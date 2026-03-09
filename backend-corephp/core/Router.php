<?php

class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler, array $middlewares = []): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'handler' => $handler,
            'middlewares' => $middlewares,
        ];
    }

    public function dispatch(Request $request): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== strtoupper($request->method)) {
                continue;
            }

            $regex = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^\/]+)', $route['pattern']);
            $regex = '#^' . $regex . '$#';

            if (!preg_match($regex, $request->path, $matches)) {
                continue;
            }

            foreach ($matches as $key => $value) {
                if (!is_int($key)) {
                    $request->params[$key] = $value;
                }
            }

            foreach ($route['middlewares'] as $middleware) {
                $ok = $middleware($request);
                if ($ok === false) {
                    return;
                }
            }

            call_user_func($route['handler'], $request);
            return;
        }

        Response::json([
            'success' => false,
            'error' => 'Route not found',
            'path' => $request->path,
        ], 404);
    }
}
