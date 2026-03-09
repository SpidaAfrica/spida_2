<?php

class TokenService
{
    public static function generateHashToken(): array
    {
        $plain = bin2hex(random_bytes(32));
        return [$plain, hash('sha256', $plain)];
    }
}
