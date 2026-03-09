<?php

class NotificationService
{
    public function queue(mysqli $db, string $userId, string $channel, string $templateKey, string $message, ?string $subject = null): bool
    {
        $stmt = $db->prepare('INSERT INTO notifications (id, user_id, channel, template_key, subject, message, status) VALUES (UUID(), ?, ?, ?, ?, ?, "QUEUED")');
        $stmt->bind_param('sssss', $userId, $channel, $templateKey, $subject, $message);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }
}
