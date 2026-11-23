# V2 · Delivery and trust

**Status:** built (live on the client prototype)
**Roadmap increment:** I2 (see `docs/product/roadmap.md`)

## What this version adds
Orders can now be delivered, not only collected. Verified transporters quote, get assigned and prove delivery. Buyers check what arrives, can open a dispute, and leave reviews that are checked before they are published. A new **Transporter** role appears in the Role menu.

## The delivery flow (try it in this order)
1. Buyer · **Checkout** → choose *Delivery* → *Get delivery quotes*
2. Buyer · **Delivery quotes** → compare verified transporters → *Accept and pay*
3. Transporter · **Delivery requests** → **Send a quote** (blocked if the load is too heavy)
4. Farmer · **Order detail** → check the plate, count the load → *Confirm handover*
5. Transporter · **Job** → confirm pickup → on the way → proof of delivery (buyer's 4-digit code)
6. Buyer · **Order status** → *My order has arrived* → **Check your order** → all good, or report a problem
7. Buyer · **Dispute** ↔ Admin · **Decide a dispute**
8. Buyer · **Leave a review** (farm and delivery rated separately) → Admin · **Review moderation**
9. Farmer · **Reviews** → **Request investigation** → Admin · *Investigations*

## Screens
| Group | New | Updated from V1 |
|---|---|---|
| Transporter | Sign-up (vehicle and documents), dashboard, delivery requests, send a quote, job with proof of delivery, public profile | — |
| Buyer | Delivery quotes, receive and check, dispute, leave a review | Checkout (delivery option), order status (tracking and delivery code) |
| Farmer | Reviews, request an investigation | Order detail (handover to the driver) |
| Admin | Transporter queue and review, disputes and case decision, review moderation | Menu: Transporters, Disputes, Reviews |

## Rules shown
- Only verified transporters can quote or be assigned (BR-TRN-01). Name must match the ID; plate needed for motor vehicles (BR-TRN-02).
- A quote is blocked when the load is heavier than the vehicle's capacity (BR-TRN-03).
- The driver's phone and the buyer's exact address are shared only after assignment (BR-TRN-04).
- Delivery needs proof: buyer's code, quantity and condition (BR-TRN-05).
- Delivery is a separate cost set by the transporter, never by the farmer (BR-ORD-07).
- An order with a dispute never closes on its own (BR-ORD-08).
- Only parties to a delivered order can review; farm and delivery are rated separately; reviews are checked before publishing; a review is never removed just for being negative (BR-REV-01…05).
- No live GPS map: the buyer sees status updates from the driver.

## Folder
`parts.tsx` holds V2 sample data (transporters, the delivery order) and small parts (route, star rating). Screens are in `screens/`.
