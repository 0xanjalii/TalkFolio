export interface SocialLink {
  label: string;
  url: string;
}

export const profile = {
  name: "Anjali",
  handle: "@0xanjalii",
  label: "AI Systems Architect & Speech AI Specialist",
  role: "AI Systems Architect · Speech AI Specialist",
  location: "San Francisco · Remote",
  x: "https://x.com/0xanjalii",
  tagline: "Architecting voice-first conversational AI and real-time audio intelligence with AssemblyAI.",
  about: [
    "AI Systems Architect specialized in applied speech intelligence, real-time voice interfaces, and conversational multi-modal agents.",
    "Pioneering voice-driven systems powered by AssemblyAI's streaming speech-to-text, audio intelligence, and LeMUR LLM capabilities. Equally passionate about low-latency audio pipelines, intuitive human-AI voice interactions, and high-performance production systems.",
  ],
  stats: [
    { value: "10+", label: "years in tech & AI" },
    { value: "<300ms", label: "voice latency" },
    { value: "99.9%", label: "system reliability" },
  ],
  socials: [
    { label: "X (Twitter)", url: "https://x.com/0xanjalii" },
    { label: "GitHub", url: "https://github.com/0xanjalii" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ] as SocialLink[],
};
