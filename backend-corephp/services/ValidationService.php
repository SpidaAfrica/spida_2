<?php

class ValidationService
{
    public static function requireFields(array $body, array $fields): array
    {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($body[$field]) || $body[$field] === '') {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    public static function email(string $email): bool
    {
        return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
    }
}
