# OgaFarm app → Figma

Every screen of the OgaFarm mobile app prototype, in **every demo state**, in **day and night**, ready to drop into Figma.

## What's in `output/`
| File | What it is |
|---|---|
| `OgaFarm-app-01-sign-in-account.svg` | Board: Welcome, Sign up, Confirm email, Sign in, Forgot password, Account and settings, avatar menu |
| `OgaFarm-app-02-buyer.svg` | Board: all Buyer screens |
| `OgaFarm-app-03-farmer.svg` | Board: all Farmer screens |
| `OgaFarm-app-04-transporter.svg` | Board: all Transporter screens |
| `screens/` | Every frame as its own sharp PNG (2×, 780×1688), named `group-screen-name--state--day/night.png` |
| `manifest.json` | List of every frame (group, screen, state, day/night, file) |

On each board: **one row per screen**; each state is a pair of phone frames (**Day · Night**) with the screen name, V1/V2 and the state above it.

## Put it in Figma
1. Open (or create) a Figma design file.
2. **Drag the `.svg` boards** from `output/` onto the canvas (or File → Place image… / ⇧⌘K and pick them).
   Each board comes in as one group with named layers (screen → state → Day/Night) and editable text.
3. Want single screens instead? Drag PNGs from `output/screens/` onto the canvas.

Tip: Figma shows big boards at low detail while zoomed out; zoom in to see them sharp. Fonts are Lora (titles) and Nunito Sans (text); if they aren't installed Figma will suggest a replacement for the board titles only — the screens themselves are images.

## Make it again after design changes
1. Start the app web preview (staging, port 8090):
   ```bash
   npm run web --prefix design/app-prototype-staging -- --port 8090
   ```
2. Capture and build (first time: `npm install --prefix design/figma-export` and `npx --prefix design/figma-export puppeteer browsers install chrome`):
   ```bash
   npm run all --prefix design/figma-export
   ```
   Use `APP_URL=http://localhost:8091` for the live app. About 10 minutes for ~200 frames.

How it works: `capture.mjs` reads the screen list from the app (read-only), opens each screen in a capture browser (Chrome for Testing, kept in `.cache/`, git-ignored), switches every demo state through the app's own Screens helper, and saves day and night PNGs. `boards.mjs` lays them out into the SVG boards. Nothing in the app folders is changed.
