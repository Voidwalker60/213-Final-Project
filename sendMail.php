<?php
//intended to be run through JS fetch
if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['concert'])) {
    echo "Email sent!";
    //Format posted data
    $name = $_POST['name'];
    $name = explode(" ", $name);
    $email = $_POST['email'];
    $concert = $_POST['concert'];
    //send email through sendmail
    mail($email, "Your Ticket", "Hello " . $name[0] . ", your ticket for " . $concert . " has been confirmed.");

}
?>