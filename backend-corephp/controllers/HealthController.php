<?php

class HealthController
{
    public function index(Request $request): void
    {
        Response::json([
            'success' => true,
            'service' => 'spitractors-core-php-api',
            'time' => date('c'),
        ]);
    }
}
