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
  { n: "42", l: "Speakers" },
  { n: "9", l: "Tracks" },
  { n: "10+", l: "Exhibitors" },
];

const photoModules = import.meta.glob("./assets/photos/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// sorted by file name, so the order is predictable
const photos = Object.keys(photoModules)
  .sort()
  .map((k) => photoModules[k]);

const photo = (i: number) => photos[i % photos.length];

export const FEATURES = [
  {
    title: "",
    text: "",
    image: photo(0)
  },
  {
    title: "",
    text: "",
    image: photo(1)
  },
  {
    title: "",
    text: "",
    image: photo(2)
  },
  {
    title: "",
    text: "",
    image: photo(3)
  },
  {
    title: "",
    text: "",
    image: photo(4)
  },
  {
    title: "",
    text: "",
    image: photo(5)
  },
  {
    title: "",
    text: "",
    image: photo(6)
  },
  {
    title: "",
    text: "",
    image: photo(7)
  },
  {
    title: "",
    text: "",
    image: photo(8)
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
      meta: "2 hrs · Hall A",
      track: "OPENING",
    },
    {
      time: "09:00",
      title: "Opening Program",
      meta: "1 hr · Hall A",
      track: "OPENING",
      items: [
        { title: "Master of Ceremonies", speaker: "Dr. Leylani M. Juliano" },
        {
          title: "Invocation",
          speaker: "Ms. Lalaine P. Perillo",
          role: "Science Research Specialist I, DA-PhilRice Bicol",
        },
        {
          title: "National Anthem",
          speaker:
            "Ms. Loven Babes O. Rafallo, Ms. Danica P. Bane, Ms. Cirl Jeminah L. Domingo",
          role: "DA-PhilRice Bicol",
        },
        { title: "Iloilo Provincial Hymn" },
        {
          title: "Be RICEponsible Pledge",
          speaker: "Dr. Henry M. Corpuz",
          role: "Officer-in-Charge, Office of the Deputy Executive Director for Research, DA-PhilRice",
        },
        {
          title: "Welcome Remarks",
          speaker: "Hon. Arthur R. Defensor Jr.",
          role: "Governor, Iloilo",
        },
        {
          title: "Opening Message and Introduction of Speakers",
          speaker: "Dr. John C. de Leon",
          role: "Executive Director, DA-PhilRice",
        },
        {
          title: "Message of the Guest of Honor",
          speaker: "Secretary Francisco P. Tiu Laurel Jr.",
          role: "Department of Agriculture (DA)",
          note: "To be represented by Engr. Christopher V. Morales, Undersecretary for Rice Industry Development, DA",
        },
        {
          title: "Keynote Address",
          speaker: "Rep. Alfredo Abelardo B. Benitez",
          role: "Deputy Speaker, House of Representatives",
        },
        { title: "Group Photo / Photo Opportunity" },
        { title: "Launching of Knowledge Products" },
        { title: "Ribbon Cutting / Opening of e-Posters Exhibit" },
      ],
    },
    {
      time: "10:00",
      title: "State of Rice in the Visayas",
      meta: "Plenary Session 1 · 2 hrs · Hall A",
      track: "PLENARY",
      items: [
        { title: "Chair", speaker: "Dr. Roel R. Suralta" },
        {
          title: "MRIDP Reach in Visayas: Analysis on Yield, Cost, and Income of Beneficiaries",
          speaker: "Ms. Adriel C. Abando",
          role: "DA-National Rice Program",
        },
        {
          title: "The Current State of Rice in the Visayas: Regional Trends, RCEF Impacts, and Integration of Sustainable Rice Performance Indicators",
          speaker: "Dr. Lemuel S. Preciados",
          role: "Visayas State University (VSU)",
        },
        {
          title: "Bridging Policy and the Farm: Connecting Rice Development with Farmers' Realities",
          speaker: "Ms. Hazel A. Tanchuling",
          role: "Rice Watch Action Network Inc. (RWAN)",
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
      meta: "Panel Discussion 1 · 2 hrs · Hall A",
      track: "PANEL",
      items: [
        { title: "Moderator", speaker: "Ms. Rhemilyn Z. Relado-Sevilla" },
        { title: "Panelist", speaker: "Dr. Alice G. Laborte", role: "IRRI" },
        { title: "Panelist", speaker: "Engr. Remelyn R. Recoter", role: "DA-ATI" },
        { title: "Panelist", speaker: "Dr. Karen Eloisa T. Barroga", role: "DA-PhilRice" },
        {
          title: "Panelist",
          speaker: "Mr. Geron E. Magbanua",
          role: "Office of the Provincial Agriculturist (OPAg), Iloilo",
        },
        {
          title: "Panelist",
          speaker: "Mr. Wilfredo L. Guiñabo Jr.",
          role: "FamilyFarms Inc.",
        },
      ],
    },
    {
      time: "15:00",
      title: "Concurrent Session 1: Rice Variety Innovation",
      meta: "3:00 – 5:00 PM · Hall A",
      track: "CONCURRENT",
      items: [
        { title: "Chair / Moderator", speaker: "Dr. Jonathan M. Niones" },
        {
          title: "Leveraging Industry Actors in Participatory Varietal Selection of New Rice Varieties: Localized Performance, Preference Mapping, and Strategic Positioning in Western Visayas",
          speaker: "Mr. Rinno M. Umadhay",
          role: "DA-RFO 6 (Western Visayas)",
        },
        {
          title: "Participatory Performance Testing and Validation (PPTV) of Newly Released Varieties in Eastern Visayas",
          speaker: "Engr. Ma. Divine Grace T. Inciso",
          role: "DA-RFO 8 (Eastern Visayas)",
        },
        {
          title: "Genotypic and Phenotypic Profiling of Visayas Traditional Rice Varieties",
          speaker: "Mr. Malvin D. Duldulao",
          role: "DA-PhilRice CES",
        },
        {
          title: "A Pest or A Friend: Getting to Know Weedy Rice (Oryza sativa f. spontanea)",
          speaker: "Ms. Rica M. Rentino",
          role: "DA-PhilRice Negros",
        },
        {
          title: "A Digital Platform for Data-Driven Decision-Making in Support to the DA's Fertilization Strategy through Cloud-based Monitoring, Evaluation and Learning",
          speaker: "Ms. April Joy P. Depamaylo",
          role: "DA-RFO 6 (Western Visayas)",
        },
      ],
    },
    {
      time: "15:00",
      title: "Concurrent Session 2: Smart Crop, Soil, Farm Systems, and Mechanization",
      meta: "3:00 – 5:00 PM · Function Rooms 1-2",
      track: "CONCURRENT",
      items: [
        { title: "Chair / Moderator", speaker: "Dr. Jennifer T. Niones" },
        {
          title: "Optimized Crop Establishment Practices Enhance Yield and Income in Direct-Seeded Rice",
          speaker: "Ms. Vanessa N. Sernicula",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Maps to Mandate: Strengthening the Adaptation Plans of Capiz Rice-Based Sector Through Climate Smart Map",
          speaker: "Mr. Jesmar H. Curiba",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Technology Promotion, Demonstration, and Upscaling the Use of Mechanical Transplanter for Rice Production in Irrigated Lowland Ecosystem",
          speaker: "Engr. Flerida A. Demamay",
          role: "DA-RFO 6 (Western Visayas)",
        },
        {
          title: "Technology Promotion, Demonstration, and Upscaling the Use of Seed Sower for Rice Production Established in Different Rice Crop Ecosystems",
          speaker: "Engr. Rener Jay B. Duran",
          role: "DA-RFO 6 (Western Visayas)",
        },
        {
          title: "Upscaling of Adaptive Balanced Fertilization Strategies (ABFS) Through Community Participatory Action Research (CPAR) Approach",
          speaker: "Engr. Lyka M. Hisu-an",
          role: "DA-RFO 6 (Western Visayas)",
        },
      ],
    },
    {
      time: "18:00",
      title: "Welcome Dinner",
      meta: "Hall A",
      track: "NETWORKING",
    },
  ],
  2: [
    {
      time: "07:00",
      title: "Morning Coffee, Networking, and Viewing of Posters",
      meta: "1 hr · Hall A",
      track: "NETWORKING",
    },
    {
      time: "08:00",
      title: "Recap of Day 1 / Preliminaries",
      meta: "30 min · Hall A",
      track: "OPENING",
      items: [{ title: "Master of Ceremonies", speaker: "Dr. Leylani M. Juliano" }],
    },
    {
      time: "08:30",
      title: "Scaling Rice Innovations in the Visayas",
      meta: "Plenary Session 2 · 1 hr 30 min · Hall A",
      track: "PLENARY",
      items: [
        { title: "Chair", speaker: "Mr. Dindo King M. Donayre" },
        {
          title: "Scaling Rice Production Innovations in the Visayas: M&E of Palayamanan, SRI, Heirloom, and Agroecology-based Rice Farming under the Masagana Rice Industry Development Program",
          speaker: "Dr. Alvin D. Palanog",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Converging for Impact: Connecting Farmers, Science, Government, and Industry",
          speaker: "Dr. Zaldy M. Boloron",
          role: "DA – Negros Island Region (DA-RFO NIR)",
        },
        {
          title: "Umani: From a Local Idea to a Connected Agricultural Innovation System",
          speaker: "Ms. Erica Jane Hadlocon",
          role: "Umani",
        },
        {
          title: "Enabling Scale: Policy, Financing, and Investment for Rice Innovation",
          speaker: "Dr. Zarlina B. Cuello",
          role: "DA-RFO 6 (Western Visayas)",
        },
        { title: "Open Forum / Q&A" },
      ],
    },
    {
      time: "10:00",
      title: "Concurrent Session 3: Rice-Based Value and Food Innovations",
      meta: "10:00 AM – 12:00 NN · Function Rooms 1-2",
      track: "CONCURRENT",
      items: [
        { title: "Chair / Moderator", speaker: "Ms. Rosaly V. Manaois" },
        {
          title: "Uncovering the Challenges: A Qualitative Inquiry into the Discontinuation of Rice-based Food Enterprises in Biliran Province",
          speaker: "Ms. Dianne M. Dalin-as",
          role: "Biliran Province State University",
        },
        {
          title: "Market-Mediated Technology Adoption: The PhilGAP Experience of RiceBIS Communities in San Carlos, Negros Occidental",
          speaker: "Ms. Anarie E. Bello",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Profiling Leyte's Rice-Based Enterprises: Practices, Products, and Growth Opportunities",
          speaker: "Mr. Vince G. Lao",
          role: "Visayas State University",
        },
        {
          title: "Beyond Sun and Sight: From Manual to Standardized Rice Kropek Production in Masbate",
          speaker: "Ms. Liafail dC. Davalos",
          role: "DA-PhilRice CES",
        },
        {
          title: "From Training to Practice: Equipping Implementers through Capacity Building and Knowledge Resources to Strengthen Rice-Based Food Enterprises",
          speaker: "Ms. Angela Mae P. Ritaga",
          role: "DA-PhilRice CES",
        },
      ],
    },
    {
      time: "10:00",
      title: "Concurrent Session 4: Cross-Cutting Solutions",
      meta: "10:00 AM – 12:00 NN · Hall A",
      track: "CONCURRENT",
      items: [
        { title: "Chair / Moderator", speaker: "Ms. Alice B. Mataia" },
        {
          title: "Food or Flood: Analyzing Change in Rice Area of Negros Occidental in Relation to Flood Susceptibility in the Province",
          speaker: "Engr. Frij C. Bimbao",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Phenology-Based Detection of Irrigated and Favorable Rainfed Rice Using Multi-Temporal SAR Polarimetric Parameters in Iloilo, Philippines",
          speaker: "Dr. Jean Rochielle F. Mirandilla",
          role: "DA-PhilRice Isabela",
        },
        {
          title: "Performance Evaluation of Rice using RCM Fertilizer Recommendation under Rice and Non-rice Cropping Patterns in Region 8",
          speaker: "Mr. Conrado K. Daluz",
          role: "DA-RFO 8",
        },
        {
          title: "Scaling Rice Production Innovations in the Visayas: Status and Progress of Palayamanan, SRI, and Heirloom Rice Implementation",
          speaker: "Dr. Kristiana Marie G. Dela Cruz",
          role: "DA-PhilRice CES",
        },
        {
          title: "A Zero-Sample Multi-Sensor Framework for Mapping Candidate Upland Rice Areas in the Visayas Region Using Google Earth Engine",
          speaker: "Mr. Zhandon Paul M. Cario",
          role: "DA-PhilRice CES",
        },
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
      title: "Kuan with Juan: RiceBIS Edition",
      meta: "Panel Discussion 2 · 1 hr 30 min · Hall A",
      track: "PANEL",
      items: [
        { title: "Moderator", speaker: "Dr. Diadem B. Gonzales-Esmero" },
        {
          title: "Hosts",
          speaker: "Dr. Karen Eloisa T. Barroga and Ms. Jungie A. Diamsay",
        },
        {
          title: "Panelist",
          speaker: "Mr. Hernan M. Samson",
          role: "Quezon Codcod RiceBIS Farmers' Agriculture Cooperative",
        },
        {
          title: "Panelist",
          speaker: "Ms. Mercedita C. Supangan",
          role: "Quezon Codcod RiceBIS Farmers' Agriculture Cooperative",
        },
        {
          title: "Panelist",
          speaker: "Mr. Mark Edcille A. Canda",
          role: "Lamac Multi-purpose Cooperative",
        },
        {
          title: "Panelist",
          speaker: "Mr. Ric A. Lauron",
          role: "Southern Negros Agrarian Reform Cooperative",
        },
        {
          title: "Panelist",
          speaker: "Mr. Verney M. Briones",
          role: "LGU-San Carlos, Negros Occidental",
        },
        { title: "Panelist", speaker: "Mr. Kher Jake Martin A. Trayco", role: "DTI" },
        {
          title: "Panelist",
          speaker: "Ms. Cielo Luz C. Mondejar",
          role: "DA-PhilRice Negros",
        },
      ],
    },
    {
      time: "14:30",
      title: "Convergence Plan for the Visayas Rice Agenda",
      meta: "Plenary Session 3 · 2 hrs 30 min · Hall A",
      track: "PLENARY",
      items: [
        {
          title: "Chairs",
          speaker: "Ms. Lea D. Abaoag and Ms. Melanie Aileen C. De Peralta",
        },
        {
          title: "Rice Intensification and Sustainability Enhancement in Visayas (RISE Visayas)",
          speaker: "Mr. Ommal H. Abdulkadil",
          role: "DA-PhilRice Negros",
        },
        {
          title: "Mobilizing Academe and Research Consortia for the Visayas Rice Agenda",
          speaker: "Dr. Pauline S. Caintic",
          role: "Visayas Consortium for Agriculture, Aquatic and Natural Resources Program (ViCARP)",
        },
        {
          title: "Convergence for Impact: Strategic Partnerships for RISE Visayas",
          speaker: "Dr. Rex L. Navarro",
          role: "DA-PhilRice",
        },
        { title: "Open Forum / Q&A" },
        {
          title: "Statements of Commitment and Ceremonial Signing: Adoption of the Convergence Plan for the Visayas Rice Agenda",
        },
      ],
    },
    {
      time: "17:00",
      title: "Synthesis",
      meta: "30 min · Hall A",
      track: "PLENARY",
      items: [
        {
          title: "Synthesis",
          speaker: "Mr. Joselito A. Kalaw",
          role: "DA-PhilRice",
        },
      ],
    },
    {
      time: "17:30",
      title: "Networking Break",
      meta: "30 min",
      track: "NETWORKING",
    },
    {
      time: "18:00",
      title: "Fellowship and Governor's Night",
      meta: "Closing program · Hall A",
      track: "CLOSING",
      items: [
        {
          title: "Masters of Ceremonies",
          speaker: "Mr. Albert Christian S. Suñer and Ms. Karenne Jane L. Torilla",
        },
        { title: "Recognition and Awarding of Best Papers and Posters" },
        {
          title: "Closing Message and Vote of Thanks",
          speaker: "Dr. John C. de Leon",
          role: "Executive Director, DA-PhilRice",
        },
        {
          title: "DA-PhilRice Jingle",
          speaker: "Mr. Albert Christian S. Suñer",
          role: "Supervising SRS, DA-PhilRice",
        },
      ],
    },
  ],
  3: [
    {
      time: "07:00",
      title: "Learning Journey and Technology Exposure",
      meta: "7:00 AM – 12:00 NN",
      track: "FIELD VISIT",
      items: [
        { title: "Rice Processing Center" },
        { title: "Agri-Aqua Technology Research Center" },
      ],
    },
    {
      time: "12:00",
      title: "Departure of Participants",
      meta: "",
      track: "CLOSING",
    },
  ],
};

/* ---------- faq ---------- */
export const FAQS = [
  {
    q: "When and where is the conference taking place?",
    a: "The 38th Ugnay Palay National Rice R4D Conference will be held on 23–25 November 2026. In-person participants will be gathered at the Iloilo Convention Center (iCon) in Iloilo City.",
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
    a: "Anyone can register to the 38th Ugnay Palay. We are inviting the rice science community and its stakeholders to attend the Conference.",
  },
  {
    q: "How do I register for the conference?",
    a: "You can register for the Ugnay Palay online, either as participant or paper/poster presenter, using the registration form.",
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
      { label: "Souvenir Program (PDF)", href: "/downloads/ugnay-palay-2026-souvenir-program.pdf" },
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
