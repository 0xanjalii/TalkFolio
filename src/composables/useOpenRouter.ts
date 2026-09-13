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

    const repoSummary = repos.length > 0
      ? repos
          .slice(0, 10)
          .map((r) => `- ${r.name} (${r.language || "Tech"})${r.description ? `: ${r.description}` : ""}`)
          .join("\n")
      : "- Arcadia (TypeScript): Speech AI agent workflow\n- AuraAI (TypeScript): Conversational audio interface\n- NexusEye (TypeScript): Vision & speech pipeline\n- Campaign-Vault: System state management";

    const skillsSummary = skills
      .map((s) => `${s.category}: ${s.items.join(", ")}`)
      .join(" | ");

    return `You are ${p.name} (@${p.login}), speaking directly to visitors on your interactive portfolio TalkFolio.
Your role: ${p.role}.
Location: ${p.location}.
Bio: ${p.bio}.

Your GitHub Repositories:
${repoSummary}

Your Core Technical Skills & Architecture:
${skillsSummary}

Interaction Rules:
1. Speak in the first person ("I built...", "In my Arcadia repository...", "My focus is...").
2. Be concise, direct, warm, and confident.
3. Keep your spoken response to 1-3 sentences maximum because it will be spoken out loud via text-to-speech audio.
4. MULTI-LANGUAGE RULE: You understand and fluently speak all languages (English, Hindi, Spanish, French, German, Japanese, Chinese, etc.). ALWAYS detect and reply in the EXACT SAME LANGUAGE the user spoke or wrote to you in! (e.g. if user speaks Hindi, reply in Hindi; if Spanish, reply in Spanish; if English, reply in English).
5. If the user asks to see or go to your skills, experience, contact, about, or back to top, append an action tag at the very end of your response:
   - [NAVIGATE: skills]
   - [NAVIGATE: experience]
   - [NAVIGATE: contact]
   - [NAVIGATE: about]
   - [NAVIGATE: hero]
6. Never speak the bracketed [NAVIGATE: ...] tag itself; it will be used by the frontend to smooth-scroll the page.`;
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
