<?php

class VerificationRepository
{
    public function createEmailToken(mysqli $db, string $userId, string $tokenHash, string $expiresAt): bool
    {
        $stmt = $db->prepare('INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at) VALUES (UUID(), ?, ?, ?)');
        $stmt->bind_param('sss', $userId, $tokenHash, $expiresAt);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }

    public function verifyEmailToken(mysqli $db, string $tokenHash): ?array
    {
        $stmt = $db->prepare('SELECT id, user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1');
        $stmt->bind_param('s', $tokenHash);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $row ?: null;
    }

    public function markEmailTokenUsed(mysqli $db, string $tokenId): void
    {
        $stmt = $db->prepare('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?');
        $stmt->bind_param('s', $tokenId);
        $stmt->execute();
        $stmt->close();
    }
}
