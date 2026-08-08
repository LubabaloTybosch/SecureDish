import React, { useState } from "react";
import { VoiceLanguage, SUPPORTED_VOICE_LANGUAGES } from "../utils/voiceLanguages";
import { Volume2, VolumeX, Mic, Globe, Check, Settings2, Sparkles, RefreshCw } from "lucide-react";

interface VoiceLanguageBarProps {
  selectedLanguage: VoiceLanguage;
  onLanguageChange: (lang: VoiceLanguage) => void;
  autoSpeak: boolean;
  onAutoSpeakToggle: (autoSpeak: boolean) => void;
  speakingSpeed: number;
  onSpeedChange: (speed: number) => void;
  isSpeaking?: boolean;
  isListening?: boolean;
  onStopSpeaking?: () => void;
  title?: string;
  subtitle?: string;
}

export default function VoiceLanguageBar({
  selectedLanguage,
  onLanguageChange,
  autoSpeak,
  onAutoSpeakToggle,
  speakingSpeed,
  onSpeedChange,
  isSpeaking,
  isListening,
  onStopSpeaking,
  title = "Voice Intelligence & Language Engine",
  subtitle = "Multilingual voice input (30+ languages) & automatic AI audio readout"
}: VoiceLanguageBarProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sage/20 rounded-2xl p-4 shadow-sm transition-all mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Status & Title */}
        <div className="flex items-center gap-3">
          <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
            isSpeaking 
              ? "bg-emerald-500 text-white shadow-md animate-pulse" 
              : isListening 
                ? "bg-rose-500 text-white shadow-md animate-bounce" 
                : "bg-sage/15 text-sage"
          }`}>
            {isListening ? (
              <Mic className="h-5 w-5 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="h-5 w-5 animate-bounce" />
            ) : (
              <Globe className="h-5 w-5" />
            )}
            {(isSpeaking || isListening) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-charcoal tracking-wide uppercase">{title}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                <Sparkles className="h-2.5 w-2.5" />
                Voice Active
              </span>
            </div>
            <p className="text-xs text-charcoal-light font-medium mt-0.5">
              {isListening 
                ? `Listening in ${selectedLanguage.name}... Speak your query clearly.`
                : isSpeaking 
                  ? `Speaking response aloud in ${selectedLanguage.nativeName}...`
                  : subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Language Dropdown & Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const found = SUPPORTED_VOICE_LANGUAGES.find(l => l.code === e.target.value);
                if (found) onLanguageChange(found);
              }}
              className="appearance-none bg-sand/60 hover:bg-sand border border-sage/20 font-bold text-xs text-charcoal rounded-xl py-2 pl-3 pr-8 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage/30 transition-all"
            >
              {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-charcoal-light">
              <Globe className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Auto Speak Toggle */}
          <button
            type="button"
            onClick={() => onAutoSpeakToggle(!autoSpeak)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
              autoSpeak
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                : "bg-sand/40 border-sand-dark text-charcoal-light hover:bg-sand"
            }`}
            title="Automatically read AI responses aloud"
          >
            {autoSpeak ? <Volume2 className="h-3.5 w-3.5 text-emerald-600" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>Auto-Read {autoSpeak ? "ON" : "OFF"}</span>
          </button>

          {/* Settings / Speed Dropdown */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              showSettings ? "bg-sage text-white border-sage" : "bg-sand/40 border-sand-dark text-charcoal hover:bg-sand"
            }`}
            title="Adjust Voice Speed & Options"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          {isSpeaking && onStopSpeaking && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-sm transition-all"
            >
              <VolumeX className="h-3.5 w-3.5" />
              Stop Voice
            </button>
          )}
        </div>
      </div>

      {/* Expanded Voice Settings */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-sand-dark/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-sand/30 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal">Voice Speed:</span>
            {[0.8, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  speakingSpeed === speed
                    ? "bg-sage text-white shadow-sm"
                    : "bg-white border border-sand-dark text-charcoal hover:bg-sand"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="text-[11px] font-medium text-charcoal-light flex items-center gap-1">
            <span>Selected Language:</span>
            <span className="font-bold text-charcoal">{selectedLanguage.flag} {selectedLanguage.name} ({selectedLanguage.code})</span>
          </div>
        </div>
      )}
    </div>
  );
}
