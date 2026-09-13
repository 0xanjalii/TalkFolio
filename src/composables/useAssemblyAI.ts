import { ref, computed, onUnmounted } from "vue";
import { goToSection, goHome } from "./useRoute";
import { useOpenRouter } from "./useOpenRouter";
import { useVoiceSynthesis, isSpeaking, speakingAudioLevels, detectLanguageFromText } from "./useVoiceSynthesis";

export interface VoiceCommandMatch {
  action: "navigate" | "answer";
  target?: string;
  response: string;
}

const ASSEMBLYAI_API_KEY =
  import.meta.env.VITE_ASSEMBLYAI_API_KEY || "";

export const isListening = ref(false);
export const isProcessing = ref(false);
export const isContinuousMode = ref(false);
export const transcriptText = ref("");
export const lastResponse = ref("");
export const micAudioLevels = ref<number[]>([15, 25, 45, 60, 35, 20, 10]);
export const hasAssemblyKey = computed(() => Boolean(ASSEMBLYAI_API_KEY && ASSEMBLYAI_API_KEY.length > 5));

// Supported UI language options for AssemblyAI & Speech
export const activeLanguage = ref<string>("auto");

// Display audio levels: react to mic when listening, or react to speech synthesis when AI is speaking
export const activeAudioLevels = computed(() => {
  if (isSpeaking.value) {
    return speakingAudioLevels.value;
  }
  return micAudioLevels.value;
});

let mediaStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let animationFrameId: number | null = null;

// Speech Recognition instance (Web Speech API for instant zero-latency feedback)
let speechRecognitionInstance: any = null;
let silenceTimer: number | null = null;
let userHasSpoken = false;
let lastCapturedSpeech = "";

const SpeechRecognitionClass =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function useAssemblyAI() {
  const { askOpenRouter } = useOpenRouter();
  const { speak, stop: stopSpeaking } = useVoiceSynthesis();

  /** Audio Frequency Analysis & Waveform visualization */
  const startAudioAnalysis = (stream: MediaStream) => {
    try {
      audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevels = () => {
        if (!isListening.value) return;
        analyser?.getByteFrequencyData(dataArray);

        let sum = 0;
        const bars = [];
        const step = Math.floor(bufferLength / 7) || 1;
        for (let i = 0; i < 7; i++) {
          const val = dataArray[i * step] || 0;
          sum += val;
          bars.push(Math.max(10, Math.min(100, Math.round((val / 255) * 100))));
        }
        micAudioLevels.value = bars;

        // VAD (Voice Activity Detection): average amplitude
        const avgVolume = sum / 7;
        if (avgVolume > 20) {
          userHasSpoken = true;
          resetSilenceTimer();
        }

        animationFrameId = requestAnimationFrame(updateLevels);
      };
      updateLevels();
    } catch (e) {
      console.warn("Audio analysis unavailable", e);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    audioContext?.close().catch(() => {});
    audioContext = null;
    micAudioLevels.value = [15, 25, 45, 60, 35, 20, 10];
  };

  /** Silence timer: automatically finishes turn after user pauses speaking */
  const resetSilenceTimer = () => {
    if (silenceTimer !== null) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }

    // Only start silence countdown once the user has actually said something
    if (userHasSpoken && isListening.value) {
      silenceTimer = window.setTimeout(() => {
        handleSilenceTimeout();
      }, 1300); // 1.3 seconds of silence signifies user finished speaking
    }
  };

  const clearSilenceTimer = () => {
    if (silenceTimer !== null) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  };

  const handleSilenceTimeout = () => {
    if (!isListening.value) return;
    finalizeUserTurn();
  };

  /** Start listening: sets up mic, recorder, and speech recognition */
  const startListening = async (isContinuous = isContinuousMode.value) => {
    if (isListening.value) return;

    // Do not listen while AI is speaking aloud
    if (isSpeaking.value) {
      stopSpeaking();
    }

    try {
      userHasSpoken = false;
      lastCapturedSpeech = "";
      audioChunks = [];
      transcriptText.value = isContinuous
        ? "🎙️ Listening... (Speak in any language)"
        : "🎙️ Listening via microphone...";

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      isListening.value = true;
      startAudioAnalysis(mediaStream);

      // 1. Setup MediaRecorder for AssemblyAI audio upload
      try {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

        mediaRecorder = new MediaRecorder(mediaStream, { mimeType });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) audioChunks.push(event.data);
        };
        mediaRecorder.start(200); // chunk every 200ms
      } catch (recErr) {
        console.warn("MediaRecorder init notice:", recErr);
      }

      // 2. Setup Web Speech Recognition for instant zero-latency transcription
      if (SpeechRecognitionClass) {
        try {
          speechRecognitionInstance = new SpeechRecognitionClass();
          speechRecognitionInstance.continuous = true;
          speechRecognitionInstance.interimResults = true;
          if (activeLanguage.value && activeLanguage.value !== "auto") {
            speechRecognitionInstance.lang = activeLanguage.value;
          } else {
            speechRecognitionInstance.lang = navigator.language || "en-US";
          }

          speechRecognitionInstance.onresult = (event: any) => {
            let interim = "";
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
              } else {
                interim += event.results[i][0].transcript;
              }
            }
            const recognized = (final || interim).trim();
            if (recognized) {
              transcriptText.value = recognized;
              lastCapturedSpeech = recognized;
              userHasSpoken = true;
              resetSilenceTimer();
            }
          };

          speechRecognitionInstance.onerror = (event: any) => {
            if (event.error !== "no-speech") {
              console.warn("Speech recognition notice:", event.error);
            }
          };

          speechRecognitionInstance.start();
        } catch (srErr) {
          console.warn("SpeechRecognition start notice:", srErr);
        }
      }
    } catch (err) {
      console.warn("Microphone access failed:", err);
      transcriptText.value = "Microphone access denied or unavailable.";
      isListening.value = false;
      isContinuousMode.value = false;
    }
  };

  /** Finalize user's speech turn (called either on silence or explicit stop) */
  const finalizeUserTurn = async () => {
    if (!isListening.value) return;

    clearSilenceTimer();
    isListening.value = false;
    stopAudioAnalysis();

    if (speechRecognitionInstance) {
      try {
        speechRecognitionInstance.stop();
      } catch {}
      speechRecognitionInstance = null;
    }

    let audioBlob: Blob | null = null;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      audioBlob = await new Promise<Blob | null>((resolve) => {
        if (!mediaRecorder) return resolve(null);
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunks, {
            type: mediaRecorder?.mimeType || "audio/webm",
          });
          resolve(blob);
        };
        try {
          mediaRecorder.stop();
        } catch {
          resolve(null);
        }
      });
    }

    // Stop audio tracks
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaStream = null;

    // Check captured speech
    const speechFromRecognition = lastCapturedSpeech.trim();

    if (speechFromRecognition) {
      // We already have exact words recognized with 0 latency!
      await processUserInput(speechFromRecognition);
      return;
    }

    // If no recognition text but we have an audio blob, process with AssemblyAI
    if (audioBlob && audioBlob.size > 2000 && hasAssemblyKey.value) {
      await handleAudioTranscription(audioBlob);
      return;
    }

    // If truly no speech detected
    transcriptText.value = "No speech detected. Listening again...";
    if (isContinuousMode.value) {
      setTimeout(() => {
        if (isContinuousMode.value && !isListening.value && !isSpeaking.value) {
          startListening(true);
        }
      }, 1000);
    }
  };

  /** Stop listening entirely */
  const stopListening = () => {
    isContinuousMode.value = false;
    clearSilenceTimer();
    if (!isListening.value) return;
    finalizeUserTurn();
  };

  /** Toggle standard mic recording */
  const toggleListening = () => {
    if (isListening.value) {
      finalizeUserTurn();
    } else {
      startListening(false);
    }
  };

  /** Toggle continuous bi-directional conversational mode */
  const toggleContinuousConversation = () => {
    if (isContinuousMode.value) {
      isContinuousMode.value = false;
      stopListening();
    } else {
      isContinuousMode.value = true;
      startListening(true);
    }
  };

  /** Upload audio to AssemblyAI REST endpoint with full language detection */
  const handleAudioTranscription = async (blob: Blob) => {
    isProcessing.value = true;
    transcriptText.value = "Transcribing with AssemblyAI (all languages supported)...";

    try {
      // 1. Upload audio to AssemblyAI
      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error(`Upload error (${uploadRes.status})`);
      const { upload_url } = await uploadRes.json();

      // 2. Request transcription with auto language detection enabled
      const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_detection: true, // Auto-detect any of 99+ supported languages
          speech_model: "best",
          auto_chapters: false,
          speaker_labels: false,
        }),
      });

      if (!transcriptRes.ok) throw new Error(`Transcript request error (${transcriptRes.status})`);
      const { id } = await transcriptRes.json();

      // 3. Poll for completion
      let completed = false;
      let attempts = 0;
      let recognizedText = "";
      let recognizedLang = "en";

      while (!completed && attempts < 20) {
        attempts++;
        await new Promise((r) => setTimeout(r, 900));
        const checkRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { authorization: ASSEMBLYAI_API_KEY },
        });
        const data = await checkRes.json();
        if (data.status === "completed") {
          completed = true;
          recognizedText = (data.text || "").trim();
          recognizedLang = data.language_code || "en";
        } else if (data.status === "error") {
          throw new Error(data.error || "AssemblyAI transcription failed");
        }
      }

      if (recognizedText) {
        await processUserInput(recognizedText, recognizedLang);
      } else {
        transcriptText.value = "No audible speech was recognized. Please speak again...";
        if (isContinuousMode.value) {
          setTimeout(() => {
            if (isContinuousMode.value && !isListening.value && !isSpeaking.value) {
              startListening(true);
            }
          }, 1200);
        }
      }
    } catch (err: any) {
      console.warn("AssemblyAI transcription notice:", err);
      transcriptText.value = "Could not process audio. Please try speaking again.";
      if (isContinuousMode.value) {
        setTimeout(() => {
          if (isContinuousMode.value && !isListening.value && !isSpeaking.value) {
            startListening(true);
          }
        }, 1200);
      }
    } finally {
      isProcessing.value = false;
    }
  };

  /** Simulate voice input for instant demo testing */
  const simulateVoiceInput = (customCommand?: string) => {
    isListening.value = true;
    transcriptText.value = "Listening...";
    setTimeout(() => {
      isListening.value = false;
      const cmd = customCommand || "What are your core engineering capabilities?";
      processUserInput(cmd);
    }, 600);
  };

  /** Core End-to-End Pipeline: User Input ➔ OpenRouter AI ➔ Speech Output (TTS) ➔ Auto-Navigate ➔ Bi-Directional Resume */
  const processUserInput = async (text: string, langCode?: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    transcriptText.value = cleaned;
    isProcessing.value = true;

    try {
      // 1. Send user speech to OpenRouter AI (personalized to active GitHub profile)
      const aiResponse = await askOpenRouter(cleaned);
      lastResponse.value = aiResponse.cleanText;

      // 2. Trigger UI navigation if recommended by AI
      if (aiResponse.navigateTarget) {
        if (aiResponse.navigateTarget === "hero") {
          goHome();
        } else {
          goToSection(aiResponse.navigateTarget, 1.6);
        }
      }

      // 3. Speak response out loud using Web Speech Synthesis in detected language
      const targetLang = langCode || detectLanguageFromText(aiResponse.cleanText);
      await speak(aiResponse.cleanText, targetLang);

      // 4. Bi-Directional Continuity:
      // When AI finishes speaking aloud, automatically reactivate listening so the user can reply!
      if (isContinuousMode.value) {
        setTimeout(() => {
          if (isContinuousMode.value && !isListening.value && !isSpeaking.value) {
            startListening(true);
          }
        }, 400); // 400ms cooldown to avoid picking up speaker echo
      }
    } catch (e) {
      console.error("Pipeline error:", e);
      if (isContinuousMode.value) {
        setTimeout(() => {
          if (isContinuousMode.value && !isListening.value && !isSpeaking.value) {
            startListening(true);
          }
        }, 1000);
      }
    } finally {
      isProcessing.value = false;
    }
  };

  onUnmounted(() => {
    clearSilenceTimer();
    stopListening();
    stopSpeaking();
  });

  return {
    isListening,
    isProcessing,
    isSpeaking,
    isContinuousMode,
    activeLanguage,
    transcriptText,
    lastResponse,
    audioLevels: activeAudioLevels,
    hasAssemblyKey,
    startListening,
    stopListening,
    toggleListening,
    toggleContinuousConversation,
    finalizeUserTurn,
    simulateVoiceInput,
    processUserInput,
  };
}