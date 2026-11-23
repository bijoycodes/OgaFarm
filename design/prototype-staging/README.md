# OgaFarm UI prototype (staging)

> **Staging copy** of `design/prototype`. Try changes here first; once approved, copy them to `design/prototype`, which is the version shared with the client. Runs on port **5174** (main prototype: 5173).

A clickable prototype of the OgaFarm app with sample data only, built in React (Vite + TypeScript).
There is no backend and no real payments, and nothing is saved. Its job is to show how each release will look and work before we build it for real.
The shared components and design tokens are written so the production apps (Next.js web and admin, Expo mobile) can reuse them.

**Design system:** made with the UI/UX Pro Max skill (Organic Biophilic style, softened agriculture palette, Lora + Nunito Sans, Phosphor icons). Rules and reasoning: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

## Versions
The screens are organised by release, one folder per version, matching `docs/product/roadmap.md`:

| Version | Folder | Roadmap | Status |
|---|---|---|---|
| V1 · MVP: Farmer sells, buyer buys | `versions/v1-mvp` | I1 | **Built** (33 screens) |
| V2 · Delivery and trust | `versions/v2-delivery-trust` | I2 | **Built** (17 new, 3 updated) |
| V3 · Suppliers and business buying | `versions/v3-suppliers-b2b` | I3 | Planned |
| V4 · Group buying and rescue produce | `versions/v4-group-rescue` | I4 | Planned |
| V5 · Jobs, consultants and markets | `versions/v5-jobs-consultants-markets` | I5 | Planned |
| V6 · Launch polish | `versions/v6-launch` | I6 | Planned |

Each version folder has a `README.md` (what it adds) and an `index.ts` (its list of screens). In the prototype, choosing a version shows every screen that exists at that point. A later version can replace an earlier screen by reusing its `id`, and the screen index then marks it "Updated in vN".

## Folder layout
```
design/prototype-staging/
  index.html, package.json, vite.config.ts, tsconfig.json
  public/icon.png                 app icon
  public/images/                  sample photos (free Unsplash/Pexels licence, see images/CREDITS.md)
  scripts/make-artifact.mjs       turns the build into a shareable page
  scripts/build-icons.mjs         extracts the Phosphor icons we use (regular weight) into src/shared/ui/icons.generated.ts
  src/
    main.tsx                      entry point
    app/                          prototype shell: toolbar, version picker, screen index, design system page
    shared/
      styles/                     tokens.css (soft palette, light and dark), base, components, layouts
      ui/                         Icon and UI components (buttons, badges, alerts, cards, fields…)
      layout/shells.tsx           public header/footer and the signed-in app shell (farmer, buyer, admin)
      blocks.tsx                  plans, share sheet, stock update, marketplace browse
      data/sample.ts              sample farms, products, orders and plans
      registry.ts                 types for screens and versions
  versions/
    index.ts                      list of all versions in order
    v1-mvp/                       built: README, index.ts, screens/
    v2-…/ to v6-…/                planned: README and index.ts with planned screens
```

## Run it
```bash
npm install --prefix design/prototype-staging
npm run dev --prefix design/prototype-staging      # http://127.0.0.1:5174
npm run build --prefix design/prototype-staging    # type-check + production build in dist/
npm run icons --prefix design/prototype-staging    # after adding an icon name to scripts/build-icons.mjs
```

## Add the next version
1. Create screens in `versions/v2-delivery-trust/screens/` using the shared components.
2. List them in that folder's `index.ts` (`status: 'new'`, or `'updated'` when replacing a V1 screen with the same `id`).
3. Set the version's `status` to `'built'`.
