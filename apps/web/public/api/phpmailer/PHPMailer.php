<?php
namespace PHPMailer\PHPMailer;

use PHPMailer\SMTP\SMTP;

class PHPMailer
{
    public $SMTPAuth = false;
    public $Host = '';
    public $Port = 25;
    public $SMTPSecure = 'ssl';
    public $Username = '';
    public $Password = '';
    public $From = '';
    public $FromName = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';
    public $ReplyTo = [];
    public $Recipients = [];
    public $Hostname = 'localhost';
    public $Attachments = [];

    public function __construct($exceptions = false)
    {
        $this->Hostname = gethostname() ?: 'localhost';
    }

    public function isSMTP()
    {
        $this->SMTPAuth = true;
        return true;
    }

    public function setFrom($address, $name = '')
    {
        $this->From = $address;
        $this->FromName = $name;
    }

    public function addAddress($address, $name = '')
    {
        $this->Recipients[] = $address;
    }

    public function addReplyTo($address, $name = '')
    {
        $this->ReplyTo[] = $address;
    }

    // $name must already be a safe ASCII filename; it goes into a MIME header as-is.
    public function addAttachment($path, $name, $type = 'application/octet-stream')
    {
        $content = @file_get_contents($path);
        if ($content === false) {
            throw new Exception('Could not read attachment.');
        }

        $this->Attachments[] = ['content' => $content, 'name' => $name, 'type' => $type];
    }

    public function getFrom()
    {
        return $this->From;
    }

    public function getHostname()
    {
        return $this->Hostname;
    }

    public function getRecipients()
    {
        return $this->Recipients;
    }

    public function getReplyTos()
    {
        return $this->ReplyTo;
    }

    public function createMessage()
    {
        $headers = [];
        $headers[] = 'From: ' . ($this->FromName !== '' ? $this->FromName . ' <' . $this->From . '>' : $this->From);
        // To, Date and Message-ID are expected by receiving servers; mail
        // without them is more likely to be filed as spam.
        $headers[] = 'To: ' . implode(', ', $this->Recipients);
        $headers[] = 'Date: ' . date('r');
        $domain = substr((string) strrchr($this->From, '@'), 1) ?: 'localhost';
        $headers[] = 'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>';
        $headers[] = 'Reply-To: ' . implode(', ', $this->ReplyTo);
        $headers[] = 'Subject: ' . $this->encodeHeader($this->Subject);
        $headers[] = 'MIME-Version: 1.0';

        $body = chunk_split(base64_encode($this->Body), 76, "\r\n");

        if (empty($this->Attachments)) {
            $headers[] = 'Content-Type: text/plain; charset=UTF-8';
            $headers[] = 'Content-Transfer-Encoding: base64';

            return implode("\r\n", $headers) . "\r\n\r\n" . $body;
        }

        $boundary = '=_' . bin2hex(random_bytes(16));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

        $parts = [];
        $parts[] = "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . $body;
        foreach ($this->Attachments as $attachment) {
            $parts[] = 'Content-Type: ' . $attachment['type'] . '; name="' . $attachment['name'] . "\"\r\n"
                . "Content-Transfer-Encoding: base64\r\n"
                . 'Content-Disposition: attachment; filename="' . $attachment['name'] . "\"\r\n\r\n"
                . chunk_split(base64_encode($attachment['content']), 76, "\r\n");
        }

        $message = implode("\r\n", $headers) . "\r\n\r\n";
        foreach ($parts as $part) {
            $message .= '--' . $boundary . "\r\n" . $part;
        }

        return $message . '--' . $boundary . "--\r\n";
    }

    // ASCII headers are sent unchanged; anything else is RFC 2047 encoded so
    // names with accents or Devanagari survive the trip.
    private function encodeHeader($value)
    {
        if (!preg_match('/[^\x20-\x7E]/', $value)) {
            return $value;
        }

        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    public function send()
    {
        $smtp = new SMTP($this->Host, $this->Port, $this->SMTPSecure === 'ssl');
        return $smtp->sendMail($this);
    }
}
