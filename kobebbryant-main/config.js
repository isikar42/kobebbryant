// Site settings: change prices, founding spots and contact details here.
// A price set to null is shown as "[price]" on the site (placeholder).

window.SITE_CONFIG = {
  // Where the contact form sends to (opens the visitor's email app).
  contactEmail: "contact@example.com", // PLACEHOLDER: your business email

  // TODO: set prices (monthly, in €). null shows "[price]".
  prices: {
    packages: {            // monthly price per package
      starter: null,
      growth: null,
      complete: null
    },
    annualFreeMonths: 2    // Annual billing = 12 months for the price of 10
  },

  // 30-day trial: "founding" = free for the first customers, "standard" = first month
  // paid with money back. With no founding spots left, "standard" is used automatically.
  trial: {
    variant: "founding"
  },

  founding: {
    totalSpots: 10,
    spotsLeft: 10 // Lower this number when a free trial spot is taken
  },

  // Starting values for the ROI calculator (payback is shown against Starter)
  roiDefaults: {
    hoursPerWeek: 10,
    employees: 2,
    hourlyRate: 45,
    automationPercent: 60
  }
};
