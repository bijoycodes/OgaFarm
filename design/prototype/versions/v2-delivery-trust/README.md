# V2 · Delivery and trust

**Status:** planned (not designed yet)  
**Roadmap increment:** I2 (see `docs/product/roadmap.md`)

## What this version adds
Orders can now be delivered, not only collected. Verified transporters quote, get assigned and prove delivery. Buyers and farmers can inspect, open disputes and leave reviews.

## Planned screens
- Transporter sign-up, vehicle and documents
- Transporter public profile
- Admin: transporter verification
- Buyer: request delivery quotes at checkout
- Transporter: quote requests and bids
- Buyer: compare and accept a delivery quote
- Assignment with driver details
- Delivery tracking timeline
- Proof of delivery (receiver code, quantity, condition)
- Receive and inspect an order
- Open and follow a dispute
- Admin: dispute cases
- Leave a verified review
- Request a review investigation
- Admin: review moderation
- Updated: checkout, order detail and order status with delivery

## How to build it
1. Add screen files in `screens/` (copy the pattern from `../v1-mvp/screens`).
2. Register each screen in `index.ts` with `status: 'new'` or `status: 'updated'`.
3. Change `status` to `'built'`. The prototype picks it up automatically.
