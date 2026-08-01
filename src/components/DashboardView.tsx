import React, { useState, useEffect } from "react";
import { ActiveView, SupplyDataPoint, RiskAlert, QuickStats, RegionDataPoint } from "../types";
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
  ArrowRight
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    supplyData: SupplyDataPoint[];
    riskAlerts: RiskAlert[];
    quickStats: QuickStats;
    regionData: RegionDataPoint[];
  } | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [generatingAi, setGeneratingAi] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard");
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerAiAnalysis = async () => {
    if (generatingAi) return;
    setGeneratingAi(true);
    setAiAnalysis("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              sender: "user",
              content: "Please perform a comprehensive risk assessment based on current regional indices and active alerts.",
            },
          ],
        }),
      });
      const resData = await response.json();
      setAiAnalysis(resData.text || "Analysis complete.");
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setAiAnalysis("Failed to generate risk synthesis. Please check your Gemini connection or retry.");
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-charcoal">
        <RefreshCw className="h-8 w-8 animate-spin text-sage" />
        <p className="text-sm font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  const { supplyData, riskAlerts, quickStats, regionData } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
            Security Intelligence Dashboard
          </h1>
          <p className="text-charcoal-light text-sm mt-1">
            Real-time food supply monitoring and risk intelligence overview.
          </p>
        </div>
        <button
          id="refresh-dash-btn"
          onClick={fetchData}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-lg border border-sage/15 bg-white px-4 py-2 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-sand-dark focus:outline-none"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Live Feeds
        </button>
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
              Healthy
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">Weighted regional capacity index</p>
        </div>

        {/* Active Risks */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-light">Active Risk Alerts</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">{quickStats.activeRisks}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Monitored
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">Early-warning threat profiles</p>
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
              Active
            </span>
          </div>
          <p className="text-xs text-charcoal-light/70 mt-2">Reporting data nodes globally</p>
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
          <p className="text-xs text-charcoal-light/70 mt-2">Open academy completions</p>
        </div>
      </div>

      {/* Main visual sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend chart card (2 cols on large screen) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-sand-dark pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-charcoal">Global Commodity Indices</h2>
              <p className="text-xs text-charcoal-light">Year-to-date monthly availability tracking</p>
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
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between bg-charcoal text-white relative overflow-hidden">
          {/* Subtle cosmic light effect */}
          <div className="absolute top-0 right-0 -z-0 h-40 w-40 rounded-full bg-sage-light/10 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-5">
              <div className="h-8 w-8 rounded-lg bg-sage/20 flex items-center justify-center text-sage-light">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold">AI Risk Intelligence</h3>
                <p className="text-[10px] text-white/60">Generate real-time early warning summaries</p>
              </div>
            </div>

            {aiAnalysis ? (
              <div className="text-xs leading-relaxed text-white/80 space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {aiAnalysis.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <Sparkles className="h-10 w-10 text-sage-light animate-pulse" />
                <p className="text-xs text-white/70 max-w-xs leading-relaxed">
                  Synthesize current regional indices, threat streams, and climate volatility into an early-warning report.
                </p>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 mt-5">
            <button
              id="dash-gen-ai-btn"
              onClick={triggerAiAnalysis}
              disabled={generatingAi}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sage hover:bg-sage-light px-4 py-3 text-sm font-semibold text-white shadow-md transition-all focus:outline-none disabled:opacity-50"
            >
              {generatingAi ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Synthesizing Indicators...
                </>
              ) : aiAnalysis ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Report
                </>
              ) : (
                <>
                  Generate AI Assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            {aiAnalysis && (
              <button
                id="dash-go-chat-btn"
                onClick={() => setActiveView("chat")}
                className="mt-2.5 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-sage-light hover:text-white transition-colors"
              >
                Discuss assessment with AI Advisor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
