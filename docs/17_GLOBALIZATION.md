# Fixli — Globalization Strategy

## International-by-default

From day one:
- locale
- timezone
- currency
- country
- region
- measurement system
- date format
- address format
- tax model
- service taxonomy
- emergency contacts
- legal configuration

## Languages

Architecture must support:
- English
- Arabic
- Spanish
- French
- Portuguese
- German
- Turkish
- Urdu
- Hindi
- Bahasa Indonesia

Add language packs incrementally based on launch markets.

## Currency

Never store display-formatted money.
Store:
- integer minor units
- ISO currency
- exchange metadata only where conversion is required

## Address

Do not assume US ZIP codes.
Support:
- country-specific address structures
- landmarks
- building/unit
- geocoded coordinates

## Service taxonomy

Core categories remain global, but service names, licenses and pricing models are local.

Example:
Electrical → residential wiring
may have different credential requirements by country.

## Payments

Use payment-provider adapters.
Do not hard-code Stripe-specific concepts into core domain logic.

## Taxes

Tax is configuration + provider integration, not a frontend calculation.

## Emergency

Emergency numbers must be country-specific and verified before launch.
Never hard-code 911/1122 globally.

## Localization QA

Test:
- RTL
- long translations
- pluralization
- currency formatting
- local phone numbers
- address forms
- daylight saving
- 12/24 hour time
- local holidays
- legal text

## Launch strategy

Country is not enough; launch by city/metro because marketplace liquidity is local.
