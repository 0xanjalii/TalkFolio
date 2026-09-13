import { ref } from "vue";
import { soundsEnabled } from "./useSounds";

export const isSpeaking = ref(false);
export const spokenText = ref("");
export const currentLanguage = ref("en-US");
export const speakingAudioLevels = ref<number[]>([20, 35, 60, 85, 55, 30, 15]);

let synth: SpeechSynthesis | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let pulseTimer: number | null = null;

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  synth = window.speechSynthesis;
}

/** Detect language script from text for international voice synthesis */
export function detectLanguageFromText(text: string): string {
  // Devanagari script (Hindi, Marathi, Sanskrit)
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
  // Korean Hangul
  if (/[\uac00-\ud7af]/.test(text)) return "ko-KR";
  // Japanese (Hiragana / Katakana)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return "ja-JP";
  // Chinese (CJK unified ideographs without kana)
  if (/[\u4e00-\u9fff]/.test(text)) return "zh-CN";
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return "ar-SA";
  // Cyrillic (Russian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) return "ru-RU";
  // Spanish markers
  if (/[¿¡]/.test(text) || /\b(hola|gracias|proyectos|experiencia|habilidades|desarrollo|buenas)\b/i.test(text)) return "es-ES";
  // French markers
  if (/\b(bonjour|merci|projets|expérience|compétences|développement)\b/i.test(text)) return "fr-FR";
  // German markers
  if (/\b(hallo|danke|projekte|erfahrung|fähigkeiten|entwickler)\b/i.test(text)) return "de-DE";

  return "en-US";
}

const startWaveformPulse = () => {
  stopWaveformPulse();
  pulseTimer = window.setInterval(() => {
    if (!isSpeaking.value) {
      stopWaveformPulse();
      return;
    }
    speakingAudioLevels.value = Array.from({ length: 7 }, () =>
      Math.floor(25 + Math.random() * 70),
    );
  }, 90);
};

const stopWaveformPulse = () => {
  if (pulseTimer !== null) {
    clearInterval(pulseTimer);
    pulseTimer = null;
  }
  speakingAudioLevels.value = [15, 25, 45, 60, 35, 20, 10];
};

export function useVoiceSynthesis() {
  const selectBestVoice = (lang?: string): SpeechSynthesisVoice | null => {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const targetLang = (lang || "en-US").toLowerCase();
    const langPrefix = targetLang.split(/[-_]/)[0];

    // 1. If language is not English, prioritize native voice matching language prefix
    if (langPrefix && langPrefix !== "en") {
      const matchLang = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (matchLang) return matchLang;
    }

    // 2. For English, prefer high-quality natural female voices
    const preferredNames = [
      "samantha",
      "karen",
      "serena",
      "moira",
      "zira",
      "jenny",
      "google uk english female",
      "google us english",
      "natural",
      "female",
    ];

    for (const name of preferredNames) {
      const match = voices.find(
        (v) =>
          v.name.toLowerCase().includes(name) ||
          (v.lang.startsWith("en") && v.name.toLowerCase().includes("female")),
      );
      if (match) return match;
    }

    // 3. Fallback to any English voice or first available
    return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
  };

  const speak = (rawText: string, langCode?: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synth || !soundsEnabled.value) {
        spokenText.value = rawText;
        resolve();
        return;
      }

      // Stop any existing speech
      synth.cancel();
      stopWaveformPulse();

      // Clean text of internal navigation tags like [NAVIGATE: skills]
      const cleanSpeech = rawText.replace(/\[NAVIGATE:[^\]]+\]/gi, "").trim();
      if (!cleanSpeech) {
        resolve();
        return;
      }

      const targetLang = langCode || detectLanguageFromText(cleanSpeech);
      currentLanguage.value = targetLang;
      spokenText.value = cleanSpeech;

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      currentUtterance = utterance;
      utterance.lang = targetLang;

      const voice = selectBestVoice(targetLang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.05; // natural conversational tempo
      utterance.pitch = 1.05; // clear, friendly pitch

      utterance.onstart = () => {
        isSpeaking.value = true;
        startWaveformPulse();
      };

      utterance.onend = () => {
        isSpeaking.value = false;
        stopWaveformPulse();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        isSpeaking.value = false;
        stopWaveformPulse();
        resolve();
      };

      synth.speak(utterance);
    });
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
    }
    isSpeaking.value = false;
    stopWaveformPulse();
  };

  return {
    isSpeaking,
    spokenText,
    currentLanguage,
    speakingAudioLevels,
    speak,
    stop,
  };
}
