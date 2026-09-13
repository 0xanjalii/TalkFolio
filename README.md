<div align="center">

```
 ▄▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄   ▄▄ ▄▄ ▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄   ▄▄ ▄▄ ▄▄▄▄▄▄▄ 
█       █   ▄  █  █ █  █  █  █       █       █  █ █  █  █       █
█▄     ▄█  █ █ █  █▄█  █  █▄▄█    ▄▄▄█   ▄   █  █ █  █  █   ▄   █
  █   █ █   █▄▄█       █▄▄▄▄ █   █▄▄▄█  █ █  █  █▄█  █  █  █ █  █
  █   █ █    ▄▄█  ▄▄▄  █   █ █    ▄▄▄█  █▄█  █       █  █  █▄█  █
  █   █ █   █  █ █   █ █   █ █   █   █       █       █  █       █
  █▄▄▄█ █▄▄▄█  █▄█   █▄█   █▄█▄▄▄█   █▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄█▄▄▄▄▄▄▄█
```

# ⚡ TalkFolio
### The Interactive Conversational AI Portfolio That Speaks

[![AssemblyAI](https://img.shields.io/badge/AssemblyAI-Speech%20Recognition-00F076?style=for-the-badge&logoColor=black)](https://www.assemblyai.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-GPT--4o--Mini-00F076?style=for-the-badge&logoColor=black)](https://openrouter.ai/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-000000?style=for-the-badge&logo=vuedotjs&logoColor=00F076)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-7-00F076?style=for-the-badge&logo=vite&logoColor=black)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-000000?style=for-the-badge&logo=typescript&logoColor=00F076)](https://www.typescriptlang.org/)

<p align="center">
  <b>TalkFolio</b> is a conversational developer portfolio that can <b>speak out loud</b> and dynamically personalize itself by fetching any <b>GitHub</b> or <b>LinkedIn</b> profile. Powered by <b>AssemblyAI</b> speech recognition, <b>OpenRouter</b> LLM reasoning, and Web Speech synthesis.
</p>

---

[End-to-End Pipeline](#-end-to-end-pipeline) • [Key Capabilities](#-key-capabilities) • [Dynamic Profile Ingestion](#-dynamic-profile-ingestion) • [Quick Start](#-quick-start) • [Environment Setup](#-environment-setup) • [Default Persona](#-default-persona-anjali)

---

</div>

## 🔄 End-to-End Pipeline

TalkFolio links voice input, profile knowledge synthesis, LLM intelligence, and speech synthesis into a closed-loop interactive experience:

```
                      ┌──────────────────────────────────────┐
                      │  GitHub or LinkedIn Profile Ingest   │
                      │  (e.g. 0xanjalii, yyx990803, etc.)   │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │ Dynamic AI Knowledge Base Synthesis  │
                      │ (Repositories, Tech Stack, Bio, URLs) │
                      └──────────────────┬───────────────────┘
                                         │
    ┌──────────────────────┐             │
    │   Microphone Audio   │             │
    └──────────┬───────────┘             │
               │                         │
               ▼                         ▼
    ┌──────────────────────┐   ┌──────────────────────────────────────┐
    │  AssemblyAI Speech   │──▶│      OpenRouter LLM Intelligence     │
    │  Recognition Engine  │   │      (openai/gpt-4o-mini engine)     │
    └──────────────────────┘   └──────────────────┬───────────────────┘
                                                  │
                                                  ▼
                               ┌──────────────────────────────────────┐
                               │       Spoken Audio Out (TTS)         │
                               │   + Intelligent Section Navigation   │
                               └──────────────────────────────────────┘
```

1. **Profile Ingestion**: User inputs any GitHub username or LinkedIn URL/handle. TalkFolio fetches public repositories, calculates programming language distributions, extracts bio metadata, and populates the portfolio.
2. **Voice Recognition (AssemblyAI)**: The visitor clicks the microphone or uses the voice console to speak. AssemblyAI processes the speech and generates high-accuracy transcriptions.
3. **Personalized Reasoning (OpenRouter)**: The transcribed question is evaluated by an OpenRouter LLM (`openai/gpt-4o-mini`) using a system prompt grounded on the loaded profile's repositories, skills, and background.
4. **Voice Response (Speech Synthesis)**: TalkFolio answers aloud through synthesized speech with pulsing audio visualizer bars, and automatically scrolls to the relevant section if requested (e.g. `skills`, `experience`, `contact`).

---

## ✨ Key Capabilities

- 🔄 **Bi-Directional Hands-Free Voice Conversation**: Once you start speaking, the conversational loop is bi-directional and automatic. Voice Activity Detection (VAD) detects when you stop speaking, processes your question, speaks the answer aloud, and automatically resumes listening for your next reply without requiring you to click pause/stop every time.
- 🌐 **Full Multi-Language Support**: Speak in ANY language supported by AssemblyAI (English, Hindi, Spanish, French, German, Japanese, Chinese, etc.). AssemblyAI auto-detects the spoken language, OpenRouter answers in the matching language, and Speech Synthesis speaks back aloud with native language accents.
- 🗣️ **Portfolio Speaks Aloud**: Real-time speech synthesis that speaks answers aloud to the visitor with synchronized audio visualizer waveforms.
- ⚡ **Dynamic Profile Generation**: Enter any GitHub username or LinkedIn profile (e.g., `0xanjalii`, `torvalds`, `yyx990803`, `karpathy`) to instantly transform the entire portfolio.
- 🎙️ **AssemblyAI Speech Recognition**: High-fidelity speech-to-text powered directly by AssemblyAI's transcription engine with auto language detection.
- 🧠 **Personalized OpenRouter AI**: Answers visitors in first person about projects, repositories, coding languages, experience, and contact options.
- 💬 **Dual Interaction Console**: Speak with your microphone in hands-free bi-directional mode OR type queries directly into the console.
- 👩 **Default Persona (Anjali)**: Preloaded with Anjali (`@0xanjalii`), an AI Systems Architect & Speech AI Specialist.
- 🎛️ **Live Audio Waveform**: Animated visualizer bars reacting synchronously to both incoming microphone audio and outgoing speech synthesis.

---

## ⚡ Dynamic Profile Ingestion

Click **⚡ Fetch Profile** in the top navigation or **⚡ Fetch Any Profile** in the hero section to open the ingestion modal:

- **Supported Formats**:
  - GitHub username (e.g., `0xanjalii`, `yyx990803`)
  - GitHub URL (e.g., `https://github.com/0xanjalii`)
  - LinkedIn profile handle or URL (e.g., `https://www.linkedin.com/in/username` or `username`)
- **Quick Presets**: One-click switching between featured profiles:
  - `@0xanjalii` (Anjali - AI Systems Architect)
  - `@torvalds` (Linus Torvalds - Linux Creator)
  - `@yyx990803` (Evan You - Vue.js Creator)
  - `@karpathy` (Andrej Karpathy - AI Researcher)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/0xanjalii/talkfolio.git
cd talkfolio
npm install
```

### 2. Configure Environment Keys
Create a `.env` file in the project root with your credentials:
```env
# AssemblyAI Speech Recognition API Key
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# OpenRouter Personalized AI API Key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## ⚙️ Environment Setup

| Variable | Required | Description |
|---|---|---|
| `VITE_ASSEMBLYAI_API_KEY` | Required | AssemblyAI key for microphone speech transcription |
| `VITE_OPENROUTER_API_KEY` | Required | OpenRouter key for conversational portfolio responses |
| `ASSEMBLYAI_API_KEY` | Optional | Used for backend/CLI testing scripts |

---

## 👩 Default Persona: Anjali

- **Name**: Anjali
- **Handle**: [@0xanjalii](https://x.com/0xanjalii)
- **GitHub**: [github.com/0xanjalii](https://github.com/0xanjalii)
- **Role**: AI Systems Architect · Speech AI Specialist
- **Focus**: Real-time voice agents, streaming audio pipelines, and speech intelligence architectures.

---

## 📜 Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Boots local Vite development server on port `3000` |
| `build` | `npm run build` | Validates TypeScript (`vue-tsc -b`) and bundles production assets |
| `preview` | `npm run preview` | Serves production build locally |
| `typecheck` | `npm run typecheck` | Checks TypeScript and Vue components |

---

## 📄 License

TalkFolio is released under the [MIT License](LICENSE).
