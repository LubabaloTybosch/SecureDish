import React, { useState } from "react";
import { UserProfile, UserPlan } from "../types";
import {
  X,
  User,
  Mail,
  Lock,
  Building,
  ShieldCheck,
  Crown,
  Zap,
  LogIn,
  UserPlus,
  ArrowRight,
  Check
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  initialTab?: "signin" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialTab = "signin",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "register">(initialTab);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Register Form State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerOrg, setRegisterOrg] = useState("");
  const [registerPlan, setRegisterPlan] = useState<UserPlan>("free");

  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Demo User Presets
  const demoFreeUser: UserProfile = {
    id: "usr-free-101",
    name: "Alex Rivera",
    email: "freeuser@securedish.org",
    role: "free",
    organization: "Smallholder Farmers Cooperative",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    avatar: "AR"
  };

  const demoProUser: UserProfile = {
    id: "usr-pro-202",
    name: "Lubabalo Tybosch",
    email: "tybosch.lubabalo@gmail.com",
    role: "pro",
    organization: "Global AgriTech Institute",
    joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    avatar: "LT"
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!signInEmail || !signInPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Determine tier based on email or default
    const isProEmail = signInEmail.toLowerCase().includes("pro");
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: signInEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Authenticated User",
      email: signInEmail,
      role: isProEmail ? "pro" : "free",
      organization: isProEmail ? "Enterprise Security Partner" : "Agricultural Member",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: signInEmail.slice(0, 2).toUpperCase()
    };

    onLoginSuccess(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: registerName,
      email: registerEmail,
      role: registerPlan,
      organization: registerOrg || "SecureDish Member",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: registerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "SD"
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleSelectDemo = (user: UserProfile) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-sand-dark">
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-charcoal-light/60 hover:bg-sand hover:text-charcoal transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/10 text-sage ring-8 ring-sage/5">
            <ShieldCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-charcoal font-display">
            SecureDish Authentication
          </h2>
          <p className="text-xs text-charcoal-light max-w-xs mx-auto">
            Sign in to manage permissions, track course milestones, and access food security intelligence.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-sand p-1 border border-sand-dark">
          <button
            id="tab-btn-signin"
            onClick={() => {
              setActiveTab("signin");
              setErrorMsg("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "signin"
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal-light hover:text-charcoal"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            id="tab-btn-register"
            onClick={() => {
              setActiveTab("register");
              setErrorMsg("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "register"
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal-light hover:text-charcoal"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 text-center">
            {errorMsg}
          </div>
        )}

        {/* Tab 1: SIGN IN */}
        {activeTab === "signin" && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-signin-email"
                  type="email"
                  placeholder="name@organization.org"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <button
              id="btn-submit-signin"
              type="submit"
              className="w-full py-3 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-bold shadow-md shadow-sage/10 transition-colors"
            >
              Sign In to Account
            </button>

            {/* Quick Demo Credentials */}
            <div className="pt-4 border-t border-sand-dark space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light/60 text-center">
                Or Quick Test with Pre-configured Roles:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-demo-free-login"
                  onClick={() => handleSelectDemo(demoFreeUser)}
                  className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/80 text-left transition-all"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Zap className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Free User Demo</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Dashboard + 20 Resources + Free Courses
                  </p>
                </button>

                <button
                  type="button"
                  id="btn-demo-pro-login"
                  onClick={() => handleSelectDemo(demoProUser)}
                  className="p-3 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Crown className="h-3.5 w-3.5 text-amber-600" />
                    <span>Pro User Demo</span>
                  </div>
                  <p className="text-[10px] text-amber-800 mt-1">
                    Unlimited Access to Everything
                  </p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: CREATE ACCOUNT */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-register-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-register-email"
                  type="email"
                  placeholder="jane@farmco.org"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-register-password"
                  type="password"
                  placeholder="Create password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Organization / Farm (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/40" />
                <input
                  id="input-register-org"
                  type="text"
                  placeholder="e.g. Green Valley Farm Cooperative"
                  value={registerOrg}
                  onChange={(e) => setRegisterOrg(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sand/30 border border-sand-dark rounded-xl text-xs text-charcoal focus:bg-white focus:border-sage focus:outline-none"
                />
              </div>
            </div>

            {/* Plan Tier Choice */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-charcoal block">Choose Membership Permission Tier:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="select-plan-free"
                  onClick={() => setRegisterPlan("free")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    registerPlan === "free"
                      ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300"
                      : "border-sand-dark bg-white hover:bg-sand/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      Free Plan
                    </span>
                    {registerPlan === "free" && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <p className="text-[10px] text-charcoal-light mt-1">
                    Dashboard, 1st 20 Resources & Free Courses
                  </p>
                </button>

                <button
                  type="button"
                  id="select-plan-pro"
                  onClick={() => setRegisterPlan("pro")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    registerPlan === "pro"
                      ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-300"
                      : "border-sand-dark bg-white hover:bg-sand/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5 text-amber-600" />
                      Pro Plan
                    </span>
                    {registerPlan === "pro" && <Check className="h-4 w-4 text-amber-600" />}
                  </div>
                  <p className="text-[10px] text-charcoal-light mt-1">
                    Unlimited Access to Everything
                  </p>
                </button>
              </div>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              className="w-full py-3 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-bold shadow-md shadow-sage/10 transition-colors mt-2"
            >
              Complete Registration & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
