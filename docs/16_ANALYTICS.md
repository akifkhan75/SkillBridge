# Fixli — Analytics Specification

## Core funnel

`app_open`
`service_search`
`job_started`
`job_submitted`
`ai_analysis_completed`
`match_shown`
`professional_selected`
`booking_requested`
`booking_confirmed`
`payment_authorized`
`provider_en_route`
`provider_arrived`
`job_started`
`change_order_requested`
`change_order_approved`
`job_completed`
`payment_captured`
`review_submitted`
`rebook_started`

## Professional funnel

`professional_signup`
`verification_started`
`verification_completed`
`profile_completed`
`went_online`
`job_received`
`job_accepted`
`job_declined`
`job_completed`
`payout_received`

## Safety events

- emergency_opened
- emergency_contact_shown
- emergency_call_initiated
- trusted_contact_notified
- incident_created
- incident_escalated
- safety_cancel

## Product KPIs

### Marketplace
- fill rate
- time to match
- time to acceptance
- completion rate
- cancellation rate
- repeat rate

### Quality
- rating
- rework rate
- dispute rate
- damage claims
- no-show rate

### Economics
- GMV
- take rate
- revenue/job
- payment cost
- support cost/job
- contribution margin

### AI
- analysis success
- correction rate
- safety escalation rate
- human override rate
- latency
- cost/request

## Privacy
Do not place:
- full addresses
- phone numbers
- identity documents
- private message text
into general analytics events.

Use anonymous IDs and controlled dimensions.
