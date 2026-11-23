# OgaFarm — Roles and Permissions

Part of the [PRD](prd-summary.md). The server enforces every permission below. Hidden UI is never the access control.

## 1. Roles

| Role | Key | Paid? | Activation requirements | Blocked until activated |
|---|---|---|---|---|
| Visitor (anonymous) | `visitor` | — | — | Any transaction, application or contact |
| Farmer / Agrofarmer | `farmer` | Paid | Verified email, completed profile and farm details, verification approved, settled subscription | Publishing listings, receiving orders/RFQs, posting jobs |
| Farm Supplier | `supplier` | Paid | Verified email, business profile, categories, verification approved, settled subscription | Publishing the catalogue, quoting, posting jobs |
| Farm Owner / Hiring Client | `farm_owner` | Paid | Verified email, farm details, verification approved, settled subscription | Posting jobs, receiving worker matches |
| Business Buyer | `business_buyer` | Free | Verified business email, business type | Placing orders, publishing RFQs |
| Individual Buyer | `individual_buyer` | Free | Verified email | Placing orders |
| Group Buyer | `group_buyer` | Free | Verified email | Creating or joining group orders |
| Diaspora Buyer | `diaspora_buyer` | Free | Verified email, plus recipient details per order | Placing orders for recipients |
| Transporter | `transporter` | Free | Verified email, ID (driver's licence or National ID) plus a utility bill, name matching the ID, vehicle type, plate (motor vehicles), capacity, admin approval | Being listed publicly, bidding, being assigned |
| Job Seeker | `job_seeker` | Free | Verified email, availability profile | Applying, publishing availability |
| Consultant | `consultant` | Free | Verified email, credentials reviewed and approved | Appearing in the directory, offering services |
| Benefits Partner (P2) | `partner` | Membership fee | Business verification, paid membership, approved offer | Publishing offers, redeeming codes |
| Admin | `admin.*` | Internal | Staff account with MFA | — |

**Multi-role.** One user (one verified owner identity) may hold several roles, e.g. farmer + business buyer, or job seeker + consultant. Each role is activated separately. The verified owner identity is what verification and fraud checks attach to.

**Buyer sub-types.** Business, individual, group and diaspora buyers share one buyer capability set. The sub-type controls form fields (business type, recipient details) and dashboard emphasis.

## 2. Admin sub-roles

| Sub-role | Scope |
|---|---|
| `admin.super` | All modules, user and role management, configuration. Limited to named staff |
| `admin.verification` | Verification queue and private documents (read through signed URLs), approve or reject |
| `admin.moderation` | Listings, reviews, review appeals, markets, jobs, consultant directory |
| `admin.finance` | Payments, reconciliation, subscriptions, refunds, partner memberships |
| `admin.support` | Users (read), orders (read), disputes, feedback, notifications |

All admin actions are audited. Private documents are never visible to support.

## 3. Navigation by role

| Role | Navigation |
|---|---|
| Public | Home, Browse Produce, Suppliers, Jobs, Markets, Pricing, Partners, Sign in / Register |
| Common (signed in) | Dashboard, Notifications, Messages, Profile |
| Farmer | My Farm (storefront), Listings, Orders, RFQs / Buyer demand, Availability and Calendar, Promotions, Waitlist, Transport, Reports and Records, Reviews, Jobs, Subscription |
| Supplier | Storefront, Catalogue, Quotes, Orders, Inventory, Jobs, Subscription |
| Farm Owner | Jobs (post, matches), Subscription |
| Buyer (all types) | Browse, Saved, Cart / Orders, Procurement RFQs and Quote Compare (business), Group Orders, Recipient details (diaspora), Tracking, Reviews |
| Transporter | Verification, Vehicles, Capacity, Availability, Delivery offers, Assigned jobs |
| Job Seeker | Profile, Jobs, Applications, Status |
| Consultant | Profile, Services / Portfolio, Messages, Status |
| Partner (P2) | Partner portal: membership, offers, redemptions |
| Admin | Operations, Verification, Moderation, Payments, Subscriptions, Disputes, Markets, Feedback, Partners, Audit logs |

## 4. Capability matrix

Legend: ✅ allowed · 🔒 needs an active paid subscription · ✔︎ needs verification approval · — not allowed

| Capability | Visitor | Farmer | Supplier | Farm Owner | Buyer | Transporter | Job Seeker | Consultant | Admin |
|---|---|---|---|---|---|---|---|---|---|
| Browse public listings, storefronts, jobs, markets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Publish produce/livestock listings | — | 🔒✔︎ | — | — | — | — | — | — | moderate |
| Publish farm-input catalogue | — | — | 🔒✔︎ | — | — | — | — | — | moderate |
| Share storefront / product | — | ✅ | ✅ | — | — | — | — | — | — |
| Share group / job | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Buy Now / place order | — | ✅¹ | ✅¹ | ✅¹ | ✅ | — | — | — | — |
| Publish RFQ / buying need | — | ✅¹ | ✅¹ | — | ✅ | — | — | — | moderate |
| Respond to RFQ / quote | — | 🔒✔︎ | 🔒✔︎ | — | — | — | — | — | — |
| Create / join group order | — | ✅¹ | ✅¹ | — | ✅ | — | — | — | — |
| Rescue listing (sell) | — | 🔒✔︎ | — | — | — | — | — | — | moderate |
| Request transport quote | — | ✅ | ✅ | — | ✅ | — | — | — | — |
| Bid on / accept delivery | — | — | — | — | — | ✔︎ | — | — | assign override² |
| Post job / receive worker matches | — | 🔒✔︎ | 🔒✔︎ | 🔒✔︎ | — | — | — | — | moderate |
| Apply for job / publish availability | — | — | — | — | — | — | ✅ | — | — |
| Appear in consultant directory | — | — | — | — | — | — | — | ✔︎ | moderate |
| Suggest / report market | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | verify |
| Review (after delivered order) | — | ✅ | ✅ | — | ✅ | ✅³ | — | — | moderate |
| Request review investigation | — | ✅ | ✅ | — | ✅ | ✅ | — | — | decide |
| Promotions / waitlist (P1) | — | 🔒 | — | — | join waitlist | — | — | — | — |
| Ask OgaFarm AI (P1) | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Claim partner benefit (P2) | — | 🔒 | 🔒 | 🔒 | — | — | — | — | — |

¹ When the user also holds or activates a buyer capability. Any verified user may buy.
² Admin can only assign a verified transporter (U12). The override is audited.
³ Transporters review the parties to their delivered jobs.

## 5. Data visibility rules

| Data | Visible to |
|---|---|
| Identity and verification documents | Owner (upload only) and `admin.verification` |
| Job seeker name and contact | The applicant. An employer only after the applicant approves the request |
| Consultant credentials | Owner and `admin.verification`. Never public |
| Driver name and phone | The ordering party and the seller for that order, after assignment |
| Buyer contact from farmer chat | That farmer only, for that enquiry |
| Business buyer contact on RFQs | Hidden from farmers until a quote is accepted or the buyer shares it |
| Market contact phone | Public only with the contact person's recorded consent |
| Fraud flags | Admin only |
| Partner company financials | That partner and `admin.finance` only |
