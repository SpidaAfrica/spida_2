<?php

class Database
{
    private static ?mysqli $connection = null;

    public static function connection(): mysqli
    {
        if (self::$connection instanceof mysqli) {
            return self::$connection;
        }

        $env = require __DIR__ . '/env.php';
        $db = $env['db'];

        $mysqli = new mysqli(
            $db['host'],
            $db['user'],
            $db['pass'],
            $db['name'],
            (int)$db['port']
        );

        if ($mysqli->connect_errno) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed',
                'details' => $mysqli->connect_error,
            ]);
            exit;
        }

        $mysqli->set_charset($db['charset']);
        self::$connection = $mysqli;

        return self::$connection;
    }
}
