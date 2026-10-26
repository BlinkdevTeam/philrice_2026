export type Speaker = {
  name: string;
  role: string;
  part?: string; // their part in the session: Chair, Moderator, Panelist...
  topic?: string;
  bio?: string;
  image?: string;
};
export type Session = { title: string; speakers: Speaker[] };
export type SpeakerGroup = { id: string; label: string; sessions: Session[] };

const TBA = "To be announced";

// Dr. Pinto appears in two sessions with a different part in each
const pinto = (part: string): Speaker => ({
  name: "Dr. Yvonne Pinto",
  role: "Director General, International Rice Research Institute",
  part,
});

export const SPEAKER_GROUPS: SpeakerGroup[] = [
  {
    id: "featured",
    label: "Featured",
    sessions: [
      {
        title: "Guest of Honor",
        speakers: [
          {
            name: "Sec. Francisco P. Tiu Laurel Jr.",
            role: "Secretary, Department of Agriculture (DA)",
          },
        ],
      },
      {
        title: "Keynote Speakers",
        speakers: [
          {
            name: "Engr. Christopher V. Morales",
            role: "Undersecretary for Rice Industry Development, DA",
          },
          {
            name: "Rep. Alfredo Abelardo Benitez",
            role: "Deputy Speaker, House of Representatives",
          },
        ],
      },
    ],
  },
  {
    id: "program",
    label: "Opening Program",
    sessions: [
      {
        title: "Opening Program",
        speakers: [
          {
            name: "Gov. Arthur Defensor Jr.",
            role: "Governor, Province of Iloilo",
            part: "Welcome Remarks",
          },
          {
            name: "Dr. John C. de Leon",
            role: "Executive Director, DA-PhilRice",
            part: "Opening and Closing Messages",
          },
        ],
      },
    ],
  },
  {
    id: "plenary",
    label: "Plenary Sessions",
    sessions: [
      {
        title: "Plenary Session 1",
        speakers: [
          { name: "Dr. Roel R. Suralta", role: TBA, part: "Chair" }, // for confirmation
          {
            name: "Ralph Alan C. Ceniza",
            role: TBA,
            topic: "Where Are We Now?",
          },
          {
            name: "FH Bordey",
            role: TBA,
            topic: "Where Are We Now?",
          },
          {
            name: "JC Beltran",
            role: TBA,
            topic: "Where Are We Now?",
          },
          {
            name: "Dr. Lemuel Preciados",
            role: "Department of Economics (Graduate Faculty), Visayas State University (VSU)",
            topic: "What Does the Data Tell Us?",
          },
          {
            name: "Hazel Tanchuling",
            role: "RWAN",
            topic: "Who Are We Doing This For?",
          },
        ],
      },
      {
        title: "Plenary Session 2",
        speakers: [
          {
            name: "Dr. Alvin D. Palanog",
            role: TBA,
            topic:
              "Technology Scaling in Visayas (SRI, Heirloom, Palayamanan, and AgroEcology)",
          },
          {
            name: "Zaldy M. Boloron",
            role: "Regional Technical Director for Research and Regulations, DA-RFO NIR",
            topic:
              "Converging for Impact: Connecting Farmers, Science, Government, and Industry",
          },
          {
            name: "Erica Jane Hadlocon or Rian Kierre Golez", // to be finalized
            role: "Agribnv - Farm Stays & Agricultural Experiences",
            topic: "Building the Visayas Rice Innovation Ecosystem",
          },
          {
            name: "Zarlina B. Cuello",
            role: "Regional Technical Director for Research and Regulations, DA-RFO VI",
            topic:
              "Enabling Scale: Policy, Financing, and Investment for Rice Innovation",
          },
        ],
      },
      {
        title: "Plenary Session 3",
        speakers: [
          {
            name: "O Abdulkadil", // check the full name
            role: "Rise Visayas (RiceANI)",
          },
          {
            name: "Dr. Pauline S. Caintic",
            role: "Head, Visayas Consortium for Agriculture, Aquatic and Resources Programs (ViCARP)",
            part: "Academe",
          },
          { name: "Dr. Rex L. Navarro", role: TBA, topic: "Convergence" },
          {
            name: "Dennis R. Arpia",
            role: "Regional Executive Director, DA-RFO VI",
            part: "Commitment Signing",
          },
          {
            name: "Angel C. Enriquez, CESO III",
            role: "Regional Executive Director, DA-RFO VII",
            part: "Commitment Signing",
          },
          {
            name: "Rodel G. Macapañas",
            role: "OIC-Regional Executive Director, DA-RFO VIII",
            part: "Commitment Signing",
          },
          {
            name: "Engr. Jose Albert A. Barrogo",
            role: "Regional Executive Director, DA-RFO NIR",
            part: "Commitment Signing",
          },
          pinto("Commitment Signing"),
          {
            name: "Hernan M. Samson",
            role: "Chairperson, Quezon Codcod RiceBIS Farmers Agriculture Cooperative",
            part: "Commitment Signing",
          },
          { name: "Mr. Joselito A. Kalaw", role: TBA, part: "Synthesis" },
        ],
      },
    ],
  },
  {
    id: "panels",
    label: "Panel Discussions",
    sessions: [
      {
        title: "Panel Discussion 1",
        speakers: [
          { name: "Dr. Jennifer T. Niones", role: TBA, part: "Moderator" }, // for confirmation
          { ...pinto("Panelist") },
          { name: "Dir. Remelyn Recoter", role: "ATI", part: "Panelist" },
          {
            name: "Dr. Karen Eloisa T. Barroga",
            role: "DA-PhilRice",
            part: "Panelist",
          },
          {
            name: "Mr. Geron Magbanua",
            role: "OIC PA, Iloilo",
            part: "Panelist",
          },
        ],
      },
    ],
  },
  // Concurrent Sessions: add this group once presenters are known
  // {
  //   id: "concurrent",
  //   label: "Concurrent Sessions",
  //   sessions: [
  //     { title: "Theme 1: Rice Variety Innovation", speakers: [] },
  //     { title: "Theme 2: Smart Crop, Soil, Farm Systems, and Mechanization", speakers: [] },
  //     { title: "Theme 3: Rice-Based Value and Food Innovations", speakers: [] },
  //     { title: "Theme 4: Cross-Cutting Solutions", speakers: [] },
  //   ],
  // },
];