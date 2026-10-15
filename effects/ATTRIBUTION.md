# Component provenance

Integrated into the Shuwei-Goat profile demonstration, 2026-10-15.

## React Bits

- Upstream: https://github.com/DavidHDev/react-bits
- Inspected commit: `43591e8b3fa327d45633b4e8239ff6742ef706ef`
- Files: `src/content/Components/{ProfileCard,GlassSurface,CircularGallery}/` (JSX and CSS).
- Changes to vendor files: added the default React import for this build's JSX runtime. Component behaviour otherwise retained.
- Brand integration: `src/main.jsx`, `src/style.css` and the existing, unchanged Shuwei-Goat logo.
- License: MIT + Commons Clause; full upstream notice retained in `LICENSE.react-bits.md` and the published site.
- The website uses the components as part of a complete application. No standalone component bundle is sold.

## Summary Cards

- Upstream: https://github.com/vn7n24fzkq/github-profile-summary-cards
- Inspected commit: `c5807b007a99953f06e323a463723e52dd4aed9f`
- Official hosted SVG API; exact requests recorded in the root `sources.json`.
- Public data only; profile privacy can cause zero counts in public responses.

## Capsule Render

- Upstream: https://github.com/kyechan99/capsule-render
- Inspected commit: `6c2880021a33de34d6f894a36639d7eb1ac05ae6`
- Official hosted SVG API; exact requests recorded in the root `sources.json`.
- Styles: waving, rounded and blur. No upstream source code copied.
