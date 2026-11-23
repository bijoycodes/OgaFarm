# OgaFarm: Product Requirements (for your review)

| | |
|---|---|
| Product | OgaFarm, an agricultural marketplace for Nigeria |
| Website | farmoga.com |
| Prepared by | Forazi Tech |
| Version | 1.0, 23 November 2026 |
| Status | **Draft for your review** |

**What we need from you:** please read this document and tell us if anything is wrong, missing or not what you want. You can reply with the section number and your comment (for example "5.3: farmers should also be able to…"). Once you confirm, this becomes the agreed plan we build from.

The clickable preview (prototype) shows how the first release will look. This document describes how everything should **work**.

---

## 1. What OgaFarm is

OgaFarm connects Nigerian **farmers** and **farm-input suppliers** directly with **buyers**, **transporters**, **farm workers** and **consultants**, in one platform.

- **The problem:** farmers sell through middlemen and get little of the final price. Buyers struggle to find reliable supply. Delivery is hard to arrange. Trust is low on every side.
- **Our goal:** *"Your farm. Your market."* Farmers list once and reach every buyer directly. Buyers see real prices and confirmed stock. Delivery is priced separately and tracked.

**Where people use it**
- **Website (farmoga.com):** anyone can browse farms and products without installing anything.
- **Mobile app (Android and iPhone):** for farmers, buyers and other users to manage their work.
- **Admin panel:** for your team to verify users, manage payments, settings and problems.

**How we design it**
- Works well on basic phones and slow internet.
- "Verified" is shown only when someone has truly been checked.
- Every important action (payments, stock, verification) is checked by the system, so it can't be faked.

---

## 2. Who uses OgaFarm

| User | Pays? | What they do |
|---|---|---|
| Farmer | **Paid plan** | Sell produce and livestock, manage orders, share their storefront |
| Farm Supplier | **Paid plan** | Sell farm inputs: seeds, fertiliser, feed, day-old chicks, equipment, packaging |
| Farm Owner / Hiring Client | **Paid plan** | Post farm jobs and hire workers (no selling) |
| Individual Buyer | Free | Buy for their household |
| Business Buyer | Free | Restaurants, hotels, wholesalers, processors and others buying in volume |
| Group Buyer | Free | Join with others to buy in bulk at a better price |
| Diaspora Buyer | Free | Buy from abroad for family in Nigeria |
| Transporter | Free, after verification | Quote for and carry deliveries |
| Job Seeker | Free | Find farm work, with their profile kept private |
| Consultant | Free, after verification | Offer expert advice (crops, livestock, vet, soil, business) |
| Admin (your team) | Internal | Verify users, handle payments, problems and settings |

One person can hold more than one role (for example a farmer who is also a buyer).

---

## 3. Key decisions already made

Please check these carefully. They shape how the whole system works.

| # | Decision |
|---|---|
| 3.1 | **Plans and prices for paid users:** Quarterly ₦30,000, Half-yearly ₦54,000, Annual ₦95,000. **Admin can change these prices at any time** from the admin panel |
| 3.2 | **Farm Owner / Hiring Client** prices are separate from farmer prices and are **set by admin** |
| 3.3 | **No commission** on sales. OgaFarm earns from subscriptions only |
| 3.4 | **Free draft first:** farmers can sign up, build their storefront and add products **for free**. Paying a plan is what makes the storefront visible to buyers |
| 3.5 | **Verification before selling:** a farmer's storefront goes live only **after your team approves their documents** |
| 3.6 | **When a plan ends:** the storefront stays visible for a few extra days (grace period). **Admin sets the number of days** (default 7). After that it is hidden, never deleted, until the farmer renews |
| 3.7 | **Early renewal:** the new period starts when the current one ends, so no paid day is lost |
| 3.8 | **Codes by email only:** sign-up and sign-in codes are sent **by email**, not by SMS. Phone numbers are kept as contact details |
| 3.9 | **Currency:** Naira (₦) only, including for diaspora buyers |
| 3.10 | **Language:** English at launch |
| 3.11 | **Launch area:** all of Nigeria at once (no pilot area) |
| 3.12 | **Transport prices:** farmers never set delivery prices. Transporters give a quote, the buyer accepts it, and delivery is always shown as a separate cost |
| 3.13 | **Job seeker privacy:** employers see only anonymous matches (skill and area). Contact details are shared only when the job seeker agrees |
| 3.14 | **Name:** the product is called **OgaFarm**; the website is farmoga.com |

**Still waiting for your answer**
- Which payment gateway to use (Paystack, Flutterwave or other)?
- When a buyer pays, should the money go straight to the farmer, or to OgaFarm first?
- Do you have a logo file or brand colours?

---

## 4. How we will deliver it

We build OgaFarm **in small releases**, not all at once. After each release you see a working demo and give feedback before we continue. Each release has its own screens in the prototype (V1, V2, …).

| Release | What you get |
|---|---|
| **V1 · MVP** | Farmers sign up, get verified, pay a plan and sell. Buyers browse, buy and **collect from the farm (pickup)**. Admin panel for verification, users and payments |
| **V2 · Delivery and trust** | Transporters, delivery quotes and tracking, proof of delivery, reviews, delivery inspection and disputes |
| **V3 · Suppliers and business buying** | Farm supplier storefronts, business buyers, request for quotes (RFQ) and quote comparison |
| **V4 · Group buying and rescue produce** | Group purchases, and discounted produce that must sell soon |
| **V5 · Jobs, consultants and markets** | Farm jobs with private worker matching, consultant directory, local market directory, messages |
| **V6 · Launch** | Final polish, security checks, performance and launch preparation |

---

## 5. What each part does

### 5.1 Public website and home page
- Home page with what OgaFarm does, the user types, plan prices and a "browse produce" entry.
- Main menu: Home, Browse produce, Suppliers, Jobs, Markets, Pricing, Sign in / Register.
- Visitors can browse without an account. Buying, applying or posting needs sign-in.

### 5.2 Sign up and sign in
- Sign up with **email** (required) and phone number (contact only). The email is confirmed with a **6-digit code sent by email**.
- Choose a user type at sign-up.
- Sign in with a code sent to your email.
- If someone opens a shared product link and needs to sign in, they return to that product afterwards.

### 5.3 Verification
- Each user type has its own checklist of documents.
- **Farmer:** farm details and identity documents.
- **Transporter:** ID (driver's licence or National ID), utility bill, vehicle type, plate number and capacity.
- **Supplier:** business details and categories; extra checks for regulated products.
- **Consultant:** qualification, institution, licence number and certificate. These are never shown publicly.
- Documents are stored privately and seen only by your review team.
- Admin can approve, reject with a reason, or ask for more information.

### 5.4 Plans and payments (paid users)
- Choose Quarterly, Half-yearly or Annual and pay online.
- The plan is activated only after the payment gateway confirms the payment.
- Reminders before the plan ends, payment history and receipts.
- Plan benefits:
  - **Quarterly:** storefront with five categories, unlimited products, buyer orders and enquiries, order tracking.
  - **Half-yearly:** everything in Quarterly + weekly report, sales history, renewal reminders.
  - **Annual:** everything in Half-yearly + monthly summary and downloadable records.

### 5.5 Farmer storefront and products
- Each farm gets its own public page (farmoga.com/farm/farm-name) with cover photo, name, location, bio, opening hours, reviews and a share button.
- Up to **five product categories** on the storefront, with ready templates for poultry, crops, livestock, fish and mixed farms.
- **Unlimited products.** Each product has photos, category, quantity and unit (kg, bag, crate, basket, Derica, Mudu, bird, goat and more), price, pickup location and availability.
- Availability options: Available now, Expected soon, Recurring, Seasonal, Reserved, Sold out, Temporarily unavailable. Each product shows when its stock was **last confirmed**.
- Dashboard with quick actions: add product, view orders, share my storefront (WhatsApp, copy link) and renew plan.

### 5.6 Marketplace and search
- Search produce, livestock and farm inputs.
- Filter by location, category, price, quantity and availability.
- Product cards show price per unit, quantity, location and "last confirmed".

### 5.7 Buying and orders
- **Buy Now:** choose pickup or delivery, see a clear price breakdown (product, delivery separately, fees), then pay.
- Stock is held for the buyer during checkout, so two people can't buy the same last item.
- Order steps: placed → paid → confirmed → preparing → ready for pickup / on the way → completed.
- **Pickup:** the buyer gets a **pickup code in the app** and shows it at the farm.
- Diaspora buyers enter the recipient's name, phone and address in Nigeria.

### 5.8 Delivery and transporters (V2)
- The buyer requests delivery quotes. Verified transporters send prices. The buyer picks one.
- The buyer sees the driver's name and phone after assignment.
- Proof of delivery: quantity, condition, photos and the receiver's confirmation code.
- Unverified transporters can never be assigned.

### 5.9 Reviews, inspection and disputes (V2)
- Only buyers and sellers in a **completed** order can leave a review (1–5 stars plus comments).
- Separate reviews for the product/farmer and for the delivery.
- Reviews are checked before publishing. A review is not removed just because it is negative, but users can appeal unfair ones.
- On delivery the buyer can report problems (short quantity, poor quality, damage, late, wrong product). Admin reviews and decides.

### 5.10 Farm suppliers (V3)
- Supplier storefront with catalogue: seeds, fertiliser, crop protection, feed, day-old chicks, equipment, packaging.
- Products include pack size, minimum order and batch/expiry notes.
- Buyers send an **enquiry**, and the supplier replies with a quote. An enquiry is not an order.

### 5.11 Business buyers and request for quotes (V3)
- A business posts what it needs: product, quantity, location, deadline, delivery speed and how often (one time, weekly, monthly…).
- Matching farmers and suppliers are alerted and send quotes.
- The business compares quotes on price, availability, delivery time and transport, then orders.

### 5.12 Group buying (V4)
- An organiser creates a group purchase (minimum 4 people) with item, quantity, price, deadline and pickup or delivery.
- The group can be shared by link. **Each member pays their own share**; nobody collects money for others.
- If the group doesn't fill or someone drops out, refunds are handled automatically.

### 5.13 Rescue produce (V4)
- Farmers can sell produce that must sell soon, or is bruised or irregular, at a lower price.
- The condition must be clearly described, and the farmer confirms it is safe to eat.
- Fixed price, quick checkout and an urgent pickup window.

### 5.14 Farm jobs (V5)
- Anyone can browse jobs. Applying needs a free Job Seeker account.
- Posting jobs needs an active paid plan (farmer, supplier or farm owner).
- Job seeker profiles are **private**; employers see anonymous matches only.
- Safety notice: never pay a fee to get a job.

### 5.15 Consultants (V5)
- Consultants apply privately with their qualifications. Only verified consultants appear in the public directory.
- Search by speciality and location. Fees are agreed between the consultant and the client.

### 5.16 Local market directory (V5)
- Users can suggest local markets (name, location, market days, products).
- Suggestions are checked by admin before they appear. Users can report wrong information.

### 5.17 Notifications and messages
- In-app notifications for orders, quotes, jobs and plan renewals, plus phone push notifications.
- **Email** for codes, receipts and important updates.
- Messages between buyer and seller, and buyer and transporter, inside an order.
- SMS and WhatsApp alerts can be added later (optional).

### 5.18 Sharing
- Every farm, product, group and job has its own link that looks good when shared on WhatsApp and social media.
- If the app is installed the link opens it; otherwise it opens the website. Nobody is forced to install the app.

### 5.19 Admin panel
- Overview, verification queue, users, payments and subscriptions, plan prices and settings, disputes, moderation (products, reviews, markets, jobs) and an activity log.
- Admin sign-in uses a second step (a code from an authenticator app).
- Every admin action is recorded.

### 5.20 Light and dark mode
- Users can switch between day and night mode inside the app, or follow their phone's setting.
