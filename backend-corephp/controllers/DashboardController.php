<?php

class DashboardController
{
    private DashboardRepository $dashboard;

    public function __construct()
    {
        $this->dashboard = new DashboardRepository();
    }

    public function ownerSummary(Request $request): void
    {
        $db = Database::connection();
        $data = $this->dashboard->ownerSummary($db, (string)$request->user['user_id']);
        Response::json(['success' => true, 'data' => $data]);
    }
}
