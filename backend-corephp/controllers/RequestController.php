<?php

class RequestController
{
    private RequestRepository $requests;

    public function __construct()
    {
        $this->requests = new RequestRepository();
    }

    public function create(Request $request): void
    {
        $db = Database::connection();
        $farmerId = (string)$request->user['user_id'];

        if (empty($request->body['farm_address'])) {
            Response::json(['success' => false, 'error' => 'farm_address is required'], 422);
            return;
        }

        $created = $this->requests->create($db, $farmerId, $request->body);

        if (!$created) {
            Response::json(['success' => false, 'error' => 'Failed to create request'], 500);
            return;
        }

        Response::json(['success' => true, 'data' => $created], 201);
    }

    public function tracking(Request $request): void
    {
        $db = Database::connection();
        $requestId = (string)($request->params['id'] ?? '');

        if ($requestId === '') {
            Response::json(['success' => false, 'error' => 'Missing request id'], 422);
            return;
        }

        $timeline = $this->requests->getTracking($db, $requestId);
        Response::json(['success' => true, 'data' => $timeline]);
    }
}
