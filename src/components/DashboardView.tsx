import React, { useState, useEffect } from "react";
import { ActiveView, SupplyDataPoint, RiskAlert, QuickStats, RegionDataPoint } from "../types";
import { FALLBACK_DASHBOARD, FALLBACK_DASHBOARD_BY_YEAR } from "../data/fallbackData";
import { useVoice } from "../utils/useVoice";
import { SUPPORTED_VOICE_LANGUAGES } from "../utils/voiceLanguages";
import VoicePlayerButton from "./VoicePlayerButton";
import VoiceLanguageBar from "./VoiceLanguageBar";
import {
  Activity,
  AlertTriangle,
  Globe,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  Calendar,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
}

export default function DashboardView({ setActiveView }: DashboardViewProps) {
  const [selectedYear, setSelectedYear] = useState<"2026" | "2025" | "2024">("2026");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    supplyData: SupplyDataPoint[];
    riskAlerts: RiskAlert[];
    quickStats: QuickStats;
    regionData: RegionDataPoint[];
  } | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [voiceCustomPrompt, setVoiceCustomPrompt] = useState<string>("");

  // Initialize Voice Engine for AI Assessment
  const voice = useVoice({
    initialLanguageCode: "en-US",
    onTranscriptComplete: (transcript) => {
      if (transcript.trim()) {
        setVoiceCustomPrompt(transcript);
        triggerAiAnalysisWithPrompt(transcript);
      }
    }
  });

  const fetchData = async (year: string = selectedYear) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard?year=${year}`);
      if (response.ok) {
        const json = await response.json();
        if (json.supplyData) {
          setData(json);
          return;
        }
      }
      setData(FALLBACK_DASHBOARD_BY_YEAR[year] || FALLBACK_DASHBOARD);
    } catch (err) {
      console.error("Error fetching dashboard data, using fallback:", err);
      setData(FALLBACK_DASHBOARD_BY_YEAR[year] || FALLBACK_DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (year: "2026" | "2025" | "2024") => {
    setSelectedYear(year);
  };

  const generateRiskAssessmentReport = (year: string, currentData: typeof data) => {
    if (!currentData) return "";
    const supplyIndex = currentData.quickStats.totalSupplyIndex;
    const activeRisksCount = currentData.quickStats.activeRisks;
    const regions = currentData.regionData || [];
    const lowestRegion = [...regions].sort((a, b) => a.supply - b.supply)[0];
    const highestRegion = [...regions].sort((a, b) => b.supply - a.supply)[0];

    const alertsSummary = currentData.riskAlerts && currentData.riskAlerts.length > 0
      ? currentData.riskAlerts.map(a => `• [${a.severity.toUpperCase()}] ${a.title} (${a.region}): ${a.message}`).join("\n")
      : "• No critical disruptions recorded for this period.";

    return `Executive Risk Synthesis & Early Warning Report (${year})

1. Overall Supply Vulnerability Index:
The global aggregate food supply health score for ${year} stands at ${supplyIndex}%. Baseline output in ${highestRegion?.region || "North America"} remains strong (${highestRegion?.supply || 90}%), while ${lowestRegion?.region || "East Africa"} exhibits elevated stress levels at ${lowestRegion?.supply || 52}% capacity.

2. Active Vulnerability Vectors (${activeRisksCount} Logged Events):
${alertsSummary}

3. Strategic Action Plan (${year}):
• Prioritize climate-adaptive seed distribution in vulnerable zones (${lowestRegion?.region || "East Africa"}).
• Fortify cold-chain logistics and multi-route transport buffers to mitigate port delays.
• Deploy precision fertilizer allocation & emergency grain reserve funds for immediate stabilization.`;
  };

  const triggerAiAnalysisWithPrompt = async (customPrompt?: string) => {
    if (generatingAi) return;
    setGeneratingAi(true);
    setAiAnalysis("");
    const promptText = customPrompt || `Please perform a comprehensive risk assessment for reporting year ${selectedYear} based on regional indices and active alerts in ${voice.selectedLanguage.name}.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              sender: "user",
              content: promptText,
            },
          ],
          language: voice.selectedLanguage.name,
          languageCode: voice.selectedLanguage.code
        }),
      });

      let finalReportText = "";

      if (response.ok) {
        const resData = await response.json();
        if (resData && resData.text) {
          finalReportText = resData.text;
        }
      }

      if (!finalReportText) {
        finalReportText = generateRiskAssessmentReport(selectedYear, data);
      }

      setAiAnalysis(finalReportText);

      // Speak response aloud if autoSpeak is enabled
      if (voice.autoSpeak) {
        setTimeout(() => {
          voice.speakText(finalReportText, "assessment-report", voice.selectedLanguage.code);
        }, 300);
      }
    } catch (err) {
      console.error("AI Analysis API call failed, using local risk synthesis engine:", err);
      const fallbackReport = generateRiskAssessmentReport(selectedYear, data);
      setAiAnalysis(fallbackReport);

      if (voice.autoSpeak) {
        setTimeout(() => {
          voice.speakText(fallbackReport, "assessment-report", voice.selectedLanguage.code);
        }, 300);
      }
    } finally {
      setGeneratingAi(false);
    }
  };

  const triggerAiAnalysis = () => triggerAiAnalysisWithPrompt();

  if (loading || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-charcoal">
        <RefreshCw className="h-8 w-8 animate-spin text-sage" />
        <p className="text-sm font-medium animate-pulse">Loading dashboard data for {selectedYear}...</p>
      </div>
    );
  }

  const { supplyData, riskAlerts, quickStats, regionData } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
              Security Intelligence Dashboard
            </h1>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
              selectedYear === "2026" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
            }`}>
              {selectedYear === "2026" ? "2026 (Live)" : `${selectedYear} Historical`}
            </span>
          </div>
          <p className="text-charcoal-light text-sm">
            Food supply monitoring, regional vulnerability index, and risk intelligence analytics.
          </p>
        </div>
        <button
          id="refresh-dash-btn"
          onClick={() => fetchData(selectedYear)}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-lg border border-sage/15 bg-white px-4 py-2 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-sand-dark focus:outline-none"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Feeds ({selectedYear})
        </button>
      </div>

      {/* Year Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur border border-sand-dark p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Reporting Period Filter</span>
              {selectedYear === "2026" ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Current Reporting Year
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  Previous Year Archive
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal font-medium mt-0.5">
              {selectedYear === "2026" 
                ? "Displaying active live telemetry, current commodity availability, and 2026 threat profiles."
                : `Filtered to historical data stream, archived risk events, and regional metrics for ${selectedYear}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-bold text-charcoal-light mr-1">Year:</span>
          <div className="inline-flex p-1 rounded-xl bg-sand-dark/60 border border-sand-dark">
            {(["2026", "2025", "2024"] as const).map((yr) => {
              const isActive = selectedYear === yr;
              return (
                <button
                  key={yr}
                  id={`year-filter-${yr}`}
                  onClick={() => handleYearChange(yr)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? "bg-sage text-white shadow-sm"
                      : "text-charcoal hover:bg-white/80"
                  }`}
                >
                  {yr === "2026" ? "2026 (Current)" : yr}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of 4 stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Supply Index */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-light">Global Supply Index</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">{quickStats.totalSupplyIndex}%</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              {selectedYear === "2026" ? "Healthy" : "Recorded"}
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">{selectedYear} weighted regional index</p>
        </div>

        {/* Active Risks */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-light">
              {selectedYear === "2026" ? "Active Risk Alerts" : "Risk Events Logged"}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">{quickStats.activeRisks}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {selectedYear === "2026" ? "Monitored" : "Archived"}
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">{selectedYear} threat profiles</p>
        </div>

        {/* Regions Monitored */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-light">Regions Monitored</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">{quickStats.regionsMonitored}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {selectedYear === "2026" ? "Active" : "Logged"}
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">Global telemetry nodes ({selectedYear})</p>
        </div>

        {/* Training Completed */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-light">Expert Training Certs</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">{quickStats.coursesCompleted}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
              Issued
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">Academy completions in {selectedYear}</p>
        </div>
      </div>

      {/* Main visual sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend chart card (2 cols on large screen) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-sand-dark pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                Global Commodity Indices
                <span className="text-xs font-extrabold text-sage bg-sage/10 px-2 py-0.5 rounded-md">
                  {selectedYear}
                </span>
              </h2>
              <p className="text-xs text-charcoal-light">Monthly food availability tracking for {selectedYear}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Grains</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Veggies</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Dairy</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Proteins</span>
            </div>
          </div>

          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrains" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVegetables" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0d7" />
                <XAxis dataKey="month" stroke="#7a8581" />
                <YAxis stroke="#7a8581" domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fbfbf8", borderRadius: "12px", border: "1px solid #e0e0d7" }}
                  labelStyle={{ fontWeight: "bold", color: "#1e2522" }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="grains" name="Grains" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGrains)" />
                <Area type="monotone" dataKey="vegetables" name="Vegetables" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorVegetables)" />
                <Area type="monotone" dataKey="dairy" name="Dairy" stroke="#3b82f6" strokeWidth={2} fill={""} fillOpacity={0} />
                <Area type="monotone" dataKey="proteins" name="Proteins" stroke="#f43f5e" strokeWidth={2} fill={""} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region supply table (1 col) */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-sand-dark pb-4 mb-5">
              <h2 className="text-lg font-bold text-charcoal">Regional Supply Health</h2>
              <p className="text-xs text-charcoal-light">Current resource capacity and directional trends</p>
            </div>

            <div className="space-y-4">
              {regionData.map((reg, idx) => {
                let trendIcon = <Minus className="h-4 w-4 text-charcoal-light/60" />;
                let trendColor = "bg-charcoal-light/5 text-charcoal-light";

                if (reg.trend === "up") {
                  trendIcon = <TrendingUp className="h-4 w-4 text-emerald-600" />;
                  trendColor = "bg-emerald-50 text-emerald-700";
                } else if (reg.trend === "down") {
                  trendIcon = <TrendingDown className="h-4 w-4 text-rose-600" />;
                  trendColor = "bg-rose-50 text-rose-700";
                }

                return (
                  <div key={idx} className="space-y-1.5 pb-3 border-b border-sand-dark/30 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-charcoal">{reg.region}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-charcoal">{reg.supply}%</span>
                        <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${trendColor}`}>
                          {trendIcon}
                          {reg.trend}
                        </span>
                      </div>
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="h-1.5 w-full bg-sand-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          reg.supply >= 80 ? "bg-emerald-500" : reg.supply >= 60 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${reg.supply}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Low row: Risk Alerts & AI synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Threat Stream (2 columns on large screen) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="border-b border-sand-dark pb-4 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-charcoal">Threat & Disruption Monitor</h2>
              <p className="text-xs text-charcoal-light">Real-time alerts tracking agriculture and logistics risks</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
              Live Feed
            </span>
          </div>

          <div className="space-y-4">
            {riskAlerts.map((alert) => {
              const isHigh = alert.severity === "high";
              const isMedium = alert.severity === "medium";

              return (
                <div
                  key={alert.id}
                  className={`flex gap-4 p-4 rounded-xl border transition-all ${
                    isHigh
                      ? "bg-rose-500/5 border-rose-500/10"
                      : isMedium
                      ? "bg-amber-500/5 border-amber-500/10"
                      : "bg-emerald-500/5 border-emerald-500/10"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isHigh
                        ? "bg-rose-100 text-rose-700"
                        : isMedium
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h4 className="text-sm font-bold text-charcoal">{alert.title}</h4>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          isHigh
                            ? "bg-rose-100 text-rose-700"
                            : isMedium
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-light leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-charcoal-light/50 font-medium pt-1">
                      <Clock className="h-3 w-3" />
                      <span>Reported on {alert.createdAt}</span>
                      <span>•</span>
                      <span>Region: {alert.region}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Synthesis Column */}
        <div className="rounded-2xl p-6 flex flex-col justify-between bg-charcoal text-white border border-sage/30 shadow-xl relative overflow-hidden">
          {/* Subtle cosmic light effect */}
          <div className="absolute top-0 right-0 -z-0 h-40 w-40 rounded-full bg-sage/20 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sage/30 flex items-center justify-center text-emerald-300 shadow-sm">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">Voice AI Assessment</h3>
                  <p className="text-[10px] text-emerald-200/80">Voice-driven early warning report ({voice.selectedLanguage.flag} {voice.selectedLanguage.name})</p>
                </div>
              </div>

              {/* Language Picker Dropdown */}
              <select
                value={voice.selectedLanguage.code}
                onChange={(e) => {
                  const lang = SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === e.target.value);
                  if (lang) voice.setSelectedLanguage(lang);
                }}
                className="bg-white/10 text-white text-xs font-semibold rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none focus:bg-charcoal transition-all"
              >
                {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-charcoal text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Listening Indicator Bar if active */}
            {voice.isListening && (
              <div className="mb-4 bg-rose-500/20 border border-rose-400/40 rounded-xl p-2.5 text-xs text-rose-100 flex items-center gap-2 animate-pulse">
                <Mic className="h-4 w-4 text-rose-400 animate-bounce" />
                <span className="font-bold text-rose-300">Dictating Assessment Directive:</span>
                <span className="italic font-medium truncate">{voice.interimTranscript || "Listening..."}</span>
              </div>
            )}

            {aiAnalysis ? (
              <div className="space-y-3">
                {/* Voice Player Bar for AI Assessment */}
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/15 flex items-center justify-between gap-2">
                  <VoicePlayerButton
                    text={aiAnalysis}
                    id="assessment-report"
                    isSpeaking={voice.isSpeaking}
                    isPaused={voice.isPaused}
                    currentSpeakingId={voice.currentSpeakingId}
                    selectedLanguage={voice.selectedLanguage}
                    onToggle={voice.toggleSpeaking}
                    onStop={voice.stopSpeaking}
                    variant="card-header"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => voice.setAutoSpeak(!voice.autoSpeak)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                        voice.autoSpeak
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}
                      title="Auto-read new AI assessments aloud"
                    >
                      {voice.autoSpeak ? "Auto-Read ON" : "Auto-Read OFF"}
                    </button>
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-sand-dark space-y-3.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {aiAnalysis.split("\n\n").map((para, i) => {
                    const isHeading = para.match(/^(\d+\.|[A-Z\s]{4,}:|Executive)/);
                    return (
                      <div key={i} className="text-sand/95 font-normal leading-relaxed">
                        {isHeading ? (
                          <p className="whitespace-pre-line text-emerald-300 font-bold text-xs tracking-wide">
                            {para}
                          </p>
                        ) : (
                          <p className="whitespace-pre-line text-emerald-50/90 font-medium text-xs leading-relaxed">
                            {para}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center text-center gap-3">
                <Sparkles className="h-10 w-10 text-emerald-400 animate-pulse" />
                <p className="text-xs text-emerald-100/80 max-w-xs leading-relaxed font-medium">
                  Generate a voice-synthesized assessment report in {voice.selectedLanguage.name} ({voice.selectedLanguage.nativeName}).
                </p>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 mt-5 space-y-2">
            <div className="flex gap-2">
              {/* Mic dictation button for assessment */}
              <button
                type="button"
                id="btn-voice-mic-dash"
                onClick={() => {
                  if (voice.isListening) {
                    voice.stopListening();
                  } else {
                    voice.startListening();
                  }
                }}
                className={`px-3 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  voice.isListening
                    ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20"
                }`}
                title="Speak custom directive for AI Assessment"
              >
                <Mic className={`h-4 w-4 ${voice.isListening ? "text-white animate-bounce" : "text-emerald-300"}`} />
                <span className="hidden sm:inline">{voice.isListening ? "Listening..." : "Dictate"}</span>
              </button>

              <button
                id="dash-gen-ai-btn"
                onClick={triggerAiAnalysis}
                disabled={generatingAi}
                className="group flex-1 flex items-center justify-center gap-2 rounded-xl bg-sage hover:bg-sage-light text-white font-semibold py-3 text-sm shadow-lg transition-all focus:outline-none disabled:opacity-50 active:scale-[0.99]"
              >
                {generatingAi ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span className="text-white">Synthesizing ({voice.selectedLanguage.flag})...</span>
                  </>
                ) : aiAnalysis ? (
                  <>
                    <RefreshCw className="h-4 w-4 text-white" />
                    <span className="text-white">Regenerate Assessment</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">Generate Voice Assessment</span>
                    <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {aiAnalysis && (
              <button
                id="dash-go-chat-btn"
                onClick={() => setActiveView("chat")}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors pt-1"
              >
                Discuss assessment in AI Voice Advisor →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
