<?php
class Router {
    private array $routes = [];

    public function get(string $path, callable $handler): void {
        $this->routes['GET ' . $path] = $handler;
    }

    public function post(string $path, callable $handler): void {
        $this->routes['POST ' . $path] = $handler;
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/');
        $key = "$method $uri";
        
        if(isset($this->routes[$key])){
            ($this->routes[$key])();
        } else {
            http_response_code(404);
            echo json_encode(['error' => "Not found"] );
        }

    }
}