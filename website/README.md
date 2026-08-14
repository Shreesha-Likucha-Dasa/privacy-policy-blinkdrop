# BlinkDrop — Public Marketing Website

A static, single-page marketing site for the BlinkDrop Android app. It is fully
independent from the BlinkDrop local file-transfer server and needs no backend.

## Structure

```
website/
├── index.html          Landing page (single page, anchor sections)
├── privacy.html        Privacy policy (restyled to match)
├── css/styles.css      All styling (system fonts, no external requests)
├── js/main.js          Nav, mobile menu, scroll reveal, demo, toggle (vanilla JS)
└── assets/img/         Optimized WebP screenshots, icon, demo video, og image
```

## Run locally

Any static file server works:

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` in a browser.

## Design notes

- **Brand** uses the real BlinkDrop colors (dark `#070a0f`, blue `#58a6ff`) and
  the real app icon / lightning-bolt mark.
- **Images** are real captures of the current app (phone screenshots) and the
  real browser web UI, resized and converted to WebP. Originals live in
  `store-assets/`.
- **No external dependencies**: system font stack, inline SVG icons, no
  analytics, no trackers, no CDN. This keeps load fast and matches the
  product's privacy story.
- **Accessibility**: skip link, semantic landmarks, keyboard-friendly FAQ
  (`<details>`), focus styles, `prefers-reduced-motion` support.

## Before publishing — TODO

1. **Google Play URL.** Every "Get BlinkDrop" button and the Google Play footer
   link currently point to
   `https://play.google.com/store/apps/details?id=com.shreesha.blinkdrop`
   (the canonical URL derived from the real package name). Verify it resolves to
   your live listing once published, or replace it with the final listing URL.
2. **Domain / canonical.** Replace the `https://blinkdrop.app/` canonical and
   Open Graph URLs with the real domain you deploy to.
3. **Contact email.** The footer and privacy policy use
   `shreeshaIbhat@gmail.com` (from the existing privacy policy). Confirm this is
   the address you want public.
4. **Terms of Service.** There is no ToS page yet, so the site intentionally
   does not link one. Add `terms.html` and a footer link when it exists.
5. **`og-image.png`** is generated from current screenshots; regenerate it if
   the product screenshots change.
6. **Structured data.** The JSON-LD includes a placeholder aggregate rating;
   remove it unless you have real Play Store ratings to mirror.

## Regenerating screenshots

The images in `assets/img/` are derived from `store-assets/`. To refresh them
after re-capturing the app:

```bash
# from the repo root
convert store-assets/screenshots/01_home.png -resize 560x -strip website/assets/img/01_home.webp
# (repeat for the other screenshots, or adjust quality/size as needed)
```
