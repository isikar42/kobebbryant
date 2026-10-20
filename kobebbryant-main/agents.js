// Builds agent cards ([data-agent-cards]) and the agent page template
// (<main data-agent="slug">) from the data in agents-data.js.

(() => {
  "use strict";

  const agents = window.AGENTS || [];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (path) => `<span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${path}" /></svg></span>`;
  const list = (items, cls = "check-list") => `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

  // ---------- Cards ----------
  document.querySelectorAll("[data-agent-cards]").forEach((el) => {
    el.innerHTML = agents.map((a) => `
      <a class="feature" href="/agents/${a.slug}">
        ${icon(a.icon)}
        <h3>${esc(a.name)}</h3>
        <p class="agent-role">${esc(a.role)}</p>
        <p>${esc(a.summary)}</p>
      </a>`).join("");
  });

  // ---------- Agent page ----------
  const main = document.querySelector("main[data-agent]");
  if (!main) return;

  const agent = agents.find((a) => a.slug === main.dataset.agent);
  const body = main.querySelector("[data-agent-body]");
  if (!agent) {
    body.innerHTML = `<p>This agent could not be found. <a href="/agents">See all agents</a>.</p>`;
    return;
  }

  const contactLink = `/?plan=pilot&agent=${agent.slug}#contact`;
  const TRACE_LABELS = { think: "Thought", act: "Action", observe: "Observation", answer: "Answer" };

  main.querySelector("[data-agent-intro]").innerHTML = `
    <p class="kicker">${esc(agent.role)}</p>
    <p class="lead">${esc(agent.summary)}</p>
    <div class="hero-actions">
      <a class="btn primary btn-lg" href="${contactLink}">Talk to us about ${esc(agent.name)} <span aria-hidden="true">→</span></a>
      <a class="btn btn-lg" href="/agents">All agents</a>
    </div>`;

  body.innerHTML = `
    <section class="section">
      <h2>What it does</h2>
      ${list(agent.does)}
    </section>

    <section class="section">
      <h2>Example run</h2>
      <p>An illustration with fictional data.</p>
      <div class="panel example-run">
        <p class="example-goal"><span class="tag">Goal</span>${esc(agent.exampleRun.goal)}</p>
        <ol class="trace">
          ${agent.exampleRun.steps.map((s) => `
            <li class="${s.type}"><span class="tag">${TRACE_LABELS[s.type]}</span>${s.type === "act" ? `<code>${esc(s.text)}</code>` : esc(s.text)}</li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="section agent-split">
      <div>
        <h2>Connects to</h2>
        ${list(agent.integrations, "tag-list")}
      </div>
      <div>
        <h2>Handing over to a person</h2>
        ${list(agent.handoff)}
      </div>
    </section>

    <section class="section">
      <h2>Price</h2>
      <div class="agent-price">
        <div>
          <p class="price"><span data-price="agent">[price]</span><span> / month</span></p>
          <p class="billing-note" data-annual-note></p>
          <p>Every agent starts with a 2–4 week pilot. <strong>Pay for results, not promises:</strong>
            if your agent doesn't save time in the pilot, you don't pay.</p>
        </div>
        <a class="btn" href="/pricing">See all pricing</a>
      </div>
    </section>

    <section class="section">
      <h2>FAQ</h2>
      <div class="faq">
        ${agent.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
      </div>
    </section>

    <section class="section cta-band">
      <h2>Is ${esc(agent.name)} a fit for you?</h2>
      <p>Start with a pilot, or ask us first. We'll tell you honestly if it's worth it.</p>
      <a class="btn primary btn-lg" href="${contactLink}">Contact us about ${esc(agent.name)}</a>
    </section>`;
})();
