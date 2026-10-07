# Fixli — AI Agent Engineering Rules

## Never
- hardcode secrets
- bypass backend authorization
- mutate payment status from client
- trust AI output blindly
- expose exact location unnecessarily
- create fake production data
- skip migrations
- silently change business rules
- remove tests to make builds pass
- disable TypeScript strictness
- introduce random libraries without justification
- create microservices prematurely

## Always
- inspect first
- use existing patterns
- reuse shared types
- validate DTOs
- validate environment variables
- add tests
- log safely
- use idempotency
- use transactions where needed
- use UTC timestamps
- use minor-unit money
- use country/currency configuration
- handle offline mode
- handle permission denial
- handle network retry
- audit sensitive actions

## Code quality
- clear names
- small modules
- explicit dependencies
- domain services for business rules
- controllers remain thin
- repositories encapsulate persistence
- external providers behind adapters

## Database
Never:
- delete production data in migrations
- change financial records destructively
- rely on application-only uniqueness

Always:
- constraints
- indexes
- foreign keys
- transactions
- migration rollback strategy

## Mobile
Never:
- store tokens in plain AsyncStorage
- request location/camera/microphone before context
- assume permissions granted
- assume network
- assume GPS accuracy

## AI
Every AI call must specify:
- provider
- model
- prompt version
- schema version
- timeout
- retry policy
- fallback
- safety handling

## Reviews
Before marking work complete:
- typecheck
- lint
- unit tests
- integration tests
- E2E where applicable
- inspect diff
