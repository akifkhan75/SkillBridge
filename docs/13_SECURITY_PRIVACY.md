# Prolivo — Security & Privacy

## Authentication
- short-lived access tokens
- rotating refresh tokens
- secure storage
- device/session revocation
- MFA for high-risk roles
- brute-force protection
- suspicious-login detection

## Authorization
Use RBAC + resource-level authorization.

Examples:
- customer can read own jobs
- provider can read assigned jobs
- provider cannot read another provider's customer data
- support can access only required case data
- finance cannot modify verification
- admins cannot silently modify financial records

## API security
- TLS
- validation
- rate limits
- WAF/API gateway
- request size limits
- file type validation
- malware scanning for uploads
- signed URLs
- secret manager
- dependency scanning

## Data protection
- encryption at rest
- encryption in transit
- field-level protection for sensitive data where needed
- segregated verification documents
- least privilege
- retention policies

## Location privacy
- coarse location for discovery
- exact location only when authorized
- no permanent provider/customer location exposure
- explicit background-location consent

## AI privacy
Do not send more user data to the model than required.
Avoid using sensitive identity documents as AI inputs unless explicitly necessary and legally reviewed.

## Audit
Audit:
- role changes
- verification decisions
- payment changes
- refunds
- disputes
- safety actions
- account suspension
- data exports
- deletion requests

## Security testing
- SAST
- dependency scan
- secret scan
- DAST
- penetration testing before major launch
- authorization tests
- rate-limit tests
- webhook signature tests
- mobile secure-storage tests
