/**
 * Selam Village — booking forms → Google Sheet + email notification
 *
 * Paste this whole file into the Google Sheet's Extensions → Apps Script editor,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Full steps: google-sheet/SETUP.md
 */

// Who gets the notification emails. Leave empty to use the Google account that owns this sheet.
// To notify several people, separate addresses with commas: "a@gmail.com,b@gmail.com"
const NOTIFY_EMAIL = "";

const SHEET_NAMES = {
  Catering: "Event & catering bookings",
  Rooms: "Room bookings",
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return json_({ ok: true }); // spam trap filled in → ignore silently

    const fields = Array.isArray(data.fields) ? data.fields : [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = SHEET_NAMES[data.form] || "Other requests";
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    // Header row: Received, Status, then one column per form field (added automatically)
    let headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(String)
      : [];
    if (headers.length === 0) headers = ["Received", "Status"];
    fields.forEach(([label]) => { if (!headers.includes(label)) headers.push(label); });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);

    const valueOf = label => { const f = fields.find(x => x[0] === label); return f ? f[1] : ""; };
    const row = headers.map(h => h === "Received" ? new Date() : h === "Status" ? "New" : valueOf(h));
    sheet.appendRow(row);

    // Email notification
    const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    const kind = data.form === "Rooms" ? "room booking" : "event / catering booking";
    const subject = "New " + kind + (data.summary ? ": " + data.summary : "");
    const body = "A new " + kind + " was sent from the Selam Village website.\n\n" +
      fields.map(([k, v]) => k + ": " + v).join("\n") +
      "\n\nAll bookings: " + ss.getUrl() + "#gid=" + sheet.getSheetId();
    const options = { to: to, subject: subject, body: body, name: "Selam Village website" };
    const customerEmail = valueOf("Email");
    if (customerEmail && /@/.test(customerEmail)) options.replyTo = customerEmail;
    MailApp.sendEmail(options);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web-app URL in a browser to check it is running
function doGet() {
  return json_({ ok: true, message: "Selam Village booking endpoint is running." });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
