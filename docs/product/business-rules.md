# OgaFarm — Business Rules

Part of the [PRD](prd-summary.md). These rules are **binding**: code and tests must enforce them on the server. Each rule has an ID so tests and specs can reference it. Rules marked *(proposed)* follow the PRD §11 decisions and await client sign-off.

---

## BR-ACC — Accounts and roles

| ID | Rule |
|---|---|
| BR-ACC-01 | One account per verified email. Sign-up creates the account with **exactly one role**. The account can hold more roles later. |
| BR-ACC-02 | A user adds a role later from the role menu (**Add another role**). Each added role must meet its own activation requirements (roles-and-permissions §1): a buyer role is active at once; a transporter or consultant role needs its own verification; a paid role needs its own plan and verification. Adding a role never charges, changes or extends another role's plan. |
| BR-ACC-03 | Only one role is active in the app at a time. Switching role changes the dashboard, navigation and actions, without signing out. The app reopens in the last role used. |
| BR-ACC-04 | Permissions are checked against the **active role** on the server. Data stays with the role that created it (an order placed as a buyer belongs to the buyer role; a listing to the farmer role). |
| BR-ACC-05 | Notifications are tagged with the role they belong to. The role menu shows an unread count per role, so nothing is missed while using another role. |
| BR-ACC-06 | The identity check (ID, name match) is done once per account and reused by every role. Role-specific checks (farm, vehicle, business, credentials) still apply to each role. |
| BR-ACC-07 | A user can pause or remove a role from account settings. At least one role must remain. A removed farmer or supplier role hides its storefront and listings; nothing is deleted, and re-adding the role restores them. |
| BR-ACC-08 | Admin staff accounts are separate and cannot hold marketplace roles. |
| BR-ACC-09 | Users sign in with email and password. Passwords: at least 8 characters with letters and numbers, stored only as a secure hash. After repeated wrong passwords, sign-in pauses briefly. *Keep me signed in* keeps a session on that device until the user signs out. Admin staff also need their authenticator code (2-step). |
| BR-ACC-10 | Forgot password: a 6-digit code is emailed; the user enters it and sets a new password; all other sessions are signed out and the user is told by email. The reply never reveals whether an email is registered. |

## BR-SUB — Subscriptions and entitlements

| ID | Rule |
|---|---|
| BR-SUB-01 | Paid roles are Farmer, Farm Supplier and Farm Owner / Hiring Client. All other roles are free. |
| BR-SUB-02 | Plans: Quarterly ₦30,000 for 3 calendar months, Half-yearly ₦54,000 for 6 calendar months, Annual ₦95,000 for 12 calendar months. Price changes need written client approval. |
| BR-SUB-03 | Expiry is calendar-based from the actual entitlement end timestamp (e.g. 3 months from 15 Jan is 15 Apr). Never assume 90/180/365 days. |
| BR-SUB-04 | The entitlement ends at `paid_until`. Every change to it is written to an entitlement ledger (payment, renewal, refund, admin adjustment with reason). |
| BR-SUB-05 | *(proposed, D4)* An early renewal or plan change starts the new term at the current `paid_until`. After expiry, the new term starts at payment time. No paid day is lost. |
| BR-SUB-06 | States: `pending → active → expiring → expired → renewed`. *(proposed)* "Expiring" starts 14 days before `paid_until` and triggers reminders. |
| BR-SUB-07 | When a subscription expires, listings, the storefront and jobs are hidden from public view, but **never deleted**. They come back on renewal. Any grace period is to be confirmed (Q6). |
| BR-SUB-08 | Renewal and expired prompts show only for paid roles. |
| BR-SUB-09 | Plan-tier extras: Half-yearly and Annual get weekly reports. Annual also gets monthly summaries and record export. |

## BR-PAY — Payments

| ID | Rule |
|---|---|
| BR-PAY-01 | Never activate a membership, confirm an order or mark anything paid from a client-side success screen. |
| BR-PAY-02 | Activation and confirmation come only from a gateway webhook that has its signature verified and its amount, currency, plan/order and owner checked. |
| BR-PAY-03 | Every provider event ID is unique in the database, so replays are ignored (idempotent processing). |
| BR-PAY-04 | A refund or chargeback reverses the related entitlement or order state. |
| BR-PAY-05 | Daily reconciliation between gateway records and the internal ledger, with mismatches flagged to `admin.finance`. |
| BR-PAY-06 | No payment secrets in clients, the repository or documents. |
| BR-PAY-07 | Group members each pay their own share. The platform never asks one member to collect money for others. |

> **Removed from scope:** the BR-REF rules (Invite & Share, referrals, Membership Rewards) are not included in the current scope. See PRD §14 (future scope).

## BR-LST — Listings, storefronts and inventory

| ID | Rule |
|---|---|
| BR-LST-01 | Each storefront has one unique public slug. Slug conflicts are rejected with suggestions. |
| BR-LST-02 | Five configurable storefront category tabs per seller, with unlimited listings. Renaming a tab remaps its listings, and nothing is deleted. |
| BR-LST-03 | The "Verified" badge shows only when the owner's verification is approved. A nice-looking profile is not verification. |
| BR-LST-04 | Every availability or stock change records who made it and when. Listings show "last confirmed". Forecast stock is labelled as a forecast. |
| BR-LST-05 | *(proposed)* Stock older than 7 days unconfirmed is flagged as stale to the seller and the admin queue, and ranks lower in matching. |
| BR-LST-06 | Stock reservation is atomic (a row lock or a conditional update). Overselling is impossible even with concurrent checkouts. |
| BR-LST-07 | Listings under a moderation hold or expired entitlement are not public. Share links show an unavailable state. |

## BR-ORD — Orders, RFQs and quotes

| ID | Rule |
|---|---|
| BR-ORD-01 | Order states: `created → payment_pending → confirmed → preparing → dispatched → delivered | disputed`, plus `cancelled` and `refunded`. Pickup orders use `ready_for_pickup` in place of `dispatched`. Every transition is audited. |
| BR-ORD-02 | A price change during checkout makes the buyer re-confirm. Insufficient quantity blocks checkout. |
| BR-ORD-03 | Unpaid reservations expire after a configurable time and release the stock. |
| BR-ORD-04 | An enquiry or RFQ is not an order. An order exists only after the buyer accepts a quote or checks out. |
| BR-ORD-05 | RFQ states: `draft → open → quoted → accepted → ordered → closed`. Quotes have an expiry. Expired or withdrawn quotes cannot be accepted. |
| BR-ORD-06 | Only eligible sellers (active, verified, matching category) can respond to an RFQ. |
| BR-ORD-07 | Transport is always a separate line item and is never set by the farmer. |
| BR-ORD-08 | Orders in inspection or dispute never auto-close. |

## BR-GRP — Group buying

| ID | Rule |
|---|---|
| BR-GRP-01 | Group size: minimum 4 members, conceptual maximum 1,000,000. |
| BR-GRP-02 | The farmer sets the unit price and approves the pickup or collection point. |
| BR-GRP-03 | States: `open → funded → sourcing → fulfilment → completed | cancelled`. A group advances only when its funding and minimum-size rules are met. |
| BR-GRP-04 | Missed deadline or underfunding → cancel with proportional refunds. Oversubscription is capped at the farmer's available quantity. |
| BR-GRP-05 | Each member's allocation, payment and refund is recorded separately. There is one source of truth for the group status. |

## BR-RSC — Rescue produce

| ID | Rule |
|---|---|
| BR-RSC-01 | Condition disclosure and the seller's food-safety confirmation are mandatory. Unsafe produce is prohibited. |
| BR-RSC-02 | Fixed price with no quoting. The buyer acknowledges the condition before paying. |
| BR-RSC-03 | The listing expires automatically at its sell-by date. Atomic reservation applies. |

## BR-TRN — Transport

| ID | Rule |
|---|---|
| BR-TRN-01 | Only approved transporters can bid or be assigned. The backend rejects anything else with a clear next step (U12). |
| BR-TRN-02 | Verification needs (1) a driver's licence or National ID and (2) a utility bill, with the registered name matching the ID. Motor vehicles also need a plate number. |
| BR-TRN-03 | Assignment is blocked when the cargo exceeds the declared payload or bag capacity. |
| BR-TRN-04 | Driver contact is shared with the ordering party only after assignment, using a number the driver agreed to share. |
| BR-TRN-05 | States: `requested → quoted → assigned → pickup → in_transit → delivered`. Proof of delivery (receiver confirmation plus quantity and condition) is required for `delivered`. |

## BR-JOB — Jobs and consultants

| ID | Rule |
|---|---|
| BR-JOB-01 | Anyone can browse jobs. Applying needs a free Job Seeker account. |
| BR-JOB-02 | Posting jobs and receiving worker matches needs an active, verified paid subscription (farmer, supplier or farm owner). |
| BR-JOB-03 | Worker profiles are private. Employers see anonymous matches. Contact is released only after the applicant approves. |
| BR-JOB-04 | One application per job per applicant. Expired jobs reject applications. |
| BR-JOB-05 | No registration fees may ever be charged to applicants. Show the safety notice. |
| BR-JOB-06 | Consultants appear publicly only after credential verification. Credentials are never published. |

## BR-REV — Reviews

| ID | Rule |
|---|---|
| BR-REV-01 | Only participants in a `delivered` order may review, once per order per target. |
| BR-REV-02 | Farmer/product and transporter/delivery ratings are separate. Farmers can review buyers. |
| BR-REV-03 | Reviews are moderated before publishing. A review is never removed only for being negative. |
| BR-REV-04 | An appeal never deletes a review automatically. Removal from public view happens only after an authorised decision. A restricted audit record is kept. |
| BR-REV-05 | Show the average together with the review count, and flag small samples. |

## BR-MKT — Markets

| ID | Rule |
|---|---|
| BR-MKT-01 | New or edited market entries are pending until reviewed. Duplicates are checked. |
| BR-MKT-02 | A contact phone is published only with the contact person's recorded consent. |
| BR-MKT-03 | A market listing never implies a confirmed buyer. |

## BR-PRM — Promotions, waitlist and partners

| ID | Rule |
|---|---|
| BR-PRM-01 | Promotion discount 0–90%. The promo price is calculated server-side from the original price. Shown only between its start and end dates while published. |
| BR-PRM-02 | Promotion notifications go only to customers with marketing consent and to opted-in accounts. |
| BR-PRM-03 | Joining a waitlist never reserves stock. |
| BR-PRM-04 | (P2) Partner discount 5–85%. A partner is visible only when verified, paid, approved and within its offer dates. |
| BR-PRM-05 | (P2) Promo codes are single-use, short-lived and linked to the member's phone (hash + last 4 digits). Redemption checks the code, the phone, partner status and expiry. |

## BR-NOT — Notifications, consent and privacy

| ID | Rule |
|---|---|
| BR-NOT-01 | In-app by default. SMS, WhatsApp and email marketing need explicit opt-in and easy opt-out. Transactional messages are kept separate from marketing. |
| BR-NOT-02 | Record consent: who, what, when, channel and the policy version. |
| BR-NOT-03 | Personal data is processed in line with the NDPA 2023. Collect only what is needed. A retention and deletion policy applies. |
| BR-NOT-04 | AI answers are disclosed as AI, grounded in authorised records, and never perform actions without user confirmation. |
| BR-NOT-05 | Private documents live in encrypted storage behind signed URLs. They are never public. |
| BR-NOT-06 | Codes are sent by email only (6 digits, short expiry, limited attempts): once at sign-up to confirm the email address, and for password reset. They are not used at every sign-in. SMS is never used for verification. |

## BR-SHR — Sharing and deep links

| ID | Rule |
|---|---|
| BR-SHR-01 | Share links use canonical HTTPS farmoga.com URLs with Open Graph previews. |
| BR-SHR-02 | Opening a link never forces installation. The destination survives signup and login. |
| BR-SHR-03 | Removed or expired content shows an informative unavailable page with alternatives, never the generic homepage while the content still exists. |
| BR-SHR-04 | No personal data appears in crawlable metadata. |
| BR-SHR-05 | Storefront and product sharing is available to every active seller. |
