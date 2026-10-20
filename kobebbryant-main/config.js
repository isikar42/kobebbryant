// Site settings: change prices, founding spots and contact details here.
// A price set to null is shown as "[price]" on the site (placeholder).

window.SITE_CONFIG = {
  // Where the contact form sends to (opens the visitor's email app).
  contactEmail: "contact@example.com", // PLACEHOLDER: your business email

  prices: {
    pilot: null,               // PLACEHOLDER: one-time pilot price in €, e.g. 1500
    agentMonthly: null,        // PLACEHOLDER: Agent plan per month in €, e.g. 500
    annualFreeMonths: 2,       // Annual billing = 12 months for the price of 10
    fleetDiscountPercent: null // PLACEHOLDER: discount per extra agent in %, e.g. 10
  },

  founding: {
    totalSpots: 10,
    spotsLeft: 10 // Lower this number when a founding customer signs up
  },

  // Starting values for the ROI calculator
  roiDefaults: {
    hoursPerWeek: 10,
    employees: 2,
    hourlyRate: 45,
    automationPercent: 60
  }
};
