import React, { useState, useEffect } from "react";
import { ResourceItem, UserPlan, UserProfile } from "../types";
import { FALLBACK_RESOURCES } from "../data/fallbackData";
import {
  Search,
  BookOpen,
  Download,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  FileText,
  Bookmark,
  RefreshCw,
  Lock,
  Crown,
  Zap,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

interface ResourcesViewProps {
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  currentUser: UserProfile | null;
}

export default function ResourcesView({
  userPlan,
  setUserPlan,
  currentUser,
}: ResourcesViewProps) {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [proLockModalResource, setProLockModalResource] = useState<ResourceItem | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");
        if (response.ok) {
          const json = await response.json();
          if (json.resources && json.resources.length > 0) {
            setResources(json.resources);
            return;
          }
        }
        setResources(FALLBACK_RESOURCES);
      } catch (err) {
        console.error("Error fetching resources, using fallback:", err);
        setResources(FALLBACK_RESOURCES);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ["All", "Livestock", "Agriculture", "Climate", "Supply Chain", "Safety", "Policy", "Agribusiness", "Water Management"];

  // Filter resources
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenResource = (item: ResourceItem, originalIndex: number) => {
    // Permission check: Free users only have access to the first 20 resources (indexes 0 to 19)
    if (userPlan === "free" && originalIndex >= 20) {
      setProLockModalResource(item);
    } else {
      setSelectedResource(item);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-charcoal">
        <RefreshCw className="h-8 w-8 animate-spin text-sage" />
        <p className="text-sm font-medium animate-pulse">Loading publication library...</p>
      </div>
    );
  }

  const unlockedCount = userPlan === "pro" ? resources.length : Math.min(20, resources.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
            Reference & Policy Resources
          </h1>
          <p className="text-charcoal-light text-sm mt-1">
            Technical guides, research papers, and standardized manuals for agricultural practitioners and policymakers.
          </p>
        </div>

        {/* Permission Status Indicator Banner */}
        <div className="shrink-0">
          {userPlan === "pro" ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-900 shadow-xs">
              <Crown className="h-4 w-4 text-amber-600" />
              <span>Pro Plan Active: Unlimited Access (All {resources.length} Unlocked)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Free Plan: Accessing First 20 Resources ({unlockedCount} of {resources.length} Unlocked)</span>
              </div>
              <button
                id="btn-upgrade-resources-header"
                onClick={() => setUserPlan("pro")}
                className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors shadow-xs"
              >
                Unlock All with Pro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-charcoal-light/40" />
          <input
            id="resource-search-input"
            type="text"
            placeholder="Search by publication name, summary, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-dark rounded-xl text-sm text-charcoal placeholder-charcoal-light/45 focus:outline-none focus:border-sage transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light/40 hover:text-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-light/60 mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-pill-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-sage text-white"
                  : "bg-white border border-sand-dark text-charcoal hover:bg-sand-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of resource list */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => {
            // Find original index in full list for permission check
            const originalIndex = resources.findIndex((r) => r.id === item.id);
            const isLocked = userPlan === "free" && originalIndex >= 20;

            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-6 flex flex-col justify-between kinetic-lift relative overflow-hidden transition-all ${
                  isLocked ? "border-amber-200 bg-amber-50/20" : ""
                }`}
              >
                {/* Lock Badge Overlay for Free Users past #20 */}
                {isLocked && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Lock className="h-3 w-3" />
                    Pro Lock (#21+)
                  </div>
                )}

                <div className="space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between pr-16">
                    <span className="inline-flex items-center rounded-md bg-sage/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sage-dark tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-bold text-charcoal-light/45 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-charcoal leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Author footer and button */}
                <div className="mt-6 pt-4 border-t border-sand-dark flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-charcoal-light/50">
                    By {item.author}
                  </span>

                  <button
                    id={`resource-open-btn-${item.id}`}
                    onClick={() => handleOpenResource(item, originalIndex)}
                    className={`inline-flex items-center gap-1 text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all ${
                      isLocked
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                        : "text-sage hover:text-sage-dark hover:bg-sage/10"
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Unlock Pro</span>
                      </>
                    ) : (
                      <>
                        <span>Open Resource</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-sand-dark rounded-2xl bg-white/40">
          <FileText className="h-10 w-10 text-charcoal-light/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-charcoal">No publications found</p>
          <p className="text-xs text-charcoal-light/60 mt-1">Try modifying your filters or search keywords.</p>
        </div>
      )}

      {/* PRO LOCK MODAL - Triggers when Free user tries to access Resource #21+ */}
      {proLockModalResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 border border-amber-300">
            <button
              onClick={() => setProLockModalResource(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-charcoal-light hover:bg-sand"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-8 ring-amber-50 font-bold">
                <Crown className="h-8 w-8" />
              </div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Pro Permission Required
              </span>
              <h2 className="text-xl font-extrabold text-charcoal font-display">
                Resource #21+ Locked on Free Plan
              </h2>
              <p className="text-xs text-charcoal-light leading-relaxed">
                Your Free account gives you full access to the first <strong>20 resources</strong> in our library.
                Publication <strong>"{proLockModalResource.title}"</strong> is a Pro Exclusive resource.
              </p>
            </div>

            <div className="bg-sand/60 p-4 rounded-2xl border border-sand-dark space-y-2 text-xs">
              <p className="font-bold text-charcoal flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Upgrade to Pro Plan for Unlimited Access:
              </p>
              <ul className="space-y-1.5 text-charcoal-light pl-5 list-disc text-[11px]">
                <li>Unlock all 35+ reference manuals & policy frameworks</li>
                <li>Access all 32 specialized masterclass courses & certificates</li>
                <li>Unlimited Gemini AI Sustainability Advisor queries</li>
                <li>Export high-resolution PDF technical guides</li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                id="modal-btn-upgrade-pro"
                onClick={() => {
                  setUserPlan("pro");
                  setSelectedResource(proLockModalResource);
                  setProLockModalResource(null);
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4" />
                <span>Switch to Pro Plan & Open Document</span>
              </button>

              <button
                onClick={() => setProLockModalResource(null)}
                className="w-full py-2 text-xs font-bold text-charcoal-light hover:text-charcoal"
              >
                Return to Free Library (First 20 Resources)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource detail / reader modal for UNLOCKED resources */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-sand rounded-2xl shadow-xl border border-sand-dark overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-sand-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center shrink-0">
                  <Bookmark className="h-5.5 w-5.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sage uppercase tracking-wider">
                    {selectedResource.type} • {selectedResource.category}
                  </span>
                  <h2 className="text-sm font-bold text-charcoal leading-tight line-clamp-1">
                    {selectedResource.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-lg text-charcoal-light/50 hover:bg-sand-dark hover:text-charcoal transition-colors"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Modal Content (Document Reader Overview) */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-light/60">
                  Document Synopsis
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {selectedResource.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-sand-dark text-xs">
                <div>
                  <span className="block font-medium text-charcoal-light/65">Publisher / Author</span>
                  <span className="font-bold text-charcoal mt-0.5 block">{selectedResource.author}</span>
                </div>
                <div>
                  <span className="block font-medium text-charcoal-light/65">Category System</span>
                  <span className="font-bold text-charcoal mt-0.5 block">{selectedResource.category}</span>
                </div>
                <div>
                  <span className="block font-medium text-charcoal-light/65">Resource Classification</span>
                  <span className="font-bold text-charcoal mt-0.5 block">{selectedResource.type}</span>
                </div>
                <div>
                  <span className="block font-medium text-charcoal-light/65">Access Rights</span>
                  <span className="font-bold text-sage mt-0.5 block">Unlocked ({userPlan.toUpperCase()} Permission)</span>
                </div>
              </div>

              {/* Technical brief */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-light/60">
                  Executive Brief & Core Findings
                </h3>
                <div className="space-y-2 text-xs text-charcoal-light leading-relaxed">
                  <p>
                    This technical reference publication contains comprehensive field protocols, policy recommendations, and implementation frameworks aimed at fostering regional self-reliance, maximizing yield predictability, and building long-term agricultural sustainability.
                  </p>
                  <p>
                    <strong>Key Directives:</strong>
                    <br />
                    1. <em>Interdisciplinary Collaboration:</em> Fostering active dialogue across departments, non-governmental bodies, and local farming co-operatives.
                    <br />
                    2. <em>Resource Allocation:</em> Expanding investment into local grain reserves, temperature-regulated cold chain units, and micro-climate crop arrays.
                    <br />
                    3. <em>Capacity Building:</em> Educating stakeholders via streamlined digital academy models, reinforcing indigenous crop wisdom.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-sand-dark flex items-center justify-between text-xs">
              <span className="text-charcoal-light/50">SecureDish Authorized Copy</span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert("Your download of '" + selectedResource.title + "' has been initiated.");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sand-dark px-4 py-2 font-bold text-charcoal hover:bg-sand-dark focus:outline-none"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    alert("Opening full publication online reader...");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sage px-4 py-2 font-bold text-white hover:bg-sage-dark focus:outline-none"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original Source
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
