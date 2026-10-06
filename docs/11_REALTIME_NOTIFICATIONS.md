# Prolivo — Realtime, Location & Notifications

## Realtime events

- professional_online
- professional_offline
- match_created
- booking_requested
- booking_accepted
- booking_declined
- provider_en_route
- provider_nearby
- provider_arrived
- job_started
- change_order_requested
- change_order_approved
- job_completed
- payment_authorized
- payment_captured
- payout_created
- message_created
- incident_created

## Location

Use adaptive update frequency:
- not on active job: no continuous tracking
- en route: higher frequency
- active job: limited updates as required
- completed: stop tracking

Do not collect continuous background location unless necessary and explicitly disclosed.

## Geofencing

Possible triggers:
- approaching customer
- arrived
- leaving
- job completion verification

Geofence events must tolerate GPS drift.

## Push

Channels:
- booking
- message
- job
- payment
- safety
- marketing

Marketing must be separately consented.

## SMS/WhatsApp

Use for:
- OTP
- critical booking events
- fallback communication

Avoid sending sensitive information in plaintext.

## Notification deduplication

Every notification needs:
- event ID
- recipient
- channel
- template version
- delivery status

Duplicate events must not spam users.
