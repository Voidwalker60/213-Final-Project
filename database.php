<?php
//Variables to simplify connection
$serverHost = "127.0.0.1";
$serverUser = "root";
$serverPass = "password";

$sqlConnect = mysqli_connect($serverHost, $serverUser, $serverPass);
//If we cannot connect, kill
if (!$sqlConnect) {
    die();
}
$sqlConnect->set_charset("utf8");
//createDB is used to improve readability
$createDB = "CREATE DATABASE IF NOT EXISTS eventDatabase";

//Connect to DB
mysqli_select_db($sqlConnect, "eventDatabase");

//tableSchemas contains all table definitions for easy iteration
$tableSchemas = [
    //Event schema
    "CREATE TABLE IF NOT EXISTS eventTB(
    id INT(6) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    startTIme TIME NOT NULL,
    endTime TIME NOT NULL,
    description VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL
    
)",
    //User schema
    "CREATE TABLE IF NOT EXISTS userTB(
    id INT(6) PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    isAdmin TINYINT(1) NOT NULL,
    email VARCHAR(50) NOT NULL
)",
    //Bookings schema
    "CREATE TABLE IF NOT EXISTS bookingTB(
    
    id INT(6) PRIMARY KEY AUTO_INCREMENT,
    userID INT(6) NOT NULL,
    eventID INT(6) NOT NULL
)",
    "CREATE TABLE IF NOT EXISTS organizerTB(
    id INT(6) PRIMARY KEY AUTO_INCREMENT,
    userID INT(6) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL

)"

];

//Iterate over all tables, and create them. Print an error if impossible
for ($i = 0; $i < count($tableSchemas); $i++) {
    if (mySqli_query($sqlConnect, $tableSchemas[$i]) === TRUE) {
        echo "Table " . $i . " created successfully";
    } else {
        echo "Error Creating table: " . $i;
    }
}


mysqli_close($sqlConnect);
?>