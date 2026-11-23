# OgaFarm — Agile Roadmap

Part of the [PRD](prd-summary.md). Machine-readable backlog for the agent loop: [harness/feature_list.json](../../harness/feature_list.json). Story IDs match one to one.

## How we work
- **Agile, in increments.** We never build the whole product at once. Each increment is a shippable vertical slice across API, web, mobile and admin, with a demo to the client at the end.
- **No fixed sprints.** Increments run in order. An increment ends when its acceptance tests pass and the client has seen the demo.
- **Built by the agent loop.** One story per loop session: pick → implement → verify → record → hand off. The user reviews every increment and steers priorities.
- **Progressive refinement.** Only the current and next increments are broken into detailed stories. Later increments stay at epic level and are refined into stories (with acceptance criteria) just before they start. Refinement updates both this file and `feature_list.json`.
- **Design just in time.** Each increment starts with screen designs for that slice only (contract Phase 1 work, spread across increments).
- **Order can change.** The client may reorder increments after any demo. P1 and P2 features become their own small increments once they are confirmed in scope (PRD Q1).

## Definition of Done (every story)
1. API endpoints covered by feature tests. OpenAPI contract updated.
2. UI built on every surface the story lists, with loading, empty, error and offline states.
3. All user-facing strings go through i18n.
4. Server-side authorisation on every new endpoint.
5. `harness/scripts/verify.sh` passes (lint, typecheck, tests, build).
6. The story's acceptance criteria and its referenced BR / U / R / AT checks pass.
7. `harness/progress.md` and `harness/session-handoff.md` updated.

## Increments at a glance

> Invite & Share, referrals and Membership Rewards are **not in scope** (PRD §14). They can return later as their own increment if the client adds them.

| # | Increment | Demo to the client | PRD features | Acceptance tests | Contract phase |
|---|---|---|---|---|---|
| I0 | Foundation | All apps boot locally and in CI; health check end to end | Scaffolding, CI, contract, tokens, i18n setup | CI green | 2 |
| I1 | **MVP: Farmer sells, buyer buys** | A farmer signs up, pays (sandbox), gets verified, builds a storefront and shares it on WhatsApp. A buyer opens the link, buys with pickup, and the farmer fulfils | F01 (min), F02, F03 (farmer), F04, F05, F07 (basic), F08 (pickup), F16 (in-app), F18 (farm/product), F19 (min) | U01, U13, U14, R01, R10, R12, AT01, AT05 (stock), AT09 | 2 |
| I2 | Delivery + trust | Verified transporters quote, get assigned and prove delivery. Inspection, disputes and reviews | F12, F21, F20, F03 (transporter) | U12, AT08 (transport) | 2 |
| I3 | Suppliers + B2B procurement | Supplier catalogue. A business RFQ gets matched quotes and becomes an order | F06, F09, F07 (filters), F18 (/supplier) | U02, U11, R02 | 2 |
| I4 | Group buying + rescue | A group order through a shared link, each member paying their share. Fixed-price rescue produce | F10, F11, F18 (/group) | U10, R11, AT08 | 2 |
| I5 | Jobs, consultants, markets | Job posts with private worker matching. Verified consultant directory. Market directory | F13, F14, F15, F18 (/jobs) | — | 2 |
| I6 | Launch hardening | Production-ready launch | Live integrations, security, performance, backups, app builds, full UAT | All in-scope U / R / AT, incl. AT10 | 3 |
| I7+ | P1 features | One small increment each, in an order agreed with the client | F22–F30 | per feature | change request / scope |
| I8+ | P2 features | Later | F31–F38 | per feature | change request / scope |

**Why this order.** I1 proves the core money loop: subscription, storefront, sharing and an order (pickup only). I2 adds transporters and delivery right after the MVP, so orders can be delivered, not just collected. I3, I4 and I5 each add one more group of users. Group payments (I4) come only after the payment foundation is proven. Live third-party integrations wait for I6, so the client's provider choices (Q2, Q4) don't block early work. Until then everything runs behind interfaces with fake or sandbox drivers.

---

## I0 — Foundation

**Goal:** every app runs locally and in CI, and the agent harness is ready.

| ID | Story | Surfaces | Depends on |
|---|---|---|---|
| I0-05 | Native local setup (no Docker): MySQL database and user, `.env.example`, Makefile targets, local-setup runbook; remove the unused `docker-compose.yml` | infra | — |
| I0-01 | Scaffold Laravel API: MySQL, database queue driver, `GET /v1/health`, Pest, Pint, Larastan | api | I0-05 |
| I0-02 | Scaffold Next.js public web: App Router, TS strict, Tailwind, i18n (en default; yo, ig, ha ready), health page | web | I0-01 |
| I0-03 | Scaffold Next.js admin console with a protected layout placeholder | admin | I0-01 |
| I0-04 | Scaffold Expo app: Expo Router, i18n, deep-link scheme, health screen | mobile | I0-01 |
| I0-06 | OpenAPI contract + generated TS client in `packages/shared`; CI drift check | all | I0-02, I0-03, I0-04 |
| I0-07 | Design tokens shared by web, admin and mobile (WCAG AA contrast) | web, admin, mobile | I0-02, I0-03, I0-04 |
| I0-08 | CI workflows per app + `harness/scripts/verify.sh` | infra | I0-06 |
| I0-09 | Harness content: root `CLAUDE.md`, `loop.md`, `init.sh`, `next-feature.sh`, `.claude` agents, commands, skills, hooks, `open-questions.md` | harness | I0-08 |

**Exit:** `make up && make verify` passes locally; CI is green; `/v1/health` shows on web, admin and mobile.

---

## I1 — MVP: Farmer sells, buyer buys

**Goal:** prove the core money loop end to end on staging with sandbox payments.

**Out of this increment:** delivery and transport (pickup only), suppliers, RFQs, groups, SMS/WhatsApp (in-app notifications only), live payments.

### Auth & accounts
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-01 | Registration with email code verification and consent | 6-digit code sent by email verifies the account (no SMS); phone stored as contact only; consent stored with policy version; marketing opt-in separate; rate limits; email sending behind an interface with a log driver | F02, BR-NOT-06, BR-NOT-02 |
| I1-02 | Login, sessions and role assignment | Web cookie session, mobile secure token; farmer and buyer roles checked server-side | F02 |
| I1-03 | Preserve the deep-link destination through signup and login | User returns to the same page and action on web and mobile | BR-SHR-02, R12 |

### Subscriptions
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-04 | Plans endpoint and pricing UI | ₦30k / 3 mo, ₦54k / 6 mo, ₦95k / 12 mo with benefits | F04, BR-SUB-02 |
| I1-05 | Checkout and verified webhook activation | Gateway behind an interface (fake driver now, real sandbox after Q2); signed, idempotent webhook is the only way to activate | BR-PAY-01…03 |
| I1-06 | Entitlement ledger, calendar expiry, expired state | `paid_until` ledger; calendar months; early renewal starts at `paid_until`; expired hides listings, never deletes | BR-SUB-03…08 |

### Admin (minimum)
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-07 | Admin login with MFA, RBAC sub-roles, audit log | TOTP MFA; sub-roles enforced server-side; every admin action audited | F19 |
| I1-08 | Farmer verification submission and review queue | Private encrypted storage; signed URLs; approve, reject or request info; badge only when approved | F03, BR-LST-03, BR-NOT-05 |

### Storefront & listings
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-09 | Farmer profile and storefront with five category tabs | Unique slug with suggestions; templates; renaming remaps listings; public only when entitled and verified | F05, BR-LST-01, 02, 07 |
| I1-10 | Product listing create, edit and stock updates | Photos compressed; taxonomy; units; availability; "last confirmed" with who and when | F05, BR-LST-04 |
| I1-11 | Farmer dashboard with Share my storefront | Summary cards; quick actions; copy, WhatsApp and native share; new, unverified and expired states | F05, S02 |

### Public & sharing
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-12 | Landing page and role selection | Hero, role cards, pricing, browse entry; loading and error states | F01, S01 |
| I1-13 | SSR `/farm/{slug}` and `/product/{id}` with share previews | Canonical URLs, OG tags, WhatsApp text; no account or app install needed; app opens the link when installed | F18, U01, R01, AT01 |
| I1-14 | Unavailable and expired content page | Informative page with alternatives; never the generic homepage | U14, R10, AT09 |
| I1-15 | Marketplace browse and search | Keyword plus section, category and location filters; only public listings | F07 |

### Buying
| ID | Story | Key acceptance | Refs |
|---|---|---|---|
| I1-16 | Buy Now with atomic stock reservation | Concurrency test proves no overselling; reservations expire; re-confirm on price change | BR-LST-06, BR-ORD-02, 03, U13, AT05 |
| I1-17 | Order payment and order state machine | Webhook-only confirmation; audited transitions; refund handling | BR-ORD-01, BR-PAY-04 |
| I1-18 | Farmer order management (pickup flow) | Confirm → preparing → ready for pickup → handed over; buyer confirms collection | F08 |
| I1-19 | In-app notifications for orders and subscription | Inbox, unread count; events queued after commit | F16, BR-NOT-01 |
| I1-20 | I1 end-to-end demo and mobile parity check | Scripted staging demo with seed data; acceptance results recorded in `docs/acceptance` | U01, U13, U14, R01, R10, R12, AT01, AT05, AT09 |

**Exit:** the I1-20 demo runs on staging and the client signs off on the slice.

---

## Later increments (epic level — refined into stories when they are next)

### I2 — Delivery + trust
| ID | Epic | Refs |
|---|---|---|
| I2-E1 | Transporter onboarding, documents, admin verification | F12, BR-TRN-02 |
| I2-E2 | Transport quotes, bids, acceptance and assignment with capacity guard | BR-TRN-01, 03, 04, BR-ORD-07, U12 |
| I2-E3 | Delivery status timeline and proof of delivery | S10, BR-TRN-05, AT08 |
| I2-E4 | Delivery inspection and dispute cases | F21, BR-ORD-08 |
| I2-E5 | Verified reviews, moderation and appeals | F20, BR-REV-01…05 |

### I3 — Suppliers + B2B procurement
| ID | Epic | Refs |
|---|---|---|
| I3-E1 | Supplier onboarding, verification, `/supplier/{slug}` and catalogue | F06, S05, U02, R02 |
| I3-E2 | Enquiry → supplier quote flow | F06, BR-ORD-04 |
| I3-E3 | Business buyer profile and RFQ publishing | F09, S07, BR-ORD-05 |
| I3-E4 | Matching engine and seller demand alerts | F09, BR-ORD-06, BR-LST-05 |
| I3-E5 | Quote responses, comparison and order creation | F09, U11 |

### I4 — Group buying + rescue
| ID | Epic | Refs |
|---|---|---|
| I4-E1 | Create, share (`/group/{id}`) and join group orders; farmer approves pickup | F10, S08, BR-GRP-01, 02, U10, R11 |
| I4-E2 | Per-member payment, funding rules, cancellation and proportional refunds | BR-GRP-03…05, BR-PAY-07, AT08 |
| I4-E3 | Rescue listings with condition disclosure and fixed-price checkout | F11, S09, BR-RSC-01…03 |

### I5 — Jobs, consultants, markets
| ID | Epic | Refs |
|---|---|---|
| I5-E1 | Job posts (`/jobs/{id}`) by paid employers; browse and apply | F13, S11, BR-JOB-01, 02, 04, 05 |
| I5-E2 | Private worker profiles and anonymous matching with contact approval | BR-JOB-03 |
| I5-E3 | Consultant application, credential review, public directory | F14, BR-JOB-06 |
| I5-E4 | Market suggestions, moderation, reports and area alerts | F15, S12, BR-MKT-01…03 |

### I6 — Launch hardening
| ID | Epic | Refs |
|---|---|---|
| I6-E1 | Live payment gateway, live email provider, push, opt-in WhatsApp and SMS alerts | F04, F16, BR-PAY-05 |
| I6-E2 | Security review, fraud tests, performance tests | PRD §7 |
| I6-E3 | Production deploy, monitoring, backups and restore drill | AT10 |
| I6-E4 | Android/iOS build readiness, full UAT run, handover package | PRD §13 |

### I7+ — P1 backlog (one increment each, order agreed with the client)
F22 AI assistants · F23 Farm promotions · F24 Product waitlist · F25 Farm calendar · F26 Farmer records and PDF · F27 Scheduled reports · F28 Full translations (yo, ig, ha; fr to be confirmed) · F29 Offline-tolerant mode · F30 Feedback channel

### I8+ — P2 backlog
F31 Benefits partners · F32 Export calculator · F33 Cost calculator · F34 Collective input purchasing · F35 Listing import · F36 Automation and AI insights · F37 Delivery-partner integration · F38 Activity analytics

---

## Client inputs needed, and when

| Needed before | Question (PRD §12) |
|---|---|
| I1 (to swap the fake gateway for sandbox) | Q2 payment gateway, Q3 money flow and payment terms |
| I1 sign-off | Q10 confirm decisions D2, D4, D6, D7, Q6 grace period |
| I6 | Q4 messaging providers, Q8 app-store accounts, Q11 account ownership |
| I7+ | Q1 which P1/P2 features are in scope, Q7 French |
