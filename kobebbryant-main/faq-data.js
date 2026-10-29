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
        q: "What happens after I fill in the contact form?",
        a: "We reply within one business day with a link to book your free intro call. No sales pitch, just a time that works for you.",
      },
      {
        q: "What is the free intro call?",
        a: "A 45–60 minute call where we look at where your team loses time and which risks you face. Within a few days you get a short report with our advice: which agent fits, the time you could save, and a trial proposal. If an agent isn't worth it for you, we'll say so.",
      },
      {
        q: "Do I need to prepare anything for the intro call?",
        a: "No. It helps if you know roughly how many emails, orders and invoices you handle per week, and which systems you use.",
      },
      {
        q: "Is the intro call really free?",
        a: "Yes. There's no obligation to continue.",
      },
    ],
  },
  {
    id: "trial",
    title: "The 30-day trial",
    items: [
      {
        home: true,
        q: "What is the 30-day trial?",
        a: "For 30 days, the agent works on your real emails, orders or invoices while you approve everything. At the end you see the time saved, accuracy and threats found, and you decide whether to continue.",
      },
      {
        // TODO: check before going live (trial cost and money back)
        q: "What does the trial cost?",
        a: "Our first {foundingTotal} customers try it for free in return for feedback and a short case study. After that, you pay your first month as normal, with your money back if the agent doesn't save you time.",
      },
      {
        // TODO: check before going live (money back)
        home: true,
        q: "How do you measure \"saving time\"?",
        a: "Before we start, we agree how much time the task takes now. After 30 days we compare. If there's no clear gain, you don't pay.",
      },
      {
        q: "How much time does the trial take from my team?",
        a: "A kickoff call, sharing your FAQ and policies, and about 10–15 minutes a day to approve the agent's work.",
      },
    ],
  },
  {
    id: "contracts",
    title: "Contracts and payment",
    items: [
      {
        // TODO: check before going live (cancellation)
        q: "Is there a long contract?",
        a: "No. Monthly plans can be cancelled with one month's notice. Yearly plans include 2 months free.",
      },
      {
        q: "Can I switch packages later?",
        a: "Yes. You can upgrade at any time, for example from Starter to Growth when you want your orders and invoices checked too.",
      },
      {
        q: "Which package fits my shop?",
        a: "Starter suits small shops where most work is in the inbox. Growth adds Back Office for orders and invoices. Complete adds Code Guard for shops with custom code or many plugins. Not sure? The free intro call tells you.",
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
    title: "Data and access",
    items: [
      {
        home: true,
        q: "What access do you need to our systems?",
        a: "Only what the agent needs to do its job, through a separate account you create and control. You never share your own passwords, and you can revoke access at any time.",
      },
      {
        q: "How do you handle our customers' data?",
        a: "We sign a data processing agreement before connecting any system. Data is only used to run your agent, and we keep as little as possible.",
      },
      {
        q: "Will the agent change anything on my live webshop?",
        a: "No. Agents prepare work for you to approve, and Code Guard only suggests fixes for your developer.",
      },
    ],
  },
  {
    id: "after-the-trial",
    title: "After the trial",
    items: [
      {
        q: "What happens when we continue?",
        a: "Your agent moves into daily use. Approval steps are relaxed only where the trial showed the agent gets it right. Your first monthly security report arrives after about 30 days.",
      },
      {
        // TODO: check before going live (data deletion)
        q: "What happens if we stop?",
        a: "We remove all access and delete your data, and confirm that to you in writing.",
      },
      {
        q: "Who do I contact if something goes wrong?",
        a: "You email us directly. For serious incidents, like a hacked webshop, we help you assess the situation and refer you to a specialist incident response team.",
      },
    ],
  },
];
