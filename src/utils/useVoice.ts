import { useState, useEffect, useRef, useCallback } from "react";
import { SUPPORTED_VOICE_LANGUAGES, VoiceLanguage, cleanTextForSpeech, getLanguageByCode } from "./voiceLanguages";

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface UseVoiceOptions {
  initialLanguageCode?: string;
  onTranscriptComplete?: (transcript: string) => void;
}

export function useVoice(options?: UseVoiceOptions) {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>(() => {
    return getLanguageByCode(options?.initialLanguageCode || 'en-US');
  });

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const [speakingSpeed, setSpeakingSpeed] = useState<number>(1.0);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis reference
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
      // Force loading voices in Chrome
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Speech Recognition Handler
  const startListening = useCallback((overrideLangCode?: string) => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setRecognitionError("Speech recognition is not supported in this browser. You can still use text input and Voice Synthesis output.");
      return;
    }

    // Stop current recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      const targetLang = overrideLangCode || selectedLanguage.code;
      recognition.lang = targetLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      setInterimTranscript("");
      setFinalTranscript("");
      setRecognitionError(null);
      setIsListening(true);

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) setInterimTranscript(interim);
        if (final) {
          setFinalTranscript(final);
          if (options?.onTranscriptComplete) {
            options.onTranscriptComplete(final);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech Recognition Error:", event.error);
        if (event.error !== "no-speech") {
          setRecognitionError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setRecognitionError(`Could not access microphone: ${err.message || err}`);
      setIsListening(false);
    }
  }, [selectedLanguage.code, options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Speech Synthesis Handler
  const speakText = useCallback((text: string, id: string = "default", overrideLangCode?: string) => {
    if (!synthesisRef.current) {
      console.warn("SpeechSynthesis not supported.");
      return;
    }

    // Cancel current speech
    synthesisRef.current.cancel();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLangCode = overrideLangCode || selectedLanguage.code;
    utterance.lang = targetLangCode;
    utterance.rate = speakingSpeed;

    // Pick best available voice matching language code or prefix
    const voices = synthesisRef.current.getVoices();
    const exactVoice = voices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase());
    const prefixVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangCode.split('-')[0].toLowerCase()));
    
    if (exactVoice) {
      utterance.voice = exactVoice;
    } else if (prefixVoice) {
      utterance.voice = prefixVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentSpeakingId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingId(null);
    };

    utteranceRef.current = utterance;
    synthesisRef.current.speak(utterance);
  }, [selectedLanguage.code, speakingSpeed]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSpeakingId(null);
  }, []);

  const pauseSpeaking = useCallback(() => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  const resumeSpeaking = useCallback(() => {
    if (synthesisRef.current && isPaused) {
      synthesisRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const toggleSpeaking = useCallback((text: string, id: string = "default") => {
    if (isSpeaking && currentSpeakingId === id) {
      if (isPaused) {
        resumeSpeaking();
      } else {
        pauseSpeaking();
      }
    } else {
      speakText(text, id);
    }
  }, [isSpeaking, isPaused, currentSpeakingId, speakText, pauseSpeaking, resumeSpeaking]);

  return {
    selectedLanguage,
    setSelectedLanguage,
    isListening,
    interimTranscript,
    finalTranscript,
    recognitionError,
    startListening,
    stopListening,
    isSpeaking,
    isPaused,
    currentSpeakingId,
    speakingSpeed,
    setSpeakingSpeed,
    autoSpeak,
    setAutoSpeak,
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    toggleSpeaking,
    hasSpeechRecognition: typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    hasSpeechSynthesis: typeof window !== "undefined" && "speechSynthesis" in window
  };
}
