<?php

class VerificationController
{
    private VerificationRepository $repo;
    private UserRepository $users;

    public function __construct()
    {
        $this->repo = new VerificationRepository();
        $this->users = new UserRepository();
    }

    public function send(Request $request): void
    {
        $db = Database::connection();
        [$plain, $hash] = TokenService::generateHashToken();
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);
        $ok = $this->repo->createEmailToken($db, (string)$request->user['user_id'], $hash, $expiresAt);

        if (!$ok) {
            Response::json(['success' => false, 'error' => 'Unable to create verification token'], 500);
            return;
        }

        Response::json(['success' => true, 'data' => ['token' => $plain, 'expires_at' => $expiresAt]]);
    }

    public function verify(Request $request): void
    {
        $db = Database::connection();
        $token = (string)($request->body['token'] ?? '');
        if ($token === '') {
            Response::json(['success' => false, 'error' => 'token is required'], 422);
            return;
        }

        $row = $this->repo->verifyEmailToken($db, hash('sha256', $token));
        if (!$row) {
            Response::json(['success' => false, 'error' => 'Invalid or expired token'], 422);
            return;
        }

        $stmt = $db->prepare('UPDATE users SET email_verified_at = NOW(), status = "ACTIVE" WHERE id = ?');
        $stmt->bind_param('s', $row['user_id']);
        $stmt->execute();
        $stmt->close();

        $this->repo->markEmailTokenUsed($db, $row['id']);
        Response::json(['success' => true, 'message' => 'Email verified']);
    }
}
