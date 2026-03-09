<?php

class PasswordRepository
{
    public function createResetToken(mysqli $db, string $userId, string $tokenHash, string $expiresAt): bool
    {
        $stmt = $db->prepare('INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (UUID(), ?, ?, ?)');
        $stmt->bind_param('sss', $userId, $tokenHash, $expiresAt);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }

    public function getValidResetToken(mysqli $db, string $tokenHash): ?array
    {
        $stmt = $db->prepare('SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1');
        $stmt->bind_param('s', $tokenHash);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $row ?: null;
    }

    public function markUsed(mysqli $db, string $tokenId): void
    {
        $stmt = $db->prepare('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?');
        $stmt->bind_param('s', $tokenId);
        $stmt->execute();
        $stmt->close();
    }

    public function updatePassword(mysqli $db, string $userId, string $passwordHash): void
    {
        $stmt = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $stmt->bind_param('ss', $passwordHash, $userId);
        $stmt->execute();
        $stmt->close();
    }
}
