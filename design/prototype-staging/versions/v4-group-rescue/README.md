# V4 · Group buying and rescue produce

**Status:** planned (not designed yet)  
**Roadmap increment:** I4 (see `docs/product/roadmap.md`)

## What this version adds
Buyers organise group orders through a shared link and each member pays their own share. Farmers sell imperfect or urgent produce at a fixed price.

## Planned screens
- Create a group order
- Shared group page (/group/{id})
- Join a group and pay your share
- Group funding progress and deadline
- Farmer approves the pickup point
- Cancellation and refunds
- Rescue produce listing with condition disclosure
- Rescue fixed-price checkout

## How to build it
1. Add screen files in `screens/` (copy the pattern from `../v1-mvp/screens`).
2. Register each screen in `index.ts` with `status: 'new'` or `status: 'updated'`.
3. Change `status` to `'built'`. The prototype picks it up automatically.
