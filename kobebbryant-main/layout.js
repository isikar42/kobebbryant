// Shared layout: header with menu, footer and copyright bar.
// Every page has an empty <header data-site-header> and <footer data-site-footer>;
// this script fills them, so the menu and footer live in one place.

(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const BRAND = "Defendly"; // TODO: final business name

  const NAV = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
  ];
  const CTA = { href: "/#security-check", label: "Free Security Check" };

  // Old one-page anchors that moved to their own page
  const MOVED_ANCHORS = {
    pricing: "/pricing",
    packages: "/pricing",
    founding: "/pricing#founding",
    roi: "/pricing",
    what: "/how-it-works",
    demo: "/how-it-works",
    glossary: "/how-it-works",
    agents: "/how-it-works",
    "how-we-work": "/how-it-works",
    "fit-scan": "/#security-check",
  };

  // "/how-it-works.html" and "/how-it-works/" both become "/how-it-works"
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
        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </svg>
      <span>${BRAND.slice(0, -2)}<em>${BRAND.slice(-2)}</em></span>
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
          <h3>${BRAND}</h3>
          <p>Security for webshops: we secure your shop, train your team and advise you when things go wrong.</p>
        </div>
        <nav aria-label="Footer">
          <h3>Pages</h3>
          <ul class="footer-links">
            ${NAV.map((n) => `<li>${link(n)}</li>`).join("")}
            <li><a href="/#security-check">Free Security Check</a></li>
            <li><a href="/#contact">Contact</a></li>
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
      <p>© ${year} [Your name] · ${BRAND}. All rights reserved.
        · ${link({ href: "/privacy", label: "Privacy" })} · ${link({ href: "/terms", label: "Terms" })}</p>
    </div>`;
})();
