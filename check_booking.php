<?php

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "eventDatabase";

// Get inputs from the POST request (sent by JavaScript)
$user_email = $_POST['email'] ?? '';
$concert_name = $_POST['concert'] ?? '';

// Basic sanitization
$user_email = filter_var($user_email, FILTER_SANITIZE_EMAIL);
$concert_name = filter_var($concert_name, FILTER_SANITIZE_STRING);


$current_event_date = null;
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => true, "message" => "Connection failed: " . $conn->connect_error]));
}

// 2a. First, find the DATE of the event the user is trying to book
$sql_date = "SELECT date FROM eventTB WHERE name = ?";
$stmt_date = $conn->prepare($sql_date);
$stmt_date->bind_param("s", $concert_name);
$stmt_date->execute();
$result_date = $stmt_date->get_result();

if ($result_date->num_rows > 0) {
    $row = $result_date->fetch_assoc();
    $current_event_date = $row['date'];
}
$stmt_date->close();

if (empty($current_event_date)) {
    // This handles the unlikely case where the concert name doesn't match the DB
    echo json_encode(["error" => true, "message" => "Error: Concert not found in database."]);
    $conn->close();
    exit;
}


$sql_check = "
    SELECT 
        e.name, e.date 
    FROM 
        userTB u
    JOIN 
        bookingTB b ON u.id = b.userID
    JOIN 
        eventTB e ON b.eventID = e.id
    WHERE 
        u.email = ? AND e.date = ?
";

$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ss", $user_email, $current_event_date);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    // CONFLICT FOUND: The user already has a booking on this date.
    $booked_event = $result_check->fetch_assoc();
    $conn->close();

    echo json_encode([
        "error" => true,
        "conflict" => true,
        "message" => "You already have a booking for '{$booked_event['name']}' on {$current_event_date}. Sign in to view that booking."
    ]);
} else {
    // NO CONFLICT: Booking can proceed.
    $conn->close();
    echo json_encode([
        "error" => false,
        "conflict" => false,
        "message" => "Booking validation successful. Proceeding with confirmation."
    ]);
}
?>
