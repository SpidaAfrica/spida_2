<?php

class AdminRepository
{
    public function allUsers(mysqli $db): array
    {
        $res = $db->query('SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 200');
        $rows = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $rows[] = $row;
            }
            $res->free();
        }
        return $rows;
    }
}
