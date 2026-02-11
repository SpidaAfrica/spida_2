<?php

class UserRepository
{
    public function findByEmail(mysqli $db, string $email): ?array
    {
        $stmt = $db->prepare('SELECT id, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        $stmt->close();

        return $row ?: null;
    }

    public function create(mysqli $db, string $email, string $passwordHash, string $role): ?array
    {
        $stmt = $db->prepare('INSERT INTO users (id, email, password_hash, role, status) VALUES (UUID(), ?, ?, ?, "ACTIVE")');
        $stmt->bind_param('sss', $email, $passwordHash, $role);
        $ok = $stmt->execute();
        $stmt->close();

        if (!$ok) {
            return null;
        }

        return $this->findByEmail($db, $email);
    }
}
