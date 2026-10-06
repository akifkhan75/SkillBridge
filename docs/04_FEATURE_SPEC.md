# Prolivo — Functional Feature Specification

## A. Authentication & Identity
- Phone OTP
- Email OTP/password option
- Social login where strategically useful
- Device/session management
- MFA for professionals/admins
- Account recovery
- Age/jurisdiction checks
- Role selection
- Ability to be both customer and professional where legally appropriate

## B. Customer profile
- Name
- photo
- preferred language
- addresses
- notification preferences
- trusted contacts
- payment methods
- favorites
- service history

## C. Professional profile
- display name
- business name
- profile photo
- trade categories
- subskills
- experience
- service areas
- pricing
- availability
- portfolio
- equipment
- certifications
- insurance
- verification badges
- response statistics
- completion statistics
- reviews
- languages

## D. Service catalog
Hierarchical:
Category → service → job type → required skills → optional questions → pricing model → risk level → required credentials.

Every category must support country/city overrides.

## E. Job request
Fields:
- customer
- service category
- structured intent
- free text
- AI summary
- photos/videos
- address
- location precision
- urgency
- preferred date/time
- budget
- access instructions
- hazards
- pets/parking/building access
- requested professional characteristics

## F. Matching engine
Hard filters:
- active/approved
- required credential
- service category
- service area
- availability
- legal eligibility

Ranking:
- skill fit
- distance/travel time
- reliability
- rating quality
- response probability
- price compatibility
- repeat customer preference
- fairness constraints

Never rank solely on star rating.

## G. Pricing
Supported models:
- fixed price
- starting from
- hourly
- diagnostic/call-out fee
- quote required
- package
- subscription

Customer must see:
- base service
- platform fee
- taxes where applicable
- expected extras
- payment timing
- cancellation terms

## H. Booking
- instant
- scheduled
- recurring
- quote-required
- multi-step project
- provider reassignment
- waitlist
- no-show handling

## I. Change orders
Provider submits:
- reason
- added scope
- line items
- photos
- revised price
- revised duration

Customer:
Approve / decline / ask question.

No silent charging.

## J. Job evidence
- before photos
- work photos
- after photos
- notes
- checklist
- materials
- customer sign-off
- provider sign-off
- timestamp
- approximate location proof

## K. Reviews
Two-sided reviews.
Controls:
- verified-job only
- anti-retaliation rules
- fraud detection
- moderation
- appeal
- category-specific ratings

## L. Communication
- text
- photos
- video
- voice notes
- read status
- typing indicator
- system messages
- safety warnings
- blocked contact details where appropriate

## M. Service history / Home Passport
Recommended differentiator:
- property
- room
- appliance/asset
- installation
- repair
- provider
- warranty
- documents
- photos
- recurring maintenance

This turns Prolivo from a one-time marketplace into a long-term home/service record.

## N. Recurring services
- maintenance schedules
- recurring bookings
- preferred provider
- reminders
- skip/pause
- auto-renewal rules
- price change approval

## O. Business accounts
Phase 2:
- organization
- locations
- employees
- permissions
- service budgets
- approval workflows
- vendor lists
- invoices
- service-level agreements
- reports

## P. Professional business tools
Phase 2:
- customer CRM
- quotes
- invoices
- job costing
- expenses
- team members
- route optimization
- service packages
- repeat customers
- earnings reports

## Q. AI assistant
Customer:
- diagnose intake
- explain service
- compare quotes
- summarize provider profiles
- prepare job instructions

Professional:
- summarize job
- draft customer messages
- create quote from notes
- summarize work report
- suggest follow-up maintenance

Admin:
- summarize incidents
- detect fraud signals
- explain marketplace anomalies
