// Sales parts: prices and founding spots from config.js, the ROI calculator
// and the contact form (opens the visitor's email app via mailto:).
// Each part only runs when its elements are on the current page.

(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const agents = window.AGENTS || [];
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const PLAN_LABELS = {
    scan: "Free Agent Fit Scan",
    pilot: "Pilot (founding offer)",
    agent: "Agent",
    fleet: "Fleet",
  };

  const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 });
  const formatPrice = (value) => (value == null ? "[price]" : euro.format(value));

  // The ROI calculator hands its result to the contact form on the home page.
  const ROI_KEY = "agentlab-roi-message";
  const store = {
    get() { try { return sessionStorage.getItem(ROI_KEY); } catch { return null; } },
    set(v) { try { sessionStorage.setItem(ROI_KEY, v); } catch { /* storage unavailable */ } },
    clear() { try { sessionStorage.removeItem(ROI_KEY); } catch { /* storage unavailable */ } },
  };

  // ---------- Contact details ----------
  $$("[data-contact-email]").forEach((a) => {
    a.href = `mailto:${cfg.contactEmail}`;
    a.textContent = cfg.contactEmail;
  });

  // ---------- Founding spots ----------
  const { totalSpots, spotsLeft } = cfg.founding;
  $$("[data-spots-total]").forEach((el) => (el.textContent = totalSpots));
  $$("[data-spots-left]").forEach((el) => (el.textContent = spotsLeft));
  if (spotsLeft <= 0) {
    $$(".founding .spots").forEach((el) => (el.textContent = "All founding spots are taken."));
    $$("[data-founding-cta]").forEach((el) => (el.hidden = true));
    const opt = $('#c-interest option[value="pilot"]');
    if (opt) opt.textContent = "Pilot";
    PLAN_LABELS.pilot = "Pilot";
  }

  // ---------- Prices ----------
  const { pilot, agentMonthly, annualFreeMonths, fleetDiscountPercent } = cfg.prices;

  function renderPrices() {
    const checked = $('input[name="billing"]:checked');
    const annual = checked ? checked.value === "annual" : false;
    // Annual: shown as the effective monthly price (12 months for the price of 12 - free months)
    const factor = annual ? (12 - annualFreeMonths) / 12 : 1;
    const agent = agentMonthly == null ? null : agentMonthly * factor;

    $$('[data-price="pilot"]').forEach((el) => (el.textContent = formatPrice(pilot)));
    $$('[data-price="agent"], [data-price="fleet"]').forEach((el) => (el.textContent = formatPrice(agent)));
    $$("[data-annual-note]").forEach((el) => {
      el.textContent = annual
        ? `Billed yearly, ${annualFreeMonths} months free included`
        : `${annualFreeMonths} months free with annual billing`;
    });
  }

  $$("[data-fleet-discount]").forEach((el) => {
    el.textContent = fleetDiscountPercent == null ? "[X]%" : `${fleetDiscountPercent}%`;
  });
  $$("[data-free-months]").forEach((el) => (el.textContent = annualFreeMonths));
  $$('input[name="billing"]').forEach((r) => r.addEventListener("change", renderPrices));
  renderPrices();

  // ---------- ROI calculator ----------
  if ($("#roi-form")) {
    const WEEKS_PER_MONTH = 52 / 12;
    const d = cfg.roiDefaults;
    $("#roi-hours").value = d.hoursPerWeek;
    $("#roi-people").value = d.employees;
    $("#roi-rate").value = d.hourlyRate;
    $("#roi-share").value = d.automationPercent;

    const readNumber = (sel) => Math.max(0, parseFloat($(sel).value) || 0);
    let roi = null;

    const updateRoi = () => {
      const hours = readNumber("#roi-hours");
      const people = readNumber("#roi-people");
      const rate = readNumber("#roi-rate");
      const share = readNumber("#roi-share");

      const hoursSaved = hours * people * WEEKS_PER_MONTH * (share / 100);
      const moneySaved = hoursSaved * rate;

      let payback = "[price needed]"; // shown until agentMonthly is set in config.js
      if (agentMonthly != null) {
        if (moneySaved <= 0) payback = "–";
        else {
          const months = agentMonthly / moneySaved;
          payback = months < 1
            ? `${Math.max(1, Math.round(months * 30))} days`
            : `${months.toFixed(1)} months`;
        }
      }

      $("#roi-share-out").textContent = `${share}%`;
      $("#roi-out-hours").textContent = `${num.format(hoursSaved)} h`;
      $("#roi-out-money").textContent = euro.format(moneySaved);
      $("#roi-out-payback").textContent = payback;

      roi = { hours, people, rate, share, hoursSaved, moneySaved, payback };
    };

    $("#roi-form").addEventListener("input", updateRoi);
    updateRoi();

    // The CTA is a link to the contact form; the message travels via sessionStorage.
    $("#roi-cta").addEventListener("click", () => {
      store.set([
        "Hi, I used the ROI calculator on your site:",
        "",
        `- Hours per week on the task (per employee): ${roi.hours}`,
        `- Employees doing it: ${roi.people}`,
        `- Hourly rate: ${euro.format(roi.rate)}`,
        `- Share an agent could take over: ${roi.share}%`,
        "",
        `Estimated hours saved per month: ${num.format(roi.hoursSaved)} h`,
        `Estimated savings per month: ${euro.format(roi.moneySaved)}`,
        `Payback vs. the Agent plan: ${roi.payback}`,
        "",
        "I'd like to check this with a free Fit Scan.",
      ].join("\n"));
    });
  }

  // ---------- Contact form ----------
  const form = $("#contact-form");
  if (!form) return;

  const agentSelect = $("#c-agent");
  agentSelect.innerHTML = `<option value="">Not sure yet</option>` +
    agents.map((a) => `<option value="${a.slug}">${a.name} (${a.role})</option>`).join("");

  // Links like /?plan=pilot&agent=darkhawk#contact preselect the form.
  const params = new URLSearchParams(location.search);
  if (PLAN_LABELS[params.get("plan")]) $("#c-interest").value = params.get("plan");
  if (agents.some((a) => a.slug === params.get("agent"))) agentSelect.value = params.get("agent");

  const roiMessage = store.get();
  if (roiMessage) {
    $("#c-message").value = roiMessage;
    store.clear();
  }

  // Same-page buttons (e.g. the hero CTA) preselect without a reload.
  $$("[data-plan]").forEach((el) => {
    el.addEventListener("click", () => ($("#c-interest").value = el.dataset.plan));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const plan = PLAN_LABELS[data.interest];
    const agent = agents.find((a) => a.slug === data.agent);
    const subject = `${plan}${agent ? ` (${agent.name})` : ""}: ${data.name}${data.company ? `, ${data.company}` : ""}`;
    const body = [
      `Name: ${data.name}`,
      `Company: ${data.company || "-"}`,
      `Email: ${data.email}`,
      `Interested in: ${plan}`,
      `Agent: ${agent ? `${agent.name} (${agent.role})` : "Not sure yet"}`,
      "",
      data.message,
    ].join("\n");

    window.location.href =
      `mailto:${cfg.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $("#contact-status").textContent =
      `Your email app should open now. If it doesn't, email us at ${cfg.contactEmail}.`;
  });
})();
