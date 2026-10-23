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

/* ---------- speakers ---------- */
export const SPEAKERS = [
  {
    name: "Dr. Aiko Tanaka",
    role: "Chief AI Scientist, Helix Labs",
    topic: "Agentic systems that learn in the wild",
    tag: "AI",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Marcus Reyes",
    role: "Head of Spatial UX, Orbit",
    topic: "Designing interfaces for mixed reality",
    tag: "XR",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Priya Nair",
    role: "VP Quantum, QuBit",
    topic: "Practical quantum for developers",
    tag: "QUANTUM",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Elena Vasquez",
    role: "Robotics Lead, Atlas",
    topic: "Humanoids on the factory floor",
    tag: "ROBOTICS",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Jonas Weber",
    role: "CISO, Sentinel Net",
    topic: "Zero-trust in an AI-first world",
    tag: "SECURITY",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Sofia Lim",
    role: "Founder, Neon Studio",
    topic: "Generative worlds and creative code",
    tag: "CREATIVE",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Kenji Okada",
    role: "Principal Eng., EdgeCore",
    topic: "Intelligence at the edge, at scale",
    tag: "EDGE",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
  {
    name: "Amara Okafor",
    role: "Director, Future Cities Lab",
    topic: "Smart infrastructure for 2040",
    tag: "CITIES",
    image: "https://picsum.photos/seed/speaker-1/640/800",
  },
];

/* ---------- schedule ---------- */
export type Session = {
  time: string;
  title: string;
  meta: string;
  track: string;
  speaker: string;
};

export const SCHEDULE: Record<1 | 2, Session[]> = {
  1: [
    {
      time: "09:00",
      title: "Opening Keynote: Beyond the Horizon",
      meta: "Main stage · 45 min",
      track: "MAIN STAGE",
      speaker: "Aiko Tanaka",
    },
    {
      time: "10:15",
      title: "Designing for Spatial Interfaces",
      meta: "Hands-on · 60 min",
      track: "XR TRACK",
      speaker: "Marcus Reyes",
    },
    {
      time: "11:45",
      title: "Quantum for Developers",
      meta: "Workshop · 60 min",
      track: "DEEP TECH",
      speaker: "Priya Nair",
    },
    {
      time: "13:30",
      title: "Humanoids on the Factory Floor",
      meta: "Session · 45 min",
      track: "ROBOTICS",
      speaker: "Elena Vasquez",
    },
    {
      time: "15:00",
      title: "Zero-Trust in an AI-First World",
      meta: "Session · 45 min",
      track: "SECURITY",
      speaker: "Jonas Weber",
    },
    {
      time: "16:30",
      title: "Closing Panel: Building 2040",
      meta: "Main stage · 60 min",
      track: "MAIN STAGE",
      speaker: "Amara Okafor",
    },
  ],
  2: [
    {
      time: "09:30",
      title: "Generative Worlds Showcase",
      meta: "Main stage · 45 min",
      track: "MAIN STAGE",
      speaker: "Sofia Lim",
    },
    {
      time: "11:00",
      title: "Intelligence at the Edge",
      meta: "Workshop · 90 min",
      track: "ROBOTICS",
      speaker: "Kenji Okada",
    },
    {
      time: "14:00",
      title: "Agentic AI Live Build",
      meta: "Hands-on · 60 min",
      track: "DEEP TECH",
      speaker: "Aiko Tanaka",
    },
    {
      time: "16:00",
      title: "Founders Fireside & Closing",
      meta: "Main stage · 60 min",
      track: "MAIN STAGE",
      speaker: "Marcus Reyes",
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
