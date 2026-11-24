# Selam Village — ሰላም ቪሌጅ

Website for **Selam Village**, a traditional Ethiopian restaurant and catering company established in 1983.

- Bilingual: English / Amharic (toggle in the header, choice is remembered)
- Location: Giorgis, next to Addis Ababa Restaurant, Addis Ababa
- Separate short pages: `index.html` (home), `story.html`, `menu.html`, `garden.html` (garden & in-house events), `catering.html` (clickable packages that open a pre-filled booking form), `contact.html` (address, hours, map)
- Ox-skull logo (`images/logo-mark.svg`; the round "Since 1983 · ከ1983 ጀምሮ" emblem is inline SVG in each page)
- Food photos from Wikimedia Commons (free licences, credited under **Photo credits** in every page footer)
- Pure HTML/CSS/JS — no build step. Open `index.html` or host on GitHub Pages.

## Before going live — replace placeholders
- Phone number in `contact.html`
- A real garden photo at `images/garden.jpg` (see `images/README.md`)
- `CATERING_EMAIL` in `script.js` and the email link in `contact.html`
- Google Maps embed currently points to Addis Ababa Restaurant, Giorgis — swap for Selam Village's own pin once listed

## Files
- `*.html` — one file per page (English text; header/footer are repeated in each page, so edit nav links in all of them)
- `i18n.js` — Amharic translations keyed by `data-i18n`
- `styles.css` — design
- `script.js` — language toggle, nav, menu tabs, form
