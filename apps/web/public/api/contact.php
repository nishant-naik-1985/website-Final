<?php
header('Content-Type: application/json; charset=utf-8');

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
    $file = sys_get_temp_dir() . '/caxperts_contact_rate_limit.json';
    $now = time();
    $window = 15 * 60;

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

    $recent = [];
    foreach (($items[$ip] ?? []) as $ts) {
        if ($now - (int) $ts < $window) {
            $recent[] = (int) $ts;
        }
    }
    $recent[] = $now;
    $items[$ip] = $recent;
    @file_put_contents($file, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    return count($recent) > 5;
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

function trimField($value, $maxLength = 0) {
    $trimmed = trim((string) $value);
    if ($maxLength > 0 && strlen($trimmed) > $maxLength) {
        $trimmed = substr($trimmed, 0, $maxLength);
    }
    return $trimmed;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || $rawBody === '') {
    sendJson(400, ['ok' => false, 'error' => 'Invalid request body']);
}

$json = json_decode($rawBody, true);
if (!is_array($json)) {
    sendJson(400, ['ok' => false, 'error' => 'Invalid JSON body']);
}

if (!empty($json['website'])) {
    sendJson(200, ['ok' => true]);
}

$ip = getClientIp();
if (rateLimitExceeded($ip)) {
    sendJson(429, ['ok' => false, 'error' => 'Too many submissions. Please try again later.']);
}

$name = trimField($json['name'] ?? '', 150);
$email = trimField($json['email'] ?? '', 254);
$company = trimField($json['company'] ?? '', 150);
$phone = trimField($json['phone'] ?? '', 50);
$interest = trimField($json['interest'] ?? '', 100);
$industry = trimField($json['industry'] ?? '', 100);
$timeline = trimField($json['timeline'] ?? '', 100);
$message = trimField($json['message'] ?? '', 5000);

if ($name === '') {
    sendJson(400, ['ok' => false, 'error' => 'Name is required']);
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(400, ['ok' => false, 'error' => 'Email is invalid']);
}
if ($company === '') {
    sendJson(400, ['ok' => false, 'error' => 'Company is required']);
}
if ($message === '') {
    sendJson(400, ['ok' => false, 'error' => 'Message is required']);
}
if ($phone !== '' && !preg_match('/^\+?[0-9()\s-]{7,50}$/', $phone)) {
    sendJson(400, ['ok' => false, 'error' => 'Phone is invalid']);
}
if ($interest !== '' && strlen($interest) > 100) {
    sendJson(400, ['ok' => false, 'error' => 'Interest is too long']);
}

$config = getConfig();
if ($config === null) {
    sendJson(503, ['ok' => false, 'error' => 'Service temporarily unavailable']);
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
$mail->Subject = 'Website enquiry: ' . $name . ' (' . $company . ')';
$mail->Body = "Name: {$name}\nCompany: {$company}\nEmail: {$email}\nPhone: " . ($phone !== '' ? $phone : 'Not provided') . "\nIndustry: " . ($industry !== '' ? $industry : 'Not provided') . "\nService required: " . ($interest !== '' ? $interest : 'Not provided') . "\nExpected timeline: " . ($timeline !== '' ? $timeline : 'Not provided') . "\n\nProject description:\n{$message}";
$mail->AltBody = $mail->Body;

try {
    $mail->send();
    sendJson(200, ['ok' => true]);
} catch (MailerException $exception) {
    sendJson(503, ['ok' => false, 'error' => 'Service temporarily unavailable']);
} catch (Exception $exception) {
    sendJson(503, ['ok' => false, 'error' => 'Service temporarily unavailable']);
}
