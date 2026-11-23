# OgaFarm — Product Requirements Document (PRD)

| Field | Value |
|---|---|
| Product | OgaFarm — agricultural marketplace, logistics and growth platform |
| Domain | farmoga.com |
| Client | Chatpliance Inc. |
| Delivery | Forazi Tech |
| PRD version | 1.0 (draft) |
| Date | 2026-11-23 |
| Status | Draft. Scope, priorities and the decisions in §11 need written client sign-off |

**Companion documents**
- [roles-and-permissions.md](roles-and-permissions.md): every role, how it is activated, and what it may do
- [business-rules.md](business-rules.md): binding rules (subscriptions, payments, orders, privacy)
- [glossary.md](glossary.md): terms used across the product
- [roadmap.md](roadmap.md): agile increments, stories and the delivery order
- [design/prototype](../../design/prototype/README.md): clickable UI prototype, one folder per release version (V1 MVP built)
- [recommendations.md](recommendations.md): our proposed improvements for the client. Not part of the scope until the client approves them
- Screen specs: `docs/specs/screens/S01–S13`. Acceptance tests: `docs/acceptance/`

**Sources, in order of precedence**
1. Signed contract and approved scope exhibits. These control commercial obligations.
2. `docs/reference/OgaFarm_Application_Flow_Design_and_Visual_Architecture-Updated_v60 (1).pdf`: v57 flow design, v58 Invite & Share addendum (**not in current scope**, see §14), v59/v60 architecture.
3. `docs/reference/html/` HTML prototype (v44–v57 era). It is **a visual guide only**: incomplete, browser-local and not secure. It shows what options could look like. It is not a specification. Where it conflicts with the PDF, the PDF wins unless §11 says otherwise.

---

## 1. Product overview

OgaFarm is one integrated platform that connects Nigerian farmers and farm-input suppliers with buyers, transporters, workers and specialists. Public pages work in any browser without installing the app. Signed-in users get a dashboard for their role on the web and on Android/iOS.

**Problem.** Farmers sell through middlemen with little price visibility. Buyers struggle to find reliable, stock-confirmed supply. Delivery is hard to arrange and hard to track. Trust (identity, stock, quality, payment) is low on every side.

**Vision.** *"Your farm. Your market."* Farmers list once and reach every buyer type directly. Businesses source with confidence. Delivery is priced separately and visible end to end. Shareable storefronts and products help the network grow.

**Design principles**
- Mobile-first and low-bandwidth: large tap targets, compressed images, progressive disclosure, fast loads, offline-tolerant.
- Trust before transaction: separate *verified identity* from *confirmed availability*, and never label anything "verified" unless it truly is.
- The server decides: payments, entitlements, verification and stock are enforced by the backend, never by the client.
- Shareable by default: storefronts, products, groups and jobs all have public HTTPS links with rich previews.
- Honest states: every screen has loading, empty, error, offline, expired and moderation-hold states.

## 2. Goals and success metrics

| Goal | Metric (measured after launch) |
|---|---|
| Grow paid supply | Number of active paid farmer and supplier subscriptions, and the renewal rate |
| Convert demand into orders | RFQ or enquiry → paid order conversion |
| Reliable fulfilment | On-time delivery rate against the agreed window, and disputes per completed order |
| Repeat business | Share of buyers who return for a second order |
| Reach | Visits to public storefront and product pages from shared links |
| Trust | Share of listings with stock confirmed in the last 7 days, and verified-profile ratio |

**Non-goals for v1:** guaranteeing sales, and automated AI decisions on money or verification.

## 3. Users

| Persona | Pays? | Core job |
|---|---|---|
| Farmer / Agrofarmer | Paid | List produce and livestock, sell direct, manage orders, share their storefront |
| Farm Supplier | Paid | Sell inputs (seed, fertiliser, feed, chicks, equipment, crop protection, packaging) |
| Farm Owner / Hiring Client | Paid | Hire farm workers (comes from the prototype; see §11 D7) |
| Business Buyer | Free | Wholesalers, restaurants, hotels, processors, retailers and institutions sourcing in volume, including recurring supply |
| Individual Buyer | Free | Households buying direct |
| Group Buyer | Free | Organise or join pooled purchases with shared pickup or delivery |
| Diaspora Buyer | Free | Buy for recipients in Nigeria |
| Transporter | Free (verified) | Offer capacity, quote, deliver, and provide proof of delivery |
| Job Seeker | Free | Find farm work and keep their profile private |
| Consultant | Free (verified) | Offer agronomy, veterinary, soil, business and post-harvest expertise |
| Benefits Partner | Paid membership fee | Offer discounts to members (P2) |
| Platform Admin | Internal | Verification, moderation, payments, disputes, audit |

Full matrix: [roles-and-permissions.md](roles-and-permissions.md).

## 4. Platforms and channels

| Surface | Tech (approved by the team) | Purpose |
|---|---|---|
| Public web, farmoga.com | Next.js (SSR) | Landing, browsing, storefront/product/group/job pages, SEO and Open Graph previews. Works without installing anything |
| Signed-in web app | Next.js | Role dashboards in the browser |
| Mobile app | React Native (Expo), Android and iOS | Role dashboards, native share sheet, push notifications, deep links |
| Admin console | Next.js (separate app) | Operations, with MFA and strict RBAC |
| Backend API | Laravel + MySQL 8+ + object storage + queue workers | All business logic, webhooks and scheduled jobs |

> The PDF proposes Flutter for mobile. The team chose React Native (Expo). Per PDF §A9 the stack needs written engineering approval from the client (see §11 D1).

**Languages (P1):** English (default), Yorùbá, Igbo and Hausa, as shown in the prototype. French appears in the prototype's language picker; confirm (Q7).
**Currency:** NGN (₦). USD appears only in the export calculator (P2).
**Time zone:** WAT (Africa/Lagos) for display and scheduling. Store timestamps in UTC.

## 5. Scope and release priorities

Priorities are **proposed**. P0 is the contracted scope from the PDF (S01–S13 and admin). Invite & Share, referrals and Membership Rewards (S14–S16) are **not included**; see §14. P1 and P2 come from the prototype and must be confirmed against the US$4,500 three-phase quote before they are built (Q1).

- **P0**: must ship for launch (contracted scope).
- **P1**: high value. Build after P0 if it is in scope, or as a change request.
- **P2**: later or optional.

| ID | Feature | Priority | Screens / refs |
|---|---|---|---|
| F01 | Public site, landing and role selection | P0 | S01 |
| F02 | Accounts, authentication and multi-role | P0 | §4 of PDF |
| F03 | Verification (identity, business, transporter, consultant) | P0 | Admin |
| F04 | Subscriptions, billing and entitlements | P0 | S02 |
| F05 | Farmer storefront and product listings | P0 | S02, S03, S04 |
| F06 | Supplier storefront and catalogue | P0 | S05 |
| F07 | Marketplace browse, search and filters | P0 | S06 |
| F08 | Buy Now checkout, orders and inventory reservation | P0 | S06 |
| F09 | RFQ, quotes, business demand and matching alerts | P0 | S07 |
| F10 | Group buying | P0 | S08 |
| F11 | Rescue and imperfect produce | P0 | S09 |
| F12 | Transport: transporter onboarding, quotes, assignment, tracking, proof of delivery | P0 | S10 |
| F13 | Farm jobs and private worker matching | P0 | S11 |
| F14 | Consultants directory and applications | P0 | S11 |
| F15 | Local market directory and contributions | P0 | S12 |
| F16 | Notifications, messaging and consent | P0 | S13 |
| F17 | ~~Invite & Share, referrals and Membership Rewards~~ | **Not in scope** | Future scope (§14) |
| F18 | Public share links, deep links and OG previews | P0 | PDF §7 |
| F19 | Admin console | P0 | Admin |
| F20 | Verified reviews and review appeals | P0 | Prototype |
| F21 | Delivery inspection and disputes | P0 | PDF §8 |
| F22 | AI assistants (Ask OgaFarm, plus a per-farmer assistant) | P1 | S13 |
| F23 | Farm promotions | P1 | Prototype |
| F24 | Product waitlist | P1 | Prototype |
| F25 | Farm calendar and operating schedule | P1 | Prototype |
| F26 | Farmer records and PDF report | P1 | Prototype |
| F27 | Reports and scheduled weekly/monthly summaries | P1 | Prototype |
| F28 | Multilingual UI | P1 | Prototype |
| F29 | Offline-tolerant mobile and web | P1 | Prototype |
| F30 | User feedback channel | P1 | Prototype |
| F31 | Benefits partner programme and promo codes | P2 | Prototype + partner previews |
| F32 | Export price and weight calculator | P2 | Prototype |
| F33 | Farmer economics: cost-per-unit calculator | P2 | Prototype |
| F34 | Collective farm-input purchasing (farmer groups) | P2 | Prototype |
| F35 | Listing import from CSV/Excel/PDF | P2 | Prototype |
| F36 | Automation and AI insights | P2 | Prototype |
| F37 | Delivery-partner integration (named partner) | P2 | Prototype |
| F38 | Activity analytics (e.g. busy hours) | P2 | Prototype |

---

## 6. Feature requirements

Each feature lists its requirements (**R**) and acceptance references. Binding rules live in [business-rules.md](business-rules.md) (BR-xx).

### F01 Public site, landing and role selection (P0)
- R1 Hero, value proposition, role cards, subscription pricing, browse-produce entry, trust signals, footer and support.
- R2 Role cards: Farmer, Business Buyer, Group Buyer (free), Farm Supplier, Farm Owner / Hiring Client, Transporter. Jobs entry: "I need a job" (free) and "I need workers" (paid).
- R3 Public navigation: Home, Browse Produce, Suppliers, Jobs, Markets, Pricing, Partners, Sign in / Register.
- R4 Anonymous visitors can browse approved public content. Transactions and applications need sign-in.
- R5 Campaign source (UTM) is captured on entry for analytics.
- R6 States: loading skeleton, network failure, no content, mobile menu.

### F02 Accounts, authentication and multi-role (P0)
- R1 Register with email (required) and phone number (contact only). The email address is verified with a 6-digit code sent **by email**. No SMS or phone codes are used anywhere. Record consent (terms, privacy, optional marketing).
- R2 Choose an account type at signup. One user may hold several permitted roles. The server enforces role entitlements.
- R3 Paid roles go to plan selection before activation (F04). Free roles go straight to onboarding.
- R4 A deep link's destination is preserved through signup and login.
- R5 Profile and business details: name, business or farm name, locality, phone, optional logo, cover and bio.
- R6 Sign in with email: a 6-digit code is sent to the registered email address. Rate limits on registration, sign-in and email codes. Bot protection on signup.

### F03 Verification (P0)
- R1 Each role has its own verification checklist (see roles doc). Verification status shows on profiles only when it is real.
- R2 Transporter: one identity document (driver's licence or National ID) plus a utility bill. The registered name must match the ID. A plate number is required for motor vehicles. Vehicle type and capacity are also required.
- R3 Supplier: business details, categories supplied, and optional proof (registration, batch, hatchery records). Regulated inputs need extra checks.
- R4 Consultant: qualification, issuing institution, year, licence or membership number and regulator (e.g. VCN, COREN), plus a certificate upload. Credentials are never published.
- R5 Documents go to private encrypted storage, readable only by authorised reviewers through signed URLs. A retention policy applies.
- R6 Admin queue: approve, reject with reason, or request more information. Every decision is audited.

### F04 Subscriptions, billing and entitlements (P0)
- R1 Plans for paid roles: Quarterly ₦30,000 / 3 months, Half-yearly ₦54,000 / 6 months, Annual ₦95,000 / 12 months.
- R2 Plan benefits as shown in the prototype. Quarterly: five custom storefront categories, unlimited listings, buyer discovery and enquiries, quotes, orders and delivery tracking, private worker-matching alerts. Half-yearly adds automatic weekly reports, history and renewal reminders. Annual adds weekly and monthly summaries and exportable records.
- R3 Checkout through the payment gateway. Activation **only** after a verified, signed, idempotent webhook (BR-PAY).
- R4 Entitlement ledger keyed on `paid_until`. Expiry is calendar-based.
- R5 Expiring and expired prompts for paid roles only. Listings are never silently deleted when membership lapses; they are hidden from public view until renewal (BR-SUB).
- R6 Renewal reminders. Payment history and receipts.

### F05 Farmer storefront and product listings (P0)
- R1 Public storefront `/farm/{slug}`: cover, name, verified badge (only when verified), locality, bio, operating hours, up to **five configurable category tabs**, product cards, review summary, share controls.
- R2 Business-type templates for the five categories (poultry, crops, livestock, fish, mixed). Renaming a tab remaps its products. Listings are unlimited.
- R3 Product listing: photos, product category (taxonomy in glossary), storefront category, section, quantity and unit (kg, tonne, 50/100 kg bag, paint bucket, Derica, Mudu, crate, basket, sack, bird, goat, ram, animal, bunch, piece, litre), unit price, pickup location, availability status and dates, delivery options, and a condition label for rescue items.
- R4 Availability states: Available now, Expected soon, Recurring supply, Seasonal, Reserved, Sold out, Temporarily unavailable. Each change stores who confirmed it and when ("last confirmed").
- R5 Dashboard quick actions: Add product, View orders, **Share my storefront** (copy link, WhatsApp, more options), Respond to RFQs, Renewal.
- R6 Summary cards: active listings, orders, RFQs, pending transport, subscription expiry. Alerts.
- R7 States: slug conflict, unpublished, out of stock, expired entitlement, moderation hold, image upload failure, price change during checkout.

### F06 Supplier storefront and catalogue (P0)
- R1 Public `/supplier/{slug}`: logo, banner, about, categories supplied, catalogue, verification status, share.
- R2 Input categories: Seeds and seedlings, Fertiliser, Crop protection, Feed and livestock supplies, Day-old chicks, Equipment and tools, Packaging.
- R3 Listing fields: product, brand/spec, pack size, price, quantity and unit, minimum order, location, availability (Available now, Low stock, Expected on date, Seasonal, Out of stock), next date, batch/expiry/vaccination/hatchery notes.
- R4 Enquiry → quote: supplier confirms quantity, final price, stock (confirmed, partial, expected later, unavailable), delivery terms and quality notes. **An enquiry is not an order.**
- R5 Dashboard: Add farm input, Quotes, Share my storefront, Share product on each item.

### F07 Marketplace browse, search and filters (P0)
- R1 Search across produce, livestock and inputs. Filters: location, category, price, quantity, availability.
- R2 Category taxonomy: four sections and their sub-categories (see glossary).
- R3 Product cards: price per unit, quantity available, location, "last confirmed", Request quote, Buy Now (where enabled), Contact, Farmer profile.
- R4 Saved items and a saved sourcing requirement (product, quantity, unit, location) that feeds matching (F09).

### F08 Buy Now checkout, orders and inventory (P0)
- R1 Cart or Buy Now → delivery destination or pickup → fee breakdown (product subtotal, transport shown separately, fees) → payment terms → pay.
- R2 Atomic stock reservation at checkout prevents overselling (U13). Reservations expire if payment does not complete.
- R3 Order state machine: `created → payment_pending → confirmed → preparing → dispatched → delivered | disputed` (BR-ORD).
- R4 Payment terms supported per the agreed scope (e.g. full payment, or 50% deposit with the balance after delivery). See Q3.
- R5 Order detail: lines, status timeline, assigned driver contact (after assignment), delivery evidence, dispute action, review action after delivery.
- R6 Diaspora buyer: recipient name, phone and address. Delivery confirmation can be done by the recipient.

### F09 RFQ, quotes, business demand and matching (P0)
- R1 RFQ form: product and specification or grade, unit, quantity, destination, deadline, delivery speed (same day, 24 h, 72 h, 1 week, flexible), delivery method (road, refrigerated, air cargo), frequency (one-time, daily, weekly, monthly, seasonal), priority.
- R2 Business profile type: wholesaler, market trader, restaurant/caterer, hotel, processor, bakery, retailer, school/institution, hospital, other. A verified email address is required.
- R3 Matching engine (rule-based): product match, location or distance, quantity, availability window and stock-confirmation freshness. Alerts are deduplicated. Urgent requests go to the top three matches first, and the search widens if there is no response.
- R4 Farmer or supplier response: stock status, quantity, price, earliest date, conditions, and an attestation that availability was checked.
- R5 Buyer compares quotes on price, availability, ETA and transport, then selects, approves and creates an order (U11).
- R6 Farmer alert preferences: on/off and quiet hours.
- R7 RFQ states: `draft → open → quoted → accepted → ordered → closed`, plus expired and withdrawn quotes and partial fulfilment.

### F10 Group buying (P0)
- R1 The organiser creates a group: item, farmer, quantity per member, target quantity, number of buyers (**min 4**, conceptual max 1,000,000), unit price set by the farmer, join deadline, collection arrangement (farm pickup, farmer-approved collection point, group delivery with a transporter quote), destination, date.
- R2 Shareable `/group/{id}`. Invitees join after signing in. **Each member pays their own share.** No member collects money for others.
- R3 The farmer must approve the pickup point. Transport is quoted separately.
- R4 States: `open → funded → sourcing → fulfilment → completed | cancelled`. Handle underfunded, oversubscribed, member dropout, deadline missed and proportional refunds.

### F11 Rescue and imperfect produce (P0)
- R1 Listing types: perishable / sell soon, bruised or visually marked, irregular size or shape. Mandatory condition disclosure, rescue price and usual price, sell-by date, handling notes.
- R2 The seller must confirm the food is safe. Unsafe produce is not allowed.
- R3 Fixed-price checkout without quoting. The buyer acknowledges the condition, quantity and collection terms. Farm pickup, or a transporter quote requested separately (the farmer never sets transport prices).
- R4 Atomic stock reservation. Urgent pickup window. Expiry when the sell-by date passes.

### F12 Transport and order tracking (P0)
- R1 Transporter onboarding: name exactly as on ID, display name, phone, vehicle type (motorcycle, keke, pickup, small or large truck, refrigerated, air cargo, other), plate, operating location, service areas, max payload, capacity in 50/100 kg bags, bio, photo, private documents (F03).
- R2 Public transporter profile after approval. **Unverified transporters cannot be assigned** (U12).
- R3 Flow: request transport quote → transporters bid → buyer accepts → assignment (driver name and phone shared with the ordering party) → pickup verified → in transit → delivered.
- R4 Capacity guard: block an assignment when payload or bag capacity is exceeded.
- R5 Delivery evidence: pickup confirmation, quantity or weight, condition, receiver confirmation (delivery code shown in the buyer's app, or signature), photos.
- R6 States: `requested → quoted → assigned → pickup → in_transit → delivered`, plus driver unavailable, missed pickup, failed delivery and missing proof.
- R7 The order shows a status timeline with manual or event updates.

### F13 Farm jobs and private worker matching (P0)
- R1 Anyone can browse open jobs without an account. Applying needs a free Job Seeker account.
- R2 Posting jobs and receiving worker alerts needs a verified, active paid subscription (farmer, supplier or farm owner).
- R3 Job post: business, location, title, skill, employment type, number of workers, pay and pay period, start date, deadline, details. Shareable `/jobs/{id}`.
- R4 Worker availability profile: preferred name, location, work type, skill, available from, expected pay, travel radius, notes. **Private.** Employers see anonymous skill-and-area matches only. Contact details are released only when the applicant approves.
- R5 Application states: `draft → submitted → reviewed → shortlisted | rejected | hired`. Reject duplicate applications and expired roles.
- R6 Safety notice: never pay a fee to get a job.

### F14 Consultants (P0)
- R1 Specialities: crop agronomy and plant health, livestock and animal nutrition, veterinary, soil/irrigation/water, farm business and economics, post-harvest/storage/export, extension and training.
- R2 A private application with credentials (F03 R4). Only verified consultants appear in the public directory. Pending applications are never searchable.
- R3 Directory search by speciality and location. Fees and availability are confirmed between the parties.
- R4 Warning: do not rely on unverified advisers for veterinary diagnosis or other regulated work.

### F15 Local market directory (P0)
- R1 Anyone signed in may suggest a market: name, community/town, address or landmark, type (produce/wholesale, retail/community, livestock, collection centre, processing/storage, farm-input), market days, products, contact person, public phone (only with that person's consent), directions, and how they know it.
- R2 Submissions stay **pending** until moderated. States: Submitted, Under review, Verified, Needs updating, Inactive. Duplicates are checked.
- R3 "Report inaccurate entry". Opt-in alerts for new or verified markets in a chosen area.
- R4 A market listing is not a confirmed buyer or a guarantee of sales.

### F16 Notifications, messaging and consent (P0)
- R1 In-app inbox grouped by orders, quotes, jobs and renewals. Mark as read. Preferences.
- R2 Channels: in-app (default), push (mobile), email, SMS and WhatsApp. External channels need provider integration and opt-in. Transactional messages are kept separate from marketing.
- R3 Messaging between transaction parties (buyer ↔ farmer/supplier, buyer ↔ transporter), with history kept.
- R4 Notifications never imply a sale or payment before it is validated.

### F18 Public share links and deep links (P0)
- R1 Routes: `/farm/{slug}`, `/supplier/{slug}`, `/product/{id}`, `/group/{id}`, `/jobs/{id}`.
- R2 Server-rendered with canonical HTTPS URLs, Open Graph title, image and description, and a WhatsApp prefilled message.
- R3 Mobile: universal links and app links open the app when installed and the web page otherwise. Installation is never forced.
- R4 Unavailable or removed content shows an informative page with alternatives. Never redirect to the generic homepage while the content still exists (U14, R10).
- R5 No personal data in crawlable metadata.

### F19 Admin console (P0)
- R1 Modules: Operations dashboard, Verification queue, Moderation (listings, reviews, markets, jobs), Payments and reconciliation, Subscriptions, Disputes, Markets, Feedback, Partners (P2), Audit logs, Users and roles.
- R2 Separate admin accounts with MFA, sub-roles (see roles doc), least privilege, and every action audited.
- R3 Stock-confirmation queue: stale availability and forecast vs confirmed stock.

### F20 Verified reviews and appeals (P0)
- R1 Only parties to a **delivered** order can review. One review per order per target.
- R2 Separate ratings for the farmer/product and for the transporter/delivery. Farmers can review business buyers.
- R3 1–5 rating plus criteria (quality, quantity accuracy, communication, punctuality, payment conduct) and optional text.
- R4 Moderation before publishing. Averages show with the number of reviews, and small samples are flagged.
- R5 Appeal: the profile owner requests an investigation (abusive, false, private info, discriminatory, no genuine transaction, competitor manipulation). A review is not removed just for being negative. Steps: logged → triage → investigate → decision → profile updated. A restricted audit record is kept.

### F21 Delivery inspection and disputes (P0)
- R1 Receive and inspect: agreed vs received quantity, condition (matches, minor difference, damaged, wrong product), receiver confirmation, notes and photos.
- R2 Dispute types: quantity shortfall, quality mismatch, damage or spoilage, late, wrong product, payment discrepancy, failed delivery.
- R3 A case holds the history, evidence and both parties' responses. An admin decides. Refunds are reconciled. Orders in inspection never auto-close.

### F22 AI assistants (P1)
- R1 **Ask OgaFarm**: platform help, marketplace discovery, order steps, records and support.
- R2 **Ask this farmer**: answers grounded only in that farmer's public profile (products, listed price, location, stated availability). Before chatting, the buyer shares their name and phone with consent, and the farmer sees these as customer contacts.
- R3 Grounded in live records. Role-scoped data access. Any action (quote, order, payment) needs user confirmation and backend validation. AI disclosure. Escalation to a human.
- R4 Conversation history is stored per account on the server, with user controls to clear memory.

### F23 Farm promotions (P1)
- R1 The farmer creates a campaign: title, message, discount 0–90%, product, original price (the promo price is calculated), start and end dates, optional banner, publish toggle.
- R2 Optionally notify previous customers who gave marketing consent, and opted-in OgaFarm accounts.
- R3 Shown on the public storefront only while the campaign is active and within its dates.

### F24 Product waitlist (P1)
- R1 A buyer joins the waitlist for a product (quantity, unit, date, location, preferences, consent). This does not reserve stock.
- R2 The farmer manages it: Confirm availability → Converted to order or Cancelled. The buyer is notified.

### F25 Farm calendar and operating schedule (P1)
- R1 Operating days and hours, buyer access (by appointment, walk-in, call first, delivery only), seasonal closures.
- R2 Calendar entries: product, section, type (expected harvest, available now, recurring, seasonal, growing, unavailable), dates, estimated quantity, confidence (forecast vs confirmed).

### F26 Farmer records and PDF report (P1)
- R1 Ledger: date, type (sale, expense, production, inventory adjustment, payment received, amount owed), category, quantity, description, income, expense.
- R2 Platform orders are added to records automatically. Totals and net recorded result. PDF export (marked "not audited accounts").

### F27 Reports and scheduled summaries (P1)
- R1 Dashboard metrics from real events only. Show "not enough data" below the minimum sample size.
- R2 Weekly report (Half-yearly and Annual plans) and monthly summary (Annual plan): sales, expenses, orders, enquiries, stock changes, upcoming harvests and actions. User picks the day, time and channel. Status is tracked as generated, sent or failed.

### F28 Multilingual UI (P1)
- R1 English, Yorùbá, Igbo and Hausa (French to be confirmed). Language picker on landing and in the profile. Remember the choice.
- R2 All UI strings go through i18n.

### F29 Offline-tolerant (P1)
- R1 Mobile caches the last viewed dashboards and listings. Forms are queued while offline and synced on reconnect, with clear "pending sync" status.
- R2 Money, stock reservation and verification actions need a connection. They are never queued offline.

### F30 Feedback channel (P1)
- R1 Category, priority, problem, suggestion and optional contact with consent.
- R2 Admin workflow: New → Under review → Planned → In development → Completed / Not planned. Contributor is notified where they consented.

### F31–F38 (P2, summarised)
- **F31 Benefits partners:** businesses apply (company, contacts, private CAC number, category, state, benefit title, discount 5–85%, dates, conditions, logo). They pay a negotiated membership fee, not an advertising fee. Their logo appears only after verification, payment and an active offer. Eligible paid members claim a single-use promo code linked to their phone (stored as a hash plus the last 4 digits) with a short expiry. Partners redeem through an authenticated partner portal by checking the code and phone. Admin manages approvals, membership terms and the redemption ledger.
- **F32 Export calculator:** kg ↔ lb, NGN ↔ USD with a live indicative or manual rate, additional costs, copyable buyer estimate. Freight, customs and insurance are quoted separately.
- **F33 Cost calculator:** cost per unit (e.g. egg crate) from feed, labour, vet, utilities, packaging and losses.
- **F34 Collective input purchasing:** farmers pool input demand and request supplier volume quotes. Each farmer commits only after seeing their own allocation and price.
- **F35 Listing import:** fill listing fields from CSV, Excel or PDF, with the user reviewing before saving.
- **F36 Automation and AI insights:** demand patterns, shortage signals, sales explanations and seasonal planning, grounded in records and showing confidence.
- **F37 Delivery partner:** integrate a named logistics partner as a selectable carrier (the prototype names one; Q9).
- **F38 Activity analytics:** e.g. farmer busy hours from aggregated real events.

---

## 7. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Public pages: LCP < 2.5 s on a mid-range Android over 3G. Images compressed and responsive (WebP/AVIF). API p95 < 500 ms for reads |
| Availability | Target 99.5% monthly for the API and public web |
| Security | HTTPS everywhere. Server-side RBAC and object-level authorisation on every endpoint. Admin MFA. Rate limits on sign-up, sign-in and email codes. No secrets in clients or the repo. OWASP ASVS L2 as the baseline |
| Payments | Signed webhooks, replay protection, idempotency keys, unique provider event IDs, daily reconciliation |
| Concurrency | Atomic stock reservation. Unique constraints on payment events. Locked group-funding updates |
| Privacy | Compliance with the NDPA 2023 (Nigeria Data Protection Act). Consent records. Data minimisation. Private documents in encrypted storage with signed URLs. Retention and deletion policy |
| Accessibility | WCAG 2.1 AA: contrast, keyboard navigation, screen-reader labels, tap targets of at least 44 px |
| Auditability | Immutable audit events (actor, action, target, time, before/after) for admin actions, money, verification and moderation |
| Observability | Structured logs, error tracking, queue monitoring, alerting |
| Reliability | Daily backups with tested restores (AT10). Staging mirrors production. Migrations through CI |
| Scalability | Group orders designed for large membership (pagination, async allocation). Queue-driven notifications |
| SEO | SSR share pages, sitemap, canonical URLs, structured data for products and organisations |

## 8. Integrations

| Integration | Purpose | Status |
|---|---|---|
| Payment gateway (NGN) | Subscriptions, orders, group shares, refunds | Provider to be confirmed (Q2). Recommended: Paystack, with Flutterwave as the alternative |
| SMS | Optional urgent alerts only (never used for verification) | Later, opt-in. Provider to be confirmed (Q4) |
| WhatsApp Business Platform | Opt-in notifications | Phase 3, consent required |
| Email | Account verification and sign-in codes, receipts, transactional email | **Required from I1.** Provider to be confirmed (Q4) |
| Push | Expo push notifications (FCM/APNs) | Mobile |
| Maps / geocoding | Distance matching, market pins | Provider to be confirmed. Text location in v1, geocoding when available |
| Object storage | Media and private documents | S3-compatible |
| AI model provider | F22 / F36 | P1/P2. To be decided |
| FX rate API | F32 | P2 |

## 9. Out of scope (v1)
Automated AI decisions on payments, verification or moderation. App-store submission accounts held by Forazi (the client owns the accounts).

## 10. Prototype vs production
The prototype stores everything in the browser (localStorage, IndexedDB), has no authentication, and simulates payments, verification, notifications and AI. **Do not copy its data handling.** Treat it only as a reference for layout, fields and options. Every "demo" checkpoint in it is a real backend requirement in production.

## 11. Decisions taken (proposed, pending client sign-off)

| ID | Topic | Decision | Basis |
|---|---|---|---|
| D1 | Tech stack | Laravel API, Next.js public web and admin, React Native (Expo) mobile, **MySQL 8+**, monorepo. Local development runs natively on the developer's machine (no Docker): MySQL, Laravel's database queue and cache drivers, a local private disk for uploads, and the log mailer. Staging and production add Redis (queue/cache) and S3-compatible storage | Team decision. Deviates from the PDF's Flutter proposal; the PDF names PostgreSQL only as an example, and MySQL meets every requirement (row locks for stock reservation, unique constraints for payment events, transactions, JSON) |
| D2 | Consultant | **Standalone free role** with credential verification before it is listed publicly | Team decision, 23 Nov 2026 |
| D4 | Renewal | An early renewal or plan change starts the new term at the current `paid_until`; after expiry it starts at payment time. No paid day is lost | Fairness |
| D6 | Paid vs free roles | Paid: Farmer, Farm Supplier, Farm Owner / Hiring Client. Free: all buyer types, Transporter, Job Seeker, Consultant | PDF + prototype |
| D7 | Farm Owner / Hiring Client | Included as a paid role with hiring tools only (no selling). Its plan prices are separate from farmer prices and **set by admin** | Team decision, 23 Nov 2026 (answers Q5) |
| D8 | Marketplace and storefront limits | Five storefront category tabs, unlimited listings | PDF + prototype v52 |
| D9 | Promotion discount range | 0–90% | Prototype |
| D10 | Group size | Minimum 4, conceptual maximum 1,000,000 | PDF + prototype |
| D11 | Transport pricing | Farmers never set transport prices. Transporters quote and buyers accept. Transport is always a separate line | Prototype |
| D12 | Job seeker privacy | Anonymous matching. Contact is released only with the applicant's approval | Prototype |
| D13 | Account verification | Verification and sign-in codes are sent by email only, never by SMS. Phone numbers are kept as contact details | Client decision, 23 Nov 2026 |
| D14 | Plan prices | All plan prices are **editable by admin**. Defaults for demo and development: Quarterly ₦30,000, Half-yearly ₦54,000, Annual ₦95,000 | Team decision, 23 Nov 2026 |
| D15 | Commission | **No commission** on sales. OgaFarm earns from subscriptions only | Team decision, 23 Nov 2026 (part of Q3) |
| D16 | Draft before pay | Farmers can build their storefront and add products **for free as a draft**. Paying publishes it (recommendation #9 approved) | Team decision, 23 Nov 2026 |
| D17 | Verification before selling | Farmers can sell **only after verification is approved**, not while it is in progress (recommendation #10 not taken) | Team decision, 23 Nov 2026 |
| D18 | Grace period | Days after expiry before a storefront is hidden are **set by admin**, default 7 | Team decision, 23 Nov 2026 (answers Q6) |
| D19 | Launch area | No pilot area. Launch nationwide | Team decision, 23 Nov 2026 |
| D20 | Email sending | Emails are sent from our own server (SMTP), no third-party email service | Team decision, 23 Nov 2026 (part of Q4) |
| D21 | Languages | English only at launch | Team decision, 23 Nov 2026 (answers Q7) |
| D22 | Currency | Naira (NGN) only, including diaspora buyers | Team decision, 23 Nov 2026 (answers Q12) |
| D23 | Product name | **OgaFarm** is the product name; the website is farmoga.com | Team decision, 23 Nov 2026 |

## 12. Open questions for the client

| ID | Question | Why it matters |
|---|---|---|
| Q1 | Which P1/P2 features are inside the US$4,500 three-phase quote? **Deferred (team, 23 Nov 2026).** | Scope and budget |
| Q2 | Which payment gateway(s)? **Sent to client, 23 Nov 2026.** | F04, F08 |
| Q3 | Marketplace money flow: does OgaFarm collect buyer payments and pay sellers out (split or subaccounts), or do buyers pay sellers directly? Commission or fees? Which payment terms are allowed (full, 50% deposit, on delivery)? **Partly answered: no commission (D15). Money flow sent to client.** | F08, F10, the legal model |
| Q4 | SMS, WhatsApp and email providers, and who owns the accounts? **Email: own server (D20). Ownership deferred.** | F02, F16 |
| Q5 | Farm Owner / Hiring Client pricing: same plans or different? **Answered: D7.** | F04, F13 |
| Q6 | Grace period length after expiry before listings are hidden? **Answered: D18.** | F04, BR-SUB |
| Q7 | Languages at launch: is French required? **Answered: D21.** | F28 |
| Q8 | Native app-store release commitments for Phase 3 (who owns the developer accounts)? **Deferred (team).** | Phase 3 |
| Q9 | Is the delivery partner named in the prototype under contract, and is integration expected? **Deferred: we will suggest delivery partners to the client later (team, 23 Nov 2026).** | F37 |
| Q10 | Confirm D2, D4, D6 and D7 above **D2 and D7 answered; D4 and D6 stand.** | Binding behaviour |
| Q11 | Legal entity name in contracts, and ownership of product accounts and repositories **Deferred (team).** | Handover |
| Q12 | Do diaspora buyers pay in NGN only, or in foreign currency too? **Answered: D22.** | F08, gateway |

## 13. Milestones

| Phase | Outputs | Approval gate |
|---|---|---|
| Phase 1: UI/UX and landing | Design system. All role flows. S01–S13 designs for mobile and desktop. Public share pages. Responsive landing | Owner approves complete flows and UI states |
| Phase 2: Backend + apps | Schema and migrations, auth, subscriptions, inventory, orders, RFQ, groups, jobs, transport, working screens, repository | Integrated staging demo with test data |
| Phase 3: Integration and deployment | Gateway and notifications, end-to-end UAT (in-scope U, R and AT tests; see §14), fraud and security tests, performance, production deploy, Android/iOS build readiness, handover | All critical UAT passes. Credentials handed over |

## 14. Future scope (not included in the current scope)

These items appear in the reference PDF or prototype but are **excluded** from the current scope by client decision (2026-11-23). They may be added later as a change request. Nothing in the current build should depend on them.

| Item | What it was | Source when it is picked up |
|---|---|---|
| Invite & Share module | Permanent referral code `OGA-XXXXXX`, invite link `/invite/{code}`, invite summary, editable invite message | PDF §6 (S14), v58 addendum (S14-R) |
| Referral attribution and history | Direct-referrer attribution, "My Referrals" history, admin referral review and fraud flags | PDF §6 (S16), v58 addendum (S16-R), v59 §A4–A5 |
| Membership Rewards | +14 subscription days per qualifying paid referral, two lifetime rewards (28 days), reward ledger, earned-extension days on the entitlement | PDF §6 (S15), v58 addendum (S15-R), v59 §A5 |
| Related acceptance tests | U03–U09, R03–R09, AT02–AT04, AT06, AT07 (and the referral parts of AT05) | PDF §11, v58 QA, v59 §A10 |

Not affected: public storefront, product, group and job pages, and their Share / Copy link / WhatsApp buttons with link previews. These stay in scope (F18).

