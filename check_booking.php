<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json');


$conn = new mysqli("localhost", "root", "", "eventDatabase");

if ($conn->connect_error) {
    die(json_encode(["error" => true, "message" => "Connection failed: " . $conn->connect_error]));
}


$user_email = $_POST['email'] ?? '';
$concert_name = $_POST['concert'] ?? '';
$user_email = trim($user_email);
$concert_name = trim($concert_name);

if (empty($user_email) || empty($concert_name)) {
    echo json_encode(["error" => true, "message" => "Email and Concert Name are required."]);
    $conn->close();
    exit;
}

$eventID = null;
$eventDate = null;

$sql_event = "SELECT id, date FROM eventTB WHERE name = ?";
$stmt = $conn->prepare($sql_event);
$stmt->bind_param("s", $concert_name);
$stmt->execute();
$res_event = $stmt->get_result();

if ($res_event->num_rows > 0) {
    $row = $res_event->fetch_assoc();
    $eventID = $row['id'];
    $eventDate = $row['date'];
}
$stmt->close();

if (!$eventID) {
    echo json_encode(["error" => true, "message" => "Concert not found in database."]);
    $conn->close();
    exit;
}


$userID = null;

$sql_user = "SELECT id FROM userTB WHERE email = ?";
$stmt = $conn->prepare($sql_user);
$stmt->bind_param("s", $user_email);
$stmt->execute();
$res_user = $stmt->get_result();

if ($res_user->num_rows > 0) {

    $row = $res_user->fetch_assoc();
    $userID = $row['id'];
} else {
  
    echo json_encode([
        "error" => true,
        "message" => "Account not found. You have to sign up first."
    ]);
    $stmt->close();
    $conn->close();
    exit; 
}
$stmt->close();

$sql_check = "
    SELECT e.name 
    FROM bookingTB b
    JOIN eventTB e ON b.eventID = e.id
    WHERE b.userID = ? AND e.date = ?
";
$stmt = $conn->prepare($sql_check);
$stmt->bind_param("is", $userID, $eventDate);
$stmt->execute();
$res_check = $stmt->get_result();

if ($res_check->num_rows > 0) {
 
    $existing_event = $res_check->fetch_assoc();
    echo json_encode([
        "error" => true,
        "conflict" => true,
        "message" => "You already have a booking on same day. Please sign in to view your booking"
    ]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

echo json_encode([
    "error" => false,
    "message" => "Validation passed."
]);

$conn->close();
?>
