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

// Send the customer an automatic "we received your request" email (true / false)
const SEND_CONFIRMATION = true;
const BUSINESS_PHONE = "+251 95 831 2525";

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

    // Confirmation email to the customer
    if (SEND_CONFIRMATION && customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      try { sendConfirmation_(data, fields, customerEmail, to); } catch (err) { console.error(err); }
    }

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

// "We received your request" email to the customer, in the language they used on the website
function sendConfirmation_(data, fields, customerEmail, replyTo) {
  const am = data.lang === "am";
  const rooms = data.form === "Rooms";
  const name = (fields.find(f => f[0] === "Name") || [, ""])[1];
  const shown = Array.isArray(data.shown) && data.shown.length
    ? data.shown
    : fields.filter(f => f[0] !== "Language" && f[1] && f[1] !== "-");

  const T = am ? {
    subject: rooms ? "ሰላም ቪሌጅ፤ የክፍል ጥያቄዎ ደርሶናል" : "ሰላም ቪሌጅ፤ የዝግጅት ጥያቄዎ ደርሶናል",
    hello: "ጤና ይስጥልኝ " + name + "፣",
    intro: "ሰላም ቪሌጅን ስለመረጡ እናመሰግናለን። ጥያቄዎ ደርሶናል። ቦታውን ለማረጋገጥ በቅርቡ እንደውልልዎታለን።",
    note: "ማሳሰቢያ፤ ይህ ኢሜይል ጥያቄዎ እንደደረሰን ብቻ ያሳያል። ቦታ የሚያዘው በስልክ ስናረጋግጥልዎ ነው።",
    details: "የላኩልን መረጃ",
    contact: "ለማንኛውም ጥያቄ ይደውሉልን፤ " + BUSINESS_PHONE,
    address: "ጊዮርጊስ፣ ከውቤ በረሃ አፓርትመንት አጠገብ፣ አዲስ አበባ",
    bye: "ከሰላምታ ጋር፣\nሰላም ቪሌጅ",
  } : {
    subject: rooms ? "Selam Village: we received your room request" : "Selam Village: we received your event request",
    hello: "Dear " + name + ",",
    intro: "Thank you for choosing Selam Village. We have received your request and will call you shortly to confirm availability.",
    note: "Please note: this email confirms that we received your request. Your booking is confirmed once we call you.",
    details: "Your request",
    contact: "Questions? Call us on " + BUSINESS_PHONE,
    address: "Giorgis, next to Wube Berha Apartment, Addis Ababa",
    bye: "Warm regards,\nSelam Village",
  };

  const esc = v => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = shown.map(([k, v]) =>
    '<tr><td style="padding:8px 12px 8px 0;color:#666;vertical-align:top;white-space:nowrap">' + esc(k) +
    '</td><td style="padding:8px 0;color:#1b1b1b">' + esc(v).replace(/\n/g, "<br>") + "</td></tr>").join("");
  const html =
    '<div style="font-family:Arial,\'Noto Sans Ethiopic\',sans-serif;max-width:560px;margin:0 auto;color:#1b1b1b">' +
    '<div style="background:#8a0303;color:#fff;padding:20px 24px;font-size:20px;font-weight:bold">' + (am ? "ሰላም ቪሌጅ" : "Selam Village") + "</div>" +
    '<div style="padding:24px;border:1px solid #e5e5e5;border-top:0">' +
    "<p>" + esc(T.hello) + "</p><p>" + esc(T.intro) + "</p>" +
    '<h3 style="margin:24px 0 8px;font-size:16px;color:#8a0303">' + esc(T.details) + "</h3>" +
    '<table style="border-collapse:collapse;font-size:14px;width:100%">' + rows + "</table>" +
    '<p style="margin-top:24px;padding:12px;background:#f7e8e8;font-size:13px">' + esc(T.note) + "</p>" +
    "<p>" + esc(T.contact) + "<br>" + esc(T.address) + "</p>" +
    "<p>" + esc(T.bye).replace(/\n/g, "<br>") + "</p></div></div>";
  const body = [T.hello, "", T.intro, "", T.details + ":", ...shown.map(([k, v]) => k + ": " + v), "",
    T.note, "", T.contact, T.address, "", T.bye].join("\n");

  MailApp.sendEmail({
    to: customerEmail, subject: T.subject, body: body, htmlBody: html,
    name: am ? "ሰላም ቪሌጅ" : "Selam Village", replyTo: replyTo,
  });
}
