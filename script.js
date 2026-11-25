(() => {
  document.documentElement.classList.add("js");
  // Paste the Google Apps Script web-app URL here (see google-sheet/SETUP.md).
  // While it is empty, forms fall back to opening the visitor's email app.
  const SHEET_URL = "";
  const BOOKING_EMAIL = "info@selamvillage.com"; // fallback only

  /* ================= Ethiopian calendar ================= */
  const ET_MONTHS = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"];
  const ET_EPOCH = 1723856;
  const fl = Math.floor;
  const ethToJdn = (y, m, d) => ET_EPOCH + 365 + 365 * (y - 1) + fl(y / 4) + 30 * m + d - 31;
  const jdnToEth = j => {
    const r = (j - ET_EPOCH) % 1461, n = (r % 365) + 365 * fl(r / 1460);
    return { y: 4 * fl((j - ET_EPOCH) / 1461) + fl(r / 365) - fl(r / 1460), m: fl(n / 30) + 1, d: (n % 30) + 1 };
  };
  const gregToJdn = (y, m, d) => {
    const a = fl((14 - m) / 12), y2 = y + 4800 - a, m2 = m + 12 * a - 3;
    return d + fl((153 * m2 + 2) / 5) + 365 * y2 + fl(y2 / 4) - fl(y2 / 100) + fl(y2 / 400) - 32045;
  };
  const jdnToGreg = j => {
    const a = j + 32044, b = fl((4 * a + 3) / 146097), c = a - fl(146097 * b / 4);
    const d = fl((4 * c + 3) / 1461), e = c - fl(1461 * d / 4), m = fl((5 * e + 2) / 153);
    return { y: 100 * b + d - 4800 + fl(m / 10), m: m + 3 - 12 * fl(m / 10), d: e - fl((153 * m + 2) / 5) + 1 };
  };
  const pad = n => String(n).padStart(2, "0");
  const isoToEth = iso => { const [y, m, d] = iso.split("-").map(Number); return jdnToEth(gregToJdn(y, m, d)); };
  const ethToIso = (y, m, d) => { const g = jdnToGreg(ethToJdn(y, m, d)); return `${g.y}-${pad(g.m)}-${pad(g.d)}`; };
  const ethLabel = e => `${ET_MONTHS[e.m - 1]} ${e.d}, ${e.y} ዓ.ም.`;
  const pagumeDays = y => (y % 4 === 3 ? 6 : 5);

  /* Each date field gets an Ethiopian day / month / year picker shown in Amharic mode */
  const datePickers = [];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    const todayEth = isoToEth(new Date().toISOString().slice(0, 10));
    const wrap = document.createElement("div");
    wrap.className = "et-date";
    wrap.hidden = true;
    const mk = (name, opts) => {
      const s = document.createElement("select");
      s.setAttribute("aria-label", name);
      s.innerHTML = `<option value="">${name}</option>` + opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
      wrap.appendChild(s);
      return s;
    };
    const day = mk("ቀን", Array.from({ length: 30 }, (_, i) => [i + 1, i + 1]));
    const month = mk("ወር", ET_MONTHS.map((n, i) => [i + 1, n]));
    const year = mk("ዓ.ም.", [0, 1, 2].map(k => [todayEth.y + k, todayEth.y + k]));
    input.after(wrap);
    const syncToInput = () => {
      const y = +year.value, m = +month.value;
      let d = +day.value;
      if (m === 13 && d > pagumeDays(y || todayEth.y)) { d = pagumeDays(y || todayEth.y); day.value = d; }
      input.value = y && m && d ? ethToIso(y, m, d) : "";
      wrap.classList.remove("invalid");
    };
    [day, month, year].forEach(s => s.addEventListener("change", syncToInput));
    const syncFromInput = () => {
      if (!input.value) return;
      const e = isoToEth(input.value);
      if (![...year.options].some(o => +o.value === e.y)) year.add(new Option(e.y, e.y));
      day.value = e.d; month.value = e.m; year.value = e.y;
    };
    datePickers.push({ input, wrap, syncFromInput });
  });

  /* ================= Language ================= */
  const nodes = document.querySelectorAll("[data-i18n]");
  const EN = { ...window.SELAM_EN_EXTRA };
  nodes.forEach(n => { if (n.textContent.trim()) EN[n.dataset.i18n] = n.textContent; });
  const AM = window.SELAM_AM || {};
  let lang = "en";
  const t = key => (lang === "am" ? AM[key] : EN[key]) ?? EN[key] ?? key;

  function setLang(next) {
    lang = next === "am" ? "am" : "en";
    document.documentElement.lang = lang;
    nodes.forEach(n => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll(".lang-toggle button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    datePickers.forEach(p => {
      const am = lang === "am";
      p.wrap.hidden = !am;
      p.input.hidden = am;
      if (am) p.syncFromInput();
    });
    document.querySelectorAll(".form-status").forEach(s => { if (s.dataset.key) s.textContent = t(s.dataset.key); });
    try { localStorage.setItem("selam-lang", lang); } catch (_) {}
  }
  document.querySelectorAll(".lang-toggle button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  let saved = null;
  try { saved = localStorage.getItem("selam-lang"); } catch (_) {}
  setLang(saved === "am" ? "am" : "en");

  /* ================= Nav ================= */
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => { burger.classList.toggle("open"); links.classList.toggle("open"); });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    burger.classList.remove("open"); links.classList.remove("open");
  }));

  /* ================= Menu tabs ================= */
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("active", x === tab));
    document.querySelectorAll(".menu-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === tab.dataset.tab));
  }));

  /* ================= Reveal on scroll ================= */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ================= Choice cards → pre-filled form ================= */
  // Catering packages: [data-pkg] → #inquire select "pkg"; rooms: [data-room] → #roomForm select "room"
  const choosers = [
    { attr: "pkg", formId: "inquire", field: "pkg", param: "pkg" },
    { attr: "room", formId: "roomForm", field: "room", param: "room" },
  ];
  choosers.forEach(({ attr, formId, field, param }) => {
    const form = document.getElementById(formId);
    if (!form) return;
    const cards = document.querySelectorAll(`[data-${attr}]`);
    const choose = (value, scroll) => {
      const sel = form.elements[field];
      if (sel && [...sel.options].some(o => o.value === value)) sel.value = value;
      if (attr === "pkg") {
        if (value === "inhouse" && form.elements.where.value === "there") form.elements.where.value = "garden";
        if (value === "wedding") form.elements.type.value = "wedding";
        if (value === "corporate") form.elements.type.value = "corporate";
      }
      cards.forEach(c => c.classList.toggle("chosen", c.dataset[attr] === value));
      form.classList.remove("flash"); void form.offsetWidth; form.classList.add("flash");
      if (scroll) form.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => form.elements.name.focus({ preventScroll: true }), scroll ? 650 : 0);
    };
    cards.forEach(card => {
      card.addEventListener("click", () => choose(card.dataset[attr], true));
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(card.dataset[attr], true); }
      });
    });
    const fromUrl = new URLSearchParams(location.search).get(param);
    if (fromUrl) choose(fromUrl, false);
  });

  /* ================= Booking forms → Google Sheet + email ================= */
  // Column names in the sheet are always English, whatever language the visitor uses
  const FIELD_LABELS = {
    pkg: "Package", room: "Room", where: "Where", type: "Event type", name: "Name", phone: "Phone",
    email: "Email", date: "Event date", checkin: "Check in", checkout: "Check out",
    guests: "Guests", rooms: "Rooms", msg: "Message",
  };
  document.querySelectorAll("form.booking-form").forEach(form => {
    const status = form.querySelector(".form-status");
    const button = form.querySelector('[type="submit"]');
    const say = (key, isError) => {
      status.classList.toggle("error", !!isError);
      status.dataset.key = key;
      status.textContent = t(key);
    };
    form.addEventListener("submit", async e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach(f => {
        const bad = !f.value.trim();
        f.classList.toggle("invalid", bad);
        const et = f.nextElementSibling;
        if (et && et.classList.contains("et-date")) et.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return say("form.err", true);

      const valueOf = (el, english) => {
        if (el.tagName === "SELECT") {
          const opt = el.options[el.selectedIndex];
          return english ? (EN[opt.dataset.i18n] || opt.text) : opt.text;
        }
        if (el.type === "date" && el.value) return `${el.value} (${ethLabel(isoToEth(el.value))})`;
        return el.value.trim();
      };
      const fields = [];
      [...form.elements].forEach(el => {
        if (!el.name || el.type === "submit" || el.name === "website") return;
        fields.push([FIELD_LABELS[el.name] || el.name, valueOf(el, true) || "-"]);
      });
      fields.push(["Language", lang === "am" ? "Amharic" : "English"]);
      const summaryNames = (form.dataset.subjectFields || "").split(",").filter(Boolean);
      const summary = [form.elements.name.value.trim(), ...summaryNames.map(n => valueOf(form.elements[n], true))].join(" | ");

      if (!SHEET_URL) {
        // Fallback: open the visitor's email app
        const subject = (form.dataset.subject || "Booking request") + " | " + summary;
        const body = fields.map(([k, v]) => `${k}: ${v}`).join("\n");
        say("form.ok");
        window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return;
      }
      button.disabled = true;
      say("form.sending");
      try {
        await fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            form: form.id === "roomForm" ? "Rooms" : "Catering",
            summary, fields,
            website: form.elements.website ? form.elements.website.value : "",
          }),
        });
        say("form.sent");
        form.reset();
        form.querySelectorAll(".et-date select").forEach(sel => { sel.value = ""; });
        document.querySelectorAll(".pkg.chosen").forEach(c => c.classList.remove("chosen"));
      } catch (_) {
        say("form.fail", true);
      } finally {
        button.disabled = false;
      }
    });
  });
})();
