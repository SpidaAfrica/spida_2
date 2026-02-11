<?php

class Request
{
    public string $method;
    public string $path;
    public array $query;
    public array $params = [];
    public array $headers;
    public array $body;
    public array $user = [];

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $this->query = $_GET;
        $this->headers = function_exists('getallheaders') ? getallheaders() : [];

        $raw = file_get_contents('php://input');
        $json = json_decode($raw ?: '', true);
        $this->body = is_array($json) ? $json : $_POST;
    }

    public function header(string $name, ?string $default = null): ?string
    {
        foreach ($this->headers as $k => $v) {
            if (strtolower($k) === strtolower($name)) {
                return is_string($v) ? $v : $default;
            }
        }

        return $default;
    }
}
