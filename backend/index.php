<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Router.php';

header('Content-Type: application/json');

$router = new Router();

$router->get('/api', function(){
    echo json_encode(['status' => 'ok', 'message' => 'API funcionando']);
});

$router->dispatch();