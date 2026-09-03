<?php
class Database {
    private static ?Datbase $instance = null;
    private mysqli $conn;
    
    private function __construct(){
        $this->conn = new mysqli('db', 'user', 'password', 'app');
        if($this->conn->connect_error){
            http_response_code(500);
            echo json_encode(['error' => 'Error ao conectar ao banco']);
            exit;
        }
    }

    public static function getInstance(): Database {
        if(self::$instance === null ){
            self::$instance = new self();
        }
        return self::$instance
    }

    public function getConnection(): mysqli {
        return $this->conn;
    }
}