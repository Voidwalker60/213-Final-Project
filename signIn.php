<?php
//Variables to simplify connection
$serverHost = "127.0.0.1";
$serverUser = "root";
$serverPass = "";
$DBName = "eventDatabase";

if (isset($_POST['email']) && isset($_POST['password']
    )) {
    $email = $_POST['email'];



    $sqlConnect = new mysqli($serverHost, $serverUser, $serverPass, $DBName);
    //If we cannot connect, kill
    if ($sqlConnect->connect_error) {
        die();
    }

    $sql = "SELECT email, password FROM userTB WHERE email = '$email'";
    $result = $sqlConnect->query($sql);

    if($result->num_rows > 0)
    {
        return false;
    }
    $sqlConnect->close();
    return password_verify($_POST['password'], $result['password']);
}


