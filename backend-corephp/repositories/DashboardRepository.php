<?php

class DashboardRepository
{
    public function ownerSummary(mysqli $db, string $ownerId): array
    {
        $summary = [
            'tractors_count' => 0,
            'active_requests' => 0,
            'completed_jobs' => 0,
            'total_earnings' => 0,
        ];

        $stmt = $db->prepare('SELECT COUNT(*) AS c FROM tractors WHERE owner_user_id = ?');
        $stmt->bind_param('s', $ownerId);
        $stmt->execute();
        $summary['tractors_count'] = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
        $stmt->close();

        $stmt = $db->prepare('SELECT COUNT(*) AS c FROM job_requests jr INNER JOIN tractors t ON t.id = jr.accepted_tractor_id WHERE t.owner_user_id = ? AND jr.status IN ("ACCEPTED","EN_ROUTE","ARRIVED","WORK_STARTED","IN_PROGRESS")');
        $stmt->bind_param('s', $ownerId);
        $stmt->execute();
        $summary['active_requests'] = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
        $stmt->close();

        $stmt = $db->prepare('SELECT COUNT(*) AS c FROM job_requests jr INNER JOIN tractors t ON t.id = jr.accepted_tractor_id WHERE t.owner_user_id = ? AND jr.status = "COMPLETED"');
        $stmt->bind_param('s', $ownerId);
        $stmt->execute();
        $summary['completed_jobs'] = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
        $stmt->close();

        $stmt = $db->prepare('SELECT COALESCE(SUM(p.amount),0) AS total FROM payments p INNER JOIN job_requests jr ON jr.id = p.job_request_id INNER JOIN tractors t ON t.id = jr.accepted_tractor_id WHERE t.owner_user_id = ? AND p.status = "SUCCEEDED"');
        $stmt->bind_param('s', $ownerId);
        $stmt->execute();
        $summary['total_earnings'] = (float)($stmt->get_result()->fetch_assoc()['total'] ?? 0);
        $stmt->close();

        return $summary;
    }
}
