# OgaFarm mobile app prototype

> **Live copy** — the approved version shown to the client. Don’t edit here: change `design/app-prototype-staging` first, then copy it across after approval
> (`rsync -a --exclude node_modules --exclude .expo --exclude /package.json --exclude /package-lock.json --exclude /README.md app-prototype-staging/ app-prototype/` from `design/`).

The **Android and iPhone app** prototype, built with **Expo (React Native)** — the stack chosen in the PRD — with sample data only. No backend, no real payments, nothing is saved. It looks and feels native: real tab bar, native sheets, swipe-back, haptics, light/dark.

The web prototype (`design/prototype`) shows the website. This one shows the app. Both use the same design tokens and content.

## See it on your phone (recommended)
1. Install **Expo Go** from the App Store or Google Play.
2. On this computer:
   ```bash
   npm start --prefix design/app-prototype
   ```
3. Scan the QR code (iPhone: Camera app · Android: Expo Go). Phone and computer must be on the same Wi‑Fi.
   Different network? Use `npm run start:tunnel --prefix design/app-prototype`.

Built on **Expo SDK 58** — Expo Go must be the current version from the store.

## Web preview (backup)
```bash
npm run web --prefix design/app-prototype
```
Same screens in a browser. Sheets open as full pages and haptics are off on web.

## Using the prototype
- The app opens on **Welcome** → Create an account / Sign in / Browse without an account.
- Every role works the same way:
  - **Top bar** (pinned): OgaFarm logo on the left, your **avatar** on the right.
  - **Avatar** = you: switch role, add a role, **Account and settings**, sign out.
  - **Account and settings** (one screen for all roles): your details, notification settings, password, privacy, appearance (Day / Night / Match phone), help.
  - **Bottom tabs** = your work areas + **Alerts** (the only place for notifications).
    Buyer: Browse · Orders · Alerts. Farmer: Home · My farm · Listings · Orders · Alerts.
    Transporter: Home · Requests · Jobs · Alerts · Profile (the public page buyers see).
- The floating **Screens** button (prototype only, removed later) jumps to any screen and switches a screen’s demo state (e.g. *Wrong code*).

## Batches
| Batch | Content | Status |
|---|---|---|
| A | Setup, theme, components, tab bars for Buyer / Farmer / Transporter, role menu, Screens helper, Welcome, Sign up, Confirm email, Sign in, Forgot password | **Built** |
| B | Buyer: browse + filters, product, storefront, checkout, delivery quotes, order tracking, receive & check, dispute, review, orders, notifications, account, add a role | **Built** |
| C | Farmer: dashboard, plan, payment, verification, my farm, storefront editor, listings, add/edit product, stock sheet, orders, order handover, subscription, reviews, review check, notifications | **Built** |
| D | Transporter: sign-up (vehicle and documents), dashboard with availability, requests, send quote (capacity check), jobs, job + proof of delivery, profile, notifications | **Built** |

## Folder layout
```
src/app/            screens (Expo Router — every file is a screen, _layout.tsx = navigator)
  auth/             welcome, signup, confirm-email, signin, forgot-password
  buyer|farmer|transporter/(tabs)/   role tab screens; detail screens sit next to (tabs)
  role-menu.tsx     native sheet: switch role / add role / sign out
  screens.tsx       prototype helper sheet
src/components/     RoleTabs (native tab bar) + RoleTabs.web (web preview), RoleStack, ScreensButton
src/ui/             Icon (Phosphor), kit (buttons, cards, fields…), screen (frame, header, toast), pickers (country, role)
src/theme/          tokens (same as web), ThemeProvider (follows the phone, day/night toggle)
src/data/           sample farms, products, orders, plans, roles, accounts
src/proto/          prototype state (account, toasts, screen states), haptics, screen registry
assets/images/      app icon + Android icon, logo cuts (full / emblem / lettering, with night versions) made from
                    docs/reference/images; photos (see photos/CREDITS.md)
```

## Commands
```bash
npm run typecheck --prefix design/app-prototype   # TypeScript
npm run doctor --prefix design/app-prototype      # Expo Go compatibility (expo-doctor)
```
Add packages with `npx expo install <name>` (picks SDK-compatible versions).
