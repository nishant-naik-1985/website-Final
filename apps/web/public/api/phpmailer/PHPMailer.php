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
        $headers[] = 'Reply-To: ' . implode(', ', $this->ReplyTo);
        $headers[] = 'Subject: ' . $this->Subject;
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';

        $body = $this->Body;
        if ($this->AltBody !== '') {
            $body .= "\r\n\r\n" . $this->AltBody;
        }

        return implode("\r\n", $headers) . "\r\n\r\n" . $body;
    }

    public function send()
    {
        $smtp = new SMTP($this->Host, $this->Port, $this->SMTPSecure === 'ssl');
        return $smtp->sendMail($this);
    }
}
