# V3 · Suppliers and business buying

**Status:** planned (not designed yet)  
**Roadmap increment:** I3 (see `docs/product/roadmap.md`)

## What this version adds
Farm-input suppliers get their own storefront and catalogue. Businesses post buying requests, matching sellers are alerted and quote, and the business compares quotes and orders.

## Planned screens
- Supplier sign-up and verification
- Public supplier storefront (/supplier/{slug})
- Supplier catalogue editor
- Enquiry and supplier quote
- Business buyer profile
- Post a buying request (RFQ)
- Seller demand alerts and response
- Quote comparison and order
- Updated: marketplace filters for farm inputs

## How to build it
1. Add screen files in `screens/` (copy the pattern from `../v1-mvp/screens`).
2. Register each screen in `index.ts` with `status: 'new'` or `status: 'updated'`.
3. Change `status` to `'built'`. The prototype picks it up automatically.
