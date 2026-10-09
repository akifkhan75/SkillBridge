# Fixli — UX/UI Audit & Redesign Plan

> Status: **planning only, nothing in this document has been implemented.**
> Audited: 2026-10-07, branch `fix-mobile-app`, `apps/mobile` (Expo Router, React Native, Redux).
> Audience: the developers and AI agents who will build this. Read `19_AGENT_ENGINEERING_RULES.md` first; it still applies.
> Brand assets: `apps/mobile/assets/images/` (`logo-light.png`, `logo-dark.png`, `logo-mark.png`, `icon-tile-*.png`); source sheet in `docs/brand/`.

---

## 1. Summary

**What Fixli is:** a home-repair marketplace. A customer has something broken; a nearby tradesperson (plumber, electrician, carpenter and so on) fixes it. Many of both sides will have low literacy, limited typing ability, and older or cheaper phones.

**Where the app is today:** the visual identity (logo, blue/orange palette, navy dark mode) is in place. The product underneath is a developer demo. The core loop (request → quote → hire → track → pay → review) is not connected end to end. Most screens are mock data or placeholders, the interface is dark-only and text-heavy, and it asks users to type email addresses, passwords and paragraphs.

**The one-line redesign goal:** *a person who cannot read well should be able to get a plumber to their door in under a minute, using photos, voice and big buttons, and never have to type a sentence.*

**Top five changes, in order of impact**

1. Replace email + password with **phone number + SMS/WhatsApp OTP** (no password, no email).
2. Rebuild "Request a service" as a **visual, tap-first flow**: pick a picture tile → optionally take a photo / speak → confirm. AI fills the rest.
3. Finish the **end-to-end job loop** with real data and a plain-language **status timeline** for both sides.
4. Replace the dark-only gradient look with an **Apple-style light-first design system** (with proper dark mode), built from shared components.
5. Build a **smart-forms engine** (provenance, suggestions, voice, learned defaults) so every form is pre-filled and the user only confirms.

---

## 2. Audit findings

Severity: **P0** blocks a real user or is a correctness/safety problem · **P1** serious friction · **P2** polish.

### 2.1 Experience / flow

| # | Sev | Finding | Where |
|---|-----|---------|-------|
| U1 | P0 | Sign-in needs an email address and password. Low-literacy users forget passwords, mistype emails and abandon. | `app/(auth)/login.tsx`, `signup.tsx` |
| U2 | P0 | Request flow dead-ends. After "Analyze & Find Matches" the screen just calls `router.back()`; the user is returned to Home with no visible result, no matches, no next step. | `app/(customer)/request-service.tsx:67-78` |
| U3 | P0 | Location is a hard-coded string `'Customer Current Location'`, so no real job can be dispatched. | `request-service.tsx:62-64` |
| U4 | P0 | Quote review shows a mock quote ($150). Accept/Reject both just go back. Nothing is sent to the API. | `app/(customer)/quote-review.tsx` |
| U5 | P0 | Checkout is hard-coded ($80 + $5). Both pay buttons just go back. "Apple Pay" is shown on every platform. | `app/(customer)/checkout.tsx` |
| U6 | P0 | Bookings list is `MOCK_BOOKINGS` and shows raw enum text (`Status: PENDING_QUOTE`). | `app/(customer)/bookings.tsx` |
| U7 | P0 | Worker side: Job Requests is `MOCK_JOBS`; Dashboard, Analytics, Payments, Projects, Schedule, Chat are 34-line placeholders that print "<Screen> content". | `app/(worker)/*.tsx` |
| U8 | P0 | Worker "Upload Evidence & Complete Job" button has no `onPress`. Evidence offers gallery only (no camera) and never uploads. | `app/(worker)/evidence.tsx` |
| U9 | P0 | Worker quote screen calls `http://localhost:3000/ai/quote-draft` with raw `fetch`, bypassing `services/api.ts`, silently falls back to canned text, and the submit is a `console.log`. | `app/(worker)/quotes.tsx` |
| U10 | P1 | Request screen is a blank multiline text box ("Describe your issue in detail"). The photo, which is the best input for this audience, is labelled "Optional" and sits below the fold. No voice input. | `request-service.tsx` |
| U11 | P1 | Demo credential chips ("👤 Customer / 🔧 Worker") ship on the production login screen. | `login.tsx:118-135` |
| U12 | P1 | Jargon and developer language: "AI-Powered Matching", "Analyze & Find Matches", "Platform Fee", statuses such as `MATCHES_FOUND`, `AWAITING_WORKER`. | home, bookings, jobs |
| U13 | P1 | Navigation is too wide. Customer has 5 tabs (Chat and Settings are low-frequency). Worker has a **9-item hamburger drawer**, which is hidden navigation and hard for this audience. | `(customer)/_layout.tsx`, `(worker)/_layout.tsx` |
| U14 | P1 | SOS is a small red pill next to the notification bell. It is easy to hit by accident and easy to miss in a real emergency; there is no confirmation, countdown or "what happens next". | `(home)/index.tsx` |
| U15 | P1 | Errors use `Alert.alert('Error', …)` and English technical messages. No inline, friendly, actionable errors; no empty, loading or offline states anywhere. | all screens |
| U16 | P1 | Worker signup: role pick, then name, email, password. Workers must also be verified (ID, skills, area) but nothing guides them. `DocumentVerification.tsx` exists but is not in a guided onboarding. | `signup.tsx` |
| U17 | P1 | **i18n is not wired up.** `src/i18n/index.ts` defines en/ar/ur (with RTL), but no screen imports it. Every string is hard-coded English. The Arabic app name is still "سكيل بريدج" (SkillBridge). | `src/i18n/index.ts`, all screens |
| U18 | P1 | Currency is hard-coded `$` while the product targets markets with other currencies; DB stores money as `Float` (`paymentAmount`), which conflicts with the "minor-unit money" rule in doc 19. | checkout, quote screens, `schema.prisma` |
| U19 | P2 | Notification bell has no handler; there is no notification centre. | `(home)/index.tsx` |
| U20 | P2 | No post-job review prompt, no repeat-booking ("Book again"), no saved addresses. | n/a |

### 2.2 UI / visual

| # | Sev | Finding | Where |
|---|-----|---------|-------|
| V1 | P1 | **Dark-only.** Every screen does `const theme = colors.dark`. `app.json` says `userInterfaceStyle: automatic` and a light palette exists in `theme/index.ts`, but nothing uses it and there is no settings toggle. A dark, purple-then-blue gradient UI reads "developer tool", not "trusted home service". | all screens |
| V2 | P1 | Hard-coded colours bypass the theme in at least 9 files (`#0F172A`, `#EF4444`, `#fff`, `#e11d48`, `#10b981`…), including `_layout.tsx` files and every worker screen. The recent palette change had to be sed-patched for this reason. | `app/_layout.tsx`, `(auth)/_layout.tsx`, `(home)/_layout.tsx`, `(worker)/*` |
| V3 | P1 | Type is too small and too uniform: body 15, labels 11-13, no Dynamic Type support. The primary audience needs ≥17pt body. Several touch targets are under 44pt (back arrows, chips, "AI Assist"). | theme `fontSize`, many screens |
| V4 | P1 | Every category card uses the same `construct` wrench icon. Category recognition is the single most important visual job in the app; today it relies on reading an upper-case label ("GENERAL HANDYMAN"). | `(home)/index.tsx:79`, `categories/[id].tsx` |
| V5 | P1 | Emoji used as icons (👤 🔧 👋) in role cards and demo chips. Emoji render differently per OS and look unfinished. | `signup.tsx`, `login.tsx`, home |
| V6 | P1 | Three different screen-header patterns (custom row with back arrow, drawer hamburger row, none). Each screen re-implements its header, spacing and card styles with magic numbers (`padding: 16`, `borderRadius: 12`, `8`). | many |
| V7 | P2 | Heavy blue gradients on buttons and hero, plus 1px borders and shadows on cards. Apple-style UI uses flat colour fills, grouped inset lists, soft layered surfaces and hairline separators. | login, home, signup |
| V8 | P2 | Tab bar is a plain solid bar with filled Ionicons in both states. No blur, no outline/filled state change, no haptics. | `(customer)/_layout.tsx` |
| V9 | P2 | No motion design: default slide transitions only; no sheet presentations, skeleton loaders, success animations or haptic feedback (`expo-haptics` is installed but unused). | app-wide |
| V10 | P2 | Logo is shown at fixed 160×60 on login and signup and not at all inside the app; no branded splash/empty/loading states. | auth screens |

### 2.3 Accessibility

- **A1 (P0):** zero uses of `accessibilityLabel` / `accessibilityRole` in `app/` or `src/`. VoiceOver/TalkBack users cannot use the app.
- **A2 (P1):** colour alone carries status (blue/green/red) with no icon+text pairing.
- **A3 (P1):** no reduced-motion handling, no font-scale testing, no RTL layout testing despite shipping ar/ur strings.
- **A4 (P2):** contrast of `textTertiary` on `surface` in both palettes is below 4.5:1 for small text (verify with a contrast checker before shipping).

---

## 3. Design principles for this audience

Every screen and component must pass these. They override "what's easy to build".

1. **Pictures before words.** Every choice has an illustration or photo; text is a caption, not the interface.
2. **Tap, speak, snap. Typing is the last resort.** Offer voice and camera first; offer typing as "Write instead".
3. **One decision per screen.** One headline, one primary button at the bottom, thumb-reachable.
4. **Say it in the user's language, and say it out loud.** Language chosen on the very first screen (flags/native names, device language preselected). Key screens have a 🔊 "listen" button (text-to-speech). Short sentences, grade-3 reading level, no jargon.
5. **Never make them remember.** No passwords. Pre-fill from history. Show "Suggested" values to accept with one tap (see §6).
6. **Always show where they are and what happens next.** Progress dots, a status timeline, and "what happens next" text on every confirmation.
7. **Forgive everything.** Undo instead of "Are you sure?" dialogs; auto-save every form; recoverable errors in plain words; never lose a half-filled request.
8. **Big and calm.** Targets ≥ 56pt for primary actions (never below 44pt), body ≥ 17pt, lots of white space, one accent colour per screen.
9. **Trust is the product.** Show verified badge, photo, rating, job count, ID-checked and price up front, before the user commits.
10. **Works badly-connected.** Offline-tolerant: queue the request, show "Saved – will send when online", never a blank screen.
11. **Safety is one big deliberate gesture.** SOS is always reachable but needs press-and-hold (see §5.1).

---

## 4. Target information architecture

### 4.1 Customer app

```
First launch:   Language → Welcome (3 swipe cards, skippable) → Phone + OTP → Name (+ photo optional) → Home
Bottom tabs (3):  Home   |   My Jobs   |   Account
```

- **Home:** greeting, "What needs fixing?" tile grid (see §5.1), a prominent *Speak* and *Photo* shortcut, active-job card pinned at top when a job is in progress, **SOS** button.
- **My Jobs:** *Active* and *Past* segmented control; each card shows a plain status sentence + icon (see §7.3). Tapping opens the **Job screen** (timeline, worker card, call/chat, pay).
- **Account:** profile, saved addresses, payment methods, language, appearance (Light/Dark/Automatic), help/support (WhatsApp/call), log out.
- **Chat** is not a tab. It lives inside a job (button "Message" and "Call" on the worker card), supports **voice notes**, photos and quick replies ("I'm outside", "Please call me").
- Notifications: bell on Home opens a simple list; push notifications drive most updates.

### 4.2 Worker app

```
Onboarding:  Language → Phone + OTP → Name + photo → "What do you fix?" (tiles) → Area → ID photo + selfie → Done (pending review)
Bottom tabs (4):  Today   |   Jobs   |   Earnings   |   Account
```

- **Today:** large **Online / Offline** switch, next job card, today's earnings, new-request alerts.
- **Jobs:** *New requests* (accept / decline / send price) · *Booked* · *Done*.
- **Earnings:** this week total (big number), per-job list, payout status, "Withdraw".
- **Account:** profile and portfolio, skills and areas, working hours, ID verification status with a progress meter, language, appearance, help.
- Remove the drawer, Analytics, Projects and Schedule as top-level destinations. Working hours move into Account → Working hours; Analytics is folded into Earnings; Projects is merged into Jobs (Booked).

### 4.3 Routes to add / remove

| Add | Remove / merge |
|-----|----------------|
| `(auth)/language`, `(auth)/phone`, `(auth)/otp`, `(auth)/profile-setup` | email/password login & signup screens |
| `(customer)/request/[step]` (category → issue → photo/voice → when → where → review) | `request-service.tsx` (single page) |
| `(customer)/job/[id]` (timeline, offers, pay, review) | `quote-review.tsx`, `checkout.tsx`, `bookings.tsx` become sections/sheets of the job screen |
| `(worker)/(tabs)/{today,jobs,earnings,account}`, `(worker)/job/[id]` | `(worker)` drawer, `analytics`, `projects`, `schedule`, `payments`, `chat` top-level screens |
| `(shared)/chat/[threadId]` | per-role chat screens |

---

## 5. Target flows

### 5.1 Customer: request a service (target ≤ 5 taps, ≤ 60 seconds)

1. **Home tile grid.** 8 big picture tiles (Plumbing, Electrical, AC & Cooling, Carpentry, Painting, Cleaning, Mechanic, Other) plus a "Not sure? Show us" tile that opens the camera. Each tile has a **custom illustration** in the brand blue/orange, a native-language label and a 🔊.
2. **What's the problem?** (skipped if the photo or voice step already produced it.) 4–8 picture chips for the common problems in that category (e.g. Plumbing: *Leaking tap · Blocked drain · No water · Toilet · Geyser · Pipe burst · Other*). Defined in the catalogue (`service-catalog`), not hard-coded in the app.
3. **Show us** (photo-first). Giant camera button, secondary "Gallery", and a 🎤 **hold-to-talk** button ("Tell us in your own words"). Voice is transcribed on the server in the user's language and *shown as editable text with a play button*; photo is analysed by the existing AI endpoint. "Skip" is allowed.
4. **When?** Four big chips: **Now · Today · Tomorrow · Choose a day** (day picker uses a horizontal strip of days, then Morning / Afternoon / Evening chips; no calendar widget, no typed dates).
5. **Where?** Map pin preselected from GPS with a single "Is this your home?" confirm; saved addresses as chips (Home, Work); optional "Add a landmark" with voice. Never ask the user to type an address first.
6. **Review (one screen).** Photo, spoken note with play button, category icon, time, address, **estimated price range** from the catalogue, and a single **"Send request"** button. Everything is tappable to change. An **Edit** pencil on each row opens that step as a sheet, not a new flow. A quiet *Who should come? Anyone · Woman · Man* row sits here (§11.4); it adds no steps.
7. **Finding professionals** (animated brand loader, text "Looking for plumbers near you…", cancel link). Typical wait under 60s; push notification if the user leaves.
8. **Choose** (up to 3 offer cards): photo, name, ⭐ rating, jobs done, ✅ Verified, distance and arrival time, **price (big)**. Primary button *Choose*. Sort default: best match. No negotiation screens.
9. **Confirmed.** Big tick animation, "Ahmed is coming at 4:30 PM", call/message buttons.

**SOS (emergency):** a distinct red button on Home, bottom-right of the safe area, labelled "SOS" with an icon. **Press and hold for 2 seconds** (ring fills, haptic pulses) to start; a 5-second "Sending… Cancel" countdown follows. Selects *emergency category* (3 big icons: Water/Pipe burst · Electric/Fire hazard · Gas smell) with pre-filled location; no other questions. Copy must also show local emergency numbers for life-threatening situations (see `09_TRUST_SAFETY_COMPLIANCE.md`).

### 5.2 Customer: during and after the job

- **Job screen** is a single scrolling page with a **status timeline** (§7.3): Requested → Offers ready → Booked → On the way → Arrived → Working → Done → Paid. A map card appears at *On the way* (existing `LiveTrackerMap`).
- **Price changes:** if the worker needs extra work (the existing `change-orders` module), a full-screen sheet shows the *old price, the extra amount and a one-line reason (text + voice)* with **Approve / Decline**. Never a surprise on the final bill.
- **Pay:** total as the largest element; payment methods are the local ones for the country (cash, card, wallets) shown with logos; Apple/Google Pay only where available. Cash must be a first-class option ("Paid in cash" confirmed by both sides).
- **Rate:** five big faces (😞 → 😍 as SVG icons, not emoji), optional voice note, optional tip chips. Skippable; reminded once.

### 5.3 Worker: onboarding (target < 3 minutes)

Phone + OTP → Name + **selfie as profile photo** → "What do you fix?" (multi-select tiles, same illustrations as customers see) → "Where do you work?" (map + radius slider with chips 3 / 5 / 10 km) → ID document: **photo with live edge-detection frame and OCR** that pre-fills the name and ID number for confirmation (see §6) → Done ("We are checking your documents, usually within 24 hours"). Show a **profile completeness meter** on Account until verified. Workers can browse but not accept jobs until verified.

### 5.4 Worker: job loop

1. **New request card** (push + in-app): category icon, photo, distance, when, area (not exact address until accepted). Buttons: **Accept at suggested price**, **Send my price**, **Decline** (swipe or button, with one-tap reasons).
2. **Quote** (smart form, §6.3): price chips around a suggested number plus a numeric keypad, optional voice note instead of typing details, "ready in" time chips. No AI-draft text box.
3. **Booked → On the way → Arrived → Start work → Finish:** one **giant primary button** whose label and colour change with the step. "Arrived" is also detected from GPS and offered as a suggestion.
4. **Finish:** *take an "after" photo* (camera opens directly; "before" photos are taken at Start), confirm total, ask the customer to pay. Evidence upload happens in the background and retries when offline.
5. **Earnings** update immediately with an animated "+ amount".

---

## 6. Smart forms

Based on the Smart Forms Playbook (`~/.claude/skills/smart-forms`). The playbook was written for desktop; the principles carry over, but the **interaction is adapted for touch, voice and low literacy**: instead of keyboard shortcuts, masks and ghost text, we use *suggested chips, voice, camera and one-tap confirm*.

### 6.1 Rules for every form (non-negotiable)

- **Provenance on every value:** `user | auto | memory | master | paste | ai | default` (playbook §Z). Auto values **never overwrite** a value the user typed or chose. User edits lock the field.
- **Suggestions are visible and explained.** An autofilled value shows a small ✨ "Suggested" marker; tapping it shows the reason ("Your last address", "From your photo") and offers *Change*. The value is already in the field; the user only acts if it is wrong.
- **Bulk fills are undoable:** toast "Filled 4 things from your photo · Undo".
- **Warnings ≠ errors.** Unusual-but-legal input gets an amber, non-blocking note ("This price is 3× higher than usual in your area. Send anyway?"). Only hard rules block.
- **Autosave drafts** (debounced, versioned key, restore the **entire** form, not selected fields) so a dropped call or app switch never loses a half-done request.
- **Right keyboard, always:** `inputMode`/`keyboardType` (phone, numeric, decimal), `returnKeyType`/`enterKeyHint`, `autoComplete`/`textContentType` for OTP (`oneTimeCode`), name, tel; `autoCapitalize` set deliberately.
- **Money in minor units** (integers) with a decimal library only for display/derivation; **never floats**.
- **Pure rules + unit tests:** all derivations, masks, parsers and validators live in `src/forms/form-utils.ts` with `form-utils.test.ts`. Rules that users override more than 40% of the time get tuned or removed (track with analytics, doc 16).
- **Errors in plain words**, next to the field, with an icon, and a 🔊 for the message on critical forms. No raw Zod messages.
- Keep the existing stack: **react-hook-form + zod** (already used in login/signup). Add patterns to it; do not introduce a second form library.

### 6.2 Smart-forms engine (build once, use everywhere)

Create `apps/mobile/src/forms/`:

```
src/forms/
  provenance.ts        // FieldMeta store (zustand slice or ref map): source, reason, locked, at
  useDerivations.ts    // applies DerivationRule[] in dependency order with scoped useWatch
  applyBatch.ts        // batch fill + undo snapshot + "Filled N things · Undo" toast
  useDraft.ts          // debounced autosave, versioned key, full-restore via reset(draft)
  useSuggestions.ts    // learned defaults per (user, context key); ranks by recency × frequency
  form-utils.ts        // pure: masks, parsers, derivations, soft-warning rules (+ tests)
  components/
    SuggestedChip.tsx  // ✨ + reason + accept/change
    VoiceField.tsx     // hold-to-talk, transcript preview, playback, "write instead"
    PhotoField.tsx     // camera-first, compress, AI-analysis hook, retake
    ChipChoice.tsx     // big single/multi-select picture chips
    AmountField.tsx    // numeric keypad, currency, quick-amount chips, soft warnings
    PhoneField.tsx     // country picker + E.164 mask
    DayTimePicker.tsx  // Now/Today/Tomorrow/Choose, then Morning/Afternoon/Evening
    AddressField.tsx   // GPS pin + saved chips + voice landmark
```

Server pieces: `GET /form-suggestions?form=<id>&ctx=<key>` (or compute on-device from the last N jobs for v1), `POST /ai/extract` (voice transcript/photo → structured fields using the form's JSON schema, with confidence; server-side only; minimum personal data sent), `POST /uploads/presign`.

### 6.3 Per-form derivation tables

Format: **field → source → rule → overwrite policy.**

**A. Sign-in / sign-up (phone OTP)**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Language | device locale | preselect, user taps to change on first screen | `default` → locked on tap |
| Country / dial code | device region / SIM, then IP | preselect, flag shown | `default` |
| Phone | typed | mask to E.164 as typed (`0300 1234567` → `+92 300 1234567`), strip spaces/dashes on paste, reject wrong length with plain text | user |
| OTP | SMS autofill (`oneTimeCode`) | auto-read, auto-submit on 6 digits; "Call me instead" and "WhatsApp" fallback after 30s | auto |
| Name | typed or voice | Title-Case on blur (opt-out), no surname required for customers | user |
| Role | chosen on welcome as "I need a service" / "I fix things" | determines the whole app | user |

**B. Customer service request (the most important form)**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Category | tile tapped, **or** photo/voice analysis | AI returns category + confidence; ≥0.8 preselect with "Is this Plumbing?" confirm; <0.8 show top 3 tiles | `ai`/`user`; never overwrites a tapped tile |
| Issue (sub-service) | chip, **or** AI | from `service-catalog`; one-tap | same |
| Title (generated) | category + issue | "Leaking kitchen tap" (never shown as an input; used in lists and for workers) | `auto`, regenerated until job is sent |
| Description | voice transcript or typed | transcript shown with ▶ and *Edit*; if empty, build from issue chips | `ai`/`user` |
| Urgency | "When" chip + AI severity from photo ("water everywhere") | Now → urgent; AI may *suggest* "This looks urgent, send now?" | `auto` → suggestion only |
| Location | GPS → reverse-geocoded; saved address | default to last used address if within 200 m of GPS; else GPS pin | `memory`/`default` |
| Date/time | chip | "Now" default when category is urgent-type (burst, no power); else "Today" | `default` |
| Price estimate | service catalogue + city median | read-only range shown on Review; never editable by customer | `master` |
| Contact method | profile | call allowed by default; chat optional | `default` |
| **Soft warnings** | rules | request in the past; address far from the GPS pin; photo too dark (suggest retake); very short voice note | amber, non-blocking |

**Entry-point prefill (playbook D10):** "Book again" on a past job copies category, issue and address and only asks *When*. "Find a plumber" from a notification, or the SOS button, jumps to the right step with category preselected.

**C. Address**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Pin | GPS | drag to adjust; "Is this correct?" | `auto` |
| Area/city | reverse geocode | read-only text | `auto` |
| House/building detail | typed or voice | optional; suggest last-used format | `memory` |
| Label (Home/Work/Other) | chips | default Home for the first address | `default` |

**D. Worker quote / send price**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Price | catalogue range ∩ the worker's last prices for this service ∩ city median | pre-filled as the *suggested* figure with 5 quick chips (−20% −10% suggested +10% +20%); numeric keypad for exact; accepts `1.5k`, `2 lakh` style shorthand where locale uses them | `memory`/`master` → user |
| Ready in | chips (30 min, 1 h, 2 h, Today, Tomorrow) | default = distance-based ETA | `default` |
| Note | voice (default) or text | transcript preview; optional | `ai`/`user` |
| Materials included? | toggle | default from worker's last answer for this service | `memory` |
| **Soft warnings** | rules | price >3× or <0.3× the median for this service/area ("Customers may not accept this. Send anyway?") | amber, non-blocking |
| Final summary | derived | "You will receive {price − fee}" shown before sending | `auto` |

**E. Worker onboarding**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Profile photo | selfie with face-guide frame | face-detect, reject sunglasses/dark; compress | user |
| Skills | multi-select tiles | at least 1, up to 5; sub-skills offered after | user |
| Service area | GPS home pin + radius chips | default 5 km | `default` |
| ID type/number/name | **document photo + OCR** (CNIC/ID/passport MRZ) | show parsed fields next to the photo with confidence colours; user confirms, never auto-saves; masks like `12345-1234567-1` | `ai` → user confirms |
| Payout method | tiles (wallet / bank / cash only) | validate with checksum (IBAN) or length (wallet number) | user |
| Working hours | presets ("Mornings", "Full day", "Evenings", "Weekends too") with an editable grid under *Customize* | default Mon–Sat 9–6 | `default` |

**F. Job completion (worker)**

| Field | Source | Rule | Policy |
|-------|--------|------|--------|
| Before photo | camera at "Start work" | one tap, auto-attached | user |
| After photo | camera at "Finish" | required; warn if identical to before | user |
| Extra work / price change | chips ("Extra part", "More time") + amount + voice reason | goes to customer as a change-order sheet | user |
| Total | quote + approved change orders | read-only, computed in minor units | `auto` |

**G. Review (customer):** rating (5 faces) → *optional* quick tags ("On time", "Clean", "Fair price") → optional voice note. Skip is one tap.

### 6.4 Voice

- **Capture:** hold-to-talk with waveform and haptic start/stop; max 60s; local preview before send.
- **Transcribe:** server-side speech-to-text in the user's language (en/ur/ar and any dialect hints from the country config). Always display the transcript, never trust it silently (playbook: AI output is a suggestion).
- **Read aloud:** `expo-speech` for prompts and errors on request (🔊). Provide pre-recorded audio for the 20 most important prompts if device TTS lacks the language.
- Both the *original audio* and the transcript are sent to the worker, because dialect transcription will be imperfect.
- Privacy: audio retention window, consent line on first use (doc 13).

### 6.5 What *not* to do (anti-patterns for this audience)

- No type-only description box as the default path.
- No pickers where chips are faster (day/time), and no free-typed dates, ever.
- No email or password fields.
- No modal "Are you sure?" for reversible actions; use Undo.
- No AI value committed without being shown (and tappable to change).
- No disabling a button without telling the user why (show a plain hint instead).

---

## 7. Visual design system (Apple-like, clean, modern, premium)

### 7.1 Direction

*Light-first, calm, spacious, and tactile.* Think iOS Settings/Wallet/Maps: large titles, grouped inset lists, soft layered surfaces, system-style blur, hairline separators, subtle spring motion and haptics. The brand blue is the single accent; the logo's orange is reserved for **one** highlight per screen (the primary call-to-action badge, a "Now" chip, or a progress accent) and for SOS-adjacent warmth, never for large fills. Dark mode is a first-class peer, using the logo's navy.

Remove: gradient buttons, gradient hero banner, glow shadows, 1px card borders, emoji-as-icons, per-screen headers.

### 7.2 Tokens (replace `src/theme/index.ts` values; keep the file's export names so existing imports keep working during migration)

**Colour (semantic, resolved at runtime from the system colour scheme + user override):**

| Token | Light | Dark |
|-------|-------|------|
| `background` | `#F2F2F7` (grouped) | `#0A1228` (brand navy) |
| `surface` (cards) | `#FFFFFF` | `#121B33` |
| `surfaceElevated` (sheets) | `#FFFFFF` | `#1A2440` |
| `separator` | `rgba(60,60,67,0.18)` | `rgba(255,255,255,0.12)` |
| `textPrimary` | `#0A1228` | `#F5F7FB` |
| `textSecondary` | `#4B5873` (≥ 4.5:1) | `#A9B3C9` |
| `primary` | `#007BFF` | `#2E94FF` |
| `primaryPressed` | `#0062CC` | `#1A7FEB` |
| `onPrimary` | `#FFFFFF` | `#FFFFFF` |
| `accent` (orange, sparingly) | `#FF9500` | `#FFAA33` |
| `success` / `warning` / `danger` | `#1F9D55` / `#E08600` / `#E5392F` | slightly lighter equivalents |
| `sos` | `#E5392F` | `#FF5A4F` |

Rules: never use a raw hex in a screen or component; only tokens via `useTheme()`. A lint rule (`no-restricted-syntax` for hex literals outside `theme/`) enforces it. Verify every text/background pair ≥ 4.5:1 (7:1 for body copy in the low-literacy flows if feasible).

**Typography:** system font (SF Pro on iOS, Roboto on Android; no web fonts), Dynamic-Type-aware (`allowFontScaling` on, `maxFontSizeMultiplier` 1.4 for chrome, 1.8 for content).

| Style | Size / weight |
|-------|---------------|
| Large title | 34 / bold |
| Title 1 / 2 / 3 | 28 / 22 / 20, semibold |
| Headline | 17 semibold |
| **Body (minimum for content)** | **17 regular** |
| Callout / Subhead | 16 / 15 |
| Footnote (never for critical info) | 13 |
| Number display (prices, ETA) | 34–48 semibold, tabular figures |

**Spacing:** 4-pt grid (4, 8, 12, 16, 20, 24, 32, 40). Screen gutters 20. Section gap 24–32.
**Radius:** 12 (inputs, chips), 16 (cards), 24 (sheets, large tiles), full for pills. Use `borderCurve: 'continuous'` on iOS.
**Elevation:** cards are flat on `surface` against `background` (contrast does the work); floating elements (tab bar, sheets, SOS) use one soft shadow (`0 8 24 rgba(10,18,40,0.12)`), no glow.
**Targets:** primary actions 56pt tall, all others ≥ 48pt, spacing between adjacent targets ≥ 12pt.
**Iconography:** SF Symbols via `expo-symbols` on iOS with a matching `Ionicons` fallback on Android, outline when inactive and filled when active. **Category illustrations:** a custom set of ~12 spot illustrations (one per category) in the brand blue + orange accent, drawn as SVG (`react-native-svg`) so they scale and theme. Commission or generate once, store in `assets/illustrations/`.
**Motion:** `react-native-reanimated` springs (damping ≈ 20) for press-scale 0.97, sheet presentation, list insertions; success tick (Lottie or SVG) on booking/payment; **always respect Reduce Motion**. Haptics: light on selection, medium on primary tap, success/warning/error notifications on outcomes.
**Material:** `expo-blur` on the tab bar and large-title headers on iOS; plain translucent surface on Android.

### 7.3 Components (build in `src/components/ds/`, one story/test each)

`Screen` (safe area, background, optional large-title scroll header) · `LargeTitleHeader` · `Button` (primary / secondary / tinted / destructive; loading; ≥56pt) · `IconButton` · `Card` · `GroupedList` + `ListRow` (iOS inset-grouped) · `Chip` / `ChipChoice` · `CategoryTile` · `TextField` / `AmountField` / `PhoneField` / `OtpField` (floating-less, label above, large) · `VoiceButton` · `PhotoTile` · `BottomSheet` (`@gorhom/bottom-sheet`) · `StatusTimeline` · `StatusBadge` (icon + text + colour) · `WorkerCard` (photo, name, rating, jobs, ✅ Verified, price) · `PriceText` (locale-aware, minor units) · `EmptyState` · `Skeleton` · `Toast` (with Undo) · `InlineError` · `ProgressDots` · `SpeakButton` (🔊 TTS) · `SOSButton` (press-and-hold).

**Status vocabulary** (single source in `packages/shared`; maps DB `JobStatus` to icon + colour + a translated one-sentence message for each role):

| JobStatus | Customer sees | Worker sees |
|-----------|---------------|-------------|
| CREATED | "Sending your request…" | n/a |
| MATCHES_FOUND | "3 professionals are ready. Choose one." | "New request near you" |
| AWAITING_WORKER | "Waiting for {name} to confirm" | "Customer is choosing" |
| ACCEPTED | "{name} is booked for {time}" | "Booked. Leave by {time}" |
| IN_PROGRESS | "{name} is working on it" | "Work in progress" |
| COMPLETED | "Done! Please pay {amount}" | "Waiting for payment" |
| CANCELLED | "Cancelled" (+ why) | "Cancelled" |

(Add finer sub-states `ON_THE_WAY` and `ARRIVED` to the enum or as a separate `phase` field; requires a Prisma migration, see §9 Phase 3.)

### 7.4 Screen-by-screen visual targets

| Screen | Change |
|--------|--------|
| Welcome / language | Full-bleed light screen, `logo-mark` large, language list with native names (English / اردو / العربية …), device language preselected and highlighted, one *Continue* button. |
| Phone / OTP | Large title "Your phone number", country chip, 48pt numeric field, one *Continue*; OTP is 6 separate large boxes with autofill and a visible countdown. No logo clutter; mark in nav. |
| Home | Large title greeting; the active-job card (if any) first; "What needs fixing?" **2-column tile grid** with illustrations (no icon boxes), tile height ≥ 120; secondary row "📷 Show us · 🎤 Tell us" as two large buttons; SOS floating bottom-right above the tab bar. Remove the hero banner. |
| Request flow | Full-screen steps with `ProgressDots`, large illustration/photo at top, big chips below, sticky bottom primary button, back chevron + "Cancel" top. |
| Offers | Vertical stack of `WorkerCard`s; price is the biggest text; *Choose* is full-width inside each card. |
| Job screen | Header with status sentence; `StatusTimeline`; sticky bottom action bar whose single button changes with state (Choose → Call → Pay → Rate). |
| My Jobs | `GroupedList` with two sections (Active, Past); each row: category illustration thumbnail, title, `StatusBadge`, price. |
| Account | iOS inset-grouped lists; language and appearance rows show current value. |
| Worker Today | Big Online switch card; next-job card; today's earnings as a large number; below: new request cards with *Accept* / *Send price*. |
| Worker job | One giant step button (e.g. **"I've arrived"**), customer contact row, address with *Navigate* (opens maps), photos row. |
| Earnings | Large amount, week segmented control, simple bar chart (≤ 7 bars, labelled), list of jobs with amounts. |

---

## 8. Cross-cutting requirements

### 8.1 Internationalisation & localisation
- Wire up i18n: add `t()` + `useLocale()` (e.g. `i18n-js` or `react-i18next`; reuse the existing `src/i18n` shape), replace **every** hard-coded string, enforce with a lint rule or CI script that fails on JSX string literals.
- Languages at launch: **English, Arabic, Urdu** only (D5); locale lists come from the country config (§11.3a). Adding `hi`/`bn` later must need only translation files. Fix the stale Arabic app name. Translate by a human; machine drafts must be reviewed.
- RTL: test every screen in RTL; use `start`/`end` styles (`marginStart`, `paddingEnd`, `flexDirection` stays logical), mirror directional icons, support `I18nManager` reload prompt.
- Numbers, dates, currency via `Intl` with the user's locale; **Eastern Arabic/Urdu numerals** where users expect them. Currency comes from the country configuration, not a literal `$`.
- Content (category names, issue chips, status sentences, error messages, notifications) all live in translation files or the catalogue API, never in screens.

### 8.2 Accessibility (target WCAG 2.2 AA)
- Every touchable has `accessibilityRole` and an `accessibilityLabel` (translated); images have labels or are marked decorative; form fields have labels and error `accessibilityHint`.
- Support Dynamic Type up to 200% without clipped content (test at 100/150/200%).
- Contrast ≥ 4.5:1; status never by colour alone.
- Reduce Motion respected; haptics optional in Settings.
- Screen-reader order and focus management on step changes and sheets; live-region announcements on autofill ("Address filled from your location").
- Test with VoiceOver and TalkBack on the full request and worker job loops.

### 8.3 Performance & resilience
- Cold start < 2.5 s on a low-end Android (target: 3 GB RAM class); budget JS bundle and image sizes; compress photos on-device to ≤ 300 KB before upload; use `expo-image` with caching; skeletons not spinners.
- **Offline:** queue request creation, evidence uploads, status updates and chat messages in a persisted outbox (retry with backoff, idempotency keys per doc 19); show "Saved, will send when you're online". Cache the catalogue and the last job states.
- Permission denial: every permission prompt is preceded by a one-screen explanation with an illustration; a denial has a clear recovery path ("Open settings") and a non-permission fallback (type the address, pick from the gallery).
- Battery-friendly location tracking: only while a job is active; foreground service notification text in the user's language.

### 8.4 Trust & safety surface
- ✅ Verified badge defined precisely (ID checked, phone verified, background check status) with a one-tap "What does this mean?" sheet.
- Show the worker's photo, name, rating and job count *before* the customer commits; share the exact address only after booking (doc 13).
- Report/Help button on the job screen (call support, WhatsApp, report problem), SOS available for both roles during an active job.
- Do not display other people's phone numbers; use masked calling or in-app calls where available.

### 8.5 Analytics (doc 16)
Add events: `request_started`, `request_step_completed{step,source}`, `request_sent{time_ms,used_photo,used_voice}`, `offer_viewed`, `offer_chosen`, `job_status_changed`, `payment_completed`, `review_submitted`, and for smart forms `autofill_applied{rule}` / `autofill_overridden{rule}`. **Primary success metrics:** request-to-sent median time (target ≤ 60 s), % requests with zero typed characters (target ≥ 60%), sign-up completion (target ≥ 85%), first-job-completion rate, and worker time-to-first-response.

---

## 9. Implementation plan

Each phase is shippable. Do them in order; phases 1 and 2 can overlap once tokens exist. Sizes are rough engineering estimates for one developer (or one agent session cluster).

### Phase 0: Foundations & cleanup (≈ 3–4 days)
**Goal:** a trustworthy base. No visible redesign yet.
- Delete mock data paths (`MOCK_BOOKINGS`, `MOCK_JOBS`, mock quote, mock checkout values, `'Customer Current Location'`); where an API doesn't exist yet, show an `EmptyState`, not fake data.
- Remove demo-credential chips from production builds (`__DEV__` only).
- Move all API calls through `src/services/api.ts`; remove the hard-coded `localhost` URL in `quotes.tsx`; base URL from env (`EXPO_PUBLIC_API_URL`).
- Delete or consolidate the unused `rename_scope.py`, `update_theme.py` from the repo root.
- Introduce `useTheme()` (reads the system scheme + stored override) and migrate **all hex literals** to tokens; add the lint rule.
- Add `accessibilityLabel`/`Role` utilities and a lint/CI check that touchables have labels.
- Set up i18n (`t()`), extract existing strings to `en` and `ur`/`ar`, fix the Arabic app name; add the "no raw JSX strings" check.
- Money: introduce a `Money` type (integer minor units + ISO currency) in `packages/shared`; plan the Prisma migration from `Float` to `Int`/`BigInt` minor units (and a `currency` column).
- **Done when:** app builds, tests pass, lint rules green, no mock data in release builds, no raw hex in `app/` or `src/components/`.

### Phase 1: Design system (≈ 1–1.5 weeks)
**Goal:** all primitives in §7.3 built, themed (light/dark/auto), RTL-safe, accessible, with tests.
- Tokens (§7.2), typography with Dynamic Type, `Screen`, `LargeTitleHeader`, `Button`, `Card`, `GroupedList`, `Chip`, `TextField` family, `BottomSheet`, `Toast`, `Skeleton`, `EmptyState`, `StatusBadge`/`StatusTimeline`, `WorkerCard`, `CategoryTile`, `SOSButton`.
- Commission/generate the 12 category illustrations + empty-state illustrations + success animation; store as SVG/Lottie.
- Install and configure: `expo-blur`, `expo-symbols`, `@gorhom/bottom-sheet`, `react-native-svg`, `expo-image`, `expo-speech`, `expo-audio`, `lottie-react-native` (justify each in the PR per doc 19).
- Replace tab bar and headers; add a hidden **Design Gallery** screen (dev only) showing every component in light/dark, 100%/200% font, LTR/RTL.
- **Done when:** gallery reviewed on iOS + Android + one small low-end Android; contrast, target-size and screen-reader checks pass.

### Phase 2: Auth & onboarding (≈ 1 week; needs backend)
- Backend: phone-OTP auth (SMS provider, WhatsApp fallback, rate limits, resend/cooldown, lockout, device binding); keep email login for admin only. Add `phone` as unique on `User`; migration.
- Screens: language → welcome → phone → OTP → profile-setup (name, optional photo) for customers; worker onboarding per §5.3 with ID OCR and the verification status meter.
- Persist session securely (`expo-secure-store` is already installed); biometric unlock optional.
- **Done when:** a new user reaches Home in ≤ 45 s median in usability tests; OTP autofill works on iOS and Android; accessibility pass.

### Phase 3: Customer core loop (≈ 2–3 weeks)
- Request flow (§5.1) with real location (permission explainer + fallbacks), photo/voice capture (`PhotoField`, `VoiceField`), AI category/issue suggestion, saved addresses, review screen, offline-queued submission.
- Backend: `POST /jobs` accepting structured fields; offers/matching endpoint returning ≤ 3 offers; `ON_THE_WAY` / `ARRIVED` phases (migration); push notifications (Expo push) for offers and status; voice upload + transcription endpoint.
- Offers screen, Job screen with timeline, change-order approval sheet, payment (local methods + cash), review.
- Replace Bookings/Quote-review/Checkout with the Job screen and sheets; delete the old files.
- **Done when:** a customer can complete the full loop against a real API with a seeded worker; ≥ 60% of test requests need no typing; request-to-sent ≤ 60 s median.

### Phase 4: Worker core loop (≈ 2 weeks)
- New tab structure (§4.2) replacing the drawer; delete placeholder screens.
- Today/Jobs/Earnings/Account; accept/decline/send-price with the smart quote form (§6.3 D); step-button job loop; camera-first evidence with background upload and retry; earnings from real transactions; availability/hours presets.
- **Done when:** a verified worker can receive, quote, complete and be paid for a job with the app killed and restored mid-flow (outbox/draft recovery works).

### Phase 5: Smart-forms hardening & learned defaults (≈ 1 week)
- Implement `useSuggestions` with server suggestions and decay; price medians per service/area; anomaly warnings; duplicate-request guard ("You already have a plumber request open. View it?").
- Add provenance telemetry and a dashboard of override rates; tune or remove rules above 40%.
- Document each form's derivation table in `docs/forms/` as it is built (copy §6.3 and keep it current).

### Phase 6: Polish, accessibility, localisation QA (≈ 1 week)
- Motion/haptics pass; full-screen reader audits; RTL audits; 200% font audits; low-end device profiling; copy review by native speakers; on-device usability tests with **real low-literacy users** in the target market (5–8 per role per round), iterating on the top five failures.
- Update store assets: use `icon-tile-*` and logos from `apps/mobile/assets/images/` and `docs/brand/`; screenshots from the new UI.

### Phase 7: Admin portal alignment (≈ 3 days; optional but recommended)
- Apply the same tokens/typography to `apps/admin` (currently dark-only); add light mode; replace the favicon-only branding with the logo in the sidebar.

---

## 10. Instructions for developers and AI agents

**Before writing code**
1. Read this document, `19_AGENT_ENGINEERING_RULES.md`, `03_USER_FLOWS.md` and `04_FEATURE_SPEC.md`. If this plan conflicts with them, stop and ask which wins.
2. Check the Phase you are on. Do not skip ahead; do not implement a screen before the components it needs exist.
3. Inspect existing code first (`inspect first`); reuse Redux slices and `services/api.ts`.

**While building**
- **Never** hard-code colours, spacing, font sizes, strings, currency symbols, URLs or mock data in screens. Tokens, `t()`, the `Money` type and env config only.
- **Every** new screen: works in light and dark, LTR and RTL, at 100% and 200% font scale, with a screen reader, offline, with permission denied, with a slow network, and with an empty and an error state. Add these to the PR checklist.
- **Every** touchable: ≥ 48pt (primary 56), `accessibilityRole`, translated `accessibilityLabel`, haptic on press.
- **Every** form: uses the engine in §6.2, has a derivation table in `docs/forms/`, has `form-utils.test.ts` coverage for each rule, autosaves, never overwrites user input, offers undo on bulk fills, and uses plain-language errors.
- **Every** status or enum shown to a user goes through the shared status vocabulary (§7.3); raw enum strings must never appear in the UI.
- Keep money as integer minor units; do not use `Number` arithmetic for money.
- Keep controllers thin and DTOs validated on the API side for every new endpoint; add tests (doc 14).
- Do **not** add a library without justification in the PR; do **not** weaken TypeScript strictness or delete tests to pass CI.
- Use only brand assets from `apps/mobile/assets/images/` (`logo-light.png` for light surfaces, `logo-dark.png` (white wordmark) for dark surfaces, `logo-mark.png`). Do not recolour or redraw the logo. Orange is an accent only.

**Review checklist for each PR**
- [ ] Screenshots: light/dark, LTR/RTL, 200% text
- [ ] No hex literals / magic numbers / raw strings (CI green)
- [ ] A11y labels and roles; verified with VoiceOver/TalkBack
- [ ] Empty/loading/error/offline states
- [ ] Analytics events added
- [ ] Unit tests for rules and utilities; e2e for the flow touched
- [ ] Tap count and typed characters measured for the flow (record in PR)

---

## 11. Decisions and open questions

### 11.1 Decided (2026-10-07)

| # | Decision | Consequences built into this plan |
|---|----------|-----------------------------------|
| D1 | **Launch region: Asia and the Middle East** (multi-country). | Everything country-specific is **configuration, not code**: see §11.3. RTL is a first-class requirement from Phase 1, not a late add-on. |
| D2 | **Customers choose from offers** (up to 3). | §5.1 steps 7-8 stand as written. Matching returns ≤ 3 ranked offers; offers expire (default 10 min, configurable); the worker's price is binding once chosen. **SOS is the exception:** it auto-dispatches to the nearest verified worker, then falls back to offers. |
| D3 | **Cash on completion is allowed.** | Cash is a first-class payment method (§5.2). Needs a "mark as paid in cash" flow confirmed by both sides, commission collected from the worker's balance (running balance that can go negative, with a settle-up prompt and a cap that pauses new jobs), and fraud checks. Update `10_PAYMENTS_MONETIZATION.md` accordingly. |

### 11.2 Further decisions (2026-10-07)

| # | Decision | Notes |
|---|----------|-------|
| D4 | **Pilot countries: Pakistan, India, UAE, Saudi Arabia, Bangladesh.** | Configuration for all five is built in Phase 2 (see §11.5). Go-live may still be staged; see the recommendation in §11.5. |
| D5 | **Languages: English, Arabic, Urdu** (no more at launch). | Covers PK (ur/en), UAE and KSA (ar/en). **Known gap:** India and Bangladesh users who read neither Urdu, Arabic nor English well (Hindi, Bengali) are not served by the text UI. Mitigation: the picture-first, voice-first design (§3) keeps text secondary; every string is already keyed through i18n so adding `hi` and `bn` later is a translation task, not an engineering task. Track Bangladesh and India activation rates by language from day one, and revisit after the first usability round. |
| D6 | **Professional-gender preference is offered** (customer side), plus optional hidden profile photo (worker side). | Spec in §11.4. |
| D7 | **Product choices delegated to the team; recommendations adopted below.** | See §11.6. |

### 11.3 Still open

1. ~~Go-live order across the five countries~~ **Decided** (§11.5).
2. **Legal review and commission/cash-settlement rules are scoped to Pakistan only for now** (decision 2026-10-07; the model is per-country config so other countries can be added later). See §11.7 and §11.8. UAE, Saudi Arabia, India and Bangladesh each need their own review and rates before their go-live; until then they are **blocked from launch**, not defaulted to the Pakistan values.

### 11.3a Country configuration model (required by D1, D4)

Create one configuration object per country, served from the API and cached on the device (`GET /config/country/:code`), with a typed schema in `packages/shared`. No screen, form or string may hard-code any of these.

| Config key | What it drives |
|------------|----------------|
| `currency` (ISO code, minor-unit exponent, symbol position, digit set) | `Money`/`PriceText`. Note: exponents differ (JPY 0, PKR/INR/AED 2, KWD/BHD/OMR/JOD 3). Never assume 2. |
| `numberSystem` | Latin vs Eastern Arabic/Persian/Bengali/Devanagari digits; lakh/crore grouping (South Asia) vs thousands. |
| `phone` (dial code, national length rules, mask, example) | `PhoneField`, OTP. |
| `otpChannels` (SMS, WhatsApp, voice call) and provider | WhatsApp is the dominant channel in much of the region. Offer it first where it is. |
| `idDocuments` (type, mask, OCR template, required for worker) | Worker verification (§5.3, §6.3 E). E.g. national ID card, Emirates ID, Iqama, Aadhaar-style IDs, passport. |
| `paymentMethods` (cash, cards, local wallets, bank transfer), ordered | Pay screen (§5.2). Apple/Google Pay shown only where supported. |
| `emergencyNumbers` | SOS screen copy (§5.1). |
| `locales` (supported languages, default, RTL flag) | Language screen, i18n. |
| `week` (first day, weekend days) | Schedules and "Choose a day" strip. Weekends are Fri-Sat or Sat-Sun depending on country. |
| `calendars` (Gregorian and optionally Hijri display) | Date display where users expect it. |
| `serviceCatalog` overrides (names, popular issues, price bands per city) | Tiles and price ranges (§5.1). Category importance differs (for example AC servicing is top-3 in the Gulf and much of South Asia). |
| `legal` (terms, privacy, data-residency flag, age limits) | Onboarding and audio/photo consent. |
| `supportChannels` (WhatsApp number, phone) | Help buttons. |

Implementation note: add `countryCode` to `User` and to `Address`; derive the default from device region then confirm on the first screen ("Are you in the UAE?") instead of asking users to pick from a long list.

### 11.3b Plan adjustments from D1-D3

- **Phase 1:** RTL and Eastern-numeral rendering move into the design-system exit criteria, not Phase 6. Test every component in RTL from the start.
- **Phase 2:** seed configs for all five pilot countries (§11.5); add `preferredWorkerGender`, worker `gender` and `hidePhotoUntilBooked` fields (§11.4); build the country-config service and the `Money` type first; the OTP provider must be abstracted behind an interface so WhatsApp, SMS and voice-call channels can differ per country.
- **Phase 3:** offers screen (D2) with expiry and a countdown; pay screen with **cash** as the default-ordered option where the config says so; cash-settlement ledger on the worker side.
- **Phase 4:** add the worker's **cash balance / commission owed** card to Earnings and Today, with a plain-language "Pay Fixli {amount}" action and soft/hard caps.
- **Phase 6:** usability tests run in the pilot country in the local language with real low-literacy users, plus one RTL round in Arabic.

---

### 11.4 Professional-gender preference & privacy options (D6)

**Customer side**
- On the *Review* step (and in Account → Preferences) a quiet row: **"Who should come? Anyone · Woman · Man"**. Default *Anyone*. Stored on the user as `preferredWorkerGender` (nullable) and copied onto the job at creation.
- It is a **preference that filters matching**, not a guarantee shown as a promise: if no matching professional is available, show "No {women} professionals are free right now. Wait, or see everyone?" with both buttons. Never silently ignore it and never silently narrow to zero.
- It is **off the main path** (one row, not a step), so it adds no taps for people who don't use it. For households that want it every time, "Always use this choice" is a toggle.
- Cannot be set as a discriminatory filter on anything except gender and only for in-home visits; no other personal attributes are filterable.

**Worker side**
- `gender` is collected at onboarding (optional, "Prefer not to say" allowed; used only for this matching option and never shown publicly as text).
- **Photo visibility:** workers (especially women) may choose *"Show my photo only after the customer books"*. In offers, an initials avatar plus verification badge, rating and job count replace the photo. This reduces trust signal slightly, so the offer card still shows ✅ Verified prominently.
- **Safety extras for women workers:** an option to only receive jobs from customers with a verified phone and positive history, the in-job SOS, and masked calling.

**Data & product rules:** the preference is part of the job record and audit trail; admins can see it for dispute handling; analytics must not slice by gender in a way that exposes individuals; legal review per country (see §11.3).

### 11.5 Per-country configuration seed (D4)

> These are **starting values for the country config, to be verified with each country's local team and legal review before launch**. They are not authoritative and some rules change.

| | Pakistan | India | UAE | Saudi Arabia | Bangladesh |
|---|---|---|---|---|---|
| Currency (minor-unit exp.) | PKR (2) | INR (2) | AED (2) | SAR (2) | BDT (2) |
| Dial code | +92 | +91 | +971 | +966 | +880 |
| Default UI language | ur (en option) | en (ur/ar not applicable; en only at launch) | ar (en option) | ar (en option) | en (see D5 gap) |
| RTL | ur: yes | no | ar: yes | ar: yes | no |
| Worker ID document | CNIC (13 digits, `12345-1234567-1`) | Aadhaar (12 digits), plus alternative ID | Emirates ID (`784-YYYY-NNNNNNN-C`) | National ID / Iqama (10 digits) | NID (10, 13 or 17 digits) |
| Payment options (ordered) | Cash, JazzCash/Easypaisa, card, bank | Cash, UPI, card | Cash, card, Apple Pay | Cash, mada, STC Pay, Apple Pay, card | Cash, bKash, Nagad, card |
| Emergency numbers | police 15, rescue 1122 | 112 | police 999, ambulance 998, fire 997 | 911 (police), 997 (ambulance) | 999 |
| Weekend (verify) | Sunday | Sunday | Saturday-Sunday | Friday-Saturday | Friday-Saturday |
| OTP channel order | WhatsApp, SMS | WhatsApp, SMS (sender registration required) | WhatsApp, SMS (sender ID registration) | WhatsApp, SMS (sender registration) | SMS, WhatsApp |
| Top service tiles (initial guess; refine from data) | AC, plumbing, electrical, carpentry, cleaning | Plumbing, electrical, AC, cleaning, carpentry | AC, cleaning, plumbing, electrical, painting | AC, plumbing, electrical, cleaning, painting | Electrical, plumbing, AC, cleaning, carpentry |

**Recommended go-live order (engineering + risk):** **Pakistan and UAE first** (en/ur/ar all covered, two different market types, one provider each for OTP/payments), then **Saudi Arabia** (reuses the Arabic/RTL and Gulf work from the UAE; adds data-localisation compliance), then **India** and **Bangladesh** (largest populations, but Hindi and Bengali are not in launch languages, so wait for the first usability results). The configs for all five ship together in Phase 2; the go-live order is a feature-flag change per country. **Confirmed by the product owner on 2026-10-07:** (1) Pakistan + UAE, (2) Saudi Arabia, (3) India, (4) Bangladesh.

### 11.6 Recommendations adopted for the delegated decisions (D7)

**Voice transcription**
- Abstract it behind a `SpeechToText` interface on the API (`transcribe(audio, locale hint) → {text, confidence, language}`) so the vendor is swappable and per-country.
- **Run a bake-off before committing:** collect ~50 real recordings per language (ur, ar-Gulf, ar-Saudi, English with Pakistani/Indian/Bangladeshi accents, mixed Urdu-English "code-switching") on a repair-vocabulary script, and score at least two hosted providers on word error rate, latency and cost. Choose the winner per language if needed. Do not pick on marketing claims.
- Cost control: 60-second cap, one transcription per voice note, no re-transcribing, transcribe only when the user sends, queue when offline. Set a per-request and monthly budget alarm.
- Retention: keep the audio for **90 days** (dispute evidence), then delete; keep the transcript with the job; users can delete their own voice notes. Consent line on first use; confirm periods with legal (§11.3).
- Always send workers the **audio and the transcript** (dialect transcription will be imperfect).

**Illustrations**
- Commission **one illustrator/designer** to deliver a single consistent vector set (≈12 category illustrations + ~8 empty/success states + onboarding cards) from a brief that uses the logo's colours (blue gradient + orange accent) and rounded geometry. Budget the time before Phase 1 ends.
- **Interim (so engineering is not blocked):** use duotone icon tiles (brand-blue glyph on soft-blue squircle) generated from the icon set, behind the `CategoryTile` component's `illustration` prop. Swapping the artwork later changes no screens.
- Do not use AI-generated art as final unless a designer cleans it to vector and the licence terms are checked; keep a consistent style guide in `docs/brand/`.

**Android visual language**
- **One visual language on both platforms** (the Apple-style system in §7), with platform-correct behaviour: system back gesture and predictive back, Android status/navigation bar theming, ripple-free but with pressed-state scaling, platform-native pickers only where the system provides them (never a custom date picker). Reasoning: one design cuts build and QA cost; the audience mostly uses Android and a recognisable "clean and calm" UI works there. Test on a low-end Android device each phase.

**Admin portal**
- **Keep Phase 7.** Light mode default + dark, same tokens and logo, and a proper responsive layout for operations staff using it on laptops and tablets. It is the lowest-priority phase and should not delay the mobile launch.

---

### 11.7 Pakistan: legal review checklist (launch blocker for PK)

> This is an engineering checklist of the questions counsel must answer. It is **not legal advice**, and statements about law below are prompts to verify, not conclusions. Every row needs an owner, a written answer, and a date before Pakistan go-live. Track status in this table.

| # | Area | What counsel must confirm | Engineering impact | Owner / status |
|---|------|---------------------------|--------------------|----------------|
| L1 | **Personal-data law** | Which law currently governs consumer personal data in Pakistan (a dedicated data-protection law has been proposed for years; confirm its current status), and any obligations under PECA 2016 and constitutional privacy protections. Until clarified, adopt a GDPR-style baseline: explicit consent, purpose limitation, access/deletion on request. | Consent screens, privacy policy, data-subject request flow (`export` / `delete`), data map. | TBD / not started |
| L2 | **CNIC handling** | Rules on collecting, storing and verifying CNIC numbers and images (including NADRA verification access and whether a licensed channel is required). | Store minimum (number hash + image in encrypted storage), mask in UI (`*****-*******-1`), restrict admin access, audit-log every view, define retention. Do not claim "NADRA verified" unless it truly is. | TBD |
| L3 | **Voice and photo consent / retention** | Consent wording (Urdu + English), retention period (plan assumes audio 90 days, then delete; confirm), use for dispute evidence, deletion on request. | First-use consent sheet, retention job, per-user delete, store the consent timestamp and version. | TBD |
| L4 | **Data residency & hosting** | Whether any localisation or cross-border transfer restrictions apply (in particular to payment data and government ID data); choice of hosting region and processors (SMS, speech-to-text, AI vision). | Region setting on infra, processor list in the privacy policy, a switch to disable third-party AI on ID images. | TBD |
| L5 | **Payments licensing (SBP)** | Whether Fixli may hold, collect or disburse customer/worker funds, or must use a licensed partner (bank, payment service provider or e-money institution); how the cash-commission ledger (§11.8) is treated. | Default design: **do not hold customer funds**; card/wallet via licensed partner; worker commission settled through a partner rail. Isolate payments behind an interface. | TBD |
| L6 | **Tax** | Sales tax on services (provincial authorities differ), income-tax withholding on payments to workers and on the platform's fee, invoicing and record requirements, NTN/registration. | Tax abstraction layer (already in doc 10), invoice/receipt generator, per-province config, export for accountants. | TBD |
| L7 | **Company & contractor status** | Registration (SECP), terms for independent professionals vs employees under provincial labour rules, platform liability for workmanship and property damage, insurance. | Terms of service, worker agreement acceptance flow, dispute and claims process (doc 09), optional insurance partnership. | TBD |
| L8 | **Telecom: OTP / messaging** | Rules for SMS sender IDs/masking and bulk messaging, WhatsApp Business API terms for OTP and notifications. | Provider abstraction (Phase 2), sender registration lead time. | TBD |
| L9 | **Consumer protection & terms** | Terms of service, refund and cancellation policy, dispute resolution venue, language requirements (Urdu/English). | Policy screens, versioned acceptance records. | TBD |
| L10 | **Safety features** | Legality and wording of SOS (clear that it **does not replace calling police 15 or Rescue 1122**), gender-preference matching (§11.4) and photo-hiding for women workers, masked calling and call recording (if any: consent). | SOS copy review, matching rule review, no call recording unless consented. | TBD |
| L11 | **Law-enforcement requests & incident duty** | Procedure for lawful data requests and obligations to report incidents. | Admin runbook (doc 12), audit logs, data-export tooling. | TBD |
| L12 | **App stores & content** | Local content and age requirements; store listing disclosures (data safety / privacy labels). | Accurate privacy labels per the data map from L1-L4. | TBD |

**Process:** engineering produces the **data map** (what we collect, why, where it is stored, who can access it, retention) in Phase 2; counsel answers L1-L12 in parallel; Pakistan go-live requires all rows answered and all resulting engineering items closed. Re-use the table for each new country.

### 11.8 Pakistan: commission and cash-settlement rules (inputs for doc 10)

**Status:** the structure below is the plan; **every number is a placeholder proposal for the owner to approve or replace**. All values live in the Pakistan country config (§11.3a) and must be editable without a release; none may be hard-coded.

**Config schema (per country, per category override allowed)**

| Key | Meaning | Proposed PK placeholder (owner to confirm) |
|-----|---------|---------------------------------------------|
| `providerCommissionPct` | % of job total taken from the professional | 12% (doc 10 suggests the 10-15% range; do not force one global rate) |
| `customerServiceFee` | fee added for the customer | PKR 0 at launch (keep the price the customer sees equal to the price the worker quoted) |
| `minPlatformFee` / `maxPlatformFee` | floor and cap per job | PKR 100 / PKR 1,500 |
| `paymentFeeTreatment` | who bears card/wallet processing cost | Platform absorbs at launch |
| `categoryRates` | overrides, e.g. lower for cleaning, higher for emergency | none at launch except **SOS jobs: 0% commission on the first 3 per worker** to encourage acceptance (optional) |
| `cashSettlement` | rules below | see below |
| `taxTreatment` | tax inclusive/exclusive, per province | per §11.7 L6 |
| `currency` | PKR, exponent 2 | fixed |

**Cash settlement model (D3: cash allowed)**

1. **Cash job:** the customer pays the worker directly. The worker marks "Paid in cash {amount}"; the customer confirms in one tap ("Did you pay {amount} in cash? Yes / No"). If they disagree, the job goes to the dispute queue and the amount is held out of automatic settlement until resolved. A one-tap confirmation timeout (e.g. 24 h) auto-confirms with a flag.
2. **Commission owed:** on confirmation, the commission is added to the worker's **cash-commission balance** (a ledger entry in minor units, immutable, linked to the job).
3. **Netting first:** if the worker has digital earnings (card/wallet jobs) pending payout, the owed commission is **deducted from those payouts automatically** before any cash is requested.
4. **Settle up:** the worker pays the remaining balance through a licensed rail (JazzCash/Easypaisa or bank transfer; pending L5) from a single *Pay Fixli {amount}* button; a reference is recorded; the balance is cleared when the partner confirms.
5. **Limits (placeholders):** *soft limit* PKR 3,000 owed: warning card on Today and push notifications; *hard limit* PKR 5,000 owed, **or** any balance older than 7 days: new job requests are paused (worker can still finish jobs in progress) until settled. Limits can be set per worker (lower for new workers, higher for trusted ones).
6. **Reminders and clarity:** plain-language, voice-readable ("You owe Fixli PKR 450. Pay by Friday to keep getting jobs."), in Urdu and English; weekly statement on Earnings.
7. **Fraud and abuse controls:** limit number of cash jobs for new workers; flag workers whose cash-job share, cancellation after contact, or dispute rate is unusual; match customer and worker locations at the "Done" time; masked calling to reduce off-platform deals; reviews required for payout of bonuses.
8. **Refunds and disputes on cash jobs:** refund happens between the parties; platform may credit the customer and charge the worker's balance after a finding (doc 09); all adjustments are separate ledger entries, never edits.
9. **Reporting:** a per-worker ledger export and a finance report of cash-commission owed, collected, overdue, written off (admin portal, doc 12).

**Engineering notes:** ledger tables (`commission_ledger`, `settlements`) with minor-unit integers, idempotency keys, an immutable audit trail, and a daily reconciliation job; no floating point anywhere (doc 19). The mobile UI for this lives in Worker **Earnings** and **Today** (§11.3b).

**Decisions needed from the owner before Phase 3 exits:** confirm or change the placeholder numbers above, whether SOS jobs carry a promotional commission, the soft/hard limits, and which settlement rail is used at Pakistan launch.

---

## 12. Appendix: current-state inventory (for reference)

| Area | Files | State |
|------|-------|-------|
| Auth | `(auth)/login.tsx`, `signup.tsx` | Email/password, real Redux flow, demo chips |
| Customer home | `(customer)/(home)/index.tsx`, `categories/[id].tsx` | Real categories from `@fixli/shared`, single icon, hero banner, live tracker map |
| Customer request | `request-service.tsx` | Text+photo, calls `analyzeAndMatch`, mock location, no results screen |
| Customer quote / pay / bookings | `quote-review.tsx`, `checkout.tsx`, `bookings.tsx` | Mock data, no API |
| Customer chat/profile/settings | `chat.tsx` (26 lines), `profile.tsx` (46), `settings.tsx` (52) | Stubs |
| Worker | `(worker)/dashboard, analytics, payments, projects, schedule, chat` | 34-line placeholders |
| Worker jobs/quotes/evidence | `jobs.tsx`, `quotes.tsx`, `evidence.tsx` | Mock data; hard-coded localhost; no submit handler |
| Shared UI | `components/ui/DocumentVerification, LiveTrackerMap, WorkerPortfolio` | Exist, not yet wired into flows |
| State | `store/*Slice.ts` | auth, chat, customerFlow, data, tracking, ui, workerFlow exist |
| i18n | `src/i18n/index.ts` | Defined, imported by no screen |
| API modules | `apps/api/src/{auth,jobs,quotes,workers,chat,change-orders,verifications,service-catalog,ai,reviews,addresses,disputes,recurring-jobs,properties}` | Present; need phone-OTP, offers, phases, uploads, suggestions |
