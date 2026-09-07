<?php
require_once __DIR__ . '/../Auth.php';

class AuthController {
    private Auth $auth;

    public function __construct(Auth $auth){
        $this->auth = $auth;
    }

    public function register(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if($email === '' || $password === ''){
            http_response_code(400);
            echo json_encode(['error' => 'Email e senha são obrigatórios']);
            return;
        }   

        $result = $this->auth->register($email, $password);
        if(isset($result['error'])){
            http_response_code(400);
        }
        echo json_encode($result);
    }

    public function login(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        if($email === '' || $password === ''){
            http_response_code(400);
            echo json_encode(['error' => 'Email e senha são obrigatórios']);
            return;
        }   
        $result = $this->auth->authenticate($email, $password);
        
        if (isset($result['error'])) {
            http_response_code(401);
        }
        echo json_encode($result);
    }
}