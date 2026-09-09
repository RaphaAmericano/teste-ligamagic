<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CardController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();
$auth = new Auth();

$authController = new AuthController($auth);
$cardController = new CardController($auth);

$router->get('/api', function(){
    echo json_encode(['status' => 'ok', 'message' => 'API funcionando']);
});
$router->post('/api/register', fn() => $authController->register());
$router->post('/api/login', fn() => $authController->login());
$router->post('/api/card', fn() => $cardController->create());
$router->get('/api/cards', fn() => $cardController->userCards());
$router->get('/api/card/:id', fn() => $cardController->getById());
$router->put('/api/card/:id', fn() => $cardController->editCard());
$router->post('/api/card/:id/image', fn() => $cardController->uploadImage());
$router->delete('/api/card/:id', fn() => $cardController->deleteCard());

$router->dispatch();