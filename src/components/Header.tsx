import React, { useState } from "react";
import { ActiveView, UserPlan, UserProfile } from "../types";
import {
  Shield,
  Menu,
  X,
  Landmark,
  GraduationCap,
  Library,
  BarChart3,
  MessageSquarePlus,
  Crown,
  Zap,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Lock,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import AuthModal from "./AuthModal";

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
}

export default function Header({
  activeView,
  setActiveView,
  userPlan,
  setUserPlan,
  currentUser,
  setCurrentUser,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "register">("signin");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { view: "landing", label: "Home", icon: Landmark, proOnly: false },
    { view: "dashboard", label: "Dashboard", icon: BarChart3, proOnly: false },
    { view: "courses", label: "Courses", icon: GraduationCap, proOnly: false },
    { view: "resources", label: "Resources", icon: Library, proOnly: false },
    { view: "chat", label: "AI Advisor", icon: MessageSquarePlus, proOnly: true },
  ] as const;

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUserPlan(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserPlan("free");
    setUserDropdownOpen(false);
  };

  const handleTogglePlan = () => {
    const nextPlan = userPlan === "free" ? "pro" : "free";
    setUserPlan(nextPlan);
    if (nextPlan === "pro") {
      setCurrentUser({
        id: "usr-pro-202",
        name: "Lubabalo Tybosch",
        email: "tybosch.lubabalo@gmail.com",
        role: "pro",
        organization: "Global AgriTech Institute",
        joinedDate: "Jan 2026",
        avatar: "LT"
      });
    } else {
      setCurrentUser({
        id: "usr-free-101",
        name: "Alex Rivera",
        email: "freeuser@securedish.org",
        role: "free",
        organization: "Smallholder Farmers Cooperative",
        joinedDate: "Jan 2026",
        avatar: "AR"
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-sand-dark bg-sand/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              setActiveView("landing");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage">
              <Shield className="h-5.5 w-5.5 stroke-[2]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-charcoal">
              Secure<span className="text-sage">Dish</span>
            </span>
          </button>

          {/* Primary Navigation (Home, Dashboard, Courses, Resources, AI Advisor) */}
          <div className="hidden md:flex md:items-center md:gap-x-1 overflow-x-auto py-1">
            <nav className="flex items-center gap-x-1 md:gap-x-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.view;
                const isLockedForFree = item.proOnly && userPlan === "free";

                return (
                  <button
                    key={item.view}
                    id={`nav-desktop-${item.view}`}
                    onClick={() => setActiveView(item.view)}
                    className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "text-sage bg-sage/10 shadow-xs ring-1 ring-sage/20"
                        : "text-charcoal-light hover:text-charcoal hover:bg-white/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {isLockedForFree && (
                      <span title="Pro Plan Required" className="text-amber-600">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute bottom-[-13px] left-3 right-3 h-0.5 bg-sage rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions: Auth / User Profile & Plan Badge */}
          <div className="hidden sm:flex sm:items-center sm:gap-x-3">
            {/* Plan Badge Switcher Button */}
            <button
              id="plan-badge-toggle-btn"
              onClick={handleTogglePlan}
              title="Click to switch permission plan tier"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all shadow-xs ${
                userPlan === "pro"
                  ? "bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-300/60"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/60"
              }`}
            >
              {userPlan === "pro" ? (
                <>
                  <Crown className="h-3.5 w-3.5" />
                  <span>PRO TIER</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>FREE TIER</span>
                </>
              )}
            </button>

            <div className="h-5 w-px bg-sand-dark" />

            {/* Authenticated User or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-dropdown-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-white/70 border border-sand-dark p-1.5 pl-3 hover:bg-white text-xs font-bold text-charcoal transition-all"
                >
                  <div className="h-7 w-7 rounded-lg bg-sage text-white flex items-center justify-center font-extrabold text-[11px]">
                    {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-charcoal-light/60" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-sand-dark shadow-xl p-3 z-50 space-y-3">
                    <div className="p-2 bg-sand/40 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-charcoal truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-charcoal-light truncate">{currentUser.email}</p>
                      <div className="pt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            currentUser.role === "pro"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {currentUser.role === "pro" ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                          {currentUser.role} Account
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        id="dropdown-switch-plan-btn"
                        onClick={() => {
                          handleTogglePlan();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-sand flex items-center justify-between text-charcoal font-semibold"
                      >
                        <span>Switch Permission Tier</span>
                        <span className="text-[10px] font-bold text-sage uppercase">
                          {userPlan === "free" ? "Upgrade to Pro" : "Downgrade to Free"}
                        </span>
                      </button>

                      <button
                        id="dropdown-logout-btn"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-signin-btn"
                  onClick={() => {
                    setAuthModalTab("signin");
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-charcoal hover:text-sage transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  id="header-register-btn"
                  onClick={() => {
                    setAuthModalTab("register");
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-plan-toggle"
              onClick={handleTogglePlan}
              className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${
                userPlan === "pro" ? "bg-amber-500 text-white" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {userPlan.toUpperCase()}
            </button>

            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal hover:bg-sand-dark"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand-dark bg-sand p-4 space-y-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.view;
                const isLocked = item.proOnly && userPlan === "free";
                return (
                  <button
                    key={item.view}
                    id={`nav-mobile-${item.view}`}
                    onClick={() => {
                      setActiveView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                      isActive ? "bg-sage/10 text-sage" : "text-charcoal hover:bg-sand-dark"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {isLocked && (
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md">
                        <Lock className="h-3 w-3" /> PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-sand-dark flex flex-col gap-2">
              {currentUser ? (
                <div className="p-3 bg-white rounded-xl space-y-2">
                  <div className="text-xs font-bold text-charcoal">{currentUser.name} ({currentUser.role.toUpperCase()})</div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-sage text-white font-bold text-xs rounded-xl text-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authModalTab}
      />
    </>
  );
}
