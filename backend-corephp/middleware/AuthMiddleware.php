<?php

class AuthMiddleware
{
    public static function handle(Request $request): bool
    {
        $env = require __DIR__ . '/../config/env.php';
        $auth = $request->header('Authorization', '');

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            Response::json(['success' => false, 'error' => 'Unauthorized'], 401);
            return false;
        }

        $token = trim(substr($auth, 7));
        $payload = JwtService::decode($token, $env['jwt_secret']);

        if (!$payload || !isset($payload['user_id'])) {
            Response::json(['success' => false, 'error' => 'Invalid token'], 401);
            return false;
        }

        $request->user = $payload;
        return true;
    }

    public static function role(array $allowedRoles): callable
    {
        return function (Request $request) use ($allowedRoles): bool {
            if (empty($request->user['role']) || !in_array($request->user['role'], $allowedRoles, true)) {
                Response::json(['success' => false, 'error' => 'Forbidden'], 403);
                return false;
            }
            return true;
        };
    }
}
