import { CalendarDays, MapPin, Radio } from "lucide-react";

/* ---------- time ---------- */
export const EVENT_DATE = new Date("2026-11-23T09:00:00+08:00").getTime();

/* ---------- hero / about ---------- */
export const DETAILS = [
  { label: "Date", value: "Nov 23–25, 2026", icon: CalendarDays },
  { label: "Location", value: "Iloilo + Online", icon: MapPin },
  { label: "Format", value: "Hybrid Event", icon: Radio },
];

export const STATS = [
  { n: "10+", l: "Speakers" },
  { n: "3", l: "Tracks" },
  { n: "20+", l: "Exhibitors" },
];

export const FEATURES = [
  {
    title: "AI & Intelligence",
    text: "Hands-on labs and keynotes on generative and agentic AI systems.",
    image: "https://picsum.photos/seed/ugnay-ai/900/1200",
  },
  {
    title: "Spatial & AR",
    text: "Immersive demos of mixed reality and holographic interfaces.",
    image: "https://picsum.photos/seed/ugnay-spatial/900/1200",
  },
  {
    title: "Quantum & Security",
    text: "Practical quantum and zero-trust sessions for developers.",
    image: "https://picsum.photos/seed/ugnay-quantum/900/1200",
  },
  {
    title: "Robotics & Edge",
    text: "Edge platforms and machines moving AI into the physical world.",
    image: "https://picsum.photos/seed/ugnay-robotics/900/1200",
  },
  {
    title: "AI & Intelligence",
    text: "Hands-on labs and keynotes on generative and agentic AI systems.",
    image: "https://picsum.photos/seed/ugnay-ai/900/1200",
  },
  {
    title: "Spatial & AR",
    text: "Immersive demos of mixed reality and holographic interfaces.",
    image: "https://picsum.photos/seed/ugnay-spatial/900/1200",
  },
  {
    title: "Quantum & Security",
    text: "Practical quantum and zero-trust sessions for developers.",
    image: "https://picsum.photos/seed/ugnay-quantum/900/1200",
  },
  {
    title: "Robotics & Edge",
    text: "Edge platforms and machines moving AI into the physical world.",
    image: "https://picsum.photos/seed/ugnay-robotics/900/1200",
  },
];

/* ---------- schedule ---------- */
export type SessionItem = {
  title: string;
  speaker?: string;
  role?: string; // affiliation or position
  note?: string; // e.g. the key question for a talk
};

export type Session = {
  time: string;
  title: string;
  meta: string;
  track: string;
  speaker?: string; // now optional
  items?: SessionItem[];
};

export const SCHEDULE: Record<1 | 2 | 3, Session[]> = {
  1: [
    {
      time: "07:00",
      title: "Registration of Participants and Welcome Coffee",
      meta: "2 hrs",
      track: "OPENING",
    },
    {
      time: "09:00",
      title: "Opening Program",
      meta: "1 hr",
      track: "OPENING",
      items: [
        { title: "Master of Ceremonies", speaker: "To be announced" },
        { title: "Invocation", role: "Regions/SUCs" },
        { title: "National Anthem" },
        { title: "Iloilo Provincial Hymn" },
        {
          title: "Welcome Remarks",
          speaker: "Governor Arthur Defensor Jr.",
          role: "Governor, Province of Iloilo",
        },
        {
          title: "Opening Message and Introduction of the Guests of Honor and Keynote Speaker",
          speaker: "Dr. John C. de Leon",
          role: "Executive Director, DA-PhilRice",
        },
        {
          title: "Message",
          speaker: "Secretary Francisco P. Tiu Laurel Jr.",
          role: "Department of Agriculture (DA)",
        },
        {
          title: "Message",
          speaker: "Engr. Christopher V. Morales",
          role: "Undersecretary for Rice Industry Development, DA",
        },
        {
          title: "Message",
          speaker: "Rep. Alfredo Abelardo Benitez",
          role: "Deputy Speaker, House of Representatives",
        },
        { title: "Photo Opportunity and Knowledge Product Launching" },
        { title: "Opening of e-Posters Exhibit" },
      ],
    },
    {
      time: "10:00",
      title: "Networking Break",
      meta: "15 min",
      track: "NETWORKING",
    },
    {
      time: "10:15",
      title: "State of Rice in the Visayas",
      meta: "Plenary Session 1 · 1 hr 45 min",
      track: "PLENARY",
      items: [
        { title: "Chair", speaker: "Dr. Roel R. Suralta (for confirmation)" },
        {
          title: "Where Are We Now?",
          speaker: "Ralph Alan C. Ceniza, FH Bordey, JC Beltran",
          note: "What is the current state of rice production in the Visayas, and what are the major challenges that government and R&D institutions need to address?",
        },
        {
          title: "What Does the Data Tell Us?",
          speaker: "Dr. Lemuel Preciados",
          role: "Department of Economics (Graduate Faculty), Visayas State University (VSU)",
          note: "What do the socioeconomic data tell us about the real condition, competitiveness, and resilience of the Visayan rice sector?",
        },
        {
          title: "Who Are We Doing This For?",
          speaker: "Hazel Tanchuling",
          role: "RWAN",
          note: "Are our current rice research, policies, technologies, and programs solving the problems that farmers actually experience?",
        },
        { title: "Open Forum / Q&A" },
      ],
    },
    {
      time: "12:00",
      title: "Lunch Break",
      meta: "1 hr",
      track: "NETWORKING",
    },
    {
      time: "13:00",
      title: "Bridging the Gaps: Responding to the Visayas Rice Situation",
      meta: "Panel Discussion 1 · 2 hrs",
      track: "PANEL",
      items: [
        { title: "Moderator", speaker: "Dr. Jennifer T. Niones (for confirmation)" },
        { title: "Panelist", speaker: "Dr. Yvonne Pinto", role: "IRRI representative" },
        { title: "Panelist", speaker: "Dir. Remelyn Recoter", role: "ATI" },
        { title: "Panelist", speaker: "Dr. Karen Eloisa T. Barroga", role: "DA-PhilRice" },
        { title: "Panelist", speaker: "Mr. Geron Magbanua", role: "OIC PA, Iloilo" },
      ],
    },
    {
      time: "15:00",
      title: "Concurrent Sessions",
      meta: "Parallel themes · Iloilo City",
      track: "CONCURRENT",
      items: [
        { title: "Theme 1: Rice Variety Innovation" },
        { title: "Theme 2: Smart Crop, Soil, Farm Systems, and Mechanization" },
      ],
    },
    {
      time: "18:00",
      title: "Welcome Dinner",
      meta: "Iloilo City",
      track: "NETWORKING",
    },
  ],
  2: [
    {
      time: "07:00",
      title: "Morning Coffee and Networking",
      meta: "1 hr",
      track: "NETWORKING",
    },
    {
      time: "08:00",
      title: "Recap of Day 1 / Preliminaries",
      meta: "30 min",
      track: "OPENING",
    },
    {
      time: "08:30",
      title: "Scaling Rice Innovations in the Visayas",
      meta: "Plenary Session 2 · 1 hr 30 min",
      track: "PLENARY",
      items: [
        { title: "Chair", speaker: "To be announced" },
        {
          title: "Technology Scaling in Visayas (SRI, Heirloom, Palayamanan, and AgroEcology)",
          speaker: "Dr. Alvin D. Palanog",
        },
        {
          title: "Converging for Impact: Connecting Farmers, Science, Government, and Industry",
          speaker: "Zaldy M. Boloron",
          role: "Regional Technical Director for Research and Regulations, Department of Agriculture - Negros Island Region (DA-RFO NIR)",
          note: "How can farmers, researchers, government, academe, and the private sector work together to accelerate the adoption of rice innovations?",
        },
        {
          title: "Building the Visayas Rice Innovation Ecosystem",
          speaker: "Erica Jane Hadlocon or Rian Kierre Golez",
          role: "Agribnv - Farm Stays & Agricultural Experiences",
          note: "What regional platforms and mechanisms are needed to connect innovations, knowledge, data, financing, and markets across the Visayas?",
        },
        {
          title: "Enabling Scale: Policy, Financing, and Investment for Rice Innovation",
          speaker: "Zarlina B. Cuello",
          role: "Regional Technical Director for Research and Regulations, Department of Agriculture–Western Visayas (DA-RFO VI)",
          note: "What policies, financing mechanisms, and investments are needed to move rice innovations from promising projects to sustainable, large-scale adoption?",
        },
        { title: "Open Forum / Q&A" },
      ],
    },
    {
      time: "10:00",
      title: "Concurrent Sessions",
      meta: "Parallel themes · Iloilo City",
      track: "CONCURRENT",
      items: [
        { title: "Theme 3: Rice-Based Value and Food Innovations" },
        { title: "Theme 4: Cross-Cutting Solutions" },
      ],
    },
    {
      time: "12:00",
      title: "Lunch Break",
      meta: "2 hrs 30 min",
      track: "NETWORKING",
    },
    {
      time: "14:30",
      title: "Presenting the Convergence Plan for the Visayas Rice Agenda",
      meta: "Plenary Session 3",
      track: "PLENARY",
      items: [
        { title: "Chair", speaker: "To be announced" },
        { title: "Rise Visayas (RiceANI)", speaker: "O Abdulkadil" },
        {
          title: "Academe",
          speaker: "Dr. Pauline S. Caintic",
          role: "Head, Visayas Consortium for Agriculture, Aquatic and Resources Programs (ViCARP)",
        },
        {
          title: "Convergence",
          speaker: "Dr. Rex L. Navarro",
          role: "Includes NIA and BSWM",
        },
        {
          title: "Commitment Signing: Research Consortia",
          role: "WESVIARC, VICAARP, WESVAARRDEC, CVAARRDEC",
        },
        { title: "Commitment Signing: BSWM", speaker: "To be announced" },
        { title: "Commitment Signing: NIA", speaker: "To be announced" },
        {
          title: "Commitment Signing: DA, RFOs, and Attached Agencies",
          speaker: "Dennis R. Arpia",
          role: "Regional Executive Director, Department of Agriculture - Western Visayas (DA-RFO VI)",
        },
        {
          title: "Commitment Signing: DA, RFOs, and Attached Agencies",
          speaker: "Angel C. Enriquez, CESO III",
          role: "Regional Executive Director, Department of Agriculture - Central Visayas (DA-RFO VII)",
        },
        {
          title: "Commitment Signing: DA, RFOs, and Attached Agencies",
          speaker: "Rodel G. Macapañas",
          role: "OIC-Regional Executive Director, Department of Agriculture - Eastern Visayas (DA-RFO VIII)",
        },
        {
          title: "Commitment Signing: DA, RFOs, and Attached Agencies",
          speaker: "Engr. Jose Albert A. Barrogo",
          role: "Regional Executive Director, Department of Agriculture - Negros Island Region (DA-RFO NIR)",
        },
        {
          title: "Commitment Signing: International Organization/Agency",
          speaker: "Dr. Yvonne Pinto",
          role: "Director General, International Rice Research Institute",
        },
        { title: "Commitment Signing: Local Government", speaker: "To be announced" },
        {
          title: "Commitment Signing: Non-Government Organization/Civil Society Organization",
          speaker: "To be announced",
        },
        { title: "Commitment Signing: Private Company", speaker: "To be announced" },
        {
          title: "Commitment Signing: Seed Growers' Cooperative",
          speaker: "Hernan M. Samson",
          role: "Chairperson, Quezon Codcod RiceBIS Farmers Agriculture Cooperative",
        },
        { title: "Open Forum / Q&A" },
        { title: "Ceremonial Commitment Signing" },
        { title: "Adoption of the Convergence Plan for the Visayas Rice Agenda" },
        { title: "Synthesis (SDE)", speaker: "Mr. Joselito A. Kalaw" },
      ],
    },
    {
      time: "TBA",
      title: "Networking Break",
      meta: "",
      track: "NETWORKING",
    },
    {
      time: "TBA",
      title: "Fellowship and Governor's Night",
      meta: "Closing program",
      track: "CLOSING",
      items: [
        { title: "Masters of Ceremonies", speaker: "To be announced" },
        { title: "Recognition and Awarding of Best Posters" },
        {
          title: "Closing Message and Vote of Thanks",
          speaker: "Dr. John C. de Leon",
          role: "Executive Director, DA-PhilRice",
        },
        { title: "DA-PhilRice Jingle" },
      ],
    },
  ],
  3: [
    {
      time: "07:00",
      title: "Learning Journey and Technology Exposure",
      meta: "7:00 AM – 12:00 NN · Coordinated by the Regions",
      track: "FIELD VISIT",
      items: [
        { title: "Learning sites and facilitators", role: "To be announced" },
      ],
    },
  ],
};

/* ---------- faq ---------- */
export const FAQS = [
  {
    q: "When and where is the conference taking place?",
    a: "The 37th Ugnay Palay National Rice R4D Conference will be held on 25-27 November 2025. In-person participants will be gathered at the DA-Crop Biotechnology Center Plenary Hall, DA-PhilRice in Nueva Ecija.",
  },
  {
    q: "Who should attend the conference?",
    a: "The DA-PhilRice hosts the annual Ugnay Palay National Rice Research for Development (R4D) Conference to unite stakeholders – researchers, development workers, scientists, policymakers, government officials, farmers, youth in agriculture, and industry partners – toward transforming the industry.",
  },
  {
    q: "Who is the organizer of Ugnay Palay?",
    a: "Ugnay Palay is organized by the Department of Agriculture – Philippine Rice Research Institute.",
  },
  {
    q: "Who can register for the conference?",
    a: "Anyone can register to the 37th Ugnay Palay. We are inviting the rice science community and its stakeholders to attend the Conference. Registration is open until mid-November 2024.",
  },
  {
    q: "How do I register for the conference?",
    a: "You can register for the Ugnay Palay online, either as participant or paper/poster presenter, via",
  },
];

/* ---------- footer ---------- */
export type FootLink = { label: string; href: string; plus?: boolean };

export const FOOT_COLS: { title: string; links: FootLink[] }[] = [
  {
    title: "Event",
    links: [
      { label: "About", href: "#about", plus: true },
      { label: "Schedule", href: "#schedule", plus: true },
    ],
  },
  {
    title: "Speakers",
    links: [
      { label: "Guest of Honor", href: "#speakers" },
      { label: "Keynote Speakers", href: "#speakers" },
      { label: "Panel Discussions", href: "#speakers" },
      { label: "Plenary Sessions", href: "#speakers" },
      { label: "Concurrent Sessions", href: "#speakers" },
    ],
  },
  {
    title: "Attend",
    links: [
      { label: "Register", href: "https://ugnaypalay.philrice.gov.ph/registration-form/ABCDefgHI", plus: true },
      { label: "Venue", href: "https://maps.app.goo.gl/f355RKQp4q6wBeNHA", plus: true },
    ],
  },
  {
    title: "Organizer",
    links: [
      { label: "About DA-PhilRice", href: "https://www.philrice.gov.ph/", plus: true },
      { label: "PinoyRice", href: "https://www.pinoyrice.com", plus: true },
    ],
  },
];

export const LEGAL = [
  "Privacy policy",
  "Terms and conditions for attendees",
  "Code of conduct",
  "Accessibility",
  "Contact",
];
