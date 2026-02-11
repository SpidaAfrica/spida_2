<?php

class TractorRepository
{
    public function create(mysqli $db, string $ownerUserId, array $data): bool
    {
        $name = $data['name'] ?? '';
        $registration = $data['registration_id'] ?? '';
        $model = $data['model'] ?? null;
        $brand = $data['brand'] ?? null;
        $rate = isset($data['base_rate_per_hour']) ? (float)$data['base_rate_per_hour'] : 0;

        $stmt = $db->prepare('INSERT INTO tractors (id, owner_user_id, name, registration_id, model, brand, base_rate_per_hour, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?, "ACTIVE")');
        $stmt->bind_param('sssssd', $ownerUserId, $name, $registration, $model, $brand, $rate);
        $ok = $stmt->execute();
        $stmt->close();

        return $ok;
    }

    public function listByOwner(mysqli $db, string $ownerUserId): array
    {
        $stmt = $db->prepare('SELECT id, name, registration_id, model, brand, base_rate_per_hour, status FROM tractors WHERE owner_user_id = ? ORDER BY created_at DESC');
        $stmt->bind_param('s', $ownerUserId);
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
