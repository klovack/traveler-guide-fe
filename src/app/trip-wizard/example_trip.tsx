import type { TripWizardResponse } from "tg-sdk"; // Adjust import path if needed

export const exampleTrip: TripWizardResponse = {
  title: "European Family Escape: Culture & Comfort in Paris and Rome",
  is_round_trip: true,
  start_date: "2024-07-01",
  end_date: "2024-07-02",
  suggested_itinerary: [
    {
      itinerary_time: {
        start: "2024-07-01T07:00:00Z",
        end: "2024-07-01T19:00:00Z",
      },
      description:
        "Begin your journey in Paris, immersing in its vibrant culture and tranquil parks. Enjoy iconic landmarks, delicious cuisine, and leisurely family time.",
      activities: [
        "Morning stroll and breakfast at a Parisian café near Notre-Dame Cathedral",
        "Guided family tour of the Louvre Museum focusing on art and stories for all ages",
        "Lunch picnic at Jardin des Tuileries",
        "Visit and photo stop at the Eiffel Tower, with optional elevator ride",
        "Late afternoon relaxation at Luxembourg Gardens",
        "Dinner at a cozy bistro sampling classic French dishes",
      ],
      locations: ["Paris"],
    },
    {
      itinerary_time: {
        start: "2024-07-02T06:00:00Z",
        end: "2024-07-02T19:00:00Z",
      },
      description:
        "Travel to Rome for a day of ancient wonders, vibrant Italian culture, and laid-back family exploration amid historic ruins and beautiful gardens.",
      activities: [
        "Early morning check-out and transfer to the airport for Paris-Rome flight",
        "Arrive in Rome and check in to your accommodation",
        "Family-friendly guided tour of the Colosseum and Roman Forum",
        "Lunch at a trattoria enjoying authentic Italian pasta and gelato",
        "Afternoon stroll in Villa Borghese gardens with playgrounds and lake",
        "Explore Piazza Navona and Pantheon at leisure",
        "Evening at a local pizzeria with outdoor dining",
      ],
      locations: ["Rome", "Paris"],
    },
  ],
  mood_board_text:
    "A delightful blend of European charm, rich cultural discovery, and moments of relaxation. Picture family laughter in lush gardens, delicious local food under city lights, and timeless photos at legendary sites. This trip is designed for families seeking both enrichment and leisure in the heart of Europe.",
  recommended_guide_profile: {
    guide_type: ["Cultural", "Family-friendly", "Foodie"],
    languages: ["en", "id", "jawa"],
    personality: ["Friendly", "Patient", "Engaging", "Knowledgeable"],
    certifications: ["Licensed", "Experienced"],
    min_experience_level: 3,
  },
  id: "923f25fe-e7b1-48a9-9a9d-04c0300445d6",
  location_details: [
    {
      name: "Paris",
      country_code: "FR",
      lat: 48.85341,
      lon: 2.3488,
      timezone: "Europe/Paris",
    },
    {
      name: "Rome",
      country_code: "IT",
      lat: 41.89193,
      lon: 12.51133,
      timezone: "Europe/Rome",
    },
  ],
};
