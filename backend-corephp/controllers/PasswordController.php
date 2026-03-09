<?php

class PasswordController
{
    private PasswordRepository $repo;
    private UserRepository $users;

    public function __construct()
    {
        $this->repo = new PasswordRepository();
        $this->users = new UserRepository();
    }

    public function forgot(Request $request): void
    {
        $db = Database::connection();
        $email = strtolower(trim((string)($request->body['email'] ?? '')));

        $user = $this->users->findByEmail($db, $email);
        if (!$user) {
            Response::json(['success' => true, 'message' => 'If email exists, reset token has been generated']);
            return;
        }

        [$plain, $hash] = TokenService::generateHashToken();
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);
        $this->repo->createResetToken($db, $user['id'], $hash, $expiresAt);

        Response::json(['success' => true, 'data' => ['token' => $plain, 'expires_at' => $expiresAt]]);
    }

    public function reset(Request $request): void
    {
        $db = Database::connection();
        $token = (string)($request->body['token'] ?? '');
        $newPassword = (string)($request->body['new_password'] ?? '');

        if (strlen($newPassword) < 6) {
            Response::json(['success' => false, 'error' => 'new_password must be at least 6 chars'], 422);
            return;
        }

        $row = $this->repo->getValidResetToken($db, hash('sha256', $token));
        if (!$row) {
            Response::json(['success' => false, 'error' => 'Invalid or expired reset token'], 422);
            return;
        }

        $this->repo->updatePassword($db, $row['user_id'], password_hash($newPassword, PASSWORD_BCRYPT));
        $this->repo->markUsed($db, $row['id']);

        Response::json(['success' => true, 'message' => 'Password reset successful']);
    }
}
