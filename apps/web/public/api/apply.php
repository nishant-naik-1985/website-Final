<?php
header('Content-Type: application/json; charset=utf-8');

const MAX_CV_BYTES = 5 * 1024 * 1024;

// Extension => [canonical MIME type, MIME types finfo may report for it].
// .docx is a zip container, so some servers report it as application/zip.
const CV_TYPES = [
    'pdf' => ['application/pdf', ['application/pdf']],
    'doc' => ['application/msword', ['application/msword', 'application/vnd.ms-office', 'application/CDFV2', 'application/x-ole-storage']],
    'docx' => [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
    ],
];

function sendJson($statusCode, $payload) {
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getClientIp() {
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $value = $_SERVER[$key];
            if (strpos($value, ',') !== false) {
                $value = trim(explode(',', $value)[0]);
            }
            return $value;
        }
    }
    return 'unknown';
}

function rateLimitExceeded($ip) {
    $file = sys_get_temp_dir() . '/caxperts_apply_rate_limit.json';
    $now = time();
    $window = 60 * 60;

    $items = [];
    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $items = $decoded;
            }
        }
    }

    // Drop expired timestamps for every visitor, not just this one, so stored IP
    // addresses never outlive the rate-limit window (the privacy policy says so).
    $pruned = [];
    foreach ($items as $key => $timestamps) {
        $recent = [];
        foreach ((array) $timestamps as $ts) {
            if ($now - (int) $ts < $window) {
                $recent[] = (int) $ts;
            }
        }
        if (!empty($recent)) {
            $pruned[$key] = $recent;
        }
    }
    $pruned[$ip][] = $now;
    @file_put_contents($file, json_encode($pruned, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    return count($pruned[$ip]) > 5;
}

function getConfig() {
    $configPath = dirname($_SERVER['DOCUMENT_ROOT']) . '/mail.config.php';
    if (!is_file($configPath)) {
        return null;
    }

    $config = require $configPath;
    if (!is_array($config)) {
        return null;
    }

    $keys = ['host', 'port', 'encryption', 'username', 'password', 'from_email', 'from_name', 'to_email'];
    foreach ($keys as $key) {
        if (!array_key_exists($key, $config) || $config[$key] === null || $config[$key] === '') {
            if ($key === 'password') {
                continue;
            }
            return null;
        }
    }

    return [
        'host' => (string) $config['host'],
        'port' => (int) $config['port'],
        'encryption' => in_array((string) $config['encryption'], ['ssl', 'tls'], true) ? (string) $config['encryption'] : 'ssl',
        'username' => (string) $config['username'],
        'password' => (string) ($config['password'] ?? ''),
        'from_email' => (string) $config['from_email'],
        'from_name' => (string) $config['from_name'],
        'to_email' => (string) $config['to_email'],
    ];
}

// Single-line fields end up in email headers (subject), so strip line breaks
// and other control characters rather than trusting the browser.
function singleLine($value, $maxLength) {
    $clean = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) $value));
    return mb_substr($clean, 0, $maxLength);
}

function multiLine($value, $maxLength) {
    $clean = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', (string) $value));
    return mb_substr($clean, 0, $maxLength);
}

function orNotProvided($value) {
    return $value !== '' ? $value : 'Not provided';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// When the upload is bigger than post_max_size, PHP silently drops the whole
// body, so an empty $_POST with a large Content-Length means "file too big".
if (empty($_POST) && empty($_FILES) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    sendJson(413, ['ok' => false, 'error' => 'Your CV is too large. Please upload a file under 5 MB.']);
}

if (!empty($_POST['website'])) {
    sendJson(200, ['ok' => true]);
}

$ip = getClientIp();
if (rateLimitExceeded($ip)) {
    sendJson(429, ['ok' => false, 'error' => 'Too many applications from this connection. Please try again later or email your CV directly.']);
}

$position = singleLine($_POST['position'] ?? '', 150);
$name = singleLine($_POST['name'] ?? '', 150);
$email = singleLine($_POST['email'] ?? '', 254);
$phone = singleLine($_POST['phone'] ?? '', 50);
$location = singleLine($_POST['location'] ?? '', 150);
$experience = singleLine($_POST['experience'] ?? '', 50);
$noticePeriod = singleLine($_POST['notice_period'] ?? '', 100);
$linkedin = singleLine($_POST['linkedin'] ?? '', 300);
$message = multiLine($_POST['message'] ?? '', 5000);

if ($position === '') {
    sendJson(400, ['ok' => false, 'error' => 'Please select a position.']);
}
if ($name === '') {
    sendJson(400, ['ok' => false, 'error' => 'Please enter your full name.']);
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
}
if ($phone === '' || !preg_match('/^\+?[0-9()\s-]{7,50}$/', $phone)) {
    sendJson(400, ['ok' => false, 'error' => 'Please enter a valid phone number.']);
}
if ($linkedin !== '' && !filter_var($linkedin, FILTER_VALIDATE_URL)) {
    sendJson(400, ['ok' => false, 'error' => 'Please enter a valid LinkedIn profile URL.']);
}

$cv = $_FILES['cv'] ?? null;
if (!is_array($cv) || is_array($cv['error']) || $cv['error'] === UPLOAD_ERR_NO_FILE) {
    sendJson(400, ['ok' => false, 'error' => 'Please attach your CV.']);
}
if ($cv['error'] === UPLOAD_ERR_INI_SIZE || $cv['error'] === UPLOAD_ERR_FORM_SIZE || $cv['size'] > MAX_CV_BYTES) {
    sendJson(413, ['ok' => false, 'error' => 'Your CV is too large. Please upload a file under 5 MB.']);
}
if ($cv['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($cv['tmp_name'])) {
    sendJson(400, ['ok' => false, 'error' => 'Your CV could not be uploaded. Please try again.']);
}

$extension = strtolower(pathinfo((string) $cv['name'], PATHINFO_EXTENSION));
if (!array_key_exists($extension, CV_TYPES)) {
    sendJson(400, ['ok' => false, 'error' => 'Please upload your CV as a PDF or Word document (.pdf, .doc, .docx).']);
}

[$cvMimeType, $acceptedMimeTypes] = CV_TYPES[$extension];
if (class_exists('finfo')) {
    $detected = (new finfo(FILEINFO_MIME_TYPE))->file($cv['tmp_name']);
    if (!in_array($detected, $acceptedMimeTypes, true)) {
        sendJson(400, ['ok' => false, 'error' => 'Your CV does not look like a valid PDF or Word document.']);
    }
}

// Name the attachment after the applicant, using only safe ASCII characters.
$safeName = trim(preg_replace('/[^A-Za-z0-9]+/', '-', $name), '-');
$cvFileName = 'CV-' . ($safeName !== '' ? substr($safeName, 0, 60) : 'applicant') . '.' . $extension;

require __DIR__ . '/includes/submissions.php';

// Save a copy (with the CV) first, so the application survives even if email
// delivery fails.
$savedPath = storeSubmission('applications', [
    'position' => $position,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'location' => $location,
    'experience' => $experience,
    'notice_period' => $noticePeriod,
    'linkedin' => $linkedin,
    'message' => $message,
], $cv['tmp_name'], $cvFileName);

$config = getConfig();
if ($config === null) {
    if ($savedPath !== null) {
        error_log('[apply.php] Mail config missing; application saved to ' . $savedPath . ' only.');
        sendJson(200, ['ok' => true]);
    }
    sendJson(503, ['ok' => false, 'error' => 'Online applications are temporarily unavailable. Please email your CV to info@caxperts-engineering.com.']);
}

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailerException;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = $config['host'];
$mail->Port = $config['port'];
$mail->SMTPSecure = $config['encryption'];
$mail->SMTPAuth = true;
$mail->Username = $config['username'];
$mail->Password = $config['password'];
$mail->setFrom($config['from_email'], $config['from_name']);
$mail->addAddress($config['to_email'], $config['from_name']);
$mail->addReplyTo($email, $name);
$mail->Subject = 'Job application: ' . $position . ' - ' . $name;
$mail->Body = "Position: {$position}\n\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nCurrent location: " . orNotProvided($location) . "\nTotal experience: " . orNotProvided($experience) . "\nNotice period: " . orNotProvided($noticePeriod) . "\nLinkedIn: " . orNotProvided($linkedin) . "\n\nMessage:\n" . orNotProvided($message) . "\n\nCV attached: {$cvFileName}";
$mail->AltBody = $mail->Body;

try {
    $mail->addAttachment($cv['tmp_name'], $cvFileName, $cvMimeType);
    $mail->send();
    markSubmissionEmailed($savedPath, true);
} catch (Exception $exception) {
    // Catches MailerException too (it extends Exception).
    error_log('[apply.php] Mail delivery failed: ' . $exception->getMessage());
    markSubmissionEmailed($savedPath, false);
    if ($savedPath === null) {
        sendJson(503, ['ok' => false, 'error' => 'Your application could not be sent right now. Please try again or email your CV to info@caxperts-engineering.com.']);
    }
    // Otherwise the application is safely stored; carry on and confirm it.
}

sendApplicantConfirmation($config, $email);
sendJson(200, ['ok' => true]);

// Automatic "application received" email to the applicant. Deliberately
// repeats nothing the applicant typed, so the form can't be abused to send
// someone else an email with arbitrary text. A failure here is only logged.
function sendApplicantConfirmation($config, $email) {
    $confirmation = new PHPMailer(true);
    $confirmation->isSMTP();
    $confirmation->Host = $config['host'];
    $confirmation->Port = $config['port'];
    $confirmation->SMTPSecure = $config['encryption'];
    $confirmation->SMTPAuth = true;
    $confirmation->Username = $config['username'];
    $confirmation->Password = $config['password'];
    $confirmation->setFrom($config['from_email'], $config['from_name']);
    $confirmation->addAddress($email);
    $confirmation->addReplyTo($config['to_email'], $config['from_name']);
    $confirmation->Subject = 'We have received your application - CAxperts Engineering';
    $confirmation->Body = "Thank you for applying to CAxperts Engineering.\n\n"
        . "This is an automatic confirmation that we have received your application and CV. "
        . "Our team reviews every application, and we will contact you if your profile matches the role.\n\n"
        . "If you have any questions, simply reply to this email.\n\n"
        . "Best regards,\nCAxperts Engineering Pvt. Ltd.\nPune, India\nhttps://caxperts-engineering.com/careers\n\n"
        . "We keep applications for up to 12 months. Our privacy policy: https://caxperts-engineering.com/privacy";
    $confirmation->AltBody = $confirmation->Body;

    try {
        $confirmation->send();
    } catch (Exception $exception) {
        error_log('[apply.php] Applicant confirmation failed: ' . $exception->getMessage());
    }
}
