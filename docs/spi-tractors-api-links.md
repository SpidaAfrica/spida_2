# SpiTractors Full API Links (Core PHP / mysqli)

Base URL (local): `http://localhost:8080`

## Health
- `GET http://localhost:8080/health`

## Auth
- `POST http://localhost:8080/auth/register`
- `POST http://localhost:8080/auth/login`
- `GET http://localhost:8080/auth/me`
- `POST http://localhost:8080/auth/verify-email/send`
- `POST http://localhost:8080/auth/verify-email/confirm`
- `POST http://localhost:8080/auth/password/forgot`
- `POST http://localhost:8080/auth/password/reset`

## Requests & Matching
- `POST http://localhost:8080/requests`
- `GET http://localhost:8080/requests/{id}/tracking`
- `POST http://localhost:8080/requests/{id}/search`

## Tractors
- `POST http://localhost:8080/tractors`
- `GET http://localhost:8080/tractors/me`

## Dashboard
- `GET http://localhost:8080/dashboard/owner/summary`

## Payments & Wallet
- `POST http://localhost:8080/payments/estimate`
- `POST http://localhost:8080/payments/intent`
- `POST http://localhost:8080/webhooks/payments`
- `GET http://localhost:8080/wallet/me`

## Notifications
- `GET http://localhost:8080/notifications/me`

## Admin
- `GET http://localhost:8080/admin/users`

---

## Headers for protected endpoints
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

---

## Quick payload examples

### Register
```json
{ "email": "user@example.com", "password": "secret123", "role": "FARMER" }
```

### Create request
```json
{
  "service": "PLOUGHING",
  "farm_address": "12 Banana Street, Lekki, Lagos",
  "farm_size_acres": 10,
  "preferred_date": "2026-03-01",
  "notes": "Please arrive early"
}
```

### Create payment intent
```json
{
  "job_request_id": "REQUEST_UUID",
  "amount": 32000,
  "method": "CARD",
  "provider": "PAYSTACK",
  "idempotency_key": "optional-unique-key"
}
```

### Verify email
```json
{ "token": "raw_verification_token" }
```

### Reset password
```json
{ "token": "raw_reset_token", "new_password": "newSecret123" }
```
