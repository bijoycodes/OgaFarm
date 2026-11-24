# OgaFarm — Our Recommendations

**From:** Forazi Tech
**To:** OgaFarm product owner (Chatpliance Inc.)
**Date:** 23 November 2026
**Status:** Proposal for discussion. Nothing here changes the agreed scope until you approve it.

---

## Why we wrote this

You told us you are open to suggestions. We read the full v60 design document (v57 flow, v58 addendum, v59/v60 architecture) and walked through the HTML prototype screen by screen. The vision is strong and the rules are carefully thought out.

We also see a few places where a different approach would get OgaFarm to real farmers and buyers **sooner, with less risk and less cost**, without losing anything you asked for. This document lists each change, the reason for it, the trade-off, and what we need from you.

Each recommendation has the same layout:
- **Today:** what the PDF or prototype says now
- **We recommend:** the change
- **Why it is better for you**
- **Trade-off:** what you give up, honestly stated
- **Your decision:** what we need from you

---

## Summary

| # | Recommendation | Area | Benefit |
|---|---|---|---|
| 1 | Build in small increments with a working demo after each one, instead of three big phases | Process | You see working software within weeks, and you can change priorities between increments |
| 2 | Design screens just before each increment, not all screens up front | Process | No paying twice for screens that change |
| 3 | Launch with a pilot in one area before going national | Process | Real feedback from real users before you spend on scale |
| 4 | Every requirement is linked to an automatic test, and you get the test evidence | Process | You can check the quality yourself, and handover is clean |
| 5 | React Native (Expo) for mobile instead of Flutter | Technology | One language across web, admin and mobile, quick fixes without store review, lower long-term cost |
| 6 | Next.js for public pages and admin, Laravel for the backend | Technology | Shared links look right on WhatsApp and Google; proven, affordable backend |
| 7 | Build the payment, SMS and messaging connections so the provider can be swapped | Technology | Work starts now even before providers are chosen; no lock-in |
| 8 | Prepare for Yorùbá, Igbo and Hausa from day one, translate later | Technology | Adding languages later is cheap instead of a rewrite |
| 9 | Let farmers set up their storefront before paying, and pay to publish | Business | Fixes the "empty marketplace" problem and makes paying easier to say yes to |
| 10 | Faster farmer onboarding: publish once paid, with a clear "Verified" badge added after review | Business | Farmers start selling the same day; trust signals stay honest |
| 11 | A 7-day grace period after a subscription ends | Business | Fewer lost farmers over a late payment |
| 12 | Buyer payments go straight to the seller through the gateway's split payments | Business | OgaFarm never holds other people's money, so there is less legal and financial risk |
| 13 | Full payment at checkout for v1; deposits and pay-on-delivery later | Business | Simpler, safer first release |
| 14 | In-app and push notifications first; one-time email confirmation and password reset by email; SMS only for urgent alerts | Business | Much lower running costs |
| 15 | Low-data design from day one; full offline mode later | Business | Works on weak networks without the high cost of offline sync |
| 16 | AI assistants after launch, once real data exists | Business | Avoids an assistant that guesses prices or stock |
| 17 | Group-buy size limit set by admin (start smaller, raise it as needed) | Business | Protects fulfilment while the system proves itself |
| 18 | Hiring tools arrive with the Jobs increment; review the Farm Owner plan price then | Business | No paid role launches without its features |

---

## A. How we deliver

### 1. Small increments with a demo after each, instead of three big phases
- **Today:** Phase 1 designs every screen, Phase 2 builds everything, Phase 3 integrates and launches. You see working software only near the end.
- **We recommend:** deliver in **increments**. Each one is a small, complete slice that works on web, mobile and admin, and ends with a live demo for you. Order (already agreed with your team):

  | # | Increment | What you will be able to do at the demo |
  |---|---|---|
  | I0 | Foundation | Everything is set up and tested automatically |
  | I1 | **MVP: Farmer sells, buyer buys** | A farmer signs up, pays, builds a storefront and shares it on WhatsApp. A buyer opens the link, pays and collects the order |
  | I2 | Delivery + trust | Verified transporters quote, deliver and prove delivery. Disputes and reviews |
  | I3 | Suppliers + business buying | Supplier catalogues. Businesses post requests and compare quotes |
  | I4 | Group buying + rescue produce | Group orders through a shared link. Fixed-price rescue produce |
  | I5 | Jobs, consultants, markets | Hiring, the consultant directory, the market directory |
  | I6 | Launch | Live providers, security checks, app-store builds, final acceptance tests |

- **Why it is better for you:**
  - You see a working product after the first increment, not at the end.
  - You can change priorities after any demo. If farmers ask for something new, we adjust the next increment, not a frozen plan.
  - If budget or time runs short, you still have a working, sellable product, not a half-finished one.
  - Problems surface early, when they are cheap to fix.
- **Trade-off:** the final shape of later increments is decided as we go, so the full screen set is not finished on day one.
- **Your decision:** approve working in increments. The contract's three phases still apply; we map them as Phase 1 = design inside each increment, Phase 2 = I0–I5, Phase 3 = I6.

### 2. Design each increment's screens just before we build them
- **Today:** all S01–S13 screens are designed in Figma first.
- **We recommend:** design the screens for one increment at a time, a few days ahead of building it. You approve them before we build.
- **Why it is better for you:** what we learn while building I1 (and what pilot users tell us) shapes the later screens. You do not pay for designs that must be redone.
- **Trade-off:** you do not get the whole design set at once.
- **Your decision:** approve per-increment design.

### 3. Pilot in one area first
- **Today:** a national launch at the end.
- **We recommend:** after I1 (or I2, so delivery is included), run a **pilot** with a small group of real farmers and buyers in one area. The prototype's sample data already centres on Delta State (Asaba, Agbor, Issele-Uku), which would be a natural choice. The prototype itself suggests a "pilot transaction workflow" as the first release.
- **Why it is better for you:** real orders show what works (pricing, onboarding, delivery) before money goes into marketing and scale. Success numbers from the pilot also make a strong story for investors and partners.
- **Trade-off:** the national launch waits for pilot results, by a few weeks.
- **Your decision:** whether to run a pilot, and where.

### 4. Every requirement is tied to an automatic test, with evidence for you
- **Today:** your document lists acceptance tests (U01–U14, R01–R12, AT01–AT10), to be checked at the end.
- **We recommend (this is how we already work):**
  - Every feature is broken into small tasks. Each task names the rules and acceptance tests it must satisfy.
  - Automatic tests run on every change. Nothing is accepted unless they pass.
  - At each demo you receive a short report: which of your acceptance tests now pass.
  - Every decision is written down in the repository, so nothing lives only in someone's head.
- **Why it is better for you:**
  - You can verify quality yourself instead of trusting a screenshot.
  - Bugs that were fixed stay fixed.
  - At handover you receive a project any developer can pick up, with documents, tests and a clear history. You are not locked in to us.
- **Trade-off:** none for you. It is part of our cost, not an extra.
- **Your decision:** none needed.

---

## B. Technology

### 5. React Native (Expo) for the mobile app instead of Flutter
- **Today:** the PDF proposes Flutter.
- **We recommend:** React Native with Expo, using TypeScript.
- **Why it is better for you:**
  - **One language everywhere.** The public website, the admin console and the mobile app all use TypeScript and share code: the same data types, the same connection to the backend, the same colours and fonts. Fewer bugs where web and mobile disagree, and less code to pay for.
  - **Faster fixes.** Expo can push many fixes to users' phones directly, without waiting days for app-store review.
  - **Easier to staff.** JavaScript/TypeScript developers are the largest pool of developers, so future hiring is easier and cheaper.
- **Trade-off:** Flutter can be slightly smoother for very animation-heavy apps. OgaFarm is forms, lists and photos, where React Native performs well.
- **Your decision:** written approval of the stack (the PDF asks for this in §A9).

### 6. Next.js for public pages and admin, Laravel for the backend
- **Today:** the PDF asks for server-rendered public pages, but suggests Flutter for web as well.
- **We recommend:** Next.js for the public website and the admin console, Laravel for the backend, MySQL for the database. (The PDF names PostgreSQL only as an example. MySQL is fully supported by Laravel, offered by almost every hosting provider, and handles everything OgaFarm needs, such as locking stock during checkout and blocking duplicate payments.)
- **Why it is better for you:**
  - Storefront and product links shared on WhatsApp, Facebook or Google show the **right title, photo and price** in the preview. Flutter web struggles with this, and sharing is central to OgaFarm.
  - Public pages load fast on cheap phones and weak networks.
  - Laravel is mature and well known, with built-in tools for queues, scheduled jobs and payments. Hosting is affordable.
- **Trade-off:** none against the PDF's goals. It fulfils them more reliably.
- **Your decision:** included in the stack approval in #5.

### 7. Swappable connections to payment, SMS and messaging providers
- **Today:** providers are not chosen yet (Q2, Q4).
- **We recommend:** we build each connection behind a standard "socket". During development a test version plugs in. When you choose a provider, we plug in the real one.
- **Why it is better for you:** your provider decision does not hold up development. If a provider later raises prices or causes problems, switching is a small job, not a rebuild.
- **Our suggestion for payments:** **Paystack** (strong in Nigeria, handles subscriptions and split payments), with Flutterwave as the alternative.
- **Trade-off:** none.
- **Your decision:** choose the payment provider before I1 ends, and the messaging providers before I6.

### 8. Prepare for Yorùbá, Igbo and Hausa from day one
- **Today:** languages are in the later (P1) list.
- **We recommend:** every word on every screen goes into translation files from the very first screen. English ships first. Yorùbá, Igbo and Hausa (and French if you want it) are added later by translating those files.
- **Why it is better for you:** adding languages to an app built this way takes days. Adding them to an app that was not built this way means touching every screen.
- **Trade-off:** none.
- **Your decision:** confirm whether French is needed at all.

---

## C. Product and business

### 9. Let farmers set up their storefront before paying; pay to publish
- **Today:** farmers and suppliers must pay before their account is activated.
- **We recommend:** a farmer can sign up for free, build their storefront and add products **as a draft**. Paying the subscription **publishes** the storefront. Optional: a short free period for pilot farmers.
- **Why it is better for you:**
  - A marketplace needs sellers before buyers will come. Asking for ₦30,000 before a farmer has seen anything is the biggest barrier to that.
  - When the farmer sees their own storefront ready to go, paying feels like a small final step, not a leap of faith.
  - Your team can help farmers set up during onboarding visits, then they pay to go live.
- **Trade-off:** some free accounts never pay. Drafts are private, so this costs nothing beyond storage.
- **Your decision:** approve draft-before-pay, and decide whether to offer a pilot free period.
- **Status (23 Nov 2026):** draft-before-pay adopted by the team (PRD D16). No pilot area (D19).

### 10. Faster onboarding: sell once paid, with "Verified" added after review
- **Today:** farmers cannot publish until manual verification is complete.
- **We recommend:** after email verification and payment, a farmer can publish straight away. Their profile shows **"Verification in progress"** until our team reviews their documents. The **"Verified"** badge appears only after approval. Admin can pause any account at any time.
- **Why it is better for you:** farmers can start selling the same day. Verification queues do not block revenue. Buyers can still see clearly who has been checked.
- **Trade-off:** buyers might deal with an unverified farmer. The label makes this clear, and payments go through the gateway. If you prefer a stricter rule for some categories (for example livestock or regulated farm inputs), we can keep full verification for those.
- **Your decision:** approve the faster onboarding, or keep verification-first.
- **Status (23 Nov 2026):** not taken. Farmers sell only after verification is approved (PRD D17).

### 11. A 7-day grace period after a subscription ends
- **Today:** the grace period is undecided (Q6).
- **We recommend:** 7 days after expiry, the storefront stays visible with a "renew soon" reminder to the farmer. After that, it is hidden (never deleted) until renewal.
- **Why it is better for you:** farmers in rural areas sometimes pay late because of network or cash issues. A short grace period keeps them instead of losing them.
- **Trade-off:** a few days of free visibility.
- **Your decision:** approve 7 days, or choose another number.
- **Status (23 Nov 2026):** admin sets the number of days, default 7 (PRD D18).

### 12. Buyer payments go straight to the seller (split payments)
- **Today:** undecided (Q3). The prototype mentions deposits and payment after delivery.
- **We recommend:** each seller gets a payment sub-account at the gateway. When a buyer pays, the gateway sends the money to the seller directly, and OgaFarm's fee (if any) is split off automatically.
- **Why it is better for you:**
  - OgaFarm never holds other people's money. Holding funds for others can bring extra financial regulation and risk; this design avoids it. (Please confirm the final model with your legal or financial adviser.)
  - Sellers are paid quickly and automatically, with no manual payouts for your team.
  - Every payment is recorded by the gateway and in OgaFarm, which makes disputes easier to settle.
- **Trade-off:** refunds after the seller has been paid need the seller's cooperation or a dispute process (which is in I2).
- **Your decision:** approve split payments, and tell us whether OgaFarm takes a commission on orders.

### 13. Full payment at checkout for the first release
- **Today:** the prototype shows "50% deposit, balance after delivery".
- **We recommend:** v1 uses full payment at checkout. Deposits and pay-on-delivery come later, once real orders show they are needed.
- **Why it is better for you:** partial payments double the paths that can go wrong (unpaid balances, chasing buyers, partial refunds). Starting simple gets the first release out sooner and safer.
- **Trade-off:** some large business buyers may prefer deposits. We can add them in I3 (business buying) if the pilot shows demand.
- **Your decision:** approve full payment for v1.

### 14. In-app and push notifications first; codes by email
- **Today:** SMS, WhatsApp and email are listed as channels.
- **We recommend:** in-app and phone push notifications (free) for everyday updates. The one-time email confirmation and password-reset codes go by email, as you decided, so no SMS is needed for verification. SMS only for urgent alerts if ever needed, and WhatsApp at launch (I6), both opt-in.
- **Why it is better for you:** SMS and WhatsApp messages cost money every time they are sent. This keeps running costs low as the user base grows.
- **Trade-off:** users who do not open the app may see updates later.
- **Your decision:** approve this channel plan.

### 15. Low-data design from day one; full offline mode later
- **Today:** the prototype describes a fully offline app that syncs later.
- **We recommend:** from day one, compressed images, small pages and screens that remember what you last viewed. Full offline editing with background sync comes later, if the pilot shows it is needed.
- **Why it is better for you:** full offline sync is one of the most expensive features to build correctly. Conflicts can corrupt orders and stock. Low-data design gives most of the benefit at a fraction of the cost.
- **Trade-off:** creating listings or orders needs a connection in v1.
- **Your decision:** approve.

### 16. AI assistants after launch
- **Today:** the prototype shows "Ask OgaFarm" and a per-farmer assistant.
- **We recommend:** add the assistants after launch, once there is real data for them to answer from.
- **Why it is better for you:** an assistant without real data tends to guess. A wrong answer about a price or stock level damages trust in the whole platform. Built later, it can answer from real records and real questions.
- **Trade-off:** no AI at launch.
- **Your decision:** approve moving AI to after launch.

### 17. Group-buy size limit set by admin
- **Today:** groups of 4 to 1,000,000 members.
- **We recommend:** the system is built to handle very large groups, but the **maximum is a setting** your admin controls. Start with a modest limit during the pilot and raise it as farmers prove they can fulfil large orders.
- **Why it is better for you:** a very large group that a farmer cannot supply means many refunds and unhappy buyers. A setting lets you grow safely, with no code change.
- **Trade-off:** none. The 1,000,000 ceiling is still possible.
- **Your decision:** approve, and give us a starting limit (we suggest 100).

### 18. Hiring tools and the Farm Owner plan arrive with the Jobs increment
- **Today:** the prototype adds a paid "Farm Owner / Hiring Client" role on the welcome screen.
- **We recommend:** this role is offered only when the Jobs increment (I5) is live, so nobody pays for a plan whose features do not exist yet. At that point, review whether hiring-only users should pay the full farmer price or a lighter "hiring plan".
- **Why it is better for you:** no complaints or refunds from people who paid for features that are not ready. A fair price for hiring-only users brings more employers onto the platform.
- **Trade-off:** none.
- **Your decision:** confirm the timing now; decide the price before I5.

---

## D. What we are keeping exactly as you designed it

Many parts of your design are already the best choice, and we will build them as written:
- Three subscription plans and their prices (₦30,000 / ₦54,000 / ₦95,000).
- Membership activates only after the payment gateway confirms payment, never from a "success" screen.
- Stock is reserved at checkout so the same item can never be sold twice.
- Public storefront and product links work without installing the app, and keep the buyer's place through sign-up.
- Transporters must be verified before they can be assigned. Transport prices are quoted separately and never set by the farmer.
- Only buyers with a completed order can leave a review, and negative reviews are not removed just for being negative.
- Job seekers stay anonymous until they agree to share their contact details.
- Admin accounts use two-step login, and every admin action is recorded.

As you decided, **Invite & Share, referrals and Membership Rewards are out of the current scope.** They are kept in a "future scope" list so they can be added later without redesign.

---

## E. Decisions we need from you

| # | Decision | Needed before |
|---|---|---|
| 1, 2 | Work in increments with per-increment design | Now |
| 5, 6 | Approve the technology stack in writing | Now |
| 9 | Draft-before-pay for farmers; pilot free period yes/no | I1 |
| 10 | Faster onboarding, or verification-first | I1 |
| 11 | Grace period length (we suggest 7 days) | I1 |
| 7, 12 | Payment provider; split payments; OgaFarm commission yes/no and rate | I1 |
| 13 | Full payment at checkout for v1 | I1 |
| 3 | Pilot yes/no, and which area | End of I1 |
| 14 | Notification channel plan | I6 |
| 17 | Starting group-buy limit (we suggest 100) | I4 |
| 18 | Farm Owner / hiring plan price | I5 |
| 8 | French needed? | Before translations |
| 15, 16 | Offline mode and AI after launch | Any time |

---

## F. Why this approach is the better option

1. **You get value earlier.** A working, sellable product arrives in the first increment, not at the end of the project.
2. **You stay in control.** Every demo is a chance to change direction, using what real farmers and buyers tell you.
3. **Less money at risk.** We build what is proven to matter first, and the expensive extras (offline sync, AI, partial payments) wait until data says they are worth it.
4. **Lower running costs.** Free notification channels first, no money held on your books, affordable hosting.
5. **Quality you can check.** Each of your acceptance tests is automated, and you see the results at every demo.
6. **No lock-in.** One shared language, swappable providers, documented decisions and full tests mean any competent team can continue the work.

We are happy to walk through any of these on a call. Once you approve the items above, we will update the product requirements, the roadmap and the build backlog to match.
