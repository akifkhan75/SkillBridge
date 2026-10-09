# Fixli — Payments & Monetization

## Marketplace payment model

Preferred:
Customer authorizes payment
→ job completed
→ completion/dispute window
→ funds captured/released
→ platform fee retained
→ professional payout

Exact flow depends on payment provider and country.

## Pricing models

1. Fixed service
2. Hourly
3. Diagnostic fee + quote
4. Starting price
5. Package
6. Recurring service
7. Project milestone

## Platform revenue

### Primary
- transaction/service fee
- professional lead/booking fee only where economics support it

### Secondary
- professional SaaS tools
- business accounts
- premium customer protection/concierge
- promoted listings with strict transparency
- verification add-ons
- insurance/referral partnerships
- enterprise API

## Recommended launch economics

Avoid forcing a 10–15% universal commission globally.

Instead configure:
- customer service fee
- provider commission
- payment fee treatment
- minimum platform fee
- maximum platform fee
- category-specific rates
- country-specific tax

## Professional plans

Free:
- profile
- limited marketplace access
- basic job management
- payouts

Pro:
- advanced analytics
- CRM
- quote/invoice tools
- recurring customers
- AI assistant
- priority support

Business:
- teams
- dispatch
- multiple locations
- advanced reporting
- integrations

## Customer plans

Do not paywall core safety.

Premium can include:
- priority support
- service history/asset passport
- extended protection
- concierge
- advanced maintenance reminders
- household sharing

## Financial rules

- store money in minor units
- never use floating point
- immutable transaction records
- webhook reconciliation
- idempotency
- refund support
- partial refund
- payout reversal handling
- chargeback tracking
- tax calculation abstraction

## Pakistan launch configuration (addendum, 2026-10-07)

Scope: **Pakistan only** for now. Other countries are configured and approved separately before their go-live; they must not inherit these values.

- Commission, fees, caps, tax treatment and cash-settlement limits are **per-country configuration** (see `22_UX_UI_AUDIT_AND_REDESIGN_PLAN.md` §11.8 for the schema, the cash-settlement model and the proposed placeholder numbers, all awaiting owner approval).
- Cash on completion is allowed. Commission on cash jobs accrues to a worker's cash-commission ledger, is netted against digital payouts first, and any remainder is settled through a licensed partner rail with soft and hard limits.
- Fixli does not hold customer funds by default; the final model depends on the payments-licensing answer in `22_...` §11.7 (L5).
- All money is stored as integer minor units (PKR, exponent 2); ledger entries are immutable; every adjustment is a new entry.

