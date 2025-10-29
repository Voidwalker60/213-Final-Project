<?php
$serverHost = "127.0.0.1";
$serverUser = "root";
$serverPass = "";

$sqlConnect = mysqli_connect($serverHost, $serverUser, $serverPass);
if (!$sqlConnect) {
    die();
}
$sqlConnect->set_charset("utf8");
$createDB = "CREATE DATABASE IF NOT EXISTS eventDatabase";

if(mySqli_query($sqlConnect, $createDB) === TRUE) {
    echo "Database created successfully";
}
else
{
    echo "Error Creating";
}
$createTB = "CREATE TABLE IF NOT EXISTS eventTB
(
    id INT(6) PRIMARY KEY AUTO_INCREMENT,
    eventName VARCHAR(50) NOT NULL,
    eventType VARCHAR(50) NOT NULL
)";

mysqli_select_db($sqlConnect, "eventDatabase");
mysqli_close($sqlConnect);
?>