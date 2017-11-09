<?php

$msg = "Name: " . $_GET['name'] . "\nMessage: " . $_GET['message'] . "";
$msg = wordwrap($msg,70);
$subject = "alexshortt.com new message :: " . $_GET['name'] . "";

$mail=mail("alexander.shortt@gmail.com", $subject, $msg, $header);

?>