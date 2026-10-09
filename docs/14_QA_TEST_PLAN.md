# Fixli — QA & Test Plan

## Test layers

### Unit
- pricing
- matching
- eligibility
- cancellation
- fee calculations
- state transitions
- permission checks

### Integration
- database
- payment provider
- maps
- notifications
- verification provider
- AI provider

### E2E
Customer:
signup → request → match → booking → payment → job → completion → review.

Professional:
signup → verification → online → accept → navigation → work → payout.

Admin:
verification → dispute → refund → audit.

## Critical invariants

- cannot book unavailable provider
- cannot double-book
- cannot capture twice
- cannot payout twice
- cannot approve unauthorized change order
- cannot access another user's private job
- cannot mark complete without required conditions
- cannot review non-completed booking
- cannot send message outside authorized conversation
- cannot expose exact address too early

## AI testing

Create regression suite for:
- normal jobs
- vague jobs
- multilingual
- typos
- slang
- emergency language
- adversarial prompts
- hallucination attempts
- dangerous instructions
- low-confidence images

## Performance

Test:
- job feed
- map queries
- matching
- chat
- location events
- payment webhooks
- peak booking load

## Mobile

Test:
- poor network
- airplane mode
- background/foreground transitions
- GPS disabled
- location permission denied
- notification denied
- camera denied
- storage permission denied
- low battery
- app killed during active job
- OS upgrades

## Accessibility

- screen reader
- dynamic font
- contrast
- touch target size
- reduced motion
- voice navigation where feasible

## Release gates

No release if:
- critical security issue
- payment inconsistency
- authorization bypass
- data leak
- double booking
- double payout
- crash in core flow
