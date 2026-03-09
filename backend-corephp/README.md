# SpiTractors Core PHP API (mysqli)

Production-oriented Core PHP backend scaffold using **mysqli** (**no PDO**).

## Run locally

```bash
php -S 0.0.0.0:8080 -t backend-corephp/public
```

## Configure DB

- Edit `backend-corephp/config/env.php`
- Import schema: `docs/spi-tractors-schema.sql`

## API links document

- `docs/spi-tractors-api-links.md`

## Modules included

- Auth (register, login, me, verify email send/confirm, forgot/reset password)
- Requests (create, tracking)
- Matching (request search)
- Tractors (create, my tractors)
- Dashboard (owner summary)
- Payments (estimate, intent)
- Wallet (me)
- Notifications (my notifications)
- Webhooks (payments)
- Admin (users list)
