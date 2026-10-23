export type Speaker = {
  name: string;
  role: string;
  topic?: string;
  bio?: string;
  image?: string;
};
export type Session = { title: string; speakers: Speaker[] };
export type SpeakerGroup = { id: string; label: string; sessions: Session[] };

// placeholder generator, delete once you have the real list
let seed = 0;
const ph = (count: number): Speaker[] =>
  Array.from({ length: count }, () => {
    seed += 1;
    return {
      name: `Speaker ${seed}`,
      role: "Position, Organization",
      topic: "Title of the talk goes here",
      bio: "Short biography goes here. Two or three sentences about their background, their work in the rice industry, and what they will share at the conference. Short biography goes here. Two or three sentences about their background, their work in the rice industry, and what they will share at the conference.",
      image: `https://picsum.photos/seed/spk-${seed}/400/500`,
    };
  });

export const SPEAKER_GROUPS: SpeakerGroup[] = [
  {
    id: "featured",
    label: "Featured",
    sessions: [
      { title: "Guest of Honor", speakers: ph(1) },
      { title: "Keynote Speakers", speakers: ph(2) },
    ],
  },
  {
    id: "panels",
    label: "Panel Discussions",
    sessions: [
      { title: "Panel Discussion 1", speakers: ph(4) },
      { title: "Panel Discussion 2", speakers: ph(6) },
      { title: "Panel Discussion 3", speakers: ph(12) },
    ],
  },
  {
    id: "plenary",
    label: "Plenary Sessions",
    sessions: [
      { title: "Plenary Session 1", speakers: ph(3) },
      { title: "Plenary Session 2", speakers: ph(2) },
    ],
  },
  {
    id: "concurrent",
    label: "Concurrent Sessions",
    sessions: [
      { title: "Concurrent Session 1a", speakers: ph(8) },
      { title: "Concurrent Session 1b", speakers: ph(7) },
      { title: "Concurrent Session 2a", speakers: ph(5) },
      { title: "Concurrent Session 2b", speakers: ph(5) },
    ],
  },
];