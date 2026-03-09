<?php

class JwtService
{
    public static function encode(array $payload, string $secret, int $ttlSeconds = 86400): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttlSeconds;

        $baseHeader = self::base64UrlEncode(json_encode($header));
        $basePayload = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $baseHeader . '.' . $basePayload, $secret, true);
        $baseSignature = self::base64UrlEncode($signature);

        return $baseHeader . '.' . $basePayload . '.' . $baseSignature;
    }

    public static function decode(string $jwt, string $secret): ?array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return null;
        }

        [$baseHeader, $basePayload, $baseSignature] = $parts;
        $validSig = self::base64UrlEncode(hash_hmac('sha256', $baseHeader . '.' . $basePayload, $secret, true));

        if (!hash_equals($validSig, $baseSignature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($basePayload), true);
        if (!is_array($payload)) {
            return null;
        }

        if (isset($payload['exp']) && time() > (int)$payload['exp']) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
}
