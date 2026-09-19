# Cutting Lyne — website

Static marketing site for Cutting Lyne, a freight forwarding and customs
brokerage. No build step: open `index.html`, or serve the folder with any static
web server.

```bash
python -m http.server 8811     # then http://localhost:8811
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero slider, services, tracking, network, testimonials, insights |
| `about.html` | Company story, commitments, timeline, network (`#network`) |
| `services.html` | All six services, each with its own anchor (`#sea`, `#air`, `#road`, `#warehouse`, `#customs`, `#project`) + FAQ |
| `service-sea-freight.html` | Service-detail template — copy it for the other five |
| `tracking.html` | Shipment lookup and the published milestone set |
| `contact.html` | Quote request form and direct desk numbers |

## Structure

```
css/style.css      design tokens, reset, typography, buttons, brand mark
css/nav.css        top bar, navigation, mobile drawer, hero + page hero
css/sections.css   every section component (cards, marquee, stats, FAQ, footer)
js/main.js         drawer, sliders, counters, reveals, FAQ, forms, tracking
assets/img/        photography and the logo
assets/video/      road haulage footage used on services.html
```

Navigation and footer markup are duplicated in each page rather than injected by
JavaScript, so the pages work with scripting off and index cleanly. When you
change a nav item, change it in all six files.

### Containers

Three containers control horizontal rhythm. Use one of them — don't hand-roll
padding, or things stop lining up on wide screens.

| Class | Max width | Where |
|---|---|---|
| `.shell` | 1440px | ordinary sections |
| `.shell-wide` | 1660px | full-bleed panels and the CTA band |
| `.hero-shell` | 1440px | **everything inside a hero frame** — nav, headline, stat rail |

The hero is a rounded card inset from the viewport by `--hero-inset` (0 on
phones so it goes full-bleed, 16px from 768px up). `.hero-shell` subtracts that
inset from `--gutter`, so its edges land on exactly the same x as `.shell` at
every viewport width — the logo, the headline and the sections below all share
one left edge. Put a new hero element in `.hero-shell` and it will line up.

Note that `.nav-wrap` is absolutely positioned against the *padding box* of
`.hero`, which includes the padding, so it sets `left`/`right` to
`var(--hero-inset)` explicitly rather than `0`.

## Brand

Colours are taken from the logo and set as custom properties at the top of
`css/style.css`:

| Token | Value | Use |
|---|---|---|
| `--forest` | `#245633` | primary — from the logo mark |
| `--forest-900` | `#0C2114` | dark sections, footer, top bar |
| `--mint` | `#6BF09F` | accent, highlights, icons on dark |
| `--ink` | `#0B0F0C` | body text |
| `--mist` | `#F1F4F2` | page background between white sections |

Type is Plus Jakarta Sans (Google Fonts) with a system fallback stack.

### Type scale

Two ratios, all declared as tokens at the top of `css/style.css`. Never
hard-code a `font-size` in a component — use a token, so the scale stays
consistent.

| Token | Desktop | Role | Line-height | Tracking |
|---|---|---|---|---|
| `--fs-display` | 78px | hero headline | .98 | -.042em |
| `--fs-h1` | 62px | page hero headline | 1.0 | -.038em |
| `--fs-h2` | 49px | section heading | 1.06 | -.032em |
| `--fs-statement` | 40px | big pull statement | 1.2 | -.028em |
| `--fs-h3` | 29px | sub-heading | 1.2 | -.024em |
| `--fs-h4` | 21px | card title | 1.32 | -.016em |
| `--fs-lg` | 20px | lead paragraph | 1.55 | -.011em |
| `--fs-base` | 17px | body | 1.6 | normal |
| `--fs-md` | 16px | card body, form controls | 1.6 | normal |
| `--fs-sm` | 15px | captions, fine print | 1.66 | normal |
| `--fs-2xs` | 13px | top bar, meta, nav | — | +.07em |
| `--fs-micro` | 12px | eyebrows, field labels | — | +.16em |

Display sizes step by roughly 1.26 so headlines separate hard; text sizes step
by roughly 1.18 so body and UI stay tight. Display-to-body lands at 4.6:1,
which is the editorial range — body is 17px rather than 16px, because 16px
reads as browser-default.

Three rules worth keeping if you extend this:

- **Line-height tightens as size grows** (.98 at 78px, 1.6 at 17px).
- **Tracking scales inversely** — display type needs it negative, all-caps
  micro type needs it open. Do not put a negative `letter-spacing` on `body`:
  an `em` value computes to px where it is declared and then inherits as px,
  so it lands proportionally heavier on 15px text than on 17px.
- **Form controls stay at 16px minimum.** Anything smaller makes iOS Safari
  zoom the page when the field takes focus.

The logo mark is inline SVG (`#i-mark` in each page's sprite). It takes its two
colours from `--mark-a` and `--mark-b`, so `.brand--light` recolours it for dark
backgrounds without a second asset.

## Before going live

1. **Replace the photography.** Every image in `assets/img/` is an iStock
   *preview* and carries a visible watermark. Swap in the licensed originals
   under the same filenames and nothing else needs to change.
2. **Wire the forms.** The contact and newsletter forms are front-end only —
   they show a confirmation and reset. Point them at your handler
   (`data-demo-form` in `js/main.js`).
3. **Wire tracking.** `#track-form` in `js/main.js` derives a demo milestone
   from the reference string. Replace that handler with a call to your TMS or
   carrier API.
4. **Fill in the placeholders.** Address, phone numbers, email and the partner
   logo strip on the home page are illustrative.
5. Add `favicon.ico`, an OG image, and `sitemap.xml` / `robots.txt`.

## Accessibility notes

Skip link on every page, visible focus rings, `prefers-reduced-motion` honoured
for reveals and marquees, and no horizontal overflow down to 320px.
