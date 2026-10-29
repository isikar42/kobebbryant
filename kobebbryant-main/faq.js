// Renders the FAQ from faq-data.js:
//   <div data-faq="home">  the questions marked `home: true`
//   <div data-faq="full">  every group with its heading, plus FAQPage structured data

(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const groups = window.FAQ || [];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fill = (text) => text
    .replace("{foundingTotal}", cfg.founding.totalSpots);

  const item = (i) => `<details><summary>${esc(i.q)}</summary><p>${esc(fill(i.a))}</p></details>`;

  document.querySelectorAll('[data-faq="home"]').forEach((el) => {
    el.innerHTML = groups.flatMap((g) => g.items.filter((i) => i.home)).map(item).join("");
  });

  const full = document.querySelector('[data-faq="full"]');
  if (!full) return;

  full.innerHTML = groups.map((g) => `
    <section id="${g.id}" class="faq-group">
      <h2>${esc(g.title)}</h2>
      <div class="faq">${g.items.map(item).join("")}</div>
    </section>`).join("");

  // FAQPage structured data for search engines
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items).map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: fill(i.a) },
    })),
  });
  document.head.appendChild(ld);
})();
