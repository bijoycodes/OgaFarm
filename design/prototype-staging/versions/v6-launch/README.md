# V6 · Launch polish

**Status:** planned (not designed yet)  
**Roadmap increment:** I6 (see `docs/product/roadmap.md`)

## What this version adds
Mostly behind-the-scenes work: live payment and messaging providers, security and speed. Visible changes are small.

## Planned screens
- Notification channel settings (SMS, WhatsApp, email, push)
- Language picker (English, Yorùbá, Igbo, Hausa)
- App store screenshots and store listing
- Final copy and accessibility pass on all screens

## How to build it
1. Add screen files in `screens/` (copy the pattern from `../v1-mvp/screens`).
2. Register each screen in `index.ts` with `status: 'new'` or `status: 'updated'`.
3. Change `status` to `'built'`. The prototype picks it up automatically.
