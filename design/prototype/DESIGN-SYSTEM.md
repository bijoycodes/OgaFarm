# OgaFarm design system

Made with the **UI/UX Pro Max** skill (`.claude/skills/ui-ux-pro-max`). Query used:
`"agriculture farm marketplace organic fresh produce" --design-system --variance 4 --motion 3 --density 5`.
Every version of the prototype (`versions/v1-mvp`, `v2-…`) follows these rules. Tokens live in `src/shared/styles/tokens.css`.

## Direction
| | Skill recommendation | What we use | Why |
|---|---|---|---|
| Style | Organic Biophilic | Same | Nature, rounded, earthy; fits a farm marketplace |
| Pattern | Feature-Rich Showcase | Landing: hero → features → roles → fresh produce → how it works → markets and jobs → closing call to action | Skill pattern; we use a trust feature grid instead of testimonials (no invented reviews) |
| Palette | Agriculture: earth green #15803D + harvest gold #A16207 | Same family, **softened** (below) | Client asked for soft colours |
| Type | Lora + Raleway | **Lora** headings + **Nunito Sans** body | Raleway's old-style numbers make prices hard to read; Nunito Sans is the body font of the skill's "Soft Rounded" pairing |
| Icons | Phosphor (`@phosphor-icons/react`) | Same, regular weight | Skill default; one consistent family |
| Motion | Subtle (300–400 ms fade, small rise) | One 320 ms screen fade, 150 ms press feedback | Low bandwidth; switched off for reduced motion |
| Density | Standard | 4/8 px spacing scale, 44–48 px touch targets | Mobile-first |

## Colour (light; dark pairs in tokens.css)
| Role | Token | Hex | Contrast note |
|---|---|---|---|
| Primary (buttons, active) | `--primary` | #2D7A4E | White text 5.3:1 |
| Primary text | `--primary-ink` | #22603D | 7:1 on white |
| Primary soft (selected, chips) | `--primary-soft` | #E5F2E9 | |
| Leaf (decoration only) | `--leaf` | #7CC08F | Never for text |
| Harvest gold (highlights) | `--harvest-fill` | #E9BE6B | Dark text on it |
| Harvest text | `--harvest` | #A16207 | From the skill palette |
| Background | `--bg` | #F5FAF6 | |
| Text | `--ink` | #173D2A | 12:1 |
| Muted text | `--muted` | #536A5D | 5.6:1 on background |
| Success / warning / danger / info | `--ok` `--warn` `--danger` `--info` | soft fills, dark text | Each pair ≥ 4.5:1, always with an icon or word |

## Light and dark mode
- The toolbar has a theme switch: **Match device** (default), **Light** and **Dark**. The choice is remembered on that browser.
- Dark mode uses its own softened colours (in `tokens.css`), not inverted ones, and every text pair is checked for contrast.
- **Inside the product:** a day/night button (moon in day mode, sun in night mode) sits in the public header and in the signed-in top bar next to notifications. It follows the device until tapped, then remembers the choice.
- The production apps should also offer all three options (Match device, Light, Dark) in account settings.

## Shape and elevation
- Radius (reduced on client feedback): 6 / 8 / 12 px (`--r-sm/md/lg`). Buttons, inputs, chips, tabs and nav links use 8 px (`--r-ctl`), not pills. Only avatars and dots are round.
- Organic blob shapes behind the hero, storefront cover, sign-in pages, empty states and photo placeholders.
- Shadows: three soft levels (`--shadow-1/2/3`), green-tinted.

## Rules we checked (skill pre-delivery list)
- No emoji as icons; one icon family; decorative icons hidden from screen readers.
- Text contrast ≥ 4.5:1 in light and dark; colour never the only signal.
- Visible focus ring (harvest gold), skip link, focus moves to the new screen after navigation.
- Touch targets ≥ 44 px, 8 px+ gaps, press feedback within 150 ms.
- Visible labels, required markers, autofill hints, email and phone keyboards, error under the field, error summary after a failed submit.
- Toasts announced politely to screen readers and dismissed after a few seconds.
- Bottom tabs ≤ 5 with labels and a clear active state; sidebar on wide screens.
- Skeletons for loading, helpful empty states with an action, errors with a way to retry.
- No horizontal scroll at 375 px; prices and codes use tabular numbers.
