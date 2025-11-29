<?php

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "You must be logged in."]);
    exit;
}

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

$sql = "DELETE FROM bookingTB WHERE id = ? AND userID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $bookingID, $userID);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Booking Cancelled."]);
    } else {
        echo json_encode(["success" => false, "message" => "Booking not found or already cancelled."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error deleting booking."]);
}

$conn->close();
?>
