<?php

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventDatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$concert_name = $data['concert'] ?? '';
$qty = $data['qty'] ?? 1;
$type = $data['type'] ?? 'Normal';
$total = $data['total'] ?? 0;

// 1. Get Event ID
$stmt = $conn->prepare("SELECT id FROM eventTB WHERE name = ?");
$stmt->bind_param("s", $concert_name);
$stmt->execute();
$resEvent = $stmt->get_result();
$eventID = ($resEvent->num_rows > 0) ? $resEvent->fetch_assoc()['id'] : null;

if (!$eventID) {
    echo json_encode(["success" => false, "message" => "Event not found."]);
    exit;
}

$stmtUser = $conn->prepare("SELECT id FROM userTB WHERE email = ?");
$stmtUser->bind_param("s", $email);
$stmtUser->execute();
$resUser = $stmtUser->get_result();
$userID = ($resUser->num_rows > 0) ? $resUser->fetch_assoc()['id'] : null;

if (!$userID) {
    echo json_encode(["success" => false, "message" => "Please Sign Up first to track this booking on your dashboard."]);
    exit;
}

$stmtInsert = $conn->prepare("INSERT INTO bookingTB (userID, eventID, quantity, ticketType, totalPrice) VALUES (?, ?, ?, ?, ?)");
$stmtInsert->bind_param("iiisd", $userID, $eventID, $qty, $type, $total);

if ($stmtInsert->execute()) {
    echo json_encode(["success" => true, "message" => "Booking Saved!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database Error: " . $conn->error]);
}

$conn->close();
?>
