<?php

class MatchingController
{
    public function search(Request $request): void
    {
        $db = Database::connection();
        $requestId = (string)($request->params['id'] ?? '');

        $sql = 'SELECT t.id, t.name, t.registration_id, t.base_rate_per_hour, t.status FROM tractors t WHERE t.status = "ACTIVE" ORDER BY t.created_at DESC LIMIT 10';
        $res = $db->query($sql);
        $matches = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $matches[] = $row;
            }
            $res->free();
        }

        Response::json(['success' => true, 'data' => ['request_id' => $requestId, 'matches' => $matches]]);
    }
}
