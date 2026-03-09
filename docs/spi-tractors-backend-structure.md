# SpiTractors Backend Structure (Proposed)

This document proposes a clean backend architecture to support the current `src/pages/spi-tractors` frontend flows (auth, request, payment/ETA, tracking, owner dashboard).

## 1) High-level architecture

- **API Gateway / BFF** (Node.js + Express or NestJS)
  - Handles auth, validation, request shaping, and client-facing DTOs.
- **Core domain services**
  - Auth & Identity
  - User Profiles (farmer / tractor owner)
  - Tractor Inventory
  - Job Request & Matching
  - Payment & Wallet
  - Tracking & Status Timeline
  - Notifications (email/SMS/push)
- **Data layer**
  - PostgreSQL (primary relational store)
  - Redis (cache, sessions, queues, rate limits)
  - Object storage (tractor docs/images)
- **Async processing**
  - Queue worker (BullMQ/SQS/RabbitMQ) for matching, notifications, receipts, webhook processing.

---

## 2) Suggested monorepo layout

```text
backend/
  apps/
    api/                         # public REST API server
      src/
        main.ts
        app.module.ts
        config/
        middleware/
        common/
        modules/
          auth/
          users/
          tractors/
          requests/
          payments/
          tracking/
          dashboard/
          notifications/
          health/
    worker/                      # background jobs
      src/
        main.ts
        jobs/
          match-request.job.ts
          payment-webhook.job.ts
          send-notification.job.ts
  packages/
    database/
      prisma/
        schema.prisma
        migrations/
      src/
        client.ts
        seed.ts
    shared/
      src/
        constants/
        enums/
        dtos/
        validators/
        utils/
  infra/
    docker/
      docker-compose.yml
    terraform/
    k8s/
  tests/
    e2e/
    integration/
  .env.example
  package.json
  README.md
```

---

## 3) Core modules and responsibilities

### `auth/`
- Signup/login/logout
- Email verification
- Password reset
- Role assignment (`FARMER`, `TRACTOR_OWNER`, `ADMIN`)

### `users/`
- Profile CRUD
- Payment methods (card refs/wallet)
- Preferences and addresses

### `tractors/`
- Tractor CRUD (owner side)
- Tractor capabilities, pricing, availability calendar
- Documents/media upload

### `requests/`
- Create request (farm address, farm size, service, preferred date)
- Request lifecycle state machine:
  - `SENT` → `RECEIVED` → `ACCEPTED` → `EN_ROUTE` → `ARRIVED` → `WORK_STARTED` → `IN_PROGRESS` → `COMPLETED`
  - cancellation path from allowed states
- Matching logic to find nearby available tractors

### `payments/`
- Estimate generation (`ratePerHour * estimatedHours + travelFee`)
- Payment intent creation and confirmation
- Wallet debit/credit
- Payment webhook verification

### `tracking/`
- Timeline retrieval for request tracking UI
- Live updates via WebSocket/SSE
- ETA refresh from map provider integration

### `dashboard/`
- Owner dashboard aggregates:
  - stats cards
  - ongoing/upcoming jobs
  - earnings summary
  - pending request panel

### `notifications/`
- Email/SMS/push for key events:
  - request accepted
  - tractor en route
  - payment success
  - completion receipts

---

## 4) Database model (starter)

### Primary entities
- `users`
- `profiles`
- `tractors`
- `tractor_availability`
- `tractor_capabilities`
- `job_requests`
- `job_request_status_history`
- `request_matches`
- `payments`
- `wallet_transactions`
- `notifications`

### Example relationships
- one `user` (owner) → many `tractors`
- one `job_request` → many `job_request_status_history`
- one `job_request` ↔ one accepted `tractor` (via `request_matches`)
- one `job_request` → many `payments` (attempts/refunds)

---

## 5) API surface (aligned with current frontend flow)

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/verify-email`

### Request flow
- `POST /requests` (create tractor request)
- `POST /requests/:id/search` (optional explicit matching trigger)
- `GET /requests/:id/estimate` (pricing + ETA)
- `POST /requests/:id/payment-intent`
- `POST /requests/:id/confirm-payment`
- `GET /requests/:id/tracking`
- `PATCH /requests/:id/status` (owner/admin/worker updates)
- `POST /requests/:id/cancel`

### Dashboard
- `GET /dashboard/owner/summary`
- `GET /dashboard/owner/ongoing`
- `GET /dashboard/owner/upcoming`
- `GET /dashboard/owner/earnings`
- `GET /dashboard/owner/job-requests`

### Tractors (owner)
- `POST /tractors`
- `GET /tractors/me`
- `PATCH /tractors/:id`
- `PATCH /tractors/:id/availability`

---

## 6) State machine guardrails

Enforce transitions server-side:

- `SENT -> RECEIVED`
- `RECEIVED -> ACCEPTED | CANCELLED`
- `ACCEPTED -> EN_ROUTE | CANCELLED`
- `EN_ROUTE -> ARRIVED`
- `ARRIVED -> WORK_STARTED`
- `WORK_STARTED -> IN_PROGRESS`
- `IN_PROGRESS -> COMPLETED`

Reject invalid direct jumps (for example, `SENT -> COMPLETED`).

---

## 7) Security and reliability baseline

- JWT access + refresh tokens
- Role-based authorization guards
- Request DTO validation (zod/class-validator)
- Rate limiting + IP throttling on auth endpoints
- Idempotency keys on payment endpoints
- Audit logs for status/payment mutations
- Webhook signature verification
- Structured logs + tracing IDs

---

## 8) Deployment progression

1. **MVP (single deployable API + Postgres + Redis)**
2. Add worker for async jobs and notifications
3. Add real-time channel (SSE/WebSocket) for tracking
4. Split services only when load/domain complexity demands it

---

## 9) Immediate implementation plan

1. Scaffold `backend/apps/api` with Auth, Requests, Payments, Tracking modules.
2. Define Prisma schema for request lifecycle and payment records.
3. Implement `POST /requests` and `GET /requests/:id/estimate` first.
4. Implement payment intent/confirm flow with provider webhook.
5. Add `GET /requests/:id/tracking` and status history timeline.
6. Add owner dashboard aggregate endpoints.
7. Add integration tests for request lifecycle + payment success/failure paths.

