<?php

class TractorController
{
    private TractorRepository $tractors;

    public function __construct()
    {
        $this->tractors = new TractorRepository();
    }

    public function create(Request $request): void
    {
        $db = Database::connection();

        if (empty($request->body['name']) || empty($request->body['registration_id'])) {
            Response::json(['success' => false, 'error' => 'name and registration_id are required'], 422);
            return;
        }

        $ok = $this->tractors->create($db, (string)$request->user['user_id'], $request->body);
        if (!$ok) {
            Response::json(['success' => false, 'error' => 'Failed to create tractor'], 500);
            return;
        }

        Response::json(['success' => true, 'message' => 'Tractor created'], 201);
    }

    public function myTractors(Request $request): void
    {
        $db = Database::connection();
        $rows = $this->tractors->listByOwner($db, (string)$request->user['user_id']);
        Response::json(['success' => true, 'data' => $rows]);
    }
}
