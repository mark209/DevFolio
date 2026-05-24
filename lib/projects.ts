export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  impact: string[];
  technicalDecisions: string[];
  category: "Full Stack" | "API" | "Website";
  role: string;
  year: string;
  status: "Live" | "Case Study";
  image: string;
  detailImage: string;
  technologies: string[];
  features: string[];
  outcomes: string[];
  liveDemoUrl: string;
  githubUrl: string;
};

export const projects: Project[] = [
  {
    slug: "church-engine",
    title: "Church Engine",
    summary: "Centralized doctrine, lessons, and ministry content into one role-based platform for church communities.",
    description:
      "A centralized faith-based knowledge platform focused on structured content delivery, clarity, and accessibility at scale. The system emphasizes role-based workflows, intuitive navigation, and efficient content management to support hundreds of users consuming doctrine, teachings, and church resources.",
    problem:
      "Church resources and doctrine content can become scattered across separate files, links, and conversations, making it harder for members and admins to find and manage the right material.",
    solution:
      "Built a structured web platform with organized content areas, role-based access, approval workflows, and admin-controlled publishing so doctrine and lessons can be maintained from one place.",
    impact: [
      "Reduced scattered church content into one organized platform",
      "Created clearer admin workflows for approving and managing users",
      "Built a scalable foundation for publishing lessons and doctrine"
    ],
    technicalDecisions: [
      "Used server-rendered EJS pages for straightforward content delivery",
      "Added session-based authentication with password hashing for protected areas",
      "Separated content management flows from member-facing browsing paths"
    ],
    category: "Full Stack",
    role: "Full Stack Developer",
    year: "2025",
    status: "Live",
    image: "/Port1.jpg",
    detailImage: "/Deets1.jpg",
    technologies: ["Node.js", "Express", "EJS", "JavaScript", "HTML", "CSS", "PHP", "express-session", "bcryptjs", "dotenv"],
    features: [
      "Role-based authentication with admin approval workflows",
      "Centralized content management for doctrine and teachings",
      "Full CRUD system for structured topic organization",
      "Responsive dashboard for scalable user access",
      "Secure Supabase backend with real-time data handling"
    ],
    outcomes: [
      "Reduced scattered church content into one organized platform",
      "Created clearer admin workflows for approving and managing users",
      "Built a scalable foundation for publishing lessons and doctrine"
    ],
    liveDemoUrl: "https://churchengine.onrender.com/index.html",
    githubUrl: "#"
  },
  {
    slug: "arc-engine",
    title: "ARC Engine",
    summary: "Internal FAQ and script platform that helps agents search phonetics support content faster.",
    description:
      "A phonetics support platform focused on delivering structured FAQs and script-based guidance to improve pronunciation accuracy and consistency. The system emphasizes organized content flow, fast search and retrieval, and responsive UI patterns.",
    problem:
      "Support and phonetics guidance can become repetitive and difficult to maintain when agents rely on scattered scripts, informal notes, or manual lookup.",
    solution:
      "Created an internal knowledge platform with searchable FAQs, structured scripts, and controlled content updates so support guidance stays easier to find and maintain.",
    impact: [
      "Made internal support information faster to search and maintain",
      "Improved consistency for script-based pronunciation guidance",
      "Prepared the content model for future AI-assisted workflows"
    ],
    technicalDecisions: [
      "Modeled content around searchable FAQ and script records",
      "Used Supabase for managed data storage and operational updates",
      "Included OpenAI API integration as a foundation for assisted workflows"
    ],
    category: "Full Stack",
    role: "Full Stack Developer",
    year: "2025",
    status: "Live",
    image: "/Port2.jpg",
    detailImage: "/Deets2.jpg",
    technologies: ["Node.js", "Express", "JavaScript", "HTML", "CSS", "Supabase", "OpenAI API", "dotenv"],
    features: [
      "Structured FAQ and script-based content organization",
      "Fast search and keyword-driven information retrieval",
      "Modular content system for quick updates and additions",
      "Role-based access for controlled content management"
    ],
    outcomes: [
      "Made internal support information faster to search and maintain",
      "Improved consistency for script-based pronunciation guidance",
      "Prepared the content model for future AI-assisted workflows"
    ],
    liveDemoUrl: "https://arc-engine.onrender.com/index.html",
    githubUrl: "#"
  },
  {
    slug: "arcalphonetics",
    title: "ARCAlphonetics Website",
    summary: "Service website that clarifies phonetics offerings and guides visitors toward inquiry and booking flows.",
    description:
      "Arcalphonetics is a phonetics-focused learning platform presented through a clean and engaging landing page that highlights speech services, clear offerings, and direct contact flow.",
    problem:
      "New visitors need to quickly understand the phonetics service, compare offerings, and find a clear path to inquire or book without extra explanation.",
    solution:
      "Designed a focused service website with clearer content hierarchy, responsive sections, and direct inquiry paths tied to marketing and analytics tools.",
    impact: [
      "Clarified service offerings for new visitors",
      "Connected marketing traffic to focused inquiry paths",
      "Supported measurement through analytics and ad tooling"
    ],
    technicalDecisions: [
      "Used Wix to support fast content updates and service-page iteration",
      "Connected Google Analytics for visitor and campaign measurement",
      "Structured page content around service selection and inquiry intent"
    ],
    category: "Website",
    role: "Web Designer",
    year: "2025",
    status: "Live",
    image: "/Port3.jpg",
    detailImage: "/Deets3.jpg",
    technologies: ["Wix", "Google Ads", "Google Analytics"],
    features: [
      "Guided service selection flow",
      "Optimized booking and inquiry forms",
      "Strong content hierarchy for conversion",
      "Mobile-first responsive UX"
    ],
    outcomes: [
      "Clarified service offerings for new visitors",
      "Connected marketing traffic to focused inquiry paths",
      "Supported measurement through analytics and ad tooling"
    ],
    liveDemoUrl: "https://www.arcalphonetics.com/",
    githubUrl: "#"
  },
  {
    slug: "devfolio-api",
    title: "Fast API",
    summary: "FastAPI service that ingests, validates, and serves structured phonetics data from external sources.",
    description:
      "A custom-built API developed from the ground up to handle the ingestion, structuring, and lifecycle management of externally provided phonetics data. The system is designed to transform raw datasets into organized, system-ready formats while maintaining consistency and scalability. To streamline access and simplify ongoing data operations, retrieval is integrated with Google Sheets, enabling efficient updates, visibility, and lightweight management without compromising performance or data integrity.",
    problem:
      "Raw phonetics datasets from external sources need validation, structure, and reliable retrieval before they can be used safely in downstream tools or operations.",
    solution:
      "Built a FastAPI backend that separates ingestion, validation, Google Sheets retrieval, and response formatting into modular API flows.",
    impact: [
      "Turned raw phonetics data into system-ready structured records",
      "Enabled lightweight operations through Google Sheets integration",
      "Separated ingestion, validation, and retrieval concerns cleanly"
    ],
    technicalDecisions: [
      "Used FastAPI for typed request handling and clear REST endpoints",
      "Integrated Google Sheets as a lightweight operational data source",
      "Kept ingestion, validation, and retrieval logic modular for future expansion"
    ],
    category: "API",
    role: "Backend Developer",
    year: "2025",
    status: "Case Study",
    image: "/Port4.jpg",
    detailImage: "/Deets4.jpg",
    technologies: ["Python", "FastAPI", "REST APIs", "Google Sheets API", "gspread", "Uvicorn", "JSON"],
    features: [
  "Ingests and structures externally sourced data",
  "Retrieves and updates data seamlessly via Google Sheets integration",
  "Validation-first request handling and error management",
  "Modular API architecture prepared for scaling and future expansions",
  "Optimized for performance and consistent data delivery"
],
    outcomes: [
      "Turned raw phonetics data into system-ready structured records",
      "Enabled lightweight operations through Google Sheets integration",
      "Separated ingestion, validation, and retrieval concerns cleanly"
    ],
    liveDemoUrl: "#",
    githubUrl: "#"
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const projectCategories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))] as const;

export const techStackGroups = [
  {
    title: "Languages",
    items: [
      { label: "Python", icon: "/icons/tech/python.svg" },
      { label: "JavaScript", icon: "/icons/tech/javascript.svg" },
      { label: "HTML", icon: "/icons/tech/html.svg" },
      { label: "CSS", icon: "/icons/tech/css3.svg" }
    ]
  },
  {
    title: "Frontend & Backend",
    items: [
      { label: "React" },
      { label: "Node.js" },
      { label: "FastAPI" },
      { label: "Flask" }
    ]
  },
  {
    title: "APIs & Databases",
    items: [
      { label: "REST APIs" },
      { label: "PostgreSQL" },
      { label: "MySQL" },
      { label: "Supabase" }
    ]
  },
  {
    title: "Tools & Analytics",
    items: [
      { label: "GitHub" },
      { label: "Postman" },
      { label: "Google Analytics" }
    ]
  }
] as const;
