<?php
//Variables to simplify connection
$serverHost = "127.0.0.1";
$serverUser = "labuser";
$serverPass = "password";
$DBName = "eventDatabase";

$sqlConnect = new mysqli($serverHost, $serverUser, $serverPass, $DBName);
//If we cannot connect, kill
if ($sqlConnect->connect_error) {
    die();
}


$sqlConnect->close();
?>