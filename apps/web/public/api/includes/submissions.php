<?php
// Backup copies of form submissions, so an enquiry or application is never
// lost if the notification email fails. Stored in form-submissions/ next to
// mail.config.php — the folder above the site root, so it can't be downloaded
// from the web. Old records are deleted automatically in line with the
// privacy policy's retention periods.

const SUBMISSION_RETENTION_DAYS = [
    'enquiries' => 730,    // 24 months
    'applications' => 365, // 12 months
];

function submissionsDir($type) {
    return dirname($_SERVER['DOCUMENT_ROOT']) . '/form-submissions/' . $type;
}

// Saves $record as JSON (and, for applications, a copy of the CV). Returns
// the saved JSON path, or null if saving failed. Never throws: a failed backup
// must not stop the email from being sent.
function storeSubmission($type, array $record, $cvTmpPath = null, $cvFileName = null) {
    $dir = submissionsDir($type);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        error_log("[submissions] Could not create {$dir}");
        return null;
    }

    $base = $dir . '/' . date('Y-m-d_His') . '_' . bin2hex(random_bytes(4));
    if ($cvTmpPath !== null) {
        $cvPath = $base . '_' . $cvFileName;
        if (@copy($cvTmpPath, $cvPath)) {
            @chmod($cvPath, 0600);
            $record['cv_file'] = basename($cvPath);
        } else {
            error_log("[submissions] Could not save CV copy to {$cvPath}");
            $record['cv_file'] = null;
        }
    }

    $record['received_at'] = date('c');
    $jsonPath = $base . '.json';
    $json = json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || @file_put_contents($jsonPath, $json) === false) {
        error_log("[submissions] Could not write {$jsonPath}");
        return null;
    }
    @chmod($jsonPath, 0600);

    purgeOldSubmissions($type);
    return $jsonPath;
}

// Records the outcome of the notification email on a saved submission, so
// anyone checking the folder can see which ones were never emailed.
function markSubmissionEmailed($jsonPath, $emailed) {
    if ($jsonPath === null) {
        return;
    }
    $record = json_decode((string) @file_get_contents($jsonPath), true);
    if (!is_array($record)) {
        return;
    }
    $record['notification_emailed'] = (bool) $emailed;
    @file_put_contents($jsonPath, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

function purgeOldSubmissions($type) {
    $cutoff = time() - SUBMISSION_RETENTION_DAYS[$type] * 86400;
    foreach (glob(submissionsDir($type) . '/*') ?: [] as $file) {
        if (is_file($file) && filemtime($file) < $cutoff) {
            @unlink($file);
        }
    }
}
