// Site settings: change prices, founding spots and contact details here.
// A price set to null is shown as "[price]" on the site (placeholder).

window.SITE_CONFIG = {
  // Where the forms send to (opens the visitor's email app).
  contactEmail: "contact@example.com", // PLACEHOLDER: your business email

  // TODO: confirm prices (in €, excl. VAT)
  prices: {
    plans: {          // monthly price per plan
      basis: 149,
      plus: 349,
      complete: 649
    },
    monthsPaidPerYear: 10, // Yearly price = monthly price × 10 ("2 months free")
    workshop: 395          // one-off workshop
  },

  founding: {
    totalSpots: 10,
    spotsLeft: 10 // Lower this number when a founding spot is taken
  }
};
