<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["authenticated" => false]);
    exit;
}

$user_id = $_SESSION['user_id'];
$email = $_SESSION['email'];

$conn = new mysqli("localhost", "root", "", "eventDatabase");

if ($conn->connect_error) {
    echo json_encode(["authenticated" => true, "bookings" => [], "error" => "DB Connection Failed"]);
    exit;
}

$sql = "
    SELECT b.id as booking_id, e.name, e.date, e.venue 
    FROM bookingTB b
    JOIN eventTB e ON b.eventID = e.id
    WHERE b.userID = ?
    ORDER BY e.date ASC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["authenticated" => true, "bookings" => [], "error" => "SQL Error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {

    $row['image_path'] = 'images/default.jpg'; 
    $bookings[] = $row;
}


$display_name = explode('@', $email)[0];
$display_name = ucfirst($display_name);

echo json_encode([
    "authenticated" => true,
    "user_name" => $display_name,
    "bookings" => $bookings
]);

$stmt->close();
$conn->close();
?>
