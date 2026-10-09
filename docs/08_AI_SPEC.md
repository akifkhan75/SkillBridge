# Fixli — AI Specification

## AI philosophy

AI improves speed and understanding. It must not become an invisible source of truth.

## AI jobs

### 1. Request understanding
Input:
- text
- voice transcript
- images
- optional video metadata

Output:
```json
{
  "category": "plumbing",
  "subcategory": "leak",
  "urgency": "standard|urgent|emergency",
  "severity": "low|medium|high|critical",
  "summary": "...",
  "requiredSkills": [],
  "suggestedQuestions": [],
  "estimatedDurationRange": {},
  "priceRange": {},
  "hazards": [],
  "confidence": 0.0
}
```

### 2. Missing-information assistant
Ask only the minimum questions needed to improve matching.

### 3. Visual assistance
- identify visible components
- identify possible issue
- detect obvious hazards
- suggest what information to capture
- never claim certainty where image evidence is insufficient

### 4. Match explanation
Explain why a professional is recommended:
- qualified
- nearby
- available
- strong category performance
- price fit

Do not expose sensitive ranking features.

### 5. Professional job brief
Convert customer input into:
- issue summary
- likely required tools
- access notes
- questions
- safety warnings
- customer expectations

### 6. Quote assistant
Professional can dictate:
“Replace kitchen faucet and shutoff valve; parts 45, labor 80.”

AI converts it into editable line items.

Human confirms before sending.

### 7. Work report
Convert notes/photos into a structured completion report.

### 8. Support copilot
Summarize conversation, job events, payments and evidence for human support.

## Safety rules

AI must:
- label uncertainty
- never invent credentials
- never invent prices
- never invent emergency contacts
- never tell users to perform dangerous electrical/gas procedures
- escalate high-risk cases
- preserve human confirmation for bookings, payments and changes

## Prompt versioning

Every AI request stores:
- prompt version
- model
- schema version
- input class
- output
- validation result
- safety flags
- latency
- token/cost metadata where available

## Evaluation

Create a golden dataset covering:
- plumbing
- electrical
- HVAC
- appliances
- locksmith
- cleaning
- multilingual input
- slang
- vague descriptions
- adversarial requests
- emergency wording
- images with low quality
- conflicting signals

Metrics:
- category accuracy
- urgency precision/recall
- unsafe recommendation rate
- structured-output validity
- hallucination rate
- human override rate
- customer correction rate

## Gemini integration

Use a backend AI adapter:
`AIProvider` → `GeminiProvider`

Keep provider abstraction so models can change without rewriting product logic.

## AI is never the authority for:
- identity verification
- payment status
- provider approval
- emergency dispatch confirmation
- legal eligibility
- credential validity
- final charge
- dispute outcome
