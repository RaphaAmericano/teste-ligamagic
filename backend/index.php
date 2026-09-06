<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/utils/RarityMap.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CardController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
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

// $router->post('/api/register', function() use ($auth){
//     $data = json_decode(file_get_contents('php://input'), true);
//     $email = $data['email'] ?? '';
//     $password = $data['password'] ?? '';

//     if($email === '' || $password === ''){
    //         http_response_code(400);
    //         echo json_encode(['error' => 'Email e senha são obrigatórios']);
    //         return;
    //     }   
    
    //     $result = $auth->register($email, $password);
    //     if(isset($result['error'])){
//         http_response_code(400);
//     }
//     echo json_encode($result);
// });

// $router->post('/api/login', function() use ($auth) {
//     $data = json_decode(file_get_contents('php://input'), true);
//     $email = $data['email'] ?? '';
//     $password = $data['password'] ?? '';
//     if($email === '' || $password === ''){
//         http_response_code(400);
//         echo json_encode(['error' => 'Email e senha são obrigatórios']);
//         return;
//     }   
//     $result = $auth->authenticate($email, $password);
    
//     if (isset($result['error'])) {
//         http_response_code(401);
//     }
//     echo json_encode($result);
// });

$router->post('/api/register', fn() => $authController->register());
$router->post('/api/login', fn() => $authController->login());
$router->post('/api/card', fn() => $cardController->create());

$router->dispatch();