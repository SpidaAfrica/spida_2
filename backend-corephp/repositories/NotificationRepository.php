<?php

class NotificationRepository
{
    public function listByUser(mysqli $db, string $userId): array
    {
        $stmt = $db->prepare('SELECT id, channel, template_key, message, status, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100');
        $stmt->bind_param('s', $userId);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
        $stmt->close();
        return $rows;
    }
}
