import React, { useState, useRef, useEffect } from "react";
import { Message, UserPlan, UserProfile } from "../types";
import { useVoice } from "../utils/useVoice";
import VoiceLanguageBar from "./VoiceLanguageBar";
import VoicePlayerButton from "./VoicePlayerButton";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Clock,
  Lock,
  Crown,
  Zap,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Globe
} from "lucide-react";

interface ChatViewProps {
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  currentUser: UserProfile | null;
}

export default function ChatView({ userPlan, setUserPlan, currentUser }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-msg",
      sender: "ai",
      content: "Hello! I am your Voice-Driven SecureDish AI Food Security Advisor.\n\nI support text and voice intelligence in 30+ languages. You can speak to me directly using the microphone or listen to my responses aloud. How can I assist you with sustainable development, risk intelligence, or agricultural policy today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize voice engine hook
  const voice = useVoice({
    initialLanguageCode: "en-US",
    onTranscriptComplete: (transcript) => {
      if (transcript.trim()) {
        setInputValue(transcript);
        // Automatically send voice query
        handleSendMessage(transcript);
      }
    }
  });

  const quickPrompts = [
    { text: "Mitigate East Africa drought impact", query: "How can East Africa mitigate the impact of the ongoing drought warning on crop yields?" },
    { text: "Cold chain logistics practices", query: "What are the best practices for maintaining food safety and preventing food waste in cold chain logistics?" },
    { text: "Regenerative farming fundamentals", query: "What are the core regenerative farming techniques to restore soil organic matter?" },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Update input text while user is speaking
  useEffect(() => {
    if (voice.interimTranscript) {
      setInputValue(voice.interimTranscript);
    }
  }, [voice.interimTranscript]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Stop microphone if currently listening
    voice.stopListening();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          language: voice.selectedLanguage.name,
          languageCode: voice.selectedLanguage.code
        }),
      });

      let replyText = "";
      if (response.ok) {
        const data = await response.json();
        replyText = data.text;
      }

      if (!replyText) {
        const queryLower = textToSend.toLowerCase();
        if (queryLower.includes("drought") || queryLower.includes("africa")) {
          replyText = `East Africa is facing elevated drought risk in ${voice.selectedLanguage.name} context (Supply index: 52%, Trend: Down). Recommended strategies include:\n\n1. Cultivating drought-tolerant crops like sorghum, cassava, and millet.\n2. Implementing drip irrigation systems and soil mulching to conserve moisture.\n3. Creating local seed banks and buffer grain stockpiles.`;
        } else if (queryLower.includes("supply") || queryLower.includes("logistics")) {
          replyText = `Food supply chain resilience (${voice.selectedLanguage.name}) relies heavily on cold chain logistics, multi-tier traceability, and supplier diversification. Implementing cold-storage facilities near regional transport hubs dramatically cuts spoilage losses.`;
        } else {
          replyText = `SecureDish Voice Advisor (${voice.selectedLanguage.name}): I am ready to assist you. Ask me about sustainable crop management, regional trade bottlenecks, or climate adaptation strategies in any language!`;
        }
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak response automatically if autoSpeak is enabled
      if (voice.autoSpeak) {
        setTimeout(() => {
          voice.speakText(replyText, aiMessage.id, voice.selectedLanguage.code);
        }, 300);
      }
    } catch (err) {
      console.error("Chat API Error, using fallback voice intelligence:", err);
      const queryLower = textToSend.toLowerCase();
      let fallbackText = `SecureDish AI Food Security Advisor (${voice.selectedLanguage.name}): How can I assist you with agricultural risk intelligence or sustainable supply chain strategies today?`;
      if (queryLower.includes("drought") || queryLower.includes("africa")) {
        fallbackText = "East Africa is currently facing elevated drought risk (Supply index: 52%, Trend: Down). Recommended strategies include:\n\n1. Cultivating drought-tolerant crops like sorghum, cassava, and millet.\n2. Implementing drip irrigation systems and soil mulching to conserve moisture.\n3. Creating local seed banks and buffer grain stockpiles.";
      }

      const errorMessage: Message = {
        id: `fallback-${Date.now()}`,
        sender: "ai",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (voice.autoSpeak) {
        setTimeout(() => {
          voice.speakText(fallbackText, errorMessage.id, voice.selectedLanguage.code);
        }, 300);
      }
    } finally {
      setLoading(false);
    }
  };

  // If user is on Free Plan, render the Permission Gate Screen
  if (userPlan === "free") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* Lock Screen Header */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center space-y-6 border border-amber-300 bg-gradient-to-b from-amber-50/50 via-white to-sand/40 relative overflow-hidden shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-900 border border-amber-300">
              <Crown className="h-3.5 w-3.5 text-amber-600" />
              Pro Permission Required
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              AI Sustainability Advisor
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              The Gemini-powered AI Risk Advisor is an exclusive Pro feature for real-time agricultural intelligence, drought modeling, and custom policy strategy.
            </p>
          </div>

          {/* Plan Comparison Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-2">
            {/* Free Plan Access */}
            <div className="p-4 rounded-2xl bg-white border border-sand-dark space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Your Current Free Plan Includes:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-charcoal-light font-medium">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Full Access to Dashboard</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> First 20 Research Resources</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Foundational Free Courses</li>
              </ul>
            </div>

            {/* Pro Plan Unlocks */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Crown className="h-4 w-4 text-amber-600" />
                <span>Pro Plan Unlocks:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 font-semibold">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Unlimited AI Advisor Queries</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> All 32 Masterclass Courses</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> All 35+ Publications & Downloads</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="btn-upgrade-chat-lock"
              onClick={() => setUserPlan("pro")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-700 transition-all hover:scale-[1.02]"
            >
              <Crown className="h-4.5 w-4.5 text-amber-100" />
              <span>Upgrade to Pro Plan (Instant Access)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is Pro Plan, render the Full Gemini Chat Interface
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-4 flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Upper header */}
      <div className="flex items-center justify-between border-b border-sand-dark pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-charcoal">
              AI Sustainability Advisor (Voice-Driven)
            </h1>
            <p className="text-charcoal-light text-xs mt-0.5">
              Speak or type queries in any language (30+ supported). Live voice synthesis and recognition active.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-900">
          <Crown className="h-3.5 w-3.5 text-amber-600" />
          PRO UNLIMITED ACCESS
        </span>
      </div>

      {/* Voice Language Control Bar */}
      <VoiceLanguageBar
        selectedLanguage={voice.selectedLanguage}
        onLanguageChange={voice.setSelectedLanguage}
        autoSpeak={voice.autoSpeak}
        onAutoSpeakToggle={voice.setAutoSpeak}
        speakingSpeed={voice.speakingSpeed}
        onSpeedChange={voice.setSpeakingSpeed}
        isSpeaking={voice.isSpeaking}
        isListening={voice.isListening}
        onStopSpeaking={voice.stopSpeaking}
        title="Voice Advisor Language & Audio Engine"
        subtitle="Speak your prompt or listen to AI responses aloud in 30+ languages"
      />

      {/* Main split work area */}
      <div className="flex-1 min-h-[420px] grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Left Column: Quick queries list */}
        <div className="hidden lg:flex flex-col gap-4 lg:col-span-1 border-r border-sand-dark pr-6">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal uppercase tracking-wider pb-1">
            <HelpCircle className="h-4 w-4 text-sage" />
            <span>Suggested Queries</span>
          </div>
          <div className="space-y-2.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                id={`quick-prompt-btn-${idx}`}
                onClick={() => handleSendMessage(p.query)}
                className="w-full text-left p-3 rounded-xl border border-sand-dark bg-white hover:bg-sand-dark hover:border-sage/20 text-xs text-charcoal font-semibold leading-relaxed transition-all focus:outline-none flex flex-col justify-between group"
              >
                <span>{p.text}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-sage font-bold uppercase tracking-wider mt-2 group-hover:translate-x-1 transition-transform">
                  Ask Advisor ({voice.selectedLanguage.flag}) <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Chat messages box */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white/70 border border-sand-dark rounded-2xl overflow-hidden shadow-xs h-full">
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isAi = m.sender === "ai";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3.5 max-w-[85%] ${isAi ? "" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Icon Avatar */}
                  <div
                    className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center border ${
                      isAi
                        ? "bg-sage/10 border-sage/15 text-sage"
                        : "bg-charcoal/5 border-charcoal/10 text-charcoal-light"
                    }`}
                  >
                    {isAi ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>

                  {/* Bubble content */}
                  <div className="space-y-1.5 flex-1">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line border ${
                        isAi
                          ? "bg-sand border-sand-dark text-charcoal rounded-tl-none"
                          : "bg-sage text-white border-sage-dark rounded-tr-none shadow-xs"
                      }`}
                    >
                      {m.content}
                    </div>

                    {/* Voice Output & Timestamp bar */}
                    <div className={`text-[10px] text-charcoal-light font-medium flex items-center justify-between gap-2 ${!isAi ? "flex-row-reverse" : ""}`}>
                      {isAi ? (
                        <VoicePlayerButton
                          text={m.content}
                          id={m.id}
                          isSpeaking={voice.isSpeaking}
                          isPaused={voice.isPaused}
                          currentSpeakingId={voice.currentSpeakingId}
                          selectedLanguage={voice.selectedLanguage}
                          onToggle={voice.toggleSpeaking}
                          onStop={voice.stopSpeaking}
                          variant="compact"
                        />
                      ) : (
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          User Prompt
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-charcoal-light/60">
                        <Clock className="h-3 w-3" />
                        <span>{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI thinking state */}
            {loading && (
              <div className="flex gap-3.5 max-w-[85%]">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-sage/10 border border-sage/15 text-sage flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="p-4 rounded-2xl rounded-tl-none bg-sand border border-sand-dark text-charcoal flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 animate-spin text-sage" />
                    <span className="text-xs font-semibold animate-pulse text-charcoal-light">
                      Advisor is formulating voice response in {voice.selectedLanguage.name}...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Listening Overlay Preview */}
          {voice.isListening && (
            <div className="bg-rose-50 border-t border-rose-200 p-3 px-6 flex items-center justify-between gap-3 text-rose-900 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div className="text-xs font-semibold">
                  <span className="font-extrabold uppercase text-rose-700">Listening ({voice.selectedLanguage.name}):</span>{" "}
                  <span className="italic">{voice.interimTranscript || "Speak your query now..."}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={voice.stopListening}
                className="text-xs font-extrabold text-rose-700 hover:text-rose-900 underline shrink-0"
              >
                Stop Mic
              </button>
            </div>
          )}

          {/* Quick inputs footer */}
          <div className="bg-sand-dark/40 border-t border-sand-dark p-4 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2.5 items-center"
            >
              {/* Microphone Voice Input Button */}
              <button
                type="button"
                id="btn-voice-mic-chat"
                onClick={() => {
                  if (voice.isListening) {
                    voice.stopListening();
                  } else {
                    voice.startListening();
                  }
                }}
                className={`h-10 px-3 rounded-xl flex items-center justify-center font-bold text-xs gap-1.5 shadow-sm transition-all shrink-0 ${
                  voice.isListening
                    ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                    : "bg-white hover:bg-sand border border-sand-dark text-charcoal"
                }`}
                title={`Click to speak query in ${voice.selectedLanguage.name}`}
              >
                <Mic className={`h-4 w-4 ${voice.isListening ? "text-white animate-bounce" : "text-sage"}`} />
                <span className="hidden sm:inline">{voice.isListening ? "Listening..." : "Voice Input"}</span>
              </button>

              <input
                id="chat-user-input"
                type="text"
                disabled={loading}
                placeholder={`Speak or type query in ${voice.selectedLanguage.name} (${voice.selectedLanguage.nativeName})...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white border border-sand-dark rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder-charcoal-light/50 focus:outline-none focus:border-sage transition-all disabled:opacity-60"
              />

              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="h-10 w-10 bg-sage hover:bg-sage-dark text-white rounded-xl flex items-center justify-center shadow-md shadow-sage/10 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
