# Bookings → Google Sheet + email (one-time setup, about 5 minutes)

Every catering / event / room booking from the website will be saved as a row in a
Google Sheet, and you will get an email for each one.

## 1. Create the sheet
1. Go to https://sheets.google.com with the Google account that should receive the bookings.
2. Create a **blank spreadsheet** and name it **Selam Village bookings**.

## 2. Add the script
1. In the sheet, open **Extensions → Apps Script**.
2. Delete everything in the editor and paste the whole content of `google-sheet/Code.gs`.
3. (Optional) To send the emails to a different address, put it inside the quotes on the
   `NOTIFY_EMAIL` line. Leave it empty to use the sheet owner's Gmail.
4. Click the **Save** icon.

## 3. Publish it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy**, then **Authorize access**, choose your Google account.
   Google shows "Google hasn't verified this app" → **Advanced → Go to … (unsafe)** → **Allow**.
   (This is normal for your own script: it only lets the script add rows to your sheet and send you emails.)
5. Copy the **Web app URL** (it starts with `https://script.google.com/macros/s/…/exec`).

## 4. Connect the website
Paste that URL between the quotes on this line in `script.js`:

```js
const SHEET_URL = "";
```

(or send it to whoever maintains the site). Push the change to GitHub.

## Confirmation email to the customer
Every customer automatically gets a "we received your request" email, in the language they used
on the website (English or Amharic), listing what they filled in and saying you will call to confirm.
- It is sent from the Gmail account that owns the sheet, with the name "Selam Village".
  If the customer presses Reply, it goes to `NOTIFY_EMAIL` (or the sheet owner).
- To turn it off, set `SEND_CONFIRMATION = false` in the script.
- A free Gmail account can send about 100 emails a day this way, which is plenty.

## Checking bookings
- **Email:** one email per booking, subject "New event / catering booking: …" or
  "New room booking: …". Press **Reply** to answer the customer directly (if they gave an email).
- **Sheet:** two tabs are created automatically, **Event & catering bookings** and **Room bookings**.
  Each row starts with **Received** (date/time) and **Status** = `New`; change the status to
  `Called`, `Confirmed`, `Cancelled` etc. as you follow up.
- Install the **Google Sheets** app on your phone to check bookings anywhere.

## If you edit the script later
Use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy** so the
same URL keeps working.
