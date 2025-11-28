<?php
//Variables to simplify connection
$serverHost = "127.0.0.1";
$serverUser = "root";
$serverPass = "";
$DBName = "eventDatabase";

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password']
    )) {
    //Format posted data
    $name = $_POST['name'];
    $name = explode(" ", $name);
    $email = $_POST['email'];
    //hash password
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    //erase all specials from name
    for($i = 0; $i < count($name); $i++)
    {
        $name[$i] = preg_replace("/[^A-Za-z0-9]/", '', $name[$i]);
    }



    $sqlConnect = new mysqli($serverHost, $serverUser, $serverPass, $DBName);
    //If we cannot connect, kill
    if ($sqlConnect->connect_error) {
        die();
    }
    //insert into database
    $sql = "INSERT INTO userTB VALUES (DEFAULT, $name[0], $name[1], $password, 0, $email')";


    if($sqlConnect->query($sql) === TRUE)
    {
        echo "New record created successfully";
    }
    else{
        echo "Error: " . $sql . "<br>" . $sqlConnect->error;
    }
    $sqlConnect->close();
}


