<?php
function getConnection(){
    $host = 'db';
    $user = 'user';
    $pass = 'password';
    $database = 'app';

    $conn = new mysqli($host, $user, $pass, $database);

    if($conn->connect_error){
        http_response_code(500);
        echo json_encode(['error' => 'Error ao conectar ao banco']);
        exit;
    }

    return $conn;
}