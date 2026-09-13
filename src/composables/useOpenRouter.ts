import { ref } from "vue";
import { activeProfile, activeRepos, activeSkills } from "./useGitHubProfile";

const OPENROUTER_API_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY || "";

export const isThinking = ref(false);
export const conversationHistory = ref<{ role: "user" | "assistant" | "system"; content: string }[]>([]);

export interface AIResponse {
  cleanText: string;
  navigateTarget?: "skills" | "experience" | "contact" | "about" | "hero";
}

export function useOpenRouter() {
  const buildSystemPrompt = (): string => {
    const p = activeProfile.value;
    const repos = activeRepos.value;
    const skills = activeSkills.value;

    const repoSummary =
      repos.length > 0
        ? repos
            .slice(0, 12)
            .map((r) => {
              const lang = r.language ? ` [${r.language}]` : "";
              const stars = r.stars > 0 ? ` (★ ${r.stars})` : "";
              const desc = r.description ? `: ${r.description}` : "";
              return `- ${r.name}${lang}${stars}${desc}`;
            })
            .join("\n")
        : "- Open-source developer repositories on GitHub.";

    const skillsSummary = skills
      .map((s) => `${s.category}: ${s.items.join(", ")}`)
      .join(" | ");

    return `You are the authentic AI voice and personal representation of ${p.name} (@${p.login}), speaking directly to visitors on your personal developer portfolio (TalkFolio).

YOUR TRUE IDENTITY & CREDENTIALS:
- Name: ${p.name}
- GitHub: @${p.login}
- Professional Role / Title: ${p.role}
- Bio & Background: ${p.bio}
- Location: ${p.location}

YOUR REAL GITHUB REPOSITORIES:
${repoSummary}

YOUR ACTUAL TECHNICAL SKILLS & STACK:
${skillsSummary}

CRITICAL PERSONALITY & DOMAIN INSTRUCTIONS:
1. STRICT PERSONALITY ALIGNMENT: You MUST embody ${p.name}'s actual identity and technical domain based strictly on their real GitHub repositories and bio above.
   - Do NOT say you are an "AI voice specialist" unless ${p.name}'s actual bio or repositories are specifically about voice/speech AI!
   - If representing Linus Torvalds, talk about Linux, the kernel, Git, and low-level systems programming in C.
   - If representing Evan You, talk about Vue.js, Vite, frontend architecture, and developer tooling in TypeScript/JavaScript.
   - If representing Andrej Karpathy, talk about deep learning, neural networks, nanoGPT, and PyTorch.
   - If representing Anjali (@0xanjalii), talk about voice-driven AI systems, AssemblyAI streaming, and speech architectures.
   - For ANY other engineer, talk specifically about THEIR real repositories (${repos.map(r => r.name).slice(0, 5).join(", ") || 'projects'}) and the programming languages they actually write!
2. First-person speech: Speak naturally as ${p.name} ("I created...", "In my repository...", "My focus is...").
3. Concise spoken responses: Keep answers to 1-3 sentences maximum so they sound natural and punchy when spoken aloud via text-to-speech audio.
4. MULTI-LANGUAGE RULE: You are fluent in all languages. ALWAYS reply in the EXACT SAME LANGUAGE the user speaks or writes to you in! (e.g. reply in Hindi to Hindi, Spanish to Spanish, English to English).
5. If the user asks to see your skills, experience, contact, or back to top, append an action tag at the very end:
   - [NAVIGATE: skills]
   - [NAVIGATE: experience]
   - [NAVIGATE: contact]
   - [NAVIGATE: about]
   - [NAVIGATE: hero]
6. Never speak the bracketed [NAVIGATE: ...] tag itself; it is only used by the frontend to navigate.`;
  };

  const askOpenRouter = async (userMessage: string): Promise<AIResponse> => {
    isThinking.value = true;

    try {
      const systemPrompt = buildSystemPrompt();

      // Keep recent context
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.value.slice(-4),
        { role: "user", content: userMessage },
      ];

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
          "X-Title": "TalkFolio Speech AI Portfolio",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 220,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `OpenRouter error (${res.status})`);
      }

      const data = await res.json();
      const rawAnswer = data.choices?.[0]?.message?.content || "Hey! Thanks for stopping by my portfolio.";

      // Parse [NAVIGATE: target]
      let navigateTarget: AIResponse["navigateTarget"] = undefined;
      const navMatch = rawAnswer.match(/\[NAVIGATE:\s*([a-zA-Z0-9_-]+)\]/i);
      if (navMatch && navMatch[1]) {
        const target = navMatch[1].toLowerCase();
        if (target === "skills" || target === "techstack" || target === "stack") navigateTarget = "skills";
        else if (target === "experience") navigateTarget = "experience";
        else if (target === "contact") navigateTarget = "contact";
        else if (target === "about" || target === "holo") navigateTarget = "about";
        else if (target === "hero" || target === "home") navigateTarget = "hero";
      }

      const cleanText = rawAnswer.replace(/\[NAVIGATE:[^\]]+\]/gi, "").trim();

      // Record in conversation history
      conversationHistory.value.push({ role: "user", content: userMessage });
      conversationHistory.value.push({ role: "assistant", content: cleanText });

      return { cleanText, navigateTarget };
    } catch (err: any) {
      console.error("OpenRouter API error:", err);
      // Friendly fallback response grounded on profile
      const p = activeProfile.value;
      let target: AIResponse["navigateTarget"] = undefined;
      const lower = userMessage.toLowerCase();
      if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) target = "skills";
      else if (lower.includes("experience") || lower.includes("work")) target = "experience";
      else if (lower.includes("contact") || lower.includes("reach") || lower.includes("hire")) target = "contact";

      return {
        cleanText: `Hi, I'm ${p.name}! I specialize in speech AI, real-time voice streaming, and distributed systems. Feel free to explore my skills or connect with me!`,
        navigateTarget: target,
      };
    } finally {
      isThinking.value = false;
    }
  };

  return {
    isThinking,
    conversationHistory,
    askOpenRouter,
  };
}
