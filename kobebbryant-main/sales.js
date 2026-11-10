// Sales parts: prices and founding spots from config.js, the Security Check
// request and the contact form (both open the visitor's email app via mailto:).
// The site never scans anything itself: the Security Check form is only a request.
// Each part only runs when its elements are on the current page.

(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const PLAN_LABELS = {
    check: "Free Security Check",
    workshop: "Workshop",
    basis: "Basis plan",
    plus: "Plus plan",
    complete: "Complete plan",
  };

  const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const formatPrice = (value) => (value == null ? "[price]" : euro.format(value));

  // ---------- Contact details ----------
  $$("[data-contact-email]").forEach((a) => {
    a.href = `mailto:${cfg.contactEmail}`;
    a.textContent = cfg.contactEmail;
  });

  // ---------- Founding spots ----------
  const { totalSpots, spotsLeft } = cfg.founding;
  $$("[data-spots-total]").forEach((el) => (el.textContent = totalSpots));
  $$("[data-spots-left]").forEach((el) => (el.textContent = spotsLeft));
  // Hide the founding offer once every spot is taken.
  $$("[data-founding-only]").forEach((el) => (el.hidden = spotsLeft <= 0));

  // ---------- Prices ----------
  const { plans, monthsPaidPerYear, workshop } = cfg.prices;
  $$("[data-price]").forEach((el) => {
    const key = el.dataset.price;
    el.textContent = formatPrice(key === "workshop" ? workshop : plans[key]);
  });
  // Yearly price = monthly price × monthsPaidPerYear
  $$("[data-price-year]").forEach((el) => {
    const monthly = plans[el.dataset.priceYear];
    el.textContent = formatPrice(monthly == null ? null : monthly * monthsPaidPerYear);
  });
  $$("[data-months-free]").forEach((el) => (el.textContent = 12 - monthsPaidPerYear));

  // ---------- Sending (shared by both forms) ----------
  function sendByEmail(subject, lines, status) {
    window.location.href =
      `mailto:${cfg.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    status.textContent = `Your email app should open now. If it doesn't, email us at ${cfg.contactEmail}.`;
  }

  // ---------- Free Security Check request ----------
  const checkForm = $("#security-check-form");
  if (checkForm) {
    checkForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!checkForm.reportValidity()) return;

      const data = Object.fromEntries(new FormData(checkForm));
      sendByEmail(`Free Security Check: ${data.website}`, [
        `Website: ${data.website}`,
        `Name: ${data.name || "-"}`,
        `Work email: ${data.email || "-"}`,
        `Platform: ${data.platform}`,
        "",
        "I own or manage this website and agree to a check of publicly visible information.",
      ], $("#check-status"));
    });
  }

  // ---------- Contact form ----------
  const form = $("#contact-form");
  if (!form) return;

  // Links like /?plan=plus#contact preselect the form.
  const params = new URLSearchParams(location.search);
  if (PLAN_LABELS[params.get("plan")]) $("#c-interest").value = params.get("plan");

  // Same-page buttons preselect without a reload.
  $$("[data-plan]").forEach((el) => {
    el.addEventListener("click", () => ($("#c-interest").value = el.dataset.plan));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const plan = PLAN_LABELS[data.interest];
    sendByEmail(`${plan}: ${data.name}${data.company ? `, ${data.company}` : ""}`, [
      `Name: ${data.name}`,
      `Company: ${data.company || "-"}`,
      `Email: ${data.email}`,
      `Interested in: ${plan}`,
      "",
      data.message,
    ], $("#contact-status"));
  });
})();
