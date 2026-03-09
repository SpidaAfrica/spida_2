<?php

class WalletController
{
    private WalletRepository $repo;

    public function __construct()
    {
        $this->repo = new WalletRepository();
    }

    public function me(Request $request): void
    {
        $db = Database::connection();
        $userId = (string)$request->user['user_id'];

        $account = $this->repo->getAccount($db, $userId);
        if (!$account) {
            $this->repo->createAccount($db, $userId);
            $account = $this->repo->getAccount($db, $userId);
        }

        Response::json(['success' => true, 'data' => $account]);
    }
}
