<?php

class NotificationController
{
    private NotificationRepository $repo;

    public function __construct()
    {
        $this->repo = new NotificationRepository();
    }

    public function myNotifications(Request $request): void
    {
        $db = Database::connection();
        $rows = $this->repo->listByUser($db, (string)$request->user['user_id']);
        Response::json(['success' => true, 'data' => $rows]);
    }
}
