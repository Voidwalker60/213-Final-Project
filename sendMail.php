<?php
if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['concert'])) {
    echo "Email sent!";
    $name = $_POST['name'];
    $name = explode(" ", $name);
    $email = $_POST['email'];
    $concert = $_POST['concert'];
    mail($email, "Your Ticket", "Hello " . $name[0] . ", your ticket for ". $concert ." has been confirmed.");

}
?>