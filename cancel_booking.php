<?php

session_start();
header('Content-Type: application/json');

// 1. Auth Check
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "You must be logged in."]);
    exit;
}

// 2. DB Connection
$conn = new mysqli("localhost", "root", "", "eventDatabase");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database Connection Failed"]);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);
$bookingID = $data['booking_id'] ?? null;
$userID = $_SESSION['user_id'];

if (!$bookingID) {
    echo json_encode(["success" => false, "message" => "Invalid Booking ID."]);
    exit;
}

$checkSql = "SELECT e.date, e.startTime 
             FROM bookingTB b
             JOIN eventTB e ON b.eventID = e.id 
             WHERE b.id = ? AND b.userID = ?";

$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $bookingID, $userID);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Booking not found."]);
    exit;
}

$row = $result->fetch_assoc();


$eventFullString = $row['date'] . ' ' . $row['startTime'];

$eventTimestamp = strtotime($eventFullString); // Convert to seconds
$currentTimestamp = time(); // Current server time in seconds
$secondsIn24Hours = 86400; // 24 * 60 * 60

if (($eventTimestamp - $currentTimestamp) < $secondsIn24Hours) {
    echo json_encode([
        "success" => false, 
        "message" => "Too late! Cancellations must be made at least 24 hours before the event."
    ]);
    exit;
}

$checkStmt->close();

$sql = "DELETE FROM bookingTB WHERE id = ? AND userID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $bookingID, $userID);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Booking Cancelled."]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting booking."]);
}

$conn->close();
?>
