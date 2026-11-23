# V5 · Jobs, consultants and markets

**Status:** planned (not designed yet)  
**Roadmap increment:** I5 (see `docs/product/roadmap.md`)

## What this version adds
Farm jobs with private worker matching, a verified consultant directory, the local market directory and messaging.

## Planned screens
- Job board and job page (/jobs/{id})
- Post a farm job (paid employers)
- Private worker profile
- Anonymous matches and contact approval
- Consultant application
- Consultant directory
- Local market directory
- Suggest or correct a market
- Admin: market and job moderation
- Messages between buyers and sellers
- Notification preferences

## How to build it
1. Add screen files in `screens/` (copy the pattern from `../v1-mvp/screens`).
2. Register each screen in `index.ts` with `status: 'new'` or `status: 'updated'`.
3. Change `status` to `'built'`. The prototype picks it up automatically.
