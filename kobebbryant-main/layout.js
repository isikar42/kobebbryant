// Shared layout: header with menu, footer and copyright bar.
// Every page has an empty <header data-site-header> and <footer data-site-footer>;
// this script fills them, so the menu and footer live in one place.

(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const agents = window.AGENTS || [];

  const NAV = [
    { href: "/agents", label: "Agents" },
    { href: "/pricing", label: "Pricing" },
    { href: "/roi-calculator", label: "ROI Calculator" },
    { href: "/about", label: "About" },
  ];
  const CTA = { href: "/?plan=scan#contact", label: "Free Fit Scan" };

  // Old one-page anchors that moved to their own page
  const MOVED_ANCHORS = {
    pricing: "/pricing",
    packages: "/pricing",
    founding: "/pricing#founding",
    roi: "/roi-calculator",
    what: "/agents#what",
    demo: "/agents#demo",
    glossary: "/agents#glossary",
    "fit-scan": "/#how-we-work",
  };

  // "/agents/darkhawk.html" and "/agents/darkhawk/" both become "/agents/darkhawk"
  const normalize = (p) => p.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/(.)\/$/, "$1");
  const here = normalize(location.pathname);

  if (here === "/" && location.hash) {
    const target = MOVED_ANCHORS[location.hash.slice(1)];
    if (target) location.replace(target);
  }

  const isActive = (href) => here === href || here.startsWith(href + "/");
  const link = ({ href, label }) =>
    `<a href="${href}"${isActive(href) ? ' aria-current="page"' : ""}>${label}</a>`;

  // ---------- Header ----------
  const header = document.querySelector("[data-site-header]");
  header.className = "site-header";
  header.innerHTML = `
    <a class="logo" href="/">
      <svg class="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M2 9h20M9 3 7.5 9 12 21l4.5-12L15 3" />
      </svg>
      <span>Agent<em>Lab</em></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
      <span class="menu-icon" aria-hidden="true"></span><span class="visually-hidden">Menu</span>
    </button>
    <nav id="site-menu" class="site-menu" aria-label="Main">
      ${NAV.map(link).join("")}
      <a class="btn primary nav-cta" href="${CTA.href}">${CTA.label}</a>
    </nav>`;

  const toggle = header.querySelector(".menu-toggle");
  const menu = header.querySelector(".site-menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  header.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) setMenu(false);
  });

  // ---------- Footer ----------
  const footer = document.querySelector("[data-site-footer]");
  footer.className = "site-footer-wrap";
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="site-footer">
      <div class="footer-inner">
        <div>
          <h3>Agent Lab</h3>
          <p>AI agents that take repetitive work off your team.</p>
        </div>
        <nav aria-label="Footer">
          <h3>Pages</h3>
          <ul class="footer-links">
            <li>${link({ href: "/", label: "Home" })}</li>
            ${NAV.map((n) => `<li>${link(n)}</li>`).join("")}
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
        <nav aria-label="Agents">
          <h3>Agents</h3>
          <ul class="footer-links">
            ${agents.map((a) => `<li>${link({ href: `/agents/${a.slug}`, label: a.name })}</li>`).join("")}
          </ul>
        </nav>
        <div>
          <h3>Contact</h3>
          <!-- Placeholder content: replace with the real contact details. -->
          <ul class="contact-list">
            <li><span>Name</span>[Your name]</li>
            <li><span>Email</span><a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a></li>
            <li><span>Phone</span>[Phone number]</li>
            <li><span>Location</span>[City, country]</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p>© ${year} [Your name] · Agent Lab. All rights reserved.
        · ${link({ href: "/privacy", label: "Privacy" })} · ${link({ href: "/terms", label: "Terms" })}</p>
    </div>`;
})();
