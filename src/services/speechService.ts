import { Language } from "../types";

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speechService = {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  },

  speak(
    text: string,
    lang: Language = "en",
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.isSupported()) {
      console.warn("SpeechSynthesis not supported on this browser.");
      return;
    }

    try {
      // Cancel ongoing speech
      window.speechSynthesis.cancel();

      if (!text || text.trim().length === 0) return;

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance = utterance;

      // Select appropriate language tag
      switch (lang) {
        case "ta":
          utterance.lang = "ta-IN";
          break;
        case "hi":
          utterance.lang = "hi-IN";
          break;
        default:
          utterance.lang = "en-IN";
          break;
      }

      utterance.rate = 0.95; // Slightly slower for enhanced clarity for informal workers
      utterance.pitch = 1.0;

      // Try to find a matching voice if voices are loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = lang === "ta" ? "ta" : lang === "hi" ? "hi" : "en";
        const matchingVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith(langPrefix)
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech playback error:", err);
      if (onEnd) onEnd();
    }
  },

  stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  },
};
