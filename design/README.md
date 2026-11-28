# Design

| Folder | What it is |
|---|---|
| `prototype/` | Clickable React prototype, organised by release version (`prototype/versions/v1-mvp`, `v2-…`). See `prototype/README.md`. |
| `prototype-staging/` | Staging copy of `prototype/` for trying changes first. Runs on port 5174 (`npm run dev --prefix design/prototype-staging`). Once a change is approved, copy it to `prototype/`, which is the version shared with the client on port 5173. |
| `app-prototype-staging/` | **Mobile app** prototype (Expo / React Native) for Android and iPhone, sample data. Changes are made here first. Run `npm start --prefix design/app-prototype-staging` and scan the QR code with Expo Go. See its README. |
| `app-prototype/` | **Live** app prototype: the approved copy shown to the client. Run `npm start --prefix design/app-prototype` and scan the QR code with Expo Go. Update it only by copying from `app-prototype-staging/` after approval (command in its README). |
| `figma-export/` | **App screens for Figma**: every app screen in every demo state, day and night (190 frames). Drag the four boards in `figma-export/output/*.svg` into Figma, or use single PNGs from `output/screens/`. See its README to re-capture after design changes. |
