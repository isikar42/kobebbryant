// All agent data in one place. Every agent page (agents/<slug>.html) and every
// agent card on the site is built from this list.
//
// DRAFT COPY: review the texts. Integrations list the systems an agent can
// connect to; only keep the ones you really support (no official partnerships).
// Example runs use fictional data (example.com, Contoso, Fabrikam) and are illustrations.
//
// `package` is the cheapest package that includes the agent (see config.js).

window.AGENTS = [
  {
    slug: "front-office",
    name: "Front Office",
    role: "Everything your customers send in",
    package: "starter",
    icon: "M4 6h16v12H4zM4 7l8 6 8-6",
    summary: "Sorts customer email, drafts replies from your own information and flags phishing before your team falls for it.",
    does: [
      "Sorts customer emails: questions, returns, complaints, spam",
      "Drafts replies from your own FAQ, return policy and product info",
      "Flags phishing and suspicious emails and explains why",
      "Hands complaints and urgent cases to a person",
    ],
    exampleRun: {
      goal: "New email in support@example.com: \"Your parcel could not be delivered. Pay €1.99 via this link to reschedule.\"",
      steps: [
        { type: "think", text: "This looks like a courier notice. Check the sender and the link." },
        { type: "act", text: "check_sender(\"delivery-update@examp1e-parcel.net\")" },
        { type: "observe", text: "Sender domain doesn't match any courier you use. The link points to an unknown payment page." },
        { type: "think", text: "Classic fake-courier phishing. Don't reply; warn the team in plain language." },
        { type: "answer", text: "Marked as phishing: \"Fake courier email asking for a payment. Don't click the link.\" Moved out of the inbox." },
      ],
    },
    integrations: ["Outlook", "Gmail", "Zendesk", "Freshdesk", "WooCommerce", "Magento"],
    handoff: [
      "Complaints and urgent cases go straight to a person",
      "Drafts are only sent after a colleague approves them",
      "When the agent is unsure, it asks instead of guessing",
    ],
    faqs: [
      { q: "Does it send replies on its own?", a: "Not by default. It drafts replies and a person approves them. You decide later whether some routine replies may go out automatically." },
      { q: "Where do the answers come from?", a: "Only from your own FAQ, return policy and product information. If the answer isn't there, it hands the email to a person." },
      { q: "How does it spot phishing?", a: "It checks senders, links and requests that don't fit your normal mail, such as payment requests or changed bank details, and explains in plain language why an email looks suspicious." },
    ],
  },
  {
    slug: "back-office",
    name: "Back Office",
    role: "Everything that involves money",
    package: "growth",
    icon: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
    summary: "Checks orders for fraud, prepares supplier invoices and stops payments to changed bank details.",
    does: [
      "Checks orders for fraud signals and holds suspicious ones for a person",
      "Reads supplier invoices and prepares bookings for approval",
      "Blocks invoices when bank details differ from earlier invoices",
      "Spots suspicious return patterns",
    ],
    exampleRun: {
      goal: "New invoice from Fabrikam (invoice F-2291) in invoices@example.com.",
      steps: [
        { type: "think", text: "Extract the invoice details first." },
        { type: "act", text: "read_invoice(\"F-2291.pdf\")" },
        { type: "observe", text: "Supplier Fabrikam, €1,210.00 incl. VAT. Bank account differs from Fabrikam's last six invoices." },
        { type: "think", text: "A changed bank account is a common sign of invoice fraud. Don't prepare the booking." },
        { type: "answer", text: "Invoice held: \"Bank details changed since the last invoice. Call Fabrikam on a known number to confirm.\"" },
      ],
    },
    integrations: ["WooCommerce", "Magento", "Exact Online", "Moneybird", "Xero"],
    handoff: [
      "Every order it flags goes to a person before it ships",
      "Invoices with changed bank details are held until a person confirms them",
      "Payments are never made by the agent; bookings wait for approval",
    ],
    faqs: [
      { q: "Does it cancel orders or make payments?", a: "No. It flags orders and prepares bookings. Cancelling, refunding and paying stay with your team." },
      { q: "What counts as a fraud signal?", a: "For example a delivery address that doesn't match the billing address, several cards tried on one order, an unusually large amount or a suspicious return pattern." },
      { q: "What happens when bank details change?", a: "The invoice is held and a person is asked to confirm the new details with the supplier, using contact details you already had." },
    ],
  },
  {
    slug: "code-guard",
    name: "Code Guard",
    role: "The tech behind your shop",
    package: "complete",
    trialNote: "Trying Code Guard? We start with a one-time code scan, so you see results right away.",
    icon: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
    summary: "Scans your shop's code, plugins and themes every week and tells your developer what to fix, in plain language.",
    does: [
      "Weekly static code analysis and plugin/dependency scans",
      "Filters out false positives and explains risks in plain language",
      "Suggests fixes for your developer to review; never changes your live shop",
      "Read-only access",
    ],
    exampleRun: {
      goal: "Weekly scan of shop.example.com (WooCommerce, 24 plugins).",
      steps: [
        { type: "act", text: "scan_dependencies(\"wp-content/plugins\")" },
        { type: "observe", text: "Plugin \"contoso-slider\" 2.1 has a known vulnerability; fixed in 2.3." },
        { type: "act", text: "static_analysis(\"theme/custom\")" },
        { type: "observe", text: "4 findings. 3 are in code that is never reached; 1 is a real unescaped output in the checkout template." },
        { type: "answer", text: "Report for your developer: update contoso-slider to 2.3, and fix the unescaped output in checkout.php (suggested patch attached for review)." },
      ],
    },
    integrations: ["WooCommerce", "Magento", "Custom code", "Shopify (own theme and scripts only)"],
    handoff: [
      "Every suggested fix is reviewed and applied by your developer",
      "The agent never changes your live shop",
      "Findings it can't judge are marked for a person to check",
    ],
    faqs: [
      { q: "Does this work with Shopify?", a: "Only in part. Shopify runs the platform code itself, so Code Guard can only check your own theme and scripts. For WooCommerce, Magento and custom code it checks everything we get access to." },
      { q: "Do you need access to our code?", a: "Read-only access. Nothing is changed on your live shop. This is set out in the data processing agreement." },
      { q: "Who fixes the problems?", a: "Your developer. Code Guard explains each risk and suggests a fix; your developer decides and applies it." },
    ],
  },
];
