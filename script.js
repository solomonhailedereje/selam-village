(() => {
  document.documentElement.classList.add("js");
  const CATERING_EMAIL = "info@selamvillage.com"; // TODO: replace with the real address

  /* ---------- Language ---------- */
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
    document.querySelectorAll(".lang-toggle button").forEach(b =>
      b.classList.toggle("active", b.dataset.lang === lang));
    try { localStorage.setItem("selam-lang", lang); } catch (_) {}
    const status = document.getElementById("formStatus");
    if (status && status.dataset.key) status.textContent = t(status.dataset.key);
  }

  document.querySelectorAll(".lang-toggle button").forEach(b =>
    b.addEventListener("click", () => setLang(b.dataset.lang)));

  let saved = null;
  try { saved = localStorage.getItem("selam-lang"); } catch (_) {}
  setLang(saved === "am" ? "am" : "en");

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  }));

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("active", x === tab));
    document.querySelectorAll(".menu-panel").forEach(p =>
      p.classList.toggle("active", p.dataset.panel === tab.dataset.tab));
  }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------- Catering form ---------- */
  const form = document.getElementById("inquire");
  const status = document.getElementById("formStatus");

  /* Package cards open the form with that package already chosen */
  function choosePackage(pkg, scroll) {
    if (!form) return;
    const sel = form.elements.pkg;
    if (sel && [...sel.options].some(o => o.value === pkg)) sel.value = pkg;
    if (pkg === "inhouse") form.elements.where.value = "here";
    if (pkg === "wedding") form.elements.type.value = "wedding";
    if (pkg === "corporate") form.elements.type.value = "corporate";
    document.querySelectorAll(".pkg").forEach(c => c.classList.toggle("chosen", c.dataset.pkg === pkg));
    form.classList.remove("flash"); void form.offsetWidth; form.classList.add("flash");
    if (scroll) form.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), scroll ? 650 : 0);
  }
  document.querySelectorAll(".pkg[data-pkg]").forEach(card => {
    card.addEventListener("click", () => choosePackage(card.dataset.pkg, true));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choosePackage(card.dataset.pkg, true); }
    });
  });
  const urlPkg = new URLSearchParams(location.search).get("pkg");
  if (urlPkg) choosePackage(urlPkg, false);
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(f => {
      const bad = !f.value.trim();
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    status.classList.toggle("error", !ok);
    status.dataset.key = ok ? "form.ok" : "form.err";
    status.textContent = t(status.dataset.key);
    if (!ok) return;

    const d = Object.fromEntries(new FormData(form));
    const label = name => { const el = form.elements[name]; return el.options[el.selectedIndex].text; };
    const body = [
      `Package: ${label("pkg")}`, `Where: ${label("where")}`,
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email || "-"}`,
      `Event date: ${d.date}`, `Guests: ${d.guests}`, `Event type: ${label("type")}`,
      "", d.msg || ""
    ].join("\n");
    window.location.href = `mailto:${CATERING_EMAIL}?subject=${encodeURIComponent("Booking request — " + label("pkg") + " — " + d.date)}&body=${encodeURIComponent(body)}`;
  });

})();
