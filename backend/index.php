<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/Auth.php';

header('Content-Type: application/json');

$router = new Router();
$auth = new Auth();

$router->get('/api', function(){
    echo json_encode(['status' => 'ok', 'message' => 'API funcionando']);
});

$router->post('/api/register', function() use ($auth){
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if($email === '' || $password === ''){
        http_response_code(400);
        echo json_encode(['error' => 'Email e senha são obrigatórios'])
        return 
    }   

    $result = $auth->register($email, $password);
    if(isset($result['error'])){
        http_response_code(400);
    }
    echo json_encode($result);

});

$router->post('/api/login', function() use ($auth) {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    if($email === '' || $password === ''){
        http_response_code(400);
        echo json_encode(['error' => 'Email e senha são obrigatórios'])
        return 
    }   
    $result = $auth->authenticate($email, $password);

    if (isset($result['error'])) {
        http_response_code(401);
    }
    echo json_encode($result);
});


$router->dispatch();