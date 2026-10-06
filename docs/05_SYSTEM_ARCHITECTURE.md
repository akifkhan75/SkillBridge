# Prolivo — Production System Architecture

## 1. Architecture

Use a modular monolith first, with clear module boundaries. Do not start with microservices.

### Mobile
React Native + Expo + TypeScript

Modules:
- auth
- customer
- professional
- jobs
- matching
- booking
- payments
- chat
- notifications
- maps
- location
- AI
- verification
- reviews
- support
- settings

### Backend
NestJS modular monolith.

Modules:
- Auth
- Users
- Organizations
- Professionals
- Verification
- Catalog
- Jobs
- Matching
- Scheduling
- Pricing
- Quotes
- Bookings
- Payments
- Payouts
- Messaging
- Location
- Notifications
- Reviews
- Disputes
- Safety
- AI
- Files
- Analytics
- Admin
- FeatureFlags
- Audit

## 2. Infrastructure

PostgreSQL + PostGIS:
- transactional source of truth
- geographic queries
- relational integrity

Redis:
- cache
- distributed locks
- rate limiting
- short-lived presence
- job queues

Object storage:
- profile media
- verification documents
- job evidence
- reports

Queue workers:
- notifications
- AI processing
- media processing
- verification webhooks
- payout reconciliation
- analytics events

Realtime:
- WebSockets/Socket.IO
- job status
- chat
- worker presence
- location updates

## 3. Search

Start with PostgreSQL:
- full text
- trigram
- PostGIS

Add OpenSearch/Elasticsearch only when measured scale/search relevance justifies it.

## 4. AI gateway

Never call Gemini directly from mobile.

Mobile → NestJS AI module → policy/validation → Gemini → structured schema validation → business rules → response.

AI responses must use strict JSON schemas.

## 5. Payment architecture

Mobile → backend → PSP adapter.

Never trust payment success from the mobile client.

Webhook → backend → verify signature → idempotency → update payment state.

## 6. Location privacy

- Customer exact address is visible only to authorized workflow participants.
- Discovery uses approximate location until necessary.
- Professional live location is visible only during active travel/job and only under policy.
- Store location history only where necessary.
- Provide retention policies.

## 7. Security boundaries

Mobile is untrusted.
AI output is untrusted.
Webhooks are untrusted until signature verification.
Client-supplied price/status/role is untrusted.

Only backend domain logic can mutate authoritative states.

## 8. Deployment

Recommended:
- containerized NestJS API
- managed PostgreSQL
- managed Redis
- object storage/CDN
- separate worker process
- admin web deployment
- staging and production environments
- automated migrations with rollback strategy

## 9. Reliability targets

Initial:
- API availability target ≥ 99.9%
- critical booking/payment operations must be idempotent
- no double booking
- no double capture
- no duplicate payout
- push delivery is eventually consistent
- job state is authoritative in database

## 10. Offline-first professional app

Professional mobile workflow must work with weak connectivity:
- today's assigned jobs cached
- checklist locally editable
- photos queued
- status events queued
- sync conflict handling
- clear sync state
