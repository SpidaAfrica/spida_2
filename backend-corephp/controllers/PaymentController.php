<?php

class PaymentController
{
    private PaymentRepository $repo;

    public function __construct()
    {
        $this->repo = new PaymentRepository();
    }

    public function estimate(Request $request): void
    {
        $ratePerHour = (float)($request->body['rate_per_hour'] ?? 5000);
        $estimatedHours = (float)($request->body['estimated_hours'] ?? 6);
        $travelFee = (float)($request->body['travel_fee'] ?? 2000);

        $work = $ratePerHour * $estimatedHours;
        $total = $work + $travelFee;

        Response::json([
            'success' => true,
            'data' => [
                'rate_per_hour' => $ratePerHour,
                'estimated_hours' => $estimatedHours,
                'travel_fee' => $travelFee,
                'work_cost' => $work,
                'total' => $total,
            ],
        ]);
    }

    public function createIntent(Request $request): void
    {
        $db = Database::connection();
        $missing = ValidationService::requireFields($request->body, ['job_request_id', 'amount']);
        if ($missing) {
            Response::json(['success' => false, 'error' => 'Missing fields', 'fields' => $missing], 422);
            return;
        }

        $ok = $this->repo->createIntent(
            $db,
            (string)$request->body['job_request_id'],
            (string)$request->user['user_id'],
            (float)$request->body['amount'],
            (string)($request->body['method'] ?? 'CARD'),
            (string)($request->body['provider'] ?? 'PAYSTACK'),
            (string)($request->body['idempotency_key'] ?? bin2hex(random_bytes(12)))
        );

        if (!$ok) {
            Response::json(['success' => false, 'error' => 'Failed to create payment intent'], 500);
            return;
        }

        Response::json(['success' => true, 'message' => 'Payment intent created'], 201);
    }
}
