<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'external/vendor/autoload.php';
require_once('./config.php');

function sendEmail($to, $title, $content) {
		$mail = new PHPMailer();
		//$mail->SMTPDebug = 1;
		$mail->isSMTP();
		$mail->SMTPAuth=true;
		$mail->Host = EMAIL_HOST;
		$mail->SMTPSecure='ssl';
		$mail->Port = EMAIL_PORT;
		$mail->Hostname= 'http://' . MY_DOMAIN_NAME;
		$mail->CharSet= 'UTF-8';
		$mail->FromName= '书坊';
		$mail->Username = EMAIL_USER;
		$mail->Password= EMAIL_PWD;
		$mail->From= EMAIL_USER;
		$mail->isHTML(true);
		$mail->addAddress($to, $to);
		$mail->Subject=$title;
		$mail->Body=$content;
		$status = $mail->send();
		if($status) {
			return true;
		} else {
			return false;
		}

	}
	
	
	
	
?>
