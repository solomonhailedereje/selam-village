# Selam Village — ሰላም ቪሌጅ

Website for **Selam Village**, a traditional Ethiopian restaurant and catering company established in 1983.

- Bilingual: English / Amharic (toggle in the header, choice is remembered)
- Sections: Story & timeline, menu (meats, fasting/vegan, breakfast, coffee & drinks), dine-in experience, catering packages + inquiry form, hours, map
- Pure HTML/CSS/JS — no build step. Open `index.html` or host on GitHub Pages.

## Before going live — replace placeholders
- Address and phone in `index.html` (Visit section) and `contact.addrV` in `i18n.js`
- `CATERING_EMAIL` in `script.js` and the email link in `index.html`
- Opening hours
- Google Maps embed/directions query (use the exact place name or address)

## Files
- `index.html` — page structure (English text)
- `i18n.js` — Amharic translations keyed by `data-i18n`
- `styles.css` — design
- `script.js` — language toggle, nav, menu tabs, form
