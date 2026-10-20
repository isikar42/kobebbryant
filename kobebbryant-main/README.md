# kobebbryant
Personal projects

## Agent Lab

A static multi-page website for a business that builds AI agents for companies. You don't need a build step or any dependencies.

| URL | Page |
|-----|------|
| `/` | Home: hero, agents, how we work, pricing summary, FAQ, contact form |
| `/agents` | All agents, what an agent is, the demo, glossary |
| `/agents/<slug>` | One page per agent, built from `agents-data.js` |
| `/pricing` | Scan → Pilot → Agent → Fleet, founding offer, guarantee, monthly/annual switch |
| `/roi-calculator` | ROI calculator |
| `/about`, `/privacy`, `/terms` | Placeholder pages |

### Running it

The site uses clean URLs such as `/pricing`, so it needs a web server; double-clicking `index.html` is not enough. From the repository root:

```sh
powershell -ExecutionPolicy Bypass -File serve.ps1   # Windows, nothing to install
npx serve kobebbryant-main                           # Node
```

Then open http://localhost:8080 (PowerShell) or the address `serve` prints. Hosts such as GitHub Pages and Netlify serve `pricing.html` at `/pricing` automatically. The site expects to live at the root of a domain.

### Files

| File | Contents |
|------|----------|
| `*.html`, `agents/*.html` | One file per page; agent pages only hold their title, description and h1 |
| `config.js` | Prices, founding spots, contact email, ROI defaults |
| `agents-data.js` | All agent data: texts, example runs, integrations, FAQs |
| `layout.js` | Shared header, menu (with mobile hamburger) and footer |
| `agents.js` | Agent cards and the agent page template |
| `sales.js` | Prices, founding spots, ROI calculator, contact form |
| `app.js` | Demo agent (tools, `plan()`, loop) |
| `styles.css` | Styling (light and dark theme) |
| `sitemap.xml`, `robots.txt` | Replace `https://www.example.com` with your domain |

### Adding an agent

1. Add an entry to `agents-data.js`.
2. Copy one of the files in `agents/`, rename it to `<slug>.html` and change its `data-agent`, title, description and h1.
3. Add the URL to `sitemap.xml`.

### Claude agent

The [`agent/`](agent/) folder has a Node.js backend that runs a real Claude agent with the same tools. Start it there (see [agent/README.md](agent/README.md)), open http://localhost:3000 and choose **Claude (real LLM)** in the demo on `/agents`.
