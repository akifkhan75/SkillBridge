# Prolivo — API Specification

Base:
`/api/v1`

## Auth
POST `/auth/request-otp`
POST `/auth/verify-otp`
POST `/auth/refresh`
POST `/auth/logout`
GET `/auth/me`

## Customer
GET `/me`
PATCH `/me`
GET `/me/addresses`
POST `/me/addresses`
PATCH `/me/addresses/:id`
DELETE `/me/addresses/:id`

## Catalog
GET `/services/categories`
GET `/services`
GET `/services/:id`
GET `/services/:id/questions`

## Jobs
POST `/jobs`
GET `/jobs`
GET `/jobs/:id`
PATCH `/jobs/:id`
POST `/jobs/:id/media`
POST `/jobs/:id/analyze`
POST `/jobs/:id/match`
GET `/jobs/:id/matches`

## Matching
GET `/matches/:id`
POST `/matches/:id/accept`
POST `/matches/:id/decline`

## Quotes
GET `/jobs/:id/quotes`
POST `/jobs/:id/quotes`
POST `/quotes/:id/approve`
POST `/quotes/:id/reject`
POST `/quotes/:id/revise`

## Bookings
POST `/jobs/:id/book`
GET `/bookings`
GET `/bookings/:id`
POST `/bookings/:id/cancel`
POST `/bookings/:id/reschedule`
POST `/bookings/:id/start`
POST `/bookings/:id/arrive`
POST `/bookings/:id/complete`
POST `/bookings/:id/change-orders`

## Payments
POST `/bookings/:id/payment-intent`
GET `/payments/:id`
POST `/payments/webhooks/:provider`

## Professionals
POST `/professionals`
GET `/professionals/:id`
PATCH `/professionals/:id`
POST `/professionals/:id/verification`
GET `/professionals/:id/earnings`
GET `/professionals/:id/reviews`

## Availability
GET `/professionals/me/availability`
PUT `/professionals/me/availability`
POST `/professionals/me/online`
POST `/professionals/me/offline`

## Chat
GET `/conversations`
POST `/conversations`
GET `/conversations/:id/messages`
POST `/conversations/:id/messages`
POST `/conversations/:id/read`

## Reviews
POST `/bookings/:id/reviews`
GET `/professionals/:id/reviews`

## Disputes
POST `/bookings/:id/disputes`
GET `/disputes/:id`
POST `/disputes/:id/evidence`

## Safety
GET `/safety/emergency-contacts`
POST `/safety/incidents`
POST `/safety/trusted-contacts`
POST `/safety/trusted-contacts/:id/verify`

## Admin
Admin endpoints must be under `/admin/v1` and require RBAC + MFA.

## API rules

- DTO validation on every request
- pagination everywhere appropriate
- cursor pagination for feeds
- rate limits
- idempotency for mutation endpoints
- authorization at resource level
- no direct database access from controllers
- consistent error format
- correlation ID
- audit logging for sensitive mutations
- OpenAPI generated from NestJS
- versioned APIs
