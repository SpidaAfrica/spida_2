# SpiTractors Frontend API Coverage Matrix

This maps each implemented backend endpoint to frontend callers in `src/pages/spi-tractors`.

| API | Frontend caller(s) |
|---|---|
| `GET /health` | `Request-Spitractor/ChooseRole.jsx` |
| `POST /auth/register` | `Auth/Signup.jsx` |
| `POST /auth/login` | `Auth/Login.jsx` |
| `GET /auth/me` | `Dashboard/Dashboard.jsx` |
| `POST /auth/verify-email/send` | `Auth/VerifyEmail.jsx` |
| `POST /auth/verify-email/confirm` | `Auth/VerifyEmail.jsx` |
| `POST /auth/password/forgot` | `Auth/Login.jsx` |
| `POST /auth/password/reset` | `Auth/Login.jsx` |
| `POST /requests` | `Request-Spitractor/RequestSpitractor.jsx` |
| `POST /requests/{id}/search` | `Request-Spitractor/RequestSpitractor.jsx` |
| `GET /requests/{id}/tracking` | `Request-Spitractor/TrackRequest.jsx` |
| `POST /tractors` | `Auth/AddTractors.jsx` |
| `GET /tractors/me` | `components/equipment/EquipmentGrid.jsx` |
| `GET /dashboard/owner/summary` | `components/dashboard/StatCard.jsx` |
| `POST /payments/estimate` | `Request-Spitractor/PayAndEta.jsx` |
| `POST /payments/intent` | `Request-Spitractor/PayAndEta.jsx` |
| `POST /webhooks/payments` | `Request-Spitractor/PayAndEta.jsx` (demo post-payment) |
| `GET /wallet/me` | `Request-Spitractor/PayAndEta.jsx` |
| `GET /notifications/me` | `components/dashboard/Topbar.jsx` |
| `GET /admin/users` | `components/dashboard/Topbar.jsx` (admin role only) |

## Shared API client

All calls go through:
- `src/pages/spi-tractors/api/spiTractorsApi.js`

Session helpers used:
- `saveSession`
- `getCurrentUser`
- `clearSession`
