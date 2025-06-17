<?php
// This PHP script handles adding new user accounts to the database.

include 'db_connection.php'; // Ensure this file connects to your database

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username']; // Get the username from the form
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password
    $role = $_POST['role']; // Get the role from the form

    // Validate the role to ensure it's one of the allowed values
    if (in_array($role, ['admin', 'manager', 'cashier'])) {
        $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $password, $role);

        if ($stmt->execute()) {
            echo "User account created successfully!";
        } else {
            echo "Error: " . $stmt->error;
        }
    } else {
        echo "Invalid role selected.";
    }
}
