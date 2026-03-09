<?php

class RequestRepository
{
    public function create(mysqli $db, string $farmerId, array $data): ?array
    {
        $requestCode = 'REQ-' . strtoupper(substr(str_replace('-', '', uniqid('', true)), 0, 8));
        $service = $data['service'] ?? 'PLOUGHING';
        $farmAddress = $data['farm_address'] ?? '';
        $farmSize = isset($data['farm_size_acres']) ? (float)$data['farm_size_acres'] : null;
        $preferredDate = $data['preferred_date'] ?? null;
        $notes = $data['notes'] ?? null;

        $stmt = $db->prepare('INSERT INTO job_requests (id, request_code, farmer_user_id, service, farm_address, farm_size_acres, preferred_date, notes, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, "SENT")');
        $stmt->bind_param('ssssdss', $requestCode, $farmerId, $service, $farmAddress, $farmSize, $preferredDate, $notes);
        $ok = $stmt->execute();
        $stmt->close();

        if (!$ok) {
            return null;
        }

        return $this->findByCode($db, $requestCode);
    }

    public function findByCode(mysqli $db, string $code): ?array
    {
        $stmt = $db->prepare('SELECT * FROM job_requests WHERE request_code = ? LIMIT 1');
        $stmt->bind_param('s', $code);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        $stmt->close();

        return $row ?: null;
    }

    public function getTracking(mysqli $db, string $requestId): array
    {
        $stmt = $db->prepare('SELECT to_status, reason, changed_at FROM job_request_status_history WHERE job_request_id = ? ORDER BY changed_at ASC');
        $stmt->bind_param('s', $requestId);
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
