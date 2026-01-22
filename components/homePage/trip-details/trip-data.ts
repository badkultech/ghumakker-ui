/* =============================
   Trip Static Data (Temporary)
   Later replace with API
============================= */

/* ---------- Day Tabs ---------- */
export const dayTabs = ["Day 1", "Day 2", "Day 3"]

/* ---------- Day 1 Activities ---------- */
export const day1Activities = [
  {
    time: "6:00 AM - 8:00 AM",
    title: "DELHI TO MANALI",
    description:
      "Start your Himalayan backpacking journey from Delhi. Meet your trip captain and fellow travelers.",
    tags: ["Travel", "Sightseeing"],
  },
  {
    time: "8:00 AM - 10:00 AM",
    title: "Breakfast Stop",
    description:
      "Enjoy breakfast at a scenic highway dhaba en route to Manali.",
    tags: ["Breakfast"],
  },
]

/* ---------- Transfers ---------- */
export const transfers = [
  {
    name: "AC Volvo Bus",
    description: "Delhi to Manali and return",
    startDate: "5 Dec",
    endDate: "22 Dec 2025",
  },
  {
    name: "Tempo Traveler",
    description: "Local sightseeing and internal transfers",
    startDate: "6 Dec",
    endDate: "21 Dec 2025",
  },
]

/* ---------- Meals ---------- */
export const mealsData = [
  {
    name: "Dinner",
    description: "Day 1, 2, 3, 4, 5",
  },
  {
    name: "Breakfast",
    description: "Day 2, 3, 4, 5, 6",
  },
  {
    name: "Lunch",
    description: "Day 3, 4, 5",
  },
]

/* ---------- Stays ---------- */
export const staysData = [
  {
    name: "Hotel in Manali",
    description: "2 nights stay with breakfast",
    dates: "6 Dec - 8 Dec 2025",
  },
  {
    name: "Guesthouse in Kasol",
    description: "Riverside stay for 2 nights",
    dates: "8 Dec - 10 Dec 2025",
  },
  {
    name: "Cottage in Jibhi",
    description: "Mountain view cottage for 2 nights",
    dates: "10 Dec - 12 Dec 2025",
  },
]

/* ---------- Activities ---------- */
export const activitiesData = [
  {
    name: "Zipline Adventure",
    description: "Thrilling zipline experience in Solang Valley",
    included: true,
  },
  {
    name: "River Rafting",
    description: "White water rafting in Beas River",
    included: true,
  },
  {
    name: "Trekking",
    description: "Guided trek to scenic viewpoints",
    included: true,
  },
]

/* ---------- Excluded Items ---------- */
export const excludedItems = [
  "Personal expenses",
  "Travel insurance",
  "Meals not mentioned",
  "Tips & gratuities",
]

/* ---------- FAQs ---------- */
export const faqItems = [
  {
    question: "What is included in the trip?",
    answer:
      "Transportation, accommodation, meals as mentioned, and guided activities are included.",
  },
  {
    question: "Is prior trekking experience required?",
    answer:
      "No prior experience is required. Basic fitness is sufficient.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations made 30 days before departure are eligible for partial refunds.",
  },
]

/* ---------- Pricing Options ---------- */
export const pricingOptions = [
  {
    type: "Double Occupancy",
    description: "Sharing with one person",
    price: "₹12,999",
  },
  {
    type: "Triple Sharing",
    description: "Sharing with two people",
    price: "₹11,499",
  },
  {
    type: "Single Occupancy",
    description: "Private room",
    price: "₹18,999",
  },
]

/* ---------- Mobile Pricing Options ---------- */
export const occupancyOptions = [
  {
    type: "Enfield 350cc",
    description: "Solo Rider",
    price: "₹47,000",
  },
  {
    type: "Himalayan 411cc",
    description: "Dual Rider",
    price: "₹35,000",
  },
]
