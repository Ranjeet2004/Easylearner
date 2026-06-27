<?php

$host = "srv1946.hstgr.io";
$dbname = "u203717998_Easyproject";
$username = "u203717998_Easyproject";
$password = "Easy@123456789";

try {
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Connection Failed: " . $e->getMessage());
}

?>
