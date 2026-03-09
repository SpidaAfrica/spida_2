<?php

class PaymentRepository
{
    public function createIntent(mysqli $db, string $requestId, string $payerId, float $amount, string $method, string $provider, string $idempotency): bool
    {
        $stmt = $db->prepare('INSERT INTO payments (id, job_request_id, payer_user_id, provider, method, status, amount, idempotency_key) VALUES (UUID(), ?, ?, ?, ?, "PENDING", ?, ?)');
        $stmt->bind_param('ssssds', $requestId, $payerId, $provider, $method, $amount, $idempotency);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }

    public function markSucceededByReference(mysqli $db, string $provider, string $providerReference): void
    {
        $stmt = $db->prepare('UPDATE payments SET status = "SUCCEEDED", paid_at = NOW() WHERE provider = ? AND provider_reference = ?');
        $stmt->bind_param('ss', $provider, $providerReference);
        $stmt->execute();
        $stmt->close();
    }
}
