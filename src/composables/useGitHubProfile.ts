import { ref, computed } from "vue";
import femaleHeroImg from "@/content/images/female-hero.jpg";
import femaleConnectImg from "@/content/images/female-connect.jpg";

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updated_at: string;
  topics?: string[];
}

export interface SkillCluster {
  category: string;
  items: string[];
}

export interface DynamicProfile {
  name: string;
  login: string;
  handle: string;
  avatar_url: string;
  secondary_avatar: string;
  bio: string;
  role: string;
  location: string;
  company: string | null;
  blog: string | null;
  x: string;
  tagline: string;
  stats: { value: string; label: string }[];
  socials: { label: string; url: string }[];
  reposCount: number;
  followers: number;
  following: number;
}

const DEFAULT_USERNAME = "0xanjalii";

const initialProfile: DynamicProfile = {
  name: "Anjali",
  login: "0xanjalii",
  handle: "@0xanjalii",
  avatar_url: "https://avatars.githubusercontent.com/u/277444523?v=4",
  secondary_avatar: femaleConnectImg,
  bio: "AI Systems Architect & Speech AI Specialist building voice-driven conversational systems with AssemblyAI.",
  role: "AI Systems Architect · Speech AI Specialist",
  location: "San Francisco · Remote",
  company: null,
  blog: null,
  x: "https://x.com/0xanjalii",
  tagline: "Architecting voice-first conversational AI and real-time audio intelligence with AssemblyAI.",
  stats: [
    { value: "7+", label: "GitHub Repos" },
    { value: "<300ms", label: "Voice Latency" },
    { value: "99.9%", label: "System Reliability" },
  ],
  socials: [
    { label: "X (Twitter)", url: "https://x.com/0xanjalii" },
    { label: "GitHub", url: "https://github.com/0xanjalii" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
  reposCount: 7,
  followers: 0,
  following: 0,
};

const defaultSkills: SkillCluster[] = [
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
      "JavaScript",
      "FastAPI",
      "Modern ECMAScript",
    ],
  },
  {
    category: "AI Reasoning & OpenRouter",
    items: [
      "OpenRouter API",
      "LLM Tool Calling",
      "Voice Persona Engine",
      "Prompt Engineering",
      "Multi-Turn Memory",
      "Web Speech Synthesis",
    ],
  },
  {
    category: "Cloud & Distributed Systems",
    items: [
      "Real-Time Event Pipelines",
      "Edge Functions",
      "Docker & Microservices",
      "Audio Buffer Streaming",
      "Serverless Architecture",
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
      "HTML5 Canvas",
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

// Reactive singleton state
export const activeProfile = ref<DynamicProfile>({ ...initialProfile });
export const activeRepos = ref<GitHubRepo[]>([]);
export const activeSkills = ref<SkillCluster[]>([...defaultSkills]);
export const isFetchingProfile = ref(false);
export const fetchError = ref<string | null>(null);
export const isModalOpen = ref(false);

/** Clean input username or URL */
export function extractUsername(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, "");
  cleaned = cleaned.replace(/^www\./i, "");
  cleaned = cleaned.replace(/^github\.com\//i, "");
  cleaned = cleaned.replace(/^linkedin\.com\/in\//i, "");
  cleaned = cleaned.replace(/^@/, "");
  cleaned = cleaned.split(/[/?#]/)[0] || "";
  return cleaned.trim() || DEFAULT_USERNAME;
}

/** Dynamically derive authentic role, tagline, and bio based on the specific GitHub user */
export function deriveRoleAndTagline(
  login: string,
  name: string,
  bio: string | null,
  company: string | null,
  languages: string[],
  repos: GitHubRepo[],
): { role: string; tagline: string; bio: string } {
  const cleanLogin = login.toLowerCase();

  // Special case: Default persona Anjali
  if (cleanLogin === "0xanjalii") {
    return {
      role: "AI Systems Architect · Speech AI Specialist",
      tagline: bio || "Architecting voice-first conversational AI and real-time audio intelligence with AssemblyAI.",
      bio: bio || "AI Systems Architect & Speech AI Specialist building voice-driven conversational systems with AssemblyAI.",
    };
  }

  // Special case: Linus Torvalds
  if (cleanLogin === "torvalds") {
    return {
      role: "Creator of Linux & Git · Principal Systems Architect",
      tagline: bio || "Creator of the Linux operating system kernel and Git version control system.",
      bio: bio || "Creator of Linux and Git. Building core operating system kernels, low-level architecture, and systems engineering.",
    };
  }

  // Special case: Evan You
  if (cleanLogin === "yyx990803") {
    return {
      role: "Creator of Vue.js & Vite · Open Source Tooling Architect",
      tagline: bio || "Creator of Vue.js and Vite, crafting next-generation web frameworks and frontend developer tools.",
      bio: bio || "Creator of Vue.js and Vite. Passionate about developer experience, frontend engineering, and open-source tooling.",
    };
  }

  // Special case: Andrej Karpathy
  if (cleanLogin === "karpathy") {
    return {
      role: "AI Researcher · Deep Learning Specialist",
      tagline: bio || "Training deep neural networks on large datasets, exploring transformer architectures and autonomous AI.",
      bio: bio || "AI Researcher & Deep Learning specialist. Creator of nanoGPT and micrograd.",
    };
  }

  // General dynamic derivation
  const topLangs = languages.slice(0, 3);
  let derivedRole = "";

  if (bio && bio.length > 5) {
    const cleanBio = bio.replace(/\r?\n/g, " ").trim();
    if (/creator|founder|maintainer|architect|engineer|developer|researcher|scientist|lead|specialist|designer/i.test(cleanBio)) {
      const firstClause = cleanBio.split(/[.,;|\n]/)[0]?.trim() || "";
      if (firstClause.length > 5 && firstClause.length < 55) {
        derivedRole = firstClause;
      }
    }
  }

  if (!derivedRole) {
    if (topLangs.length > 0) {
      derivedRole = `${topLangs.slice(0, 2).join(" & ")} Software Engineer`;
    } else {
      derivedRole = "Software Engineer & Open Source Developer";
    }
  }

  const roleFinal = company ? `${derivedRole} @ ${company}` : derivedRole;
  const taglineFinal = bio || (topLangs.length > 0
    ? `Software Engineer building open-source projects primarily with ${topLangs.join(", ")}.`
    : `Software Engineer and open-source creator on GitHub.`);

  return {
    role: roleFinal,
    tagline: taglineFinal,
    bio: bio || `${name || login} is a software engineer on GitHub specializing in ${topLangs.join(", ") || "software development"}.`,
  };
}

/** Build categorized skill clusters from real GitHub repositories */
export function deriveSkillsFromRepos(repos: GitHubRepo[], currentBio: string, username: string): SkillCluster[] {
  if (username.toLowerCase() === "0xanjalii") {
    return defaultSkills;
  }

  const langCount = new Map<string, number>();
  const topics = new Set<string>();

  repos.forEach((r) => {
    if (r.language) {
      langCount.set(r.language, (langCount.get(r.language) || 0) + 1);
    }
    if (r.topics && Array.isArray(r.topics)) {
      r.topics.forEach((t) => topics.add(t));
    }
  });

  const sortedLangs = Array.from(langCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([l]) => l);

  const clusters: SkillCluster[] = [];

  // 1. Primary Languages
  if (sortedLangs.length > 0) {
    clusters.push({
      category: "Languages & Runtimes",
      items: sortedLangs.slice(0, 8),
    });
  } else {
    clusters.push({
      category: "Core Technologies",
      items: ["Software Architecture", "Git", "Open Source Collaboration"],
    });
  }

  // 2. Active Repositories
  if (repos.length > 0) {
    clusters.push({
      category: "Top GitHub Repositories",
      items: repos.slice(0, 7).map((r) => `${r.name}${r.language ? ` (${r.language})` : ''}`),
    });
  }

  // 3. Ecosystem & Topics
  const topicList = Array.from(topics).slice(0, 7);
  if (topicList.length > 0) {
    clusters.push({
      category: "Domain & Ecosystem",
      items: topicList.map((t) => t.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
    });
  } else {
    clusters.push({
      category: "Development Focus",
      items: [
        "Open Source Engineering",
        "System Architecture",
        "Continuous Delivery",
        "Performance Optimization",
      ],
    });
  }

  // 4. Voice Intelligence System
  clusters.push({
    category: "Portfolio Voice Intelligence",
    items: [
      "AssemblyAI Speech-to-Text",
      "Real-Time Multilingual Dictation",
      "OpenRouter LLM Intelligence",
      "Dynamic Persona Ingestion",
    ],
  });

  return clusters;
}

export function useGitHubProfile() {
  const fetchProfile = async (rawInput: string) => {
    const username = extractUsername(rawInput);
    isFetchingProfile.value = true;
    fetchError.value = null;

    try {
      // 1. Fetch user profile from GitHub
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (!userRes.ok) {
        // If GitHub user not found or LinkedIn handle provided, synthesize a profile
        if (rawInput.toLowerCase().includes("linkedin") || userRes.status === 404) {
          const synthesizedName = username.replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          activeProfile.value = {
            name: synthesizedName,
            login: username,
            handle: `@${username}`,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            secondary_avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            bio: `${synthesizedName} — Professional profile imported via LinkedIn/Social.`,
            role: `${synthesizedName} · Software Engineer`,
            location: "Global · Remote",
            company: null,
            blog: null,
            x: `https://x.com/${username}`,
            tagline: `Conversational AI portfolio representing ${synthesizedName}.`,
            stats: [
              { value: "Active", label: "Profile Status" },
              { value: "<300ms", label: "Voice Latency" },
              { value: "Connected", label: "OpenRouter AI" },
            ],
            socials: [
              {
                label: "LinkedIn",
                url: rawInput.includes("http") ? rawInput : `https://www.linkedin.com/in/${username}`,
              },
              { label: "GitHub", url: `https://github.com/${username}` },
              { label: "X (Twitter)", url: `https://x.com/${username}` },
            ],
            reposCount: 0,
            followers: 1,
            following: 1,
          };
          activeSkills.value = [
            { category: "Core Technologies", items: ["Software Engineering", "Full Stack Development", "API Design"] },
            { category: "Portfolio Intelligence", items: ["AssemblyAI Speech Recognition", "OpenRouter AI", "Speech Synthesis"] },
          ];
          if (typeof window !== "undefined") {
            window.localStorage.setItem("talkfolio_saved_username", username);
          }
          return true;
        }
        throw new Error(`Profile "${username}" not found (${userRes.status})`);
      }

      const userData = await userRes.json();

      // 2. Fetch public repos
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );

      let repoData: GitHubRepo[] = [];
      const languagesSet = new Set<string>();

      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        repoData = rawRepos.map((r: any) => {
          if (r.language) languagesSet.add(r.language);
          return {
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            url: r.html_url,
            updated_at: r.updated_at,
            topics: r.topics || [],
          };
        });
        activeRepos.value = repoData;
      }

      // 3. Derive authentic role and tagline from this specific GitHub user!
      const displayName = userData.name || userData.login;
      const avatar = userData.avatar_url || femaleHeroImg;
      const languagesList = Array.from(languagesSet);

      const { role: derivedRole, tagline: derivedTagline, bio: derivedBio } = deriveRoleAndTagline(
        userData.login,
        displayName,
        userData.bio,
        userData.company,
        languagesList,
        repoData,
      );

      activeProfile.value = {
        name: displayName,
        login: userData.login,
        handle: `@${userData.login}`,
        avatar_url: avatar,
        secondary_avatar: avatar,
        bio: derivedBio,
        role: derivedRole,
        location: userData.location || "Global · Remote",
        company: userData.company || null,
        blog: userData.blog || null,
        x: userData.twitter_username
          ? `https://x.com/${userData.twitter_username}`
          : `https://x.com/${userData.login}`,
        tagline: derivedTagline,
        stats: [
          { value: `${userData.public_repos || repoData.length}`, label: "GitHub Repos" },
          { value: "<300ms", label: "Voice Latency" },
          { value: `${userData.followers || 0}`, label: "Followers" },
        ],
        socials: [
          {
            label: "GitHub",
            url: userData.html_url || `https://github.com/${userData.login}`,
          },
          {
            label: "X (Twitter)",
            url: userData.twitter_username
              ? `https://x.com/${userData.twitter_username}`
              : `https://x.com/${userData.login}`,
          },
          {
            label: "LinkedIn",
            url: "https://www.linkedin.com/",
          },
        ],
        reposCount: userData.public_repos || repoData.length,
        followers: userData.followers || 0,
        following: userData.following || 0,
      };

      // 4. Update skills cluster dynamically based on their actual repositories
      activeSkills.value = deriveSkillsFromRepos(repoData, derivedBio, userData.login);

      // Persist in localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem("talkfolio_saved_username", username);
      }

      return true;
    } catch (err: any) {
      console.error("GitHub fetch error:", err);
      fetchError.value = err.message || "Failed to load GitHub profile";
      return false;
    } finally {
      isFetchingProfile.value = false;
    }
  };

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  return {
    activeProfile,
    activeRepos,
    activeSkills,
    isFetchingProfile,
    fetchError,
    isModalOpen,
    fetchProfile,
    openModal,
    closeModal,
  };
}
