# Prolivo — Product Requirements Document (PRD)

## 1. Executive Summary

Prolivo is a two-sided local services marketplace for customers and skilled service professionals. The initial focus is blue-collar and field services: plumbing, electrical, HVAC, appliance repair, carpentry, painting, cleaning, locksmith, moving, landscaping, installation, maintenance and related trades.

The original concept calls for AI-powered matching, real-time geolocation, worker verification, smart scheduling, visual assistance, emergency workflows, chat, pricing estimation, subscriptions and an operations/admin platform.

The product is upgraded into a production marketplace where AI is an intelligence layer—not the authority. Humans, verified credentials, explicit customer approval, deterministic pricing rules, and safety policies remain authoritative.

## 2. Problem

Customers:
- Do not know which professional is actually qualified.
- Often cannot explain technical problems accurately.
- Waste time calling multiple providers.
- Have poor visibility into arrival times and job progress.
- Fear scams, overcharging, poor workmanship and unsafe visits.
- Have difficulty resolving disputes.

Professionals:
- Depend on calls, messaging and referrals.
- Lose time chasing leads and coordinating schedules.
- Receive poorly described jobs.
- Have unpredictable demand.
- Lack portable reputation and verified work history.
- Need simple tools for quotes, jobs, payments and customer relationships.

## 3. Vision

Make trusted skilled help as easy to request as ordering a ride.

## 4. Mission

Give customers a safe, transparent path from “something is wrong” to “the right professional fixed it,” while giving skilled workers a fair way to build reputation and earn more.

## 5. Product principles

1. Trust before growth.
2. AI assists; it never silently decides high-risk outcomes.
3. Price transparency.
4. Worker dignity and fair economics.
5. Minimal customer effort.
6. Evidence-based service quality.
7. Local adaptation with global infrastructure.
8. Offline resilience for field workers.
9. Privacy by default.
10. Every important action is auditable.

## 6. Primary users

### Customer
Needs a local service, one-off or recurring.

### Professional
Independent worker, technician, tradesperson or small service business.

### Business customer
Landlord, property manager, office, hotel, retail location, facility or other organization needing repeat service.

### Operations administrator
Verifies professionals, handles disputes, configures services and monitors marketplace health.

### Safety/support operator
Handles emergencies, incidents, claims and escalations.

## 7. Core value proposition

### Customer
“Tell us what is wrong. We help you find the right person, show you what it should cost, keep you informed, and protect the transaction.”

### Professional
“Get better-qualified jobs, spend less time on admin, build verified reputation, and get paid securely.”

## 8. Core product loop

1. Customer describes a problem by text, voice, photo or video.
2. AI extracts service category, subcategory, urgency, required skills, job context and missing information.
3. Safety engine checks for hazardous/emergency language.
4. Customer confirms the structured job brief.
5. Matching engine finds eligible professionals.
6. Customer chooses instant match, recommended professional, or comparison mode.
7. Price is shown as fixed, estimate, diagnostic fee, hourly or quote-required.
8. Customer confirms booking/payment authorization.
9. Professional receives the job.
10. Professional travels with privacy-safe live tracking.
11. Arrival is confirmed.
12. Work is documented with checklist/photos where appropriate.
13. Extra work requires customer approval before charge.
14. Customer confirms completion.
15. Payment is captured/released according to marketplace rules.
16. Both sides review each other.
17. Job history becomes part of the customer's service record and professional reputation.

## 9. MVP scope

### Customer
- Phone/email authentication
- Location/address management
- Service discovery
- Natural-language job creation
- Photo/video attachments
- AI service analysis
- Matching
- Professional profiles
- Availability
- Booking
- Quote/price approval
- In-app chat
- Push notifications
- Job status timeline
- Live ETA during active visit
- Secure payment
- Completion confirmation
- Ratings/reviews
- Disputes/support
- Rebook/favorite professional
- Basic service history

### Professional
- Onboarding
- Identity verification
- Skills/services
- Service radius
- Availability
- Pricing model
- Job feed
- Accept/decline
- Job detail
- Navigation
- Status updates
- Chat
- Quote/change-order
- Before/during/after photos
- Completion checklist
- Customer signature/confirmation where applicable
- Earnings
- Payout setup
- Reviews/reputation
- Performance dashboard
- Offline job workflow

### Admin
- User management
- Professional verification
- Service catalog
- Marketplace configuration
- Job monitoring
- Payments/refunds
- Disputes
- Reviews/moderation
- Emergency incident console
- Analytics
- Feature flags
- Audit logs

## 10. Post-MVP differentiators

- AI voice intake
- Visual problem triage
- Repair/maintenance history
- Home/property asset registry
- Recurring maintenance plans
- AI quote assistant
- Multi-provider project coordination
- Business/property management accounts
- Service guarantees
- Insurance-ready documentation
- AR assistance for selected categories
- AI professional assistant
- Predictive maintenance
- Open API
- AI-agent booking API

## 11. Important changes from the original concept

### Emergency
Emergency access is not a paywall. A customer must be able to access emergency guidance and local emergency contacts regardless of subscription. Premium may provide enhanced coordination, priority non-emergency dispatch, incident documentation or concierge support.

### AI price
AI may estimate; it must not promise an exact price unless deterministic pricing rules or a confirmed professional quote support it.

### Background checks
Verification must be country-specific. Never display “background checked” unless the exact check, date and jurisdiction are known.

### Auto-dial
The app should use OS-supported emergency calling/contact flows and localized emergency numbers. It must never falsely claim that Prolivo has contacted authorities unless confirmation is received.

### AR
AR is a later-stage capability, not an MVP dependency.

## 12. Success metrics

North Star:
**Completed protected jobs per active service area per week.**

Customer:
- request-to-match conversion
- match acceptance rate
- booking conversion
- time to first qualified match
- completion rate
- repeat booking rate
- dispute rate
- customer NPS

Professional:
- activation rate
- verification completion
- jobs offered
- acceptance rate
- completion rate
- earnings/week
- payout success rate
- repeat-customer rate
- churn

Marketplace:
- supply/demand ratio
- fill rate
- median time to match
- cancellation rate
- take rate
- contribution margin/job
- support cost/job

## 13. Non-goals for MVP

- Drone inspections
- Blockchain payments
- Full AR authoring
- Autonomous emergency response
- Full enterprise FSM replacement
- Broad gig categories unrelated to field/local services
- AI making safety-critical repair instructions without safeguards
