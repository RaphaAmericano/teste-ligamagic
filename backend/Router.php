<?php
class Router {
    private array $routes = [];

    public function get(string $path, callable $handler): void {
        $this->routes['GET ' . $path] = $handler;
    }

    public function post(string $path, callable $handler): void {
        $this->routes['POST ' . $path] = $handler;
    }

    public function put(string $path, callable $handler): void {
        $this->routes['PUT ' . $path] = $handler;
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/');
        if (preg_match('~^(GET|POST|PUT|DELETE) /api/card/([a-f0-9-]{36})(/image)?$~', "$method $uri", $matches)) {
            $_GET['card_id'] = $matches[2];
            $hasImage = !empty($matches[3]);
            $routeKey = $matches[1] . ' /api/card/:id' . ($hasImage ? '/image' : '');
            if(isset($this->routes[$routeKey])){
                ($this->routes[$routeKey])();
                return;
            }
        }
        $key = "$method $uri";
        

        if(isset($this->routes[$key])){
            ($this->routes[$key])();
        } else {
            http_response_code(404);
            echo json_encode(['error' => "Not found"] );
        }

    }
}