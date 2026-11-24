# Selam Village — ሰላም ቪሌጅ

Website for **Selam Village**, a traditional Ethiopian restaurant and catering company established in 1983.

- Bilingual: English / Amharic (toggle in the header, choice is remembered)
- Location: Giorgis, next to Addis Ababa Restaurant, Addis Ababa
- Separate short pages: `index.html` (home), `story.html`, `menu.html`, `garden.html` (garden & in-house events), `gallery.html`, `catering.html` (packages + inquiry form), `contact.html` (address, hours, map)
- Food photos from Wikimedia Commons (free licences, credited on the gallery page)
- Pure HTML/CSS/JS — no build step. Open `index.html` or host on GitHub Pages.

## Before going live — replace placeholders
- Phone number in `index.html` (Visit section)
- A real garden photo at `images/garden.jpg` (see `images/README.md`)
- `CATERING_EMAIL` in `script.js` and the email link in `index.html`

- Google Maps embed currently points to Addis Ababa Restaurant, Giorgis — swap for Selam Village's own pin once listed

## Files
- `*.html` — one file per page (English text; header/footer are repeated in each page, so edit nav links in all of them)
- `i18n.js` — Amharic translations keyed by `data-i18n`
- `styles.css` — design
- `script.js` — language toggle, nav, menu tabs, form
