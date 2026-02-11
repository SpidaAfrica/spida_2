<?php

class WebhookController
{
    public function payment(Request $request): void
    {
        $db = Database::connection();
        $provider = strtoupper((string)($request->body['provider'] ?? 'PAYSTACK'));
        $eventType = (string)($request->body['event_type'] ?? 'payment.success');
        $providerEventId = (string)($request->body['provider_event_id'] ?? '');
        $payload = json_encode($request->body);

        $stmt = $db->prepare('INSERT INTO payment_webhooks (provider, event_type, provider_event_id, payload, is_verified) VALUES (?, ?, ?, ?, 1)');
        $stmt->bind_param('ssss', $provider, $eventType, $providerEventId, $payload);
        $stmt->execute();
        $stmt->close();

        Response::json(['success' => true, 'message' => 'Webhook received']);
    }
}
