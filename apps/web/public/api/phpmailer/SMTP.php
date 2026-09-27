<?php
namespace PHPMailer\SMTP;

use PHPMailer\PHPMailer\Exception as PHPMailerException;

class SMTP
{
    private $server;
    private $port;
    private $secure;
    private $timeout = 20;
    private $socket;
    private $lastError = '';

    public function __construct($server, $port, $secure = false)
    {
        $this->server = $server;
        $this->port = (int) $port;
        $this->secure = $secure;
    }

    public function getLastError()
    {
        return $this->lastError;
    }

    public function connect()
    {
        $target = $this->server;
        $scheme = $this->secure ? 'ssl://' : '';

        $this->socket = @fsockopen($scheme . $target, $this->port, $errno, $errstr, $this->timeout);
        if (!$this->socket) {
            $this->lastError = $errstr ?: 'Unable to connect to SMTP server.';
            return false;
        }

        stream_set_timeout($this->socket, $this->timeout);

        $response = $this->readResponse();
        if ($response['code'] !== 220) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function hello($hostname)
    {
        $this->writeCommand('EHLO ' . $hostname);
        $response = $this->readResponse();
        if ($response['code'] !== 250) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function authLogin($username, $password)
    {
        $this->writeCommand('AUTH LOGIN');
        $response = $this->readResponse();
        if ($response['code'] !== 334) {
            $this->lastError = $response['text'];
            return false;
        }

        $this->writeCommand(base64_encode($username));
        $response = $this->readResponse();
        if ($response['code'] !== 334) {
            $this->lastError = $response['text'];
            return false;
        }

        $this->writeCommand(base64_encode($password));
        $response = $this->readResponse();
        if ($response['code'] !== 235) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function mailFrom($address)
    {
        $this->writeCommand('MAIL FROM:<' . $address . '>');
        $response = $this->readResponse();
        if ($response['code'] !== 250) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function rcptTo($address)
    {
        $this->writeCommand('RCPT TO:<' . $address . '>');
        $response = $this->readResponse();
        if ($response['code'] !== 250 && $response['code'] !== 251) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function data($body)
    {
        $this->writeCommand('DATA');
        $response = $this->readResponse();
        if ($response['code'] !== 354) {
            $this->lastError = $response['text'];
            return false;
        }

        $data = rtrim($body, "\r\n") . "\r\n.\r\n";
        @fwrite($this->socket, $data);

        $response = $this->readResponse();
        if ($response['code'] !== 250) {
            $this->lastError = $response['text'];
            return false;
        }

        return true;
    }

    public function quit()
    {
        if (!$this->socket) {
            return true;
        }

        $this->writeCommand('QUIT');
        $this->readResponse();
        @fclose($this->socket);
        $this->socket = null;
        return true;
    }

    private function writeCommand($command)
    {
        @fwrite($this->socket, $command . "\r\n");
    }

    private function readResponse()
    {
        $response = '';
        $code = 0;

        while (true) {
            $line = fgets($this->socket, 515);
            if ($line === false) {
                break;
            }

            $response .= $line;
            if (preg_match('/^([0-9]{3}) /', $line, $matches)) {
                $code = (int) $matches[1];
                if (isset($line[3]) && $line[3] === ' ') {
                    break;
                }
            }
        }

        return ['code' => $code, 'text' => trim($response)];
    }

    public function sendMail($mail)
    {
        if (!$this->connect()) {
            throw new PHPMailerException($this->lastError ?: 'Failed to connect to SMTP server.');
        }

        if (!$this->hello($mail->getHostname())) {
            $this->quit();
            throw new PHPMailerException($this->lastError ?: 'EHLO command failed.');
        }

        if ($mail->SMTPAuth) {
            if (!$this->authLogin($mail->Username, $mail->Password)) {
                $this->quit();
                throw new PHPMailerException($this->lastError ?: 'SMTP authentication failed.');
            }
        }

        $from = $mail->getFrom();
        if (!empty($from)) {
            if (!$this->mailFrom($from)) {
                $this->quit();
                throw new PHPMailerException($this->lastError ?: 'MAIL FROM failed.');
            }
        }

        foreach ($mail->getRecipients() as $address) {
            if (!$this->rcptTo($address)) {
                $this->quit();
                throw new PHPMailerException($this->lastError ?: 'RCPT TO failed.');
            }
        }

        $message = $mail->createMessage();
        if (!$this->data($message)) {
            $this->quit();
            throw new PHPMailerException($this->lastError ?: 'DATA command failed.');
        }

        $this->quit();
        return true;
    }
}
