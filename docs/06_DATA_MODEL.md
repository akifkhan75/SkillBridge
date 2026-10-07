# Fixli — PostgreSQL/PostGIS Data Model

## Core entities

### users
- id UUID
- role flags
- name
- email
- phone
- locale
- timezone
- status
- created_at
- updated_at

### user_sessions
- id
- user_id
- device_id
- refresh_token_hash
- expires_at
- revoked_at

### addresses
- id
- user_id
- label
- address_line_1
- address_line_2
- city
- region
- postal_code
- country_code
- latitude
- longitude
- geog geography(Point,4326)
- precision_level

### professionals
- id
- user_id
- business_name
- bio
- years_experience
- status
- service_radius_km
- minimum_callout
- hourly_rate
- currency
- online_status
- response_rate
- completion_rate
- cancellation_rate
- rating_average
- rating_count

### professional_services
- professional_id
- service_id
- skill_level
- years_experience
- active

### professional_availability
- id
- professional_id
- weekday
- start_time
- end_time
- timezone
- effective_from
- effective_to

### service_categories
- id
- parent_id
- code
- name
- risk_level
- active

### service_questions
- id
- service_id
- question
- answer_type
- required
- order_index

### jobs
- id
- customer_id
- service_id
- status
- urgency
- description
- ai_summary
- scheduled_start
- scheduled_end
- address_id
- latitude
- longitude
- geog
- budget_min
- budget_max
- currency
- created_at

### job_media
- id
- job_id
- type
- storage_key
- thumbnail_key
- mime_type
- size
- created_by
- created_at

### job_ai_analyses
- id
- job_id
- model
- prompt_version
- output_json
- confidence
- safety_flags
- created_at

### matches
- id
- job_id
- professional_id
- score
- distance_m
- estimated_travel_seconds
- reason_json
- rank
- created_at

### quotes
- id
- job_id
- professional_id
- status
- subtotal
- platform_fee
- tax
- total
- currency
- valid_until
- notes

### quote_items
- id
- quote_id
- type
- description
- quantity
- unit_price
- total

### change_orders
- id
- booking_id
- quote_id
- reason
- status
- old_total
- new_total
- approved_at

### bookings
- id
- job_id
- professional_id
- status
- scheduled_start
- scheduled_end
- accepted_at
- arrived_at
- started_at
- completed_at
- cancelled_at
- cancellation_reason

### job_events
- id
- job_id
- actor_id
- type
- payload_json
- created_at

### payments
- id
- booking_id
- provider
- provider_payment_id
- status
- amount
- currency
- authorized_at
- captured_at
- refunded_at
- idempotency_key

### payouts
- id
- professional_id
- booking_id
- provider_payout_id
- amount
- currency
- status
- available_at
- paid_at

### conversations
- id
- booking_id nullable
- customer_id
- professional_id
- status

### messages
- id
- conversation_id
- sender_id
- type
- text
- media_key
- created_at
- read_at

### reviews
- id
- booking_id
- reviewer_id
- reviewee_id
- rating
- category_scores_json
- text
- status

### verification_cases
- id
- professional_id
- type
- provider
- status
- submitted_at
- reviewed_at
- expires_at
- metadata_json

### disputes
- id
- booking_id
- opened_by
- reason
- status
- resolution
- amount_held
- created_at
- closed_at

### incidents
- id
- user_id
- booking_id nullable
- type
- severity
- status
- location
- metadata_json

### trusted_contacts
- id
- user_id
- name
- phone
- relationship
- verified

### notifications
- id
- user_id
- type
- payload_json
- sent_at
- read_at

### audit_logs
- id
- actor_id
- action
- entity_type
- entity_id
- before_json
- after_json
- ip
- user_agent
- created_at

### feature_flags
- id
- key
- enabled
- rules_json

## Required constraints

- UUID primary keys
- timestamps UTC
- money stored as integer minor units
- ISO 4217 currency code
- country ISO code
- unique provider payment IDs
- unique idempotency keys
- foreign keys
- soft delete only where legally/business appropriate
- immutable financial ledger records
- audit logs for sensitive changes
