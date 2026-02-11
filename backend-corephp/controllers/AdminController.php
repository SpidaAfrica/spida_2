<?php

class AdminController
{
    private AdminRepository $repo;

    public function __construct()
    {
        $this->repo = new AdminRepository();
    }

    public function users(Request $request): void
    {
        $db = Database::connection();
        Response::json(['success' => true, 'data' => $this->repo->allUsers($db)]);
    }
}
