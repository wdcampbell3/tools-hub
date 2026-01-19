const defaultPlanId = "free";
const pricingPlans = [
  {
    id: "hourly_consulting",
    name: "Hourly Consulting",
    description: "A simple hourly consulting plan. You will be charged for the time spent on your project.",
    price: "$150",
    priceIntervalName: "per hour",
    stripe_price_id: "price_1PEEn3D1EvflrzvO0Dz4UUX3",
    stripe_product_id: "prod_Q4NYjoR7z8enyg",
    features: [
      "1 hour of consulting",
      "Zoom or Google Meet call",
      "Recording of the call"
    ]
  },
  {
    id: "consulting_downpayment",
    name: "Consulting Downpayment",
    description: "A downpayment for a project consulting work. You will be charged for the time spent on your project.",
    price: "$1500",
    priceIntervalName: "one time payment",
    stripe_price_id: "price_1OLEx8D1EvflrzvOG3qYOZuC",
    stripe_product_id: "prod_P9Y3z7UZviBXDx",
    features: [
      "10% discount on the consulting work",
      "The downpayment is non-refundable",
      "Available for any project consulting work"
    ]
  },
  {
    id: "project_consulting_work",
    name: "Project Consulting Work",
    description: "A one time payment for a project consulting work. You will be charged for the time spent on your project.",
    price: "$875",
    priceIntervalName: "one time payment",
    stripe_price_id: "price_1OpeUfD1EvflrzvOrL3N0cpp",
    stripe_product_id: "prod_PTK28d8PucjEG6",
    features: [
      "10% discount on the consulting work",
      "The payment is non-refundable",
      "Available for any project consulting work"
    ]
  }
];
export {
  defaultPlanId as d,
  pricingPlans as p
};
