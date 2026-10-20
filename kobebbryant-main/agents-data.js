// All agent data in one place. Every agent page (agents/<slug>.html) and every
// agent card on the site is built from this list.
//
// DRAFT COPY: review the texts. Items in [square brackets] are placeholders,
// such as the systems an agent connects to: only list what you really support.
// Example runs use fictional data (example.com, Contoso) and are illustrations.

window.AGENTS = [
  {
    slug: "cloak-and-dagger",
    name: "Cloak & Dagger",
    role: "Inbox Triage",
    icon: "M4 6h16v12H4zM4 7l8 6 8-6",
    summary: "Sorts your shared inbox, drafts replies and routes what needs a person.",
    does: [
      "Reads incoming email in a shared inbox",
      "Labels each message by topic and urgency",
      "Drafts a reply for routine questions",
      "Routes complex or sensitive email to the right colleague",
    ],
    exampleRun: {
      goal: "New email in support@example.com: \"Can I change the delivery address of order 1042?\"",
      steps: [
        { type: "think", text: "This is a delivery question about an existing order. Check the order status first." },
        { type: "act", text: "lookup_order(1042)" },
        { type: "observe", text: "Order 1042: not shipped yet." },
        { type: "think", text: "Address changes are allowed before shipping. Draft a reply and label the email." },
        { type: "answer", text: "Labelled \"Orders / Change\", reply drafted for a colleague to approve." },
      ],
    },
    integrations: ["[Microsoft 365 / Outlook]", "[Gmail]", "[Your ticket system]"],
    handoff: [
      "Complaints, legal questions and anything sensitive go straight to a person",
      "Drafts are only sent after a colleague approves them",
      "When the agent is unsure, it asks instead of guessing",
    ],
    faqs: [
      { q: "Does it send email on its own?", a: "Not by default. It drafts replies and a person approves them. You decide later whether some routine replies may go out automatically." },
      { q: "Which mailboxes can it work with?", a: "[List the mail systems you support.]" },
      { q: "Can it read everything in our inbox?", a: "It only gets access to the mailboxes you choose for it." },
    ],
  },
  {
    slug: "darkhawk",
    name: "Darkhawk",
    role: "Lead Researcher",
    icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
    summary: "Researches new leads and prepares a short brief before your sales call.",
    does: [
      "Collects public information about a company",
      "Summarises what they do and recent news",
      "Checks the lead against your ideal customer profile",
      "Writes a short brief in your CRM",
    ],
    exampleRun: {
      goal: "New lead: Contoso Ltd. Prepare a brief for tomorrow's call.",
      steps: [
        { type: "think", text: "Start with the company website and public company information." },
        { type: "act", text: "web_search(\"Contoso Ltd\")" },
        { type: "observe", text: "Website found: Contoso makes office furniture, about 200 employees." },
        { type: "think", text: "Compare with the ideal customer profile and write the brief." },
        { type: "answer", text: "Brief saved to the CRM with a fit score and three suggested questions." },
      ],
    },
    integrations: ["[Your CRM, e.g. HubSpot or Salesforce]", "[Web search]", "[LinkedIn Sales Navigator]"],
    handoff: [
      "The agent never contacts a lead itself: the call stays with your team",
      "Unclear or conflicting information is flagged, not filled in",
      "A salesperson reviews each brief before using it",
    ],
    faqs: [
      { q: "Where does the information come from?", a: "Only public sources and the systems you connect. Each brief lists its sources." },
      { q: "Does it contact leads?", a: "No. It prepares research; your team does the outreach." },
      { q: "Which CRM does it work with?", a: "[List the CRMs you support.]" },
    ],
  },
  {
    slug: "graviton",
    name: "Graviton",
    role: "Invoice Clerk",
    icon: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
    summary: "Reads incoming invoices, checks them and prepares them for booking.",
    does: [
      "Reads invoices from email or a folder",
      "Extracts supplier, amounts, VAT and due date",
      "Matches the invoice to a purchase order",
      "Prepares the booking in your accounting system",
    ],
    exampleRun: {
      goal: "New invoice from Fabrikam (invoice F-2291) in invoices@example.com.",
      steps: [
        { type: "think", text: "Extract the invoice details first." },
        { type: "act", text: "read_invoice(\"F-2291.pdf\")" },
        { type: "observe", text: "Supplier Fabrikam, €1,210.00 incl. VAT, PO 7781, due in 30 days." },
        { type: "act", text: "match_purchase_order(7781)" },
        { type: "answer", text: "Amounts match PO 7781. Booking prepared and waiting for approval." },
      ],
    },
    integrations: ["[Your accounting system, e.g. Exact Online or Xero]", "[Email inbox for invoices]"],
    handoff: [
      "Invoices that don't match a purchase order go to a person",
      "Payments are never made by the agent",
      "Each booking waits for approval before it is final",
    ],
    faqs: [
      { q: "Does it pay invoices?", a: "No. It prepares bookings; payments stay with your team." },
      { q: "What if an invoice doesn't match?", a: "It flags the difference and hands the invoice to a person." },
      { q: "Which accounting systems are supported?", a: "[List the systems you support.]" },
    ],
  },
  {
    slug: "deathlok",
    name: "Deathlok",
    role: "Knowledge Desk",
    icon: "M4 19.5V6a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2zm0 0A2 2 0 0 0 6 22h13",
    summary: "Answers internal questions from your own documents, with sources.",
    does: [
      "Searches your manuals, policies and wiki",
      "Answers employee questions in plain language",
      "Shows the source for every answer",
      "Says so when the answer is not in your documents",
    ],
    exampleRun: {
      goal: "Employee asks: \"How many days do I have to submit expenses?\"",
      steps: [
        { type: "think", text: "Search the internal documents for the expenses policy." },
        { type: "act", text: "search_docs(\"expenses deadline\")" },
        { type: "observe", text: "Found: Expenses policy, section 3: \"within 30 days\"." },
        { type: "answer", text: "Within 30 days. Source: Expenses policy, section 3." },
      ],
    },
    integrations: ["[SharePoint]", "[Confluence or your wiki]", "[Microsoft Teams or Slack]"],
    handoff: [
      "If the answer isn't in your documents, it says so and points to a person",
      "Questions about personal situations go to HR or a manager",
      "Only documents you select are used",
    ],
    faqs: [
      { q: "Will it make up answers?", a: "It is set up to answer only from your documents and to show the source. If it can't find an answer, it says so." },
      { q: "Which documents does it use?", a: "Only the folders and pages you choose." },
      { q: "Where can employees ask questions?", a: "[List the chat tools you support.]" },
    ],
  },
];
