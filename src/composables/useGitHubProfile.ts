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
      "Voice Persona Engines",
      "Prompt Optimization",
      "Speech Synthesis (TTS)",
      "Multi-Modal Workflows",
    ],
  },
  {
    category: "Active Repositories",
    items: [
      "Arcadia",
      "AuraAI",
      "NexusEye",
      "Campaign-Vault",
      "Capy-Magic-Carpet",
      "Markov-Engine-2.0-Emblem",
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

/** Build categorized skill clusters from real GitHub repositories */
export function deriveSkillsFromRepos(repos: GitHubRepo[], currentBio: string): SkillCluster[] {
  const languages = new Set<string>();
  const repoNames = repos.map((r) => r.name);

  repos.forEach((r) => {
    if (r.language) languages.add(r.language);
  });

  const languageList = Array.from(languages);
  if (!languageList.includes("TypeScript")) languageList.unshift("TypeScript");
  if (!languageList.includes("JavaScript")) languageList.push("JavaScript");

  const clusters: SkillCluster[] = [
    {
      category: "Speech AI & Audio Intelligence",
      items: [
        "AssemblyAI",
        "Streaming STT",
        "LeMUR LLMs",
        "Speaker Diarization",
        "Real-Time WebSockets",
        "Audio Waveform Analysis",
      ],
    },
    {
      category: "Languages & Frameworks",
      items: languageList.slice(0, 7),
    },
    {
      category: "Active Repositories",
      items: repoNames.length > 0 ? repoNames.slice(0, 7) : ["Arcadia", "AuraAI", "NexusEye"],
    },
    {
      category: "AI Reasoning & OpenRouter",
      items: [
        "OpenRouter API",
        "LLM Tool Calling",
        "Voice Persona Engine",
        "Prompt Engineering",
        "Speech Synthesis",
      ],
    },
    {
      category: "Frontend Architecture & Systems",
      items: [
        "Modular Vue 3 Components",
        "SCSS Architecture",
        "CSS Grid & Flexbox",
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
        "SVG Animation",
        "Tactile Micro-Interactions",
      ],
    },
  ];

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
        // If GitHub user not found or LinkedIn handle provided, synthesize a profile so the user can still chat!
        if (rawInput.toLowerCase().includes("linkedin") || userRes.status === 404) {
          const synthesizedName = username.replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          activeProfile.value = {
            name: synthesizedName,
            login: username,
            handle: `@${username}`,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            secondary_avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
            bio: `${synthesizedName} — Professional profile imported via LinkedIn/Social. Ready to discuss speech AI, distributed systems, and modern engineering.`,
            role: "Software Engineer · AI Specialist",
            location: "Global · Remote",
            company: null,
            blog: null,
            x: `https://x.com/${username}`,
            tagline: `Conversational AI portfolio representing ${synthesizedName}. Powered by AssemblyAI voice intelligence.`,
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
            { category: "Core Technologies", items: ["AssemblyAI", "Voice Systems", "Full Stack Development", "Cloud Architecture"] },
            { category: "Languages & Frameworks", items: ["TypeScript", "Python", "Vue 3", "Node.js", "REST APIs"] },
            { category: "AI & Audio", items: ["Speech Recognition", "OpenRouter LLMs", "Real-Time Streaming", "Audio Intelligence"] },
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
      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        repoData = rawRepos.map((r: any) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          url: r.html_url,
          updated_at: r.updated_at,
          topics: r.topics || [],
        }));
        activeRepos.value = repoData;
      }

      // 3. Update dynamic profile state
      const displayName = userData.name || userData.login;
      const avatar = userData.avatar_url || femaleHeroImg;
      const bioText =
        userData.bio ||
        "AI Systems Architect & Engineer specializing in voice interfaces, real-time speech intelligence, and cloud architectures.";

      activeProfile.value = {
        name: displayName,
        login: userData.login,
        handle: `@${userData.login}`,
        avatar_url: avatar,
        secondary_avatar: avatar,
        bio: bioText,
        role: "AI Systems Architect · Speech AI Specialist",
        location: userData.location || "San Francisco · Remote",
        company: userData.company || null,
        blog: userData.blog || null,
        x: userData.twitter_username
          ? `https://x.com/${userData.twitter_username}`
          : `https://x.com/${userData.login}`,
        tagline: `Architecting voice-first conversational AI and real-time audio intelligence with AssemblyAI.`,
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

      // 4. Update skills cluster
      activeSkills.value = deriveSkillsFromRepos(repoData, bioText);

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
