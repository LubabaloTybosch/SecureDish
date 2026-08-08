import React from "react";
import { Volume2, VolumeX, Pause, Play, RefreshCw, Sparkles } from "lucide-react";
import { VoiceLanguage } from "../utils/voiceLanguages";

interface VoicePlayerButtonProps {
  text: string;
  id: string;
  isSpeaking: boolean;
  isPaused: boolean;
  currentSpeakingId: string | null;
  selectedLanguage: VoiceLanguage;
  onToggle: (text: string, id: string) => void;
  onStop: () => void;
  variant?: "button" | "card-header" | "compact";
  className?: string;
}

export default function VoicePlayerButton({
  text,
  id,
  isSpeaking,
  isPaused,
  currentSpeakingId,
  selectedLanguage,
  onToggle,
  onStop,
  variant = "button",
  className = ""
}: VoicePlayerButtonProps) {
  const isThisSpeaking = isSpeaking && currentSpeakingId === id;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => onToggle(text, id)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          isThisSpeaking
            ? "bg-emerald-500 text-white shadow-sm animate-pulse"
            : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-500/30"
        } ${className}`}
        title={`Listen to response in ${selectedLanguage.name}`}
      >
        {isThisSpeaking ? (
          isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
        <span>{isThisSpeaking ? (isPaused ? "Resume Voice" : "Pause Voice") : `Listen (${selectedLanguage.flag})`}</span>
      </button>
    );
  }

  if (variant === "card-header") {
    return (
      <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border bg-sand/40 border-sand-dark ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
            isThisSpeaking ? "bg-emerald-500 text-white animate-pulse shadow-md" : "bg-sage/15 text-sage"
          }`}>
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-charcoal">Voice Output Readout</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
                {selectedLanguage.flag} {selectedLanguage.nativeName}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-light font-medium">
              {isThisSpeaking ? (isPaused ? "Audio readout paused" : "Speaking aloud...") : "Click to hear AI Assessment voice readout"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggle(text, id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all ${
              isThisSpeaking
                ? isPaused ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                : "bg-sage hover:bg-sage-light"
            }`}
          >
            {isThisSpeaking ? (
              isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              )
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {isThisSpeaking && (
            <button
              type="button"
              onClick={onStop}
              className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
              title="Stop Voice Playback"
            >
              <VolumeX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(text, id)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
        isThisSpeaking
          ? "bg-emerald-600 text-white shadow-md animate-pulse"
          : "bg-sand-dark/60 hover:bg-sand-dark text-charcoal border border-sand-dark"
      } ${className}`}
    >
      <Volume2 className="h-3.5 w-3.5" />
      <span>{isThisSpeaking ? (isPaused ? "Resume Voice" : "Pause Voice") : `Listen (${selectedLanguage.flag})`}</span>
    </button>
  );
}
