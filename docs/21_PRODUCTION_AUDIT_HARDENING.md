# Prolivo — Production Audit, UX Quality & Hardening Specification

**Document Type:** Engineering Audit + Production Hardening Standard  
**Product:** Prolivo  
**Audience:** Antigravity / Gemini Pro, senior engineers, QA, security, DevOps, product/design  
**Status:** Mandatory before production launch

---

# 1. Purpose

This document defines the complete audit and hardening process for Prolivo.

The objective is not merely to make the application compile or pass basic tests.

The objective is to make the application:

- secure
- fast
- resilient
- understandable
- accessible
- beginner-friendly
- globally usable
- operationally observable
- production-safe
- maintainable
- scalable
- consistent with the Prolivo brand

The audit must inspect the **actual implementation**, not assume that documentation or intended architecture is already implemented.

---

# 2. Audit Philosophy

## 2.1 Audit before changing

Before modifying code:

1. inspect the repository
2. identify architecture
3. identify modules
4. identify current APIs
5. identify database schema
6. identify authentication flow
7. identify authorization rules
8. identify current UI patterns
9. identify dependencies
10. identify existing tests
11. identify infrastructure
12. identify existing technical debt

Do not rewrite working systems simply because another architecture is preferred.

---

# 3. Audit Severity

Every finding must receive a severity.

## P0 — Critical

Must be fixed before any production deployment.

Examples:

- authentication bypass
- authorization bypass
- tenant/data leakage
- exposed secrets
- payment manipulation
- SQL injection
- arbitrary file upload execution
- sensitive personal data exposure
- double payment
- double payout
- broken emergency workflow
- catastrophic data corruption

## P1 — High

Must be fixed before production unless explicitly accepted by engineering leadership.

Examples:

- missing rate limits
- broken retry behavior
- insecure refresh tokens
- weak input validation
- major query performance issue
- race condition
- missing idempotency
- sensitive logs
- poor error handling causing operational failures

## P2 — Medium

Should be fixed before or shortly after launch.

Examples:

- inconsistent validation
- weak empty states
- inefficient query
- unnecessary API calls
- poor accessibility
- inconsistent loading states
- weak caching

## P3 — Low

Improvement/technical debt.

Examples:

- naming
- minor UI inconsistency
- small refactor
- non-critical performance optimization

---

# 4. Audit Deliverables

Antigravity must produce:

1. `AUDIT_REPORT.md`
2. `SECURITY_AUDIT.md`
3. `API_AUDIT.md`
4. `DATABASE_AUDIT.md`
5. `UX_AUDIT.md`
6. `FORM_AUDIT.md`
7. `PERFORMANCE_AUDIT.md`
8. `PRODUCTION_HARDENING_REPORT.md`
9. `REMEDIATION_LOG.md`
10. `PRODUCTION_READINESS_REPORT.md`

Each finding must contain:

```text
ID:
Severity:
Area:
File/module:
Problem:
Why it matters:
Evidence:
Recommended fix:
Implemented fix:
Test:
Status:
```

---

# 5. API SECURITY AUDIT

# 5.1 API inventory

Create a complete inventory of:

- REST endpoints
- WebSocket events
- webhooks
- public endpoints
- authenticated endpoints
- admin endpoints
- internal endpoints
- health endpoints
- upload endpoints
- payment endpoints
- AI endpoints

For every endpoint document:

- method
- path
- purpose
- authentication
- authorization
- request DTO
- response DTO
- validation
- rate limit
- idempotency
- retry behavior
- caching
- audit requirement
- sensitive data exposure

No undocumented production endpoint should remain.

---

# 5.2 Authentication audit

Verify:

- registration
- login
- OTP
- password authentication if enabled
- refresh tokens
- logout
- session revocation
- password reset
- account recovery
- device management
- MFA
- suspicious login detection

## Token requirements

Access tokens:

- short-lived
- securely stored
- scoped where appropriate

Refresh tokens:

- rotated
- revocable
- hashed when persisted
- bound to session/device where appropriate

Never store authentication tokens in insecure plaintext storage.

For React Native, use platform secure storage.

---

# 5.3 Authorization audit

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to do this?

Test every protected resource.

Examples:

Customer A must not access:

- Customer B's jobs
- Customer B's addresses
- Customer B's payment information
- Customer B's chat
- Customer B's service history

Professional A must not access:

- Professional B's jobs
- Professional B's payouts
- Professional B's private customer information

Admin roles must have least privilege.

Test:

- horizontal privilege escalation
- vertical privilege escalation
- IDOR/BOLA
- role manipulation
- organization boundary violations
- resource ownership bypass

---

# 5.4 Data isolation

This is a critical requirement.

Every query involving user-owned resources must enforce ownership.

Bad:

```ts
findJob(jobId)
```

Better:

```ts
findJob({
  id: jobId,
  customerId: currentUser.id
})
```

For professional workflows:

```ts
findBooking({
  id: bookingId,
  professionalId: currentUser.professionalId
})
```

Never rely on frontend filtering for authorization.

The backend must enforce isolation.

---

# 5.5 Input validation

Every endpoint must validate:

- body
- query
- params
- headers where applicable
- file metadata

Reject:

- unexpected fields
- invalid types
- oversized strings
- malformed IDs
- invalid enums
- impossible dates
- negative amounts
- invalid currency
- invalid coordinates
- malicious payloads

Use centralized DTO/schema validation.

---

# 5.6 API rate limiting

Implement multiple levels.

### Global

Protect against:

- brute force
- scraping
- abuse
- denial of service

### Endpoint-specific

Stricter limits for:

- OTP
- login
- password reset
- AI calls
- file uploads
- search
- messaging
- emergency actions

### User/IP/device based

Use appropriate combinations of:

- IP
- user ID
- device ID
- API key
- endpoint

Do not use a single global limit for everything.

---

# 5.7 Retry logic

Retries must be deliberate.

Safe retry candidates:

- transient network failure
- temporary provider outage
- idempotent GET
- queue delivery

Dangerous retry candidates:

- payment capture
- payout
- booking creation
- refund

For dangerous operations:

**Idempotency key + database transaction + provider idempotency support**

must be used.

Never blindly retry a financial mutation.

---

# 5.8 Idempotency

Required for:

- booking creation
- payment authorization
- payment capture
- refund
- payout
- quote acceptance
- change-order acceptance
- webhook processing

Example:

```text
Idempotency-Key:
booking_01H..._request_001
```

Repeated request must return the original result rather than creating another operation.

---

# 5.9 API error standard

Every API error must follow a consistent structure.

Example:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_SLOT_UNAVAILABLE",
    "message": "This time slot is no longer available.",
    "details": {},
    "requestId": "req_123"
  }
}
```

Never expose:

- stack traces
- SQL errors
- internal paths
- secrets
- provider credentials
- implementation details

---

# 5.10 User-readable messages

Backend errors should contain stable machine codes.

Mobile/web should translate those into friendly messages.

Bad:

> `PrismaClientKnownRequestError P2002`

Good:

> **This phone number is already registered.**

Then provide an action:

> Try signing in instead.

Every important error should answer:

1. What happened?
2. Why?
3. What can I do now?

---

# 5.11 API success standards

Successful mutations should return useful results.

Bad:

```json
{
  "success": true
}
```

Better:

```json
{
  "success": true,
  "message": "Booking confirmed.",
  "data": {
    "booking": {}
  }
}
```

Do not overuse generic success messages.

---

# 5.12 API pagination

Never return unbounded collections.

Implement pagination for:

- jobs
- professionals
- messages
- reviews
- notifications
- transactions
- admin tables

Prefer cursor pagination for large/real-time feeds.

---

# 5.13 API filtering/sorting

Validate:

- allowed fields
- allowed sort directions
- maximum page size
- filter combinations

Never allow arbitrary SQL/order clauses.

---

# 5.14 API versioning

Use:

```text
/api/v1
```

Breaking changes require a new version.

---

# 5.15 API security headers

Verify appropriate:

- CORS
- CSP where applicable
- HSTS
- X-Content-Type-Options
- Referrer-Policy
- frame protections
- secure cookies where used

---

# 5.16 File upload security

For profile/job media/documents:

- MIME validation
- extension validation
- magic-byte validation
- file size limits
- image dimension limits
- malware scanning where appropriate
- signed upload URLs
- signed download URLs
- access authorization
- no executable uploads
- private verification documents

Never trust the filename or MIME type supplied by the client.

---

# 6. API LOGGING & OBSERVABILITY

Use **Pino** for NestJS unless the existing stack has a strong reason to use another structured logger.

Winston is acceptable, but do not run multiple competing logging frameworks unnecessarily.

## Log levels

### ERROR
Unexpected failures.

### WARN
Recoverable problems.

### INFO
Important business/system events.

### DEBUG
Development diagnostics.

Never use DEBUG as production default.

---

# 6.1 Structured logging

Example:

```json
{
  "level": "info",
  "requestId": "req_123",
  "userId": "usr_123",
  "route": "/api/v1/jobs",
  "method": "POST",
  "statusCode": 201,
  "durationMs": 184,
  "event": "job_created"
}
```

---

# 6.2 Never log

Never log:

- passwords
- OTP codes
- access tokens
- refresh tokens
- card numbers
- CVV
- identity documents
- private message content by default
- full addresses unnecessarily
- sensitive medical/legal information
- API keys

---

# 6.3 Correlation IDs

Every request must have a request/correlation ID.

Propagate it through:

API
→ service
→ queue
→ worker
→ external provider

This makes production debugging dramatically easier.

---

# 6.4 Audit logs

Business audit logs are different from application logs.

Audit:

- login/security events
- role changes
- verification decisions
- refunds
- payouts
- disputes
- account suspension
- feature flag changes
- sensitive data access
- admin actions

Audit logs should be tamper-resistant.

---

# 7. DATABASE AUDIT

# 7.1 Query audit

Find:

- N+1 queries
- duplicate queries
- unnecessary joins
- SELECT *
- missing indexes
- excessive relation loading
- unbounded queries
- inefficient LIKE searches
- unnecessary transactions

---

# 7.2 Index audit

Review indexes for:

- foreign keys
- lookup columns
- status
- timestamps
- geospatial fields
- composite filtering
- unique constraints

Do not create indexes blindly.

Every index has:

- storage cost
- write cost
- maintenance cost

---

# 7.3 PostgreSQL/PostGIS

Use PostGIS for location queries.

Review:

- spatial indexes
- radius searches
- bounding boxes
- distance calculation
- coordinate precision
- geography vs geometry choices

Do not calculate distances across thousands of records in application memory.

---

# 7.4 Query performance

Measure:

- p50
- p95
- p99

For important queries.

Use:

```sql
EXPLAIN ANALYZE
```

Investigate slow queries rather than simply increasing server resources.

---

# 7.5 Connection pooling

Verify:

- max connections
- application pool
- database limits
- connection timeout
- idle timeout
- serverless behavior if applicable

Prevent connection exhaustion.

---

# 7.6 Transactions

Use transactions for multi-step state changes such as:

Booking:

```text
check availability
→ reserve slot
→ create booking
→ create events
```

Payment:

```text
validate
→ create payment record
→ provider call
→ update state
```

Do not use giant transactions unnecessarily.

---

# 7.7 Race conditions

Explicitly test:

- two customers booking same provider
- provider accepting two jobs
- two change-order approvals
- duplicate payment webhook
- simultaneous cancellation
- simultaneous completion

Use:

- database constraints
- transactions
- row locks where appropriate
- distributed locks where justified

---

# 8. CACHING AUDIT

Cache suitable read-heavy data:

- service categories
- service questions
- country configuration
- public professional summaries
- feature flags
- static configuration

Do not blindly cache:

- payment state
- authorization state
- rapidly changing booking availability
- security-sensitive information

Every cache needs:

- TTL
- invalidation strategy
- namespace
- stale behavior

---

# 9. DATABASE BACKUP & RECOVERY

Verify:

- automated backups
- point-in-time recovery
- backup encryption
- retention
- restore testing
- disaster recovery procedure

A backup that has never been restored is not proven.

Perform a restore drill before production.

---

# 10. FORM UX AUDIT

Forms must be designed for people who may have:

- low digital literacy
- limited English
- poor technical knowledge
- limited typing ability
- older devices
- weak connectivity

The UI should not assume that users understand technical terminology.

---

# 10.1 Smart forms

Instead of:

> Select service category.

Use:

> **What do you need help with?**

Show visual choices:

🔧 Plumbing  
⚡ Electrical  
❄️ AC & Cooling  
🪑 Furniture  
🧹 Cleaning

---

# 10.2 Progressive disclosure

Never show 20 fields at once.

Use:

```text
What happened?
↓
Where is it?
↓
How urgent is it?
↓
Photo?
↓
When do you need help?
```

Only ask what is necessary.

---

# 10.3 Smart autofill

Use:

- current location
- saved addresses
- previous service
- preferred professional
- phone/email
- country
- currency
- timezone

Examples:

> **Use my current location**

> **Use last service address**

> **Book the same plumber**

---

# 10.4 Input masks

Use appropriate masks for:

- phone
- OTP
- currency
- date
- time
- postal code where applicable
- card inputs through PSP SDK

But do not create rigid masks that break international formats.

---

# 10.5 Validation timing

Do not aggressively show errors while users are typing.

Preferred:

- validate obvious format after input
- validate required fields on continue/submit
- validate server constraints immediately after response

---

# 10.6 Validation messages

Bad:

> Invalid value.

Good:

> **Enter a valid phone number.**

Better:

> **We couldn't recognize this phone number. Check the country code and try again.**

---

# 10.7 Error placement

Put the error next to the field.

Also show a summary for long forms.

Never make users hunt for the error.

---

# 10.8 Forms must preserve input

If submission fails:

**Never wipe the entire form.**

Preserve:

- text
- selected service
- media
- address
- date/time

unless the user explicitly resets it.

---

# 10.9 Keyboard UX

Verify:

- correct keyboard type
- next button moves logically
- keyboard does not cover fields
- numeric keyboard for numbers
- email keyboard for email
- return key appropriate to context

---

# 11. UI/UX DESIGN AUDIT

## Design objective

Prolivo should feel:

- premium
- calm
- trustworthy
- modern
- minimal
- friendly
- extremely easy

Not:

- flashy
- overly animated
- enterprise-heavy
- technical
- cluttered

---

# 11.1 Design philosophy

The interface should feel like:

**Apple simplicity + Uber clarity + Airbnb trust + modern fintech polish**

But Prolivo must have its own visual identity.

---

# 11.2 Beginner-first principle

A person who has never used a marketplace app should understand the primary action without instruction.

Ask:

> “Could my non-technical parent use this without me explaining it?”

If no:

Simplify.

---

# 11.3 One primary action per screen

Every major screen should have one dominant action.

Example:

### Problem screen

**What's wrong?**

[ 🎤 Tell us ]  
[ 📷 Show us ]  
[ ✍️ Type it ]

Primary:

**Continue**

Avoid five competing CTAs.

---

# 11.4 Navigation

Customer bottom navigation:

**Home | Jobs | Messages | Activity | Profile**

Professional:

**Home | Jobs | Calendar | Earnings | Profile**

Do not overload bottom navigation.

---

# 11.5 Headers

Use contextual headers.

Example:

**Good morning, Ahmed**

What do you need help with?

Avoid huge permanent navigation bars.

---

# 11.6 Bottom sheets

Use bottom sheets for:

- filters
- provider details
- booking options
- quote details
- change orders
- confirmations
- location selection

Use full screens for:

- complex forms
- detailed job workflow
- profile editing
- documents

---

# 11.7 Side drawers

Avoid side drawers on mobile unless there is a compelling reason.

They are less discoverable for inexperienced mobile users.

Use:

- bottom sheets
- clear navigation
- contextual menus

For web/admin, side navigation is appropriate.

---

# 11.8 Cards

Cards should communicate one concept.

Example:

### Ahmed Khan
⭐ 4.9 · 284 jobs

Plumbing · Leak Repair

**15 min away**

From **$45**

[View] [Book]

Do not create card-within-card-within-card layouts.

---

# 11.9 Typography

Use:

- strong hierarchy
- large readable headings
- comfortable body text
- high contrast
- restrained font weights

Never sacrifice readability for visual style.

---

# 11.10 Icons

Icons must support text.

Do not make users guess what an icon means.

Use:

**📍 Location**

instead of only a pin icon where ambiguity exists.

---

# 11.11 Color

Use brand color primarily for:

- primary actions
- selected state
- key highlights

Do not make the entire application saturated.

Use neutral surfaces.

---

# 11.12 Motion

Animations should:

- explain state
- provide feedback
- make transitions understandable

Avoid animation purely for decoration.

Respect:

**Reduce Motion**

OS settings.

---

# 12. ACCESSIBILITY

Audit:

- screen readers
- dynamic font size
- color contrast
- touch target size
- focus order
- labels
- semantic controls
- reduced motion
- error announcements

Minimum touch target should be comfortably usable.

---

# 13. LOW DIGITAL LITERACY UX

This is especially important for Prolivo's global strategy.

Use:

### Plain language

Instead of:

> Create Service Request

Use:

> **Get help**

Instead of:

> Professional

Use:

> **Service provider**

Instead of:

> Estimated arrival time

Use:

> **Arrives in about 15 min**

Instead of:

> Submit change order

Use:

> **Approve extra work**

---

# 13.1 Visual communication

Use:

- photos
- illustrations
- clear icons
- short labels
- examples

For example:

> **Show us the problem**

Take a photo or short video.

---

# 13.2 Voice-first capability

For users who struggle with typing:

**“Tell us what happened.”**

Voice input should be a first-class option.

AI converts speech into a structured request.

---

# 13.3 Multilingual

Do not translate word-for-word only.

Localization must preserve natural language and cultural expectations.

---

# 14. LOADING STATES

Every network action needs:

- loading
- success
- failure
- retry

Never freeze the UI.

Avoid generic:

> Loading...

Prefer:

> **Finding nearby professionals…**

> **Checking availability…**

> **Preparing your booking…**

---

# 15. EMPTY STATES

Empty states should explain what to do next.

Bad:

> No jobs.

Good:

> **You don't have any jobs yet.**

> When you book a service, your upcoming jobs will appear here.

[Find a service]

---

# 16. OFFLINE UX

Professional users are particularly vulnerable to weak connectivity.

Show:

**You're offline**

but allow:

- today's jobs
- customer details already authorized
- checklist
- notes
- photos
- status events

Queue changes and sync later.

Show:

> **Saved on your phone · Waiting to sync**

---

# 17. PERFORMANCE AUDIT

## Mobile

Measure:

- cold start
- warm start
- screen transition
- API latency
- image loading
- memory usage
- battery consumption
- JS thread performance

---

# 17.1 Images

Use:

- thumbnails
- responsive sizes
- compression
- lazy loading
- caching
- CDN

Never download a 5 MB original image to display a 100 px thumbnail.

---

# 17.2 Lists

Use virtualized lists.

Avoid rendering hundreds of cards simultaneously.

---

# 17.3 Bundle size

Audit:

- unused packages
- duplicate dependencies
- large assets
- unnecessary libraries
- oversized fonts

---

# 17.4 API performance targets

Initial target:

- common reads p95 < 300 ms excluding third-party latency
- standard writes p95 < 500 ms excluding third-party latency
- realtime events delivered quickly enough for active-job UX
- AI requests treated separately because model latency varies

Do not optimize solely for arbitrary numbers; measure real production-like workloads.

---

# 18. LOAD TESTING

Load test:

### Authentication
- login
- OTP
- token refresh

### Marketplace
- service search
- job creation
- matching
- provider feed

### Booking
- availability
- booking
- cancellation

### Realtime
- chat
- worker presence
- active-job location

### Payments
- webhook bursts
- reconciliation

### AI
- concurrent requests
- rate limits
- queue behavior
- provider failures

Test:

- normal traffic
- 2x expected peak
- 5x expected peak
- sudden spike
- dependency outage

---

# 19. RESILIENCE TESTING

Simulate:

- database unavailable
- Redis unavailable
- payment provider timeout
- payment provider returns duplicate webhook
- AI provider unavailable
- maps provider unavailable
- notification provider unavailable
- slow network
- mobile app killed during booking
- server restart during transaction
- queue worker crash

The application should fail safely.

---

# 20. PRODUCTION HARDENING

## Infrastructure

Verify:

- HTTPS everywhere
- secure DNS
- firewall
- private database access
- secrets manager
- environment separation
- least-privilege cloud IAM
- backups
- monitoring
- alerts
- autoscaling
- deployment rollback

---

# 20.1 Environment separation

At minimum:

```text
local
development
staging
production
```

Never point development mobile builds at production databases accidentally.

---

# 20.2 Configuration

All environment configuration must be validated on startup.

Missing critical configuration should fail fast.

Never silently use fake/default credentials in production.

---

# 20.3 Secrets

Never commit:

- API keys
- database passwords
- JWT secrets
- payment secrets
- Gemini keys
- cloud credentials

Rotate secrets periodically and after exposure.

---

# 20.4 Dependency security

Run:

- dependency audit
- outdated dependency review
- license review
- vulnerability scanning

Remove unused dependencies.

---

# 20.5 Database hardening

- least-privilege DB user
- encrypted connection
- restricted network
- backups
- monitoring
- connection limits
- migration control

---

# 20.6 Container hardening

If Docker is used:

- minimal base images
- non-root user
- pinned dependencies where appropriate
- no secrets in image
- read-only filesystem where possible
- vulnerability scanning
- health checks

---

# 21. ERROR HANDLING

Errors must have three layers.

## Layer 1 — User

> **We couldn't book this time.**

## Layer 2 — API

```text
BOOKING_SLOT_UNAVAILABLE
```

## Layer 3 — Logs

Full diagnostic information with request ID.

This separation is mandatory.

---

# 22. SUCCESS UX

Success should be equally clear.

Instead of:

> 200 OK

Customer sees:

> **You're booked!**

> Ahmed will arrive around 3:20 PM.

Professional sees:

> **Job accepted**

> Customer has been notified.

---

# 23. SECURITY TESTING

Run:

- authentication tests
- authorization tests
- IDOR tests
- injection tests
- XSS where relevant
- CSRF where relevant
- SSRF tests
- file upload tests
- rate-limit tests
- brute-force tests
- webhook forgery tests
- token replay tests
- session invalidation tests
- privilege escalation tests

---

# 24. DATA PRIVACY AUDIT

Check:

- what data is collected
- why it is collected
- where it is stored
- who can access it
- how long it is retained
- how it is deleted
- whether it is sent to third parties
- whether AI receives it

Do not send unnecessary personal data to AI providers.

---

# 25. PAYMENT HARDENING

Verify:

- client cannot modify price
- client cannot mark payment successful
- payment webhooks are verified
- duplicate webhooks are safe
- refunds require authorization
- payout cannot be duplicated
- payment state is server-owned
- reconciliation exists
- failed payments recover correctly
- chargebacks are tracked

---

# 26. STATE-MACHINE AUDIT

Explicitly validate states.

## Job

```text
DRAFT
→ SUBMITTED
→ ANALYZING
→ MATCHING
→ MATCHED
→ BOOKED
→ EN_ROUTE
→ ARRIVED
→ IN_PROGRESS
→ AWAITING_CONFIRMATION
→ COMPLETED
→ CANCELLED
→ DISPUTED
```

Not every job can transition from every state.

The backend must reject illegal transitions.

---

# 27. DESIGN SYSTEM AUDIT

Create and enforce:

### Tokens

- colors
- typography
- spacing
- radius
- elevation
- shadows
- motion
- icon sizes

### Components

- Button
- Input
- Select
- Search
- Card
- Avatar
- Badge
- Toast
- Alert
- Modal
- Bottom Sheet
- Header
- Tab Bar
- List Item
- Empty State
- Loading Skeleton
- Error State
- Confirmation
- Stepper
- Progress
- Map controls

Do not create slightly different versions of the same component throughout the app.

---

# 28. UI CONSISTENCY AUDIT

Find:

- different button heights
- inconsistent border radius
- inconsistent spacing
- different typography
- different error messages
- inconsistent loading states
- different modal behavior
- inconsistent navigation
- inconsistent icon usage
- duplicate components

Consolidate.

---

# 29. UX PRINCIPLE: "NO CONFUSION"

For every important screen ask:

### Can the user answer:

1. Where am I?
2. What is happening?
3. What should I do?
4. What happens next?
5. Can I undo/cancel?
6. Is this safe?
7. How much will this cost?

If not, redesign the screen.

---

# 30. FINAL PRODUCTION AUDIT

Before launch, run the complete audit again after all fixes.

No P0 issues.

No unresolved P1 security/payment/data-isolation issues.

All critical workflows must pass:

### Customer

Signup
→ request
→ AI
→ match
→ booking
→ payment
→ tracking
→ completion
→ review

### Professional

Signup
→ verification
→ availability
→ job
→ accept
→ navigation
→ work
→ completion
→ payout

### Admin

Login
→ verification
→ job monitoring
→ dispute
→ refund
→ audit

---

# 31. PRODUCTION READINESS SCORE

Score each category 0–5.

| Area | Score |
|---|---:|
| Authentication | /5 |
| Authorization | /5 |
| Data isolation | /5 |
| API security | /5 |
| Rate limiting | /5 |
| Validation | /5 |
| Error handling | /5 |
| Logging | /5 |
| Database | /5 |
| Query performance | /5 |
| Caching | /5 |
| Forms | /5 |
| UX | /5 |
| Accessibility | /5 |
| Mobile performance | /5 |
| Realtime | /5 |
| Payments | /5 |
| AI safety | /5 |
| Privacy | /5 |
| Infrastructure | /5 |
| Observability | /5 |
| Disaster recovery | /5 |
| Testing | /5 |

## Release recommendation

### 90–100%
Production ready

### 80–89%
Conditional release; resolve important gaps

### 70–79%
Not recommended for broad launch

### <70%
Not production ready

Regardless of score:

**Any P0 issue = NO PRODUCTION RELEASE.**

---

# 32. MASTER ANTIGRAVITY AUDIT PROMPT

Use this prompt after the application has been implemented.

---

You are now the **Principal Engineer, Security Engineer, Performance Engineer, QA Lead and Senior Mobile UX Reviewer** for Prolivo.

Do not assume the application is production-ready.

Perform a complete repository-wide production audit.

## Step 1 — Understand

Read:

- PRD
- feature specifications
- architecture
- API specification
- database model
- AI specification
- security specification
- this audit document

Then inspect the actual codebase.

## Step 2 — Inventory

Create an inventory of:

- applications
- modules
- APIs
- database tables
- authentication
- authorization
- external integrations
- queues
- realtime
- AI calls
- payments
- file uploads
- forms
- navigation
- reusable UI components
- tests
- infrastructure

## Step 3 — Audit

Audit every area in this document.

Do not give generic advice.

For every finding provide:

- exact file
- exact module
- exact function/class where possible
- severity
- evidence
- risk
- fix
- test

## Step 4 — Security

Attempt to identify:

- authentication bypass
- authorization bypass
- IDOR/BOLA
- data leakage
- insecure direct object access
- rate-limit bypass
- token vulnerabilities
- injection
- file upload vulnerabilities
- webhook forgery
- privilege escalation
- secret exposure

## Step 5 — API

Verify:

- validation
- error standards
- pagination
- rate limits
- retries
- idempotency
- logging
- API versioning
- authorization
- performance

## Step 6 — Database

Identify:

- N+1
- missing indexes
- slow queries
- unbounded queries
- bad transactions
- race conditions
- connection problems
- caching opportunities

Use actual query plans where possible.

## Step 7 — Forms

Inspect every form.

Verify:

- labels
- defaults
- autofill
- masks
- validation
- keyboard
- error placement
- accessibility
- preserved input
- loading
- retry
- success

## Step 8 — UX

Navigate through the application as if you are:

> a first-time smartphone user with low technical literacy.

Ask:

- Is the primary action obvious?
- Are technical terms explained?
- Is there too much information?
- Are buttons understandable?
- Is navigation predictable?
- Are errors understandable?
- Does every screen explain what happens next?

Then review it as a premium product designer.

Remove unnecessary complexity.

## Step 9 — Performance

Measure rather than guess.

Inspect:

- API latency
- database queries
- render performance
- list rendering
- image loading
- memory
- bundle size
- network usage
- unnecessary requests

## Step 10 — Resilience

Simulate:

- offline
- slow network
- server restart
- API timeout
- payment timeout
- AI failure
- map failure
- notification failure
- duplicate request
- duplicate webhook

## Step 11 — Fix

Fix P0 and P1 issues first.

Then P2 issues.

Do not create broad refactors unless they are justified.

## Step 12 — Test

After fixing:

- unit tests
- integration tests
- E2E tests
- security tests
- authorization tests
- performance tests
- mobile tests

Run:

- typecheck
- lint
- test
- production build

## Step 13 — Re-audit

Do not stop after fixing.

Run the audit again.

Check whether fixes introduced regressions.

## Step 14 — Final report

Produce:

`PRODUCTION_READINESS_REPORT.md`

Include:

- total findings
- P0
- P1
- P2
- P3
- fixed
- accepted
- remaining
- test results
- performance results
- security results
- UX results
- final score
- release recommendation

Never say:

> “Production ready”

unless the evidence supports it.

---

# 33. Final Definition of Production Ready

Prolivo is production-ready only when:

- security is tested
- authentication is hardened
- authorization is enforced server-side
- user data is isolated
- API rate limits exist
- financial mutations are idempotent
- database performance is measured
- backups are tested
- errors are user-friendly
- logs are structured
- sensitive data is not logged
- forms are resilient
- UX is understandable to beginners
- accessibility is addressed
- offline behavior is handled
- payments are reconciled
- AI failures are safe
- realtime failures degrade gracefully
- critical workflows have E2E tests
- monitoring and alerting exist
- rollback exists
- incident response exists
- legal/privacy requirements for the launch market are reviewed

**A successful build is not the same thing as a production-ready product.**
