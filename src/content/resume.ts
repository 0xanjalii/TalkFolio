export interface ExperienceRole {
  title: string;
  period: string;
  bullets: string[];
}
export interface ExperienceEntry {
  company: string;
  roles: ExperienceRole[];
}
export interface SkillGroup {
  category: string;
  items: string[];
}

// Kept deliberately generic — domain + impact, no employer-identifying specifics or dates.
export const experience: ExperienceEntry[] = [
  {
    company: "Global Automotive Company",
    roles: [
      {
        title: "Technical Architect · Applied AI",
        period: "Current",
        bullets: [
          "Lead end-to-end delivery of enterprise AI solutions for document intelligence, regulatory compliance, and engineering productivity.",
          "Architected an AI-powered compliance-validation platform that dramatically reduced manual review effort.",
          "Delivered significant recurring cost savings through automated compliance verification.",
          "Designed a custom RAG framework for large, complex documents, cutting review time substantially.",
          "Built agentic workflows for classification, dependency mapping, and impact analysis.",
          "Led data analytics and ML modeling to reduce reliance on physical prototype testing, with executive dashboards for decision-making.",
        ],
      },
    ],
  },
  {
    company: "Research University",
    roles: [
      {
        title: "Data Analyst · Research Assistant",
        period: "Earlier",
        bullets: [
          "Delivered production-grade ML and analytics solutions for external industry clients.",
          "Deployed lightweight computer-vision models for on-device inference.",
          "Conducted applied machine-learning research during graduate studies.",
          "Built data pipelines, predictive models, and object-detection architectures.",
          "Supported teaching for database and big-data systems courses.",
        ],
      },
    ],
  },
  {
    company: "Aerospace Manufacturer",
    roles: [
      {
        title: "Data Scientist",
        period: "Earlier",
        bullets: [
          "Built end-to-end analytics solutions for manufacturing operations.",
          "Automated data-collection pipelines, cutting manual effort significantly.",
          "Developed high-accuracy ML models for predictive maintenance.",
        ],
      },
    ],
  },
  {
    company: "Global Banking Company",
    roles: [
      {
        title: "Data Engineer",
        period: "Early career",
        bullets: [
          "Delivered large-scale data-warehousing solutions for enterprise clients.",
          "Built and maintained ETL pipelines and enterprise reporting platforms.",
          "Improved pipeline reliability and reporting performance; partnered with stakeholders on delivery.",
        ],
      },
    ],
  },
];

// Technical competencies, speech AI architectures, and engineering stack
export const skills: SkillGroup[] = [
  {
    category: "Speech AI & Audio Intelligence",
    items: [
      "AssemblyAI",
      "Streaming STT",
      "LeMUR LLMs",
      "Speaker Diarization",
      "Real-Time WebSockets",
      "Audio Feature Extraction",
      "Waveform Analysis",
    ],
  },
  {
    category: "Languages & Frameworks",
    items: [
      "TypeScript",
      "Python",
      "Vue 3",
      "Node.js",
      "FastAPI",
      "SQL",
      "HTML5 / Modern ECMAScript",
    ],
  },
  {
    category: "AI Agents & Intelligent Routing",
    items: [
      "Voice Command Parsers",
      "Tool Calling & Routing",
      "LangGraph",
      "LangChain",
      "Context Window Optimization",
      "Multi-Modal Workflows",
    ],
  },
  {
    category: "Cloud & Distributed Systems",
    items: [
      "Cloudflare Workers",
      "Google Cloud Platform",
      "Docker & Containers",
      "Kubernetes",
      "Vercel Edge Network",
      "CI / CD Automation",
    ],
  },
  {
    category: "Frontend Architecture & Systems",
    items: [
      "Modular Component Systems",
      "SCSS Architecture",
      "CSS Grid & Flexbox",
      "Responsive Layouts",
      "Web Audio API",
      "State Management",
    ],
  },
  {
    category: "Motion & Interactive Tech",
    items: [
      "GSAP 3 ScrollTrigger",
      "Lenis Smooth Scroll",
      "Canvas 2D Rendering",
      "SVG Kinetic Animation",
      "Tactile Event Micro-Interactions",
      "Low-Latency Event Pipelines",
    ],
  },
];


