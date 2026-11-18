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

// const TBA = "To be announced";

// Dr. Pinto appears in two sessions with a different part in each
// const pinto = (part: string): Speaker => ({
//   name: "Dr. Yvonne Pinto",
// role: "Director General, International Rice Research Institute",
//   part,
// });

// const allFiles = import.meta.glob("./assets/speakerphotos/webp/*", {
//   eager: true,
//   import: "default",
// }) as Record<string, string>;

// const files = Object.fromEntries(
//   Object.entries(allFiles).filter(([p]) =>
//     /\.(jpe?g|png|webp|avif)$/i.test(p),
//   ),
// );

// compare names ignoring case, extension and punctuation:
// "Tiu-Laurel-Jr_.png" matches photo("tiu-laurel-jr") and photo("TiuLaurelJr")
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const buildIndex = (all: Record<string, string>) =>
  new Map(
    Object.entries(all)
      .filter(([p]) => /\.(jpe?g|png|webp|avif)$/i.test(p))
      .map(([path, url]) => [
        norm(path.split("/").pop()!.replace(/\.[^.]+$/, "")),
        url,
      ]),
  );

const photoIndex = buildIndex(
  import.meta.glob("./assets/speakerphotos/webp/*", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
);

const thumbIndex = buildIndex(
  import.meta.glob("./assets/speakerphotos/thumbs/*", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
);

// full url -> thumbnail url
const thumbs = new Map<string, string>();
photoIndex.forEach((full, key) => {
  const t = thumbIndex.get(key);
  if (t) thumbs.set(full, t);
});

export const thumbOf = (url?: string) => (url ? (thumbs.get(url) ?? url) : undefined);

const photo = (name: string): string | undefined => photoIndex.get(norm(name));

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
            image: photo("tiu-laurel-jr"),
            bio: "Agriculture Secretary Francisco “Kiko” P. Tiu Laurel Jr. shares President Ferdinand R. Marcos Jr.’s vision to modernize Philippine agriculture, uplift farmers and fishers, and achieve national food security.Drawing on decades of experience in fisheries (notably Frabelle Fishing Corporation), food processing, logistics, and sustainable resource management, he aims to transform the sector through science, mechanization, and modern technology to build a thriving, self-sufficient Philippines.",
          },
        ],
      },
      {
        title: "Keynote Speakers",
        speakers: [
          // {
          //   name: "Engr. Christopher V. Morales",
          // role: "Undersecretary for Rice Industry Development, DA",
          // },
          {
            name: "Cong. Alfredo Abelardo Benitez",
            image: photo("benitez"),
            role: "Deputy Speaker, House of Representatives",
            bio:"Rep. Alfredo Abelardo “Albee” B. Benitez represents Bacolod City’s Lone District and serves as Deputy Speaker of the House of Representatives in the 20th Congress. He also convenes the Visayan Bloc, bringing together Visayas lawmakers to advance regional development. He holds a Mathematics degree from the College of William & Mary and previously led businesses in the leisure, entertainment, and media industries.He served three terms as Representative of Negros Occidental’s 3rd District (2010–2019), helping pass the Sugarcane Industry Development Act of 2015. He later served as Mayor of Bacolod City from 2022 to 2025, chaired the League of Cities of the Philippines, and launched the city's ₱20-per-kilo rice program. He is also a former national badminton athlete and supports community initiatives through the Betty Bantug Benitez Foundation.",
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
        title: "Welcome Remarks",
        speakers: [
          {
            name: "Hon. Arthur Defensor Jr.",
            image: photo("defensor_jr"),
            role: "Governor, Province of Iloilo",
            part: "Welcome Remarks",
            bio:"",
          },
        ],
      },
      {
        title: "Opening Program",
        speakers: [
          {
            name: "Dr. John C. de Leon",
            image: photo("de_leon"),
            role: "Executive Director, DA-PhilRice",
            part: "Opening and Closing Messages",
            bio:"",
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
          // image: photo("benitez"),{ name: "Dr. Roel R. Suralta", 
          // role: "", part: "Chair" },
          {
            name: "Ms. Adriel C. Abando",
            image: photo("abando"),
            role: "DA-National Rice Program",
            topic: "MRIDP Reach in Visayas: Analysis on Yield, Cost, and Income of Beneficiaries",
            bio: "Ms. Adriel C. Abando is a licensed Agriculturist with over 12 years of government service, specializing in agricultural planning, policy development, research, and monitoring and evaluation. She currently serves as Deputy Director of the Department of Agriculture’s National Rice Program, supporting strategic planning, policy formulation, and initiatives under the Masagana Rice Industry Development Program to improve rice productivity and farmer incomes. Previously, she served as Supervising Agriculturist at the DA-Bureau of Agricultural Research and spent nearly a decade in the DA’s Field Programs Operational Planning Division. She holds a Bachelor of Science in Agriculture from UPLB and is currently pursuing a Master of Public Administration at UP Diliman.",
          },
          {
            name: "Dr. Lemuel S. Preciados",
            image: photo("preciados"),
            role: "Visayas State University (VSU)",
            topic: "The Current State of Rice in the Visayas: Regional Trends, RCEF Impacts, and Integration of Sustainable Rice Performance Indicators",
            bio: "Dr. Lemuel S. Preciados is an Associate Professor IV at Visayas State University, where he also serves as Head of Global University Affairs. He holds a PhD in Agricultural and Environmental Economics and an MS in International Economics and Finance from The University of Queensland, Australia. His research focuses on agricultural and environmental economics, value chains, impact evaluation, and sustainability, with projects supported by ACIAR, CSIRO, and other development partners. He has led and contributed to various agricultural value chain assessments, feasibility studies, and impact evaluations, including research on rice production, nitrogen-use efficiency, and greenhouse gas emissions. He has presented at international and national research conferences and contributes to strengthening agricultural competitiveness, evidence-based policymaking, and sustainable food systems in the Philippines.",
          },
          {
            name: "Ms. Hazel Tanchuling",
            image: photo("tanchuling"),
            role: "Rice Watch Action Network Inc. (RWAN)",
            topic: "Bridging Policy and the Farm: Connecting Rice Development with Farmers’ Realities",
            bio:"Hazel Arandez-Tanchuling is a development practitioner with over 30 years of experience in food sovereignty, rural development, and agricultural policy. She currently serves as Executive Director of the Rice Watch Action Network, Inc. (R1) and represents stakeholders in national bodies such as the Philippine Council for Agriculture and Fisheries, advocating for rice policy, food security, and climate adaptation. Her work focuses on empowering smallholder farmers through gender equality, climate-resilient agriculture, biodiversity conservation, and sustainable farming systems. She has also collaborated with rural communities, local governments, and Southeast Asian networks, contributing to policy discussions on agricultural trade, food sovereignty, and farmer empowerment.",
          },
        ],
      },
      {
        title: "Plenary Session 2",
        speakers: [
          {
            name: "Dr. Alvin D. Palanog",
            image: photo("palanog"),
            role: "DA-PhilRice Negros",
            topic: "Scaling Rice Production Innovations in the Visayas: M&E of Palayamanan, SRI, Heirloom, and Agroecology-based Rice Farming under the Masagana Rice Industry Development Program  ",
            bio:"Dr. Alvin D. Palanog is a Senior Science Research Specialist at DA-PhilRice Negros, where he leads process monitoring and evaluation for the System of Rice Intensification (SRI). He holds bachelor's, master's, and Ph.D. degrees in Agriculture and Plant Breeding from the University of the Philippines Los Baños and has authored or co-authored 22 technical publications. Recognized as an Outstanding UPLB Alumnus in Science and Technology, he has received numerous research awards, including Best Paper at the 2021 Crop Science Society of the Philippines Conference and Best Presentation at the 2025 International Agriculture Conference in Bangkok. His research has also earned top poster presentation awards at various national and international conferences.",
          },
          {
            name: "Dr. Zaldy M. Boloron",
            image: photo("boloron"),
            role: "DA – Negros Island Region (DA-RFO NIR)",
            topic: "Converging for Impact: Connecting Farmers, Science, Government, and Industry",
            bio:"Dr. Zaldy M. Boloron is the Regional Technical Director for Research and Regulations at the Department of Agriculture – Negros Island Region (DA-NIR). He holds a Bachelor’s Degree in Fisheries and a Master in Public Administration from Mindanao State University, as well as a PhD in Rural Development from the University of Southern Mindanao. He is recognized as a key architect of the GATAS Program, which addresses malnutrition, peacebuilding, and the economic empowerment of farmers. His contributions to agriculture and rural development have earned him several distinctions, including the 2024 MOSLIV Public Servant of the Year Award for Excellence in Peace and Nation-building and the 2026 Global Hero Award for Public Service in advancing sustainable regional governance.",
          },
          {
            name: "Ms. Erica Jane Hadlocon ",
            image: photo("hadlocon"),
            role: "Umani",
            topic: "Umani: From a Local Idea to a Connected Agricultural Innovation Ecosystem",
            bio:"Erica Jane Hadlocon is a young agricultural innovator and entrepreneur who relocated from Manila to Guimaras. A cum laude graduate of Psychology from the University of the East, she is the National Top 1 Awardee of the Department of Agriculture’s Young Farmers Challenge Start-Up Component under the Digital Agriculture Category. Alongside her partner, she helps develop Golez Farmhouse and co-founded Umani, a digital platform connecting farmers, agricultural products, and farm-based experiences with consumers. Through technology, Umani aims to expand market opportunities, empower farmers, and promote sustainable agricultural growth in the Philippines.",
          },
          {
            name: "Dr. Zarlina B. Cuello",
            image: photo("cuello"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "Enabling Scale: Policy, Financing, and Investment for Rice Innovation",
            bio:"Director Zarlina Baterbonia Cuello serves as the Regional Technical Director for Research and Regulations at the Department of Agriculture – Western Visayas. With academic backgrounds in Biological Sciences, Law, and Public Management, she leads initiatives that strengthen research, regulatory frameworks, sustainable agriculture, and science-based decision-making. She also serves as the DA RFO 6 Gender and Development Alternate Chairperson, Organic Agriculture Program focal person, and Co-Chair of AFRRREDN – Western Visayas. She advocates for inclusive and climate-resilient agricultural development, particularly through empowering rural women and promoting sustainable farming practices. As a small farmer herself, she integrates rice production with high-value commercial crops, bringing practical farming experience into her leadership and agricultural research initiatives.",
          },
        ],
      },
      {
        title: "Plenary Session 3",
        speakers: [
          {
            name: "Mr. Ommal H. Abdulkadil",
            image: photo("abdulkadil"),
            role: "DA-PhilRice Negros",
            topic: "Rice Intensification and Sustainability Enhancement in Visayas (RISE Visayas)",
            bio:"Mr. Ommal H. Abdulkadil serves as Director I of PhilRice Negros, bringing over 20 years of experience in agricultural research, development, and extension management. He holds degrees in Agriculture and Plant Pathology from the University of Southern Mindanao and UPLB, as well as a Master in Development Management from the Development Academy of the Philippines. Starting as a Research Assistant, he steadily advanced to his current leadership position. His dedication to public service and institutional development has earned him several recognitions, including the 2019 Galing Midsayapeño Outstanding Government Service Award and multiple PhilRice Outstanding Development Worker awards.",
          },
          {
            name: "Dr. Rex L. Navarro",
            image: photo("navarro"),
            role: "DA-PhilRice",
            topic: "Convergence for Impact: Strategic Partnerships for RISE Visayas",
            bio:"Dr. Rex Lagundino Navarro is an expert in institutional development, agricultural extension, and strategic communication, with extensive national and international experience. He previously served as Director of the UPLB Institute of Development Communication and the DA Agricultural Training Institute. He currently serves as Senior Consultant to PhilRice, Board Member of PARRFI, and Vice President of CAMP. He holds a Doctorate in Public Administration from UP Diliman and bachelor's and master's degrees in Development Communication from UPLB. He has contributed to major agricultural initiatives, including the PhilRice 2023–2028 Strategic Plan, the DA's unified Research, Rural Development, and Extension Agenda, and the pioneering Province-led Agriculture and Fisheries Extension Systems (PAFES). His international engagements include collaborations with ICRISAT, CGIAR, ADB, USAID, EU, and other development organizations across several regions. As a hybrid rice farmer, he combines institutional expertise with practical agricultural experience to advance farmer-centered development and stronger agricultural extension systems.",
          },
          {
            name: "Dr. Pauline S. Caintic",
            image: photo("caintic"),
            role: "Visayas Consortium for Agriculture, Aquatic and Natural Resources Program (ViCARP)",
            topic: "Mobilizing Academe and Research Consortia for the Visayas Rice Agenda",
            bio:"Dr. Pauline S. Caintic is an Assistant Professor IV at Visayas State University (VSU), specializing in entrepreneurship, agribusiness, and innovation. She holds a PhD in Business Administration from the University of San Carlos and a Master in Management from VSU. She also participated in an academic exchange program at Masaryk University in the Czech Republic. She currently serves as Deputy Director of the Visayas Consortium for Agriculture, Aquatic and Natural Resources Program (ViCARP), where she has contributed for over 20 years. Her work focuses on research and development, technology transfer, commercialization, and strengthening partnerships among regional institutions to support agricultural and natural resource development in Region 8.",
          },
          // pinto("Commitment Signing"),
          // image: photo("benitez"),{ name: "Mr. Joselito A. Kalaw", 
          // role: "", part: "Synthesis" },
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
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Dr. Alice G. Laborte",
            image: photo("laborte"),
            role: "IRRI",
            topic: "Bridging the Gaps: Responding to the Visayas Rice Situation",
            bio:"Dr. Alice G. Laborte is a Senior Scientist in Geospatial Science at the International Rice Research Institute (IRRI), where she leads the Digital and Spatial Landscape Transformation Research Unit and coordinates IRRI’s research program in the Philippines. Her work focuses on remote sensing, geospatial analysis, spatial modeling, and digital technologies to monitor rice production and support sustainable, climate-resilient agriculture. She holds a PhD in Production Ecology and Resource Conservation from Wageningen University, a Master of Geographic Information Systems from the University of Queensland, and a Bachelor of Science in Statistics from the University of the Philippines Los Baños.",
          },
          {
            name: "Dir. Remelyn R. Recoter",
            image: photo("recoter"),
            role: "DA-ATI",
            topic: "Bridging the Gaps: Responding to the Visayas Rice Situation",
            bio:"Engr. Remelyn R. Recoter is the National Director of the Agricultural Training Institute (ATI), with nearly 37 years of government service in agricultural extension, capacity building, and rural development. She leads nationwide training and knowledge-sharing initiatives that empower farmers, women, youth, and other agricultural stakeholders. She has also spearheaded programs such as AgriKids, DigiAgriHack, internship opportunities, and the e-Extension Program. Previously, she served as Regional Executive Director of the Department of Agriculture in Davao and Western Visayas. She holds a degree in Chemical Engineering from Central Philippine University and a Master in Public Administration from the University of San Agustin. A CESO III and Lieutenant Colonel in the Philippine military reserves, she has received several recognitions, including the 2023 Most Outstanding Aklanon in Government Service and the 2024 Outstanding Reservist Alumna Award.",
          },
          {
            name: "Dr. Karen Eloisa T. Barroga",
            image: photo("barroga"),
            role: "DA-PhilRice",
            topic: "Bridging the Gaps: Responding to the Visayas Rice Situation",
            bio:"Dr. Karen Eloisa R. Tanzo-Barroga is the Deputy Executive Director for Development of DA-PhilRice, leading nationwide extension initiatives that empower rice farming communities. She oversees the PhilRice Extension Program under RCEF and supports technology adoption through programs such as the Rice Business Innovations System and Healthier Rice. She also contributed to the PalayCheck System, promoting science-based rice farming practices and strengthening agricultural extension training. Her contributions have earned her the Crop Science Society of the Philippines Achievement Award in Extension and the UPLB Outstanding Alumna Award for Agricultural Extension and Communication. She holds a PhD from the University of Western Australia, master's degrees in Development Management and Development Communication, and recently completed an Executive Masterclass at the Asian Institute of Digital Transformation.",
          },
          {
            name: "Mr. Geron E. Magbanua",
            image: photo("magbanua"),
            role: "Office of the Provincial Agriculturist (OPAg), Iloilo",
            topic: "Bridging the Gaps: Responding to the Visayas Rice Situation",
            bio:"Mr. Geron E. Magbanua serves as the Acting Provincial Agriculturist of Iloilo, bringing extensive experience in agricultural administration, crop production, and extension services. He previously held leadership roles as Chief of the Crops Division, Plant Manager of the Iloilo Rice Processing Complex, and Provincial Rice and Seed Coordinator. He began his government career in 2012 as an Agricultural Technologist and also worked as an agricultural information officer and radio farmcaster. A Licensed Agriculturist, he graduated cum laude in Agriculture majoring in Crop Science and earned a Master's Degree in Plant Science from West Visayas State University. He has completed specialized training in rice production, mechanization, seed certification, and agricultural extension, supporting the advancement of rice farming and agricultural development in Iloilo.",
          },
          {
            name: "Mr. Wilfredo L. Guinabo Jr.",
            image: photo("guinabo_jr"),
            role: "FamilyFarms Inc.",
            topic: "Bridging the Gaps: Responding to the Visayas Rice Situation",
            bio:"Mr. Wilfredo L. Guiñabo Jr., also known as Paolo, is the General Manager of FamilyFarms Inc., with over 20 years of experience in social enterprise development and management. He specializes in integrating organic and social standards into business operations, empowering marginalized farming communities, and strengthening agricultural value chains. His expertise includes social enterprise governance, product value-chain management, and organic agriculture standards. Through his leadership, he promotes sustainable farming, safe food, and stronger connections between farmers and consumers.",
          },
        ],
      },
      {
        title: "Panel Discussion 2",
        speakers: [
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Mr. Herman M. Samson",
            image: photo("samson"),
            role: "Quezon Codcod RiceBIS Farmers' Agriculture Cooperative",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Mr. Hernan M. Samson has over 15 years of experience as a Mechanical Technician at Golay Buchel Philippines Inc. and has been an active rice farmer since 2014. His technical background and agricultural experience support his involvement in improving local farming operations and community development. He served as President of the Initihan River Irrigators Association, Inc. from 2022 to 2025 and currently chairs the Quezon Codcod RiceBIS Farmers Agriculture Cooperative, a position he has held since 2023. He focuses on strengthening farmer collaboration, collective economic growth, and sustainable rice farming practices.",
          },
          {
            name: "Ms. Mercedita C. Supangan",
            image: photo("supangan"),
            role: "Quezon Codcod RiceBIS Farmers' Agriculture Cooperative",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Ms. Mercedita C. Supangan is a farmer and agripreneur from San Carlos City, Negros Occidental, and a member of the Quezon Codcod RiceBIS Farmers Agriculture Cooperative. Through the DA-PhilRice Negros RiceBIS Program, she developed her farming skills and transformed her farm into a sustainable agricultural enterprise. Her farm, Mercy’s Farm, became PhilGAP-certified for rice and vegetables in 2024, making her the first farmer in Western Visayas to achieve this distinction. Her achievements have earned her recognition as an outstanding rice farmer and rural woman, inspiring other farmers to pursue sustainable and profitable agriculture.",
          },
          {
            name: "Mark Edcille A. Canda",
            image: photo("canda"),
            role: "Lamac Multi-purpose Cooperative",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Mr. Mark Edcille A. Canda is a cooperative management professional currently serving as Division Manager for the Business Development Center and Research, Advocacy, and Engagement Division of Lamac Multi-Purpose Cooperative. Since joining in 2017, he has held various positions, including Teller and Training Officer. He also has experience in community development through the KALAHI-CIDSS NCDDP program in Corella, Bohol. He holds a BS in Business Administration majoring in Operations Management from the University of San Jose-Recoletos and completed the Certificate of Professional Teaching Program at the University of Bohol. He is a certified trainer for Basic Cooperative Courses Levels 1 and 2, a recognized Regional Information Officer for the Philippine Carabao Center, and holds Career Service Non-Professional Eligibility.",
          },
          {
            name: "Mr. Ric A. Lauron",
            image: photo("lauron"),
            role: "Southern Negros Agrarian Reform Cooperative",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Mr. Ric A. Lauron has been serving in ministry since 1987 and is an experienced agricultural cooperative leader. He currently serves as Chairman of the Board of the Southern Negros Agrarian Reform Cooperative (SONARCO) and Vice President of the Rice Federation of Negros Occidental. He previously led the Alliance of HOG Raisers Associations of Negros Occidental (AHRANO) and the Himamaylan City HOG Raisers Association (HIMCHORAS), demonstrating his commitment to community service, cooperative development, and organizational leadership.",
          },
          {
            name: "Mr. Verney M. Briones",
            image: photo("briones"),
            role: "LGU-San Carlos, Negros Occidental",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Mr. Verney M. Briones is a licensed agriculturist with a Master of Science in Agriculture majoring in Crop Science. He currently serves as Administrative Assistant VI at the City Agriculture Office of LGU-San Carlos, Negros Occidental, specializing in rice production, integrated pest management, Good Agricultural Practices, irrigation, soil nutrient management, and farmer development. He is committed to strengthening agricultural extension services and promoting sustainable, climate-resilient farming through technical support, training, and effective program implementation.",
          },
          {
            name: "Mr. Kher Jake Martin A. Trayco",
            image: photo("trayco"),
            role: "DTI",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Mr. Kher Jake Martin A. Trayco is a Senior Trade-Industry Development Specialist and Agri-Enterprise Consultant at the Department of Trade and Industry under the Comprehensive Agrarian Reform Program. He leads initiatives in MSME development, capacity building, product development, and market linkages for agrarian reform organizations. Previously, he served as a Business Counselor at the Negosyo Center in Bago City, providing business registration and advisory services. He holds a BS in Business Administration, double-majoring in Marketing Management and Business Economics, from the University of St. La Salle.",
          },
          {
            name: "Ms. Cielo Luz C. Mondejar",
            image: photo("mondejar"),
            role: "DA-PhilRice Negros",
            topic: "Kuan with Juan: RiceBIS Edition",
            bio:"Ms. Cielo Luz C. Mondejar is a Science Research Specialist II and Research and Development Coordinator at DA-PhilRice Negros. She holds a BS in Agriculture majoring in Agronomy and an MS in Molecular Biology and Biotechnology from the University of the Philippines Los Baños. Her expertise includes agronomy, agricultural biotechnology, molecular biology, and plant breeding, with 16 scientific publications covering rice production, water governance, ratooning, and biofertilizers. She leads initiatives such as the Rice Business Innovations System (RiceBIS), R4D for Water-scarce Environments in the Visayas, and the CREATE Project. Her work focuses on promoting organic farming, developing climate-resilient rice technologies, and strengthening farmers' capabilities across the Visayas.",
          },
        ],
      },
    ],
  },
  {
    id: "concurrent",
    label: "Concurrent Session",
    sessions: [
      {
        title: "Concurrent Session 1",
        speakers: [
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Mr. Rinno M. Umadhay",
            image: photo("umadhay"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "Leveraging Industry Actors in Participatory Varietal Selection of New Rice Varieties: Localized Performance, Preference Mapping, and Strategic Position",
            bio:"",
          },
          {
            name: "Engr. Ma. Divine Grace T. Inciso",
            image: photo("inciso"),
            role: "DA-RFO 8 (Eastern Visayas)",
            topic: "Participatory Performance Testing and Validation (PPTV) of Newly Released Varieties in Eastern Visayas",
            bio:"",
          },
          {
            name: "Mr. Malvin D. Duldulao",
            image: photo("duldulao"),
            role: "DA-PhilRice CES",
            topic: "Genotypic and Phenotypic Profiling of Visayas Traditional Rice Varieties",
            bio:"",
          },
          {
            name: "Ms. Rica M. Rentino",
            image: photo("rentino"),
            role: "DA-PhilRice Negros",
            topic: "A Pest or A Friend: Getting to Know Weedy Rice (Oryza sativa f. spontanea)",
            bio:"",
          },
          {
            name: "Ms. April Joy P. Depamaylo",
            image: photo("depamaylo"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "A Digital Platform for Data-Driven Decision-Making in Support to the DA'S Fertilization Strategy through Cloud-based Monitoring, Evaluation and Learning (MEL) of Rice Extension Interventions of the Department of Agriculture",
            bio:"",
          },
        ],
      },
      {
        title: "Concurrent Session 2",
        speakers: [
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Ms. Vanessa N. Sernicula",
            image: photo("sernicula"),
            role: "DA-PhilRice Negros",
            topic: "Optimized Crop Establishment Practices Enhance Yield and Income in Direct-Seeded Rice",
            bio:"",
          },
          {
            name: "Mr. Jesmar H. Curiba",
            image: photo("curiba"),
            role: "DA-PhilRice Negros",
            topic: "Maps to Mandate: Strengthening the Adaptation Plans of Capiz Rice-Based Sector Through Climate Smart Map",
            bio:"",
          },
          {
            name: "Engr. Flerida A. Demamay",
            image: photo("demamay"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "Technology Promotion, Demonstration, and Upscaling the Use of Mechanical Transplanter for Rice Production in Irrigated Lowland Ecosystem",
            bio:"",
          },
          {
            name: "Mr. Rener Jay B. Duran ",
            image: photo("duran"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "Technology Promotion, Demonstration, and Upscaling the Use of Seed Sower for Rice Production Established in Different Rice Crop Ecosystem",
            bio:"",
          },
          {
            name: "Engr. Lyka M. Hisu-an",
            image: photo("hisu-an"),
            role: "DA-RFO 6 (Western Visayas)",
            topic: "Upscaling of Adaptive Balanced Fertilization Strategies (ABFS) Through Community Participatory Action Research (CPAR) Approach",
            bio:"",
          },
        ],
      },
      {
        title: "Concurrent Session 3",
        speakers: [
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Ms. Dianne M. Dalin-as  ",
            image: photo(""),
            role: "Biliran Province State University",
            topic: "Uncovering the Challenges: A Qualitative Inquiry into the Discontinuation of Rice-based Food Enterprises in Biliran Province",
            bio:"",
          },
          {
            name: "Ms. Anarie E. Bello",
            image: photo("bello"),
            role: "DA-PhilRice Negros",
            topic: "Market-Mediated Technology Adoption: The PhilGAP Experience of RiceBIS Communities in San Carlos, Negros Occidental",
            bio:"",
          },
          {
            name: "Mr. Vince G. Lao",
            image: photo("lao"),
            role: "Visayas State University",
            topic: "Profiling Leyte’s Rice-Based Enterprises: Practices, Products, and Growth Opportunities",
            bio:"",
          },
          {
            name: "Ms. Liafail dC. Davalos",
            image: photo("davalos"),
            role: "DA-PhilRice CES",
            topic: "Beyond Sun and Sight: From Manual to Standardized Rice Kropek Production in Masbate",
            bio:"",
          },
          {
            name: "Ms. Angela Mae P. Ritaga",
            image: photo("ritaga"),
            role: "DA-PhilRice CES",
            topic: "From Training to Practice: Equipping Implementers through Capacity Building and Knowledge Resources to Strengthen Rice-Based Food Enterprises",
            bio:"",
          },
        ],
      },
      {
        title: "Concurrent Session 4",
        speakers: [
          // image: photo("benitez"),{ name: "Dr. Jennifer T. Niones", 
          // role: "", part: "Moderator" },
          // { ...pinto("Panelist") },
          {
            name: "Mr. Frij C. Bimbao",
            image: photo("bimbao"),
            role: "DA-PhilRice Negros",
            topic: "Food or Flood: Analyzing Change in Rice Area of Negros Occidental in Relation to Flood Susceptibility in the Province",
            bio:"",
          },
          {
            name: "Dr. Jean Rochielle F. Mirandilla",
            image: photo("mirandilla"),
            role: "DA-PhilRice Isabela",
            topic: "Phenology-Based Detection of Irrigated and Favorable Rainfed Rice Using Multi-Temporal SAR Polarimetric Parameters in Iloilo, Philippines",
            bio:"",
          },
          {
            name: "Mr. Conrado K. Daluz",
            image: photo("daluz"),
            role: "DA-RFO 8",
            topic: "Performance Evaluation of Rice using RCM Fertilizer Recommendation under Rice and Non-rice Cropping Patterns in Region 8",
            bio:"",
          },
          {
            name: "Ms. Kristiana Marie G. Dela Cruz",
            image: photo("dela_cruz"),
            role: "DA-PhilRice CES",
            topic: "Scaling Rice Production Innovations in the Visayas: Status and Progress of Palayamanan, SRI, and Heirloom Rice Implementation",
            bio:"",
          },
          {
            name: "Mr. Zhandon Paul M. Cario",
            image: photo("cario"),
            role: "DA-PhilRice CES",
            topic: "A Zero-Sample Multi-Sensor Framework for Mapping Candidate Upland Rice Areas in the Visayas Region Using Google Earth Engine",
            bio:"",
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