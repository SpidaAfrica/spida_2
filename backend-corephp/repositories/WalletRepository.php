<?php

class WalletRepository
{
    public function getAccount(mysqli $db, string $userId): ?array
    {
        $stmt = $db->prepare('SELECT id, user_id, currency, available_balance, held_balance FROM wallet_accounts WHERE user_id = ? LIMIT 1');
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $row ?: null;
    }

    public function createAccount(mysqli $db, string $userId): bool
    {
        $stmt = $db->prepare('INSERT INTO wallet_accounts (id, user_id, currency, available_balance, held_balance) VALUES (UUID(), ?, "NGN", 0, 0)');
        $stmt->bind_param('s', $userId);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }
}
