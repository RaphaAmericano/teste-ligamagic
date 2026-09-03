<?php
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');

switch("$method $uri"){
    case 'GET /api':
        echo json_encode(['status' => 'ok', 'message' => 'API funcionando']);
        break;
    default: 
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}
