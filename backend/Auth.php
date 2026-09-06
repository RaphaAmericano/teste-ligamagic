<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/JWT.php';

// Rate limiting — previne brute force. Adiciona quando colocar em produção.
// Refresh token — se o access token expirar. Adiciona quando tiver token.

class Auth {
    private mysqli $db;
    private JWT $jwt;

    public function __construct(){
        $this->db = Database::getInstance()->getConnection();
        $this->jwt = new JWT(getenv('JWT_SECRET'));
    }

    public function register(string $email, string $password): array {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            return ['error' => 'Email inválido'];
        }
        if(strlen($password) < 6) {
            return ['error' => 'Senha deve ter no mínimo 6 caractéres'];
        }

        $stmt = $this->db->prepare('SELECT id FROM user WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        if($stmt->get_result()->num_rows > 0){
            $stmt->close();
            return ['error' => 'Email já cadastrado'];
        }
        $stmt->close();

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare('INSERT INTO user (email, password) VALUES (?, ?)');
        $stmt->bind_param('ss', $email, $hash);

        if($stmt->execute()){
            $stmt->close();
            $res = $this->db->prepare("SELECT id FROM user WHERE email = ?");
            $res->bind_param('s', $email);
            $res->execute();
            $id = $res->get_result()->fetch_assoc()['id'];
            $res->close();
            return ['id' => $id, 'email' => $email];
        }
        $stmt->close();
        return ['error' => 'Erro ao criar usuário'];
    }

    public function authenticate(string $email, string $password): array{
        $stmt = $this->db->prepare('SELECT id, password FROM user WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if($result->num_rows === 0){
            return ['error' => 'Credenciais inválidas'];
        }

        $user = $result->fetch_assoc();

        if(!password_verify($password, $user['password'])){
            return ['error' => 'Credenciais inválidas'];
        }

        $token = $this->jwt->generate([
            'sub' => $user['id'], 
            'email' => $email
        ]);

        return [
            'id' => $user['id'], 
            'email' => $email,
            'token' => $token
        ];

    }

    public function verifyToken(): ?array {
        $token = $this->jwt->extractFromHeader();
        if(!$token) return null;
        $result = $this->jwt->verify($token);
        return $result ?: null;
    }

}