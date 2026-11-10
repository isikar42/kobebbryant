// All FAQ questions in one place. /faq shows every group; the home page shows
// the questions marked `home: true`. The FAQPage structured data on /faq is
// built from this list too.
//
// Placeholders in answers are filled from config.js:
//   {foundingTotal} -> founding.totalSpots

window.FAQ = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        home: true,
        q: "What does the free Security Check look at?",
        a: "Only information anyone on the internet can see, such as your email settings, certificate and visible software versions. Nothing on your site is changed. Within 2 business days you get a short report.",
      },
      {
        home: true,
        q: "Do I need technical knowledge?",
        a: "No. Every action in the report is explained in plain language.",
      },
      {
        q: "What happens after I fill in the contact form?",
        a: "We reply within one business day. No sales pitch, just answers and a next step that works for you.",
      },
    ],
  },
  {
    id: "security",
    title: "Security and incidents",
    items: [
      {
        // TODO: check before going live (incidents)
        home: true,
        q: "What happens if we get hit by ransomware?",
        a: "You follow the emergency plan and we advise on the first steps. Recovery is done by a specialist we refer you to.",
      },
      {
        q: "What is a practice phishing email?",
        a: "A harmless test email that shows whether your team recognises phishing. We only send them with the owner's written permission, and results are shared per team, not per person.",
      },
      {
        q: "Is my webshop secure after this?",
        a: "No one can promise complete security. We fix the basics, keep watching and tell you what to do.",
      },
    ],
  },
  {
    id: "plans",
    title: "Plans and payment",
    items: [
      {
        // TODO: check before going live (cancellation)
        home: true,
        q: "Can I cancel?",
        a: "Yes. Monthly plans can be cancelled with one month's notice.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes. You can upgrade at any time, for example from Basis to Plus when you want weekly scans and an advice line.",
      },
      {
        q: "Which plan fits my shop?",
        a: "Basis suits shops that have never looked at security. Plus is for shops with a team and regular orders. Complete is for larger shops or shops that handle many payments. Not sure? Start with the free Security Check.",
      },
      {
        // TODO: check before going live (payment)
        q: "How do I pay?",
        a: "By monthly or yearly invoice, paid via direct debit.",
      },
    ],
  },
  {
    id: "data",
    title: "Your data",
    items: [
      {
        q: "How do you handle our customers' data?",
        a: "We sign a data processing agreement before we connect to any system. Data is only used to protect your shop, and we keep as little as possible.",
      },
      {
        // TODO: check before going live (data deletion)
        q: "What happens if we stop?",
        a: "We remove all access and delete your data, and confirm that to you in writing.",
      },
    ],
  },
];
