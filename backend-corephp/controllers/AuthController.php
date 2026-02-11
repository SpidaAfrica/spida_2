<?php

class AuthController
{
    private UserRepository $users;

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    public function register(Request $request): void
    {
        $db = Database::connection();
        $email = strtolower(trim($request->body['email'] ?? ''));
        $password = (string)($request->body['password'] ?? '');
        $role = (string)($request->body['role'] ?? 'FARMER');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            Response::json(['success' => false, 'error' => 'Invalid email or password'], 422);
            return;
        }

        if ($this->users->findByEmail($db, $email)) {
            Response::json(['success' => false, 'error' => 'Email already exists'], 409);
            return;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $user = $this->users->create($db, $email, $hash, $role);

        if (!$user) {
            Response::json(['success' => false, 'error' => 'Registration failed'], 500);
            return;
        }

        $env = require __DIR__ . '/../config/env.php';
        $token = JwtService::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
        ], $env['jwt_secret']);

        Response::json(['success' => true, 'data' => ['user' => $user, 'token' => $token]], 201);
    }

    public function login(Request $request): void
    {
        $db = Database::connection();
        $email = strtolower(trim($request->body['email'] ?? ''));
        $password = (string)($request->body['password'] ?? '');

        $user = $this->users->findByEmail($db, $email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::json(['success' => false, 'error' => 'Invalid credentials'], 401);
            return;
        }

        $env = require __DIR__ . '/../config/env.php';
        $token = JwtService::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
        ], $env['jwt_secret']);

        Response::json(['success' => true, 'data' => ['user' => $user, 'token' => $token]]);
    }

    public function me(Request $request): void
    {
        Response::json(['success' => true, 'data' => $request->user]);
    }
}
