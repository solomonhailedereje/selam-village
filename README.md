# Selam Village — ሰላም ቪሌጅ

Website for **Selam Village**, a traditional Ethiopian restaurant and catering company established in 1983.

- Bilingual: English / Amharic (toggle in the header, choice is remembered)
- Location: Giorgis, next to Addis Ababa Restaurant, Addis Ababa
- Sections: Story & timeline, menu (ox & goat — tire siga, tibs, dulet; vegetarian & vegan; bar & coffee), garden & in-house events, photo gallery, catering + event inquiry form, hours, map
- Pure HTML/CSS/JS — no build step. Open `index.html` or host on GitHub Pages.

## Before going live — replace placeholders
- Phone number in `index.html` (Visit section)
- Gallery photos in `images/` (see `images/README.md`)
- `CATERING_EMAIL` in `script.js` and the email link in `index.html`
- Opening hours
- Google Maps embed currently points to Addis Ababa Restaurant, Giorgis — swap for Selam Village's own pin once listed

## Files
- `index.html` — page structure (English text)
- `i18n.js` — Amharic translations keyed by `data-i18n`
- `styles.css` — design
- `script.js` — language toggle, nav, menu tabs, form
