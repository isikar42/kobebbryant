# kobebbryant
Personal projects

## Defendly

<!-- TODO: final business name (Defendly is a working title) -->

A static multi-page website for a security service for webshops (mainly WooCommerce and Magento), focused on ransomware and phishing. You don't need a build step or any dependencies.

| URL | Page |
|-----|------|
| `/` | Home: hero, problem, three pillars, how it works, free Security Check form, plans at a glance, FAQ, contact form |
| `/how-it-works` | Three steps, example monthly report, what we don't do |
| `/pricing` | Basis, Plus and Complete (monthly and yearly price), comparison table, workshop, founding offer |
| `/faq` | All questions, grouped, with FAQPage structured data |
| `/about`, `/privacy`, `/terms` | Placeholder pages |

Old pages (`/agents`, `/agents/*`, `/security`) redirect to `/how-it-works`; `/roi-calculator` redirects to `/pricing`.

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
| `*.html` | One file per page |
| `config.js` | Prices, founding spots, contact email |
| `layout.js` | Shared header, menu (with mobile hamburger) and footer; also holds the brand name |
| `faq-data.js` | All FAQ questions; `home: true` marks the ones on the home page |
| `faq.js` | Renders the FAQ on the home page and /faq, plus the structured data |
| `sales.js` | Prices, founding spots, the Security Check request and the contact form |
| `styles.css` | Styling (light and dark theme) |
| `sitemap.xml`, `robots.txt` | Replace `https://www.example.com` with your domain |

The forms only open the visitor's email app with the request filled in. The site never scans anything itself.

### Other folders

[`agent/`](agent/) is an earlier learning project (a Node.js backend for a Claude agent). The website no longer uses it.
