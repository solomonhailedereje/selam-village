# Selam Village — ሰላም ቪሌጅ

Website for **Selam Village**, a traditional Ethiopian restaurant and catering company established in 1983 E.C. (1991 G.C.) as Selam Butchery & Grocery.

- Bilingual: English / Amharic (toggle in the header, choice is remembered). In Amharic, years use the Ethiopian calendar and booking forms show an Ethiopian-calendar date picker (dates are converted to Gregorian in the email)
- Location: Giorgis, next to Addis Ababa Restaurant, Addis Ababa
- Separate short pages: `index.html` (home), `story.html`, `menu.html`, `garden.html` (garden & in-house events), `rooms.html` (guest rooms + booking request form), `catering.html` (clickable packages that open a pre-filled booking form). Address, phone, email, opening hours and directions are in the footer of every page; the map is at the end of the home page.
- Ox-skull logo (`images/logo-mark.svg`; the round "Since 1983 · ከ1983 ጀምሮ" emblem is inline SVG in each page)
- Food photos from Wikimedia Commons (free licences, credited under **Photo credits** in every page footer)
- Pure HTML/CSS/JS — no build step. Open `index.html` or host on GitHub Pages.

## Before going live — replace placeholders
- Phone number in the footer of each page
- A real garden photo at `images/garden.jpg` and a room photo at `images/rooms.jpg` (see `images/README.md`)
- The year Selam Butchery & Grocery 2 opened (story timeline shows "Expansion"), room amenities and the vegetarian dishes on the menu — confirm they match what Selam Village really offers
- `CATERING_EMAIL` in `script.js` and the email link in the footer of each page
- Google Maps embed and directions search for "Selam Village, Addis Ababa"; if Google shows the wrong place, replace with the exact share link or coordinates

## Files
- `*.html` — one file per page (English text; header/footer are repeated in each page, so edit nav links in all of them)
- `i18n.js` — Amharic translations keyed by `data-i18n`
- `styles.css` — design
- `script.js` — language toggle, nav, menu tabs, form
