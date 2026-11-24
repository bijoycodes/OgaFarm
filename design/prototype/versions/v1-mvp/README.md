# V1 · MVP: Farmer sells, buyer buys

**Status:** built, ready for review
**Roadmap increment:** I1 (see `docs/product/roadmap.md`)

## What this version shows
A farmer signs up, pays for a plan, gets verified, builds a storefront and shares it on WhatsApp. A buyer opens the link, pays and collects the order at the farm with a pickup code. Admin staff verify farms, check payments and see every action in the audit log.

Delivery, suppliers, group buying, jobs and markets are not in this version. Buttons for them show a "coming in vN" message.

## Screens (35)
| Group | Screens |
|---|---|
| Public pages | Landing and role selection · Pricing · Marketplace browse (loading, empty, error) · Public farm storefront · Product detail (sold out) · Unavailable link |
| Account and onboarding | Sign up (error) · Email code check (wrong code) · Sign in · Choose a plan · Plan payment status (pending, active, failed) · Farm verification (form, submitted) |
| Farmer | Dashboard (new account, unverified, expired) · Storefront editor (link taken) · My listings (empty) · Add or edit a product · Orders (empty) · Order detail with pickup handover · Subscription (expiring) · Notifications (empty) |
| Buyer | Browse · Checkout (price changed) · Order status and pickup code (confirming, confirmed, failed) · My orders (empty) · Notifications · Account |
| Admin console | Sign in with 2-step code · Overview · Verification queue (empty) · Review a farm (approved) · Users · Payments and subscriptions · Audit log |

## Marked proposals
Screens carry a gold "Proposed change" note where client recommendations #9 (set up before paying) and #10 (sell while verification is in progress) would change the flow.

## Files
- `index.ts`: the list of screens in this version (name, spec reference, role, states)
- `screens/public.tsx`, `onboarding.tsx`, `farmer.tsx`, `buyer.tsx`, `admin.tsx`: the screens

## Accounts with more than one role
Sign-up creates one role. The **role menu** (account card at the bottom of the sidebar on desktop, role button in the top bar on mobile) switches between the roles an account holds and opens **Add another role** (`add-role`). Rules: business-rules.md BR-ACC-01…08.
