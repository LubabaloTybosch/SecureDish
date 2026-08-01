import React, { useState, useEffect } from "react";
import { ActiveView, UserPlan, UserProfile } from "./types";
import Header from "./components/Header";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import CoursesView from "./components/CoursesView";
import ResourcesView from "./components/ResourcesView";
import ChatView from "./components/ChatView";
import { Shield } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("landing");

  // User Profile state with persistence
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("securedish_user_profile") || localStorage.getItem("terraguard_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === "pro") {
          parsed.name = "Lubabalo Tybosch";
          parsed.email = "tybosch.lubabalo@gmail.com";
          parsed.avatar = "LT";
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved user profile:", e);
      }
    }
    const savedPlan = (localStorage.getItem("securedish_user_plan") || localStorage.getItem("terraguard_user_plan")) as UserPlan;
    if (savedPlan === "pro") {
      return {
        id: "usr-pro-202",
        name: "Lubabalo Tybosch",
        email: "tybosch.lubabalo@gmail.com",
        role: "pro",
        organization: "Global AgriTech Institute",
        joinedDate: "Jan 2026",
        avatar: "LT"
      };
    }
    return {
      id: "usr-free-101",
      name: "Alex Rivera",
      email: "freeuser@securedish.org",
      role: "free",
      organization: "Smallholder Farmers Cooperative",
      joinedDate: "Jan 2026",
      avatar: "AR"
    };
  });

  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    const saved = localStorage.getItem("securedish_user_plan") || localStorage.getItem("terraguard_user_plan");
    return (saved as UserPlan) || (currentUser?.role || "free");
  });

  useEffect(() => {
    localStorage.setItem("securedish_user_plan", userPlan);
    if (currentUser) {
      const updatedUser = userPlan === "pro"
        ? {
            ...currentUser,
            name: "Lubabalo Tybosch",
            email: "tybosch.lubabalo@gmail.com",
            avatar: "LT",
            role: "pro" as UserPlan
          }
        : { ...currentUser, role: userPlan };
      localStorage.setItem("securedish_user_profile", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("securedish_user_profile");
    }
  }, [userPlan, currentUser]);

  const handleSetUserPlan = (plan: UserPlan) => {
    setUserPlan(plan);
    if (plan === "pro") {
      setCurrentUser({
        id: "usr-pro-202",
        name: "Lubabalo Tybosch",
        email: "tybosch.lubabalo@gmail.com",
        role: "pro",
        organization: "Global AgriTech Institute",
        joinedDate: "Jan 2026",
        avatar: "LT"
      });
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role: plan });
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "landing":
        return <LandingView setActiveView={setActiveView} userPlan={userPlan} setUserPlan={handleSetUserPlan} />;
      case "dashboard":
        return <DashboardView setActiveView={setActiveView} />;
      case "courses":
        return <CoursesView userPlan={userPlan} setUserPlan={handleSetUserPlan} />;
      case "resources":
        return <ResourcesView userPlan={userPlan} setUserPlan={handleSetUserPlan} currentUser={currentUser} />;
      case "chat":
        return <ChatView userPlan={userPlan} setUserPlan={handleSetUserPlan} currentUser={currentUser} />;
      default:
        return <LandingView setActiveView={setActiveView} userPlan={userPlan} setUserPlan={handleSetUserPlan} />;
    }
  };

  return (
    <div id="securedish-root-container" className="flex min-h-screen flex-col bg-sand text-charcoal">
      {/* Navigation Header with Auth Controls */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        userPlan={userPlan}
        setUserPlan={handleSetUserPlan}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Minimal, Professional Footer */}
      <footer className="border-t border-sand-dark bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-sage/10 text-sage flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-charcoal">
              Secure<span className="text-sage">Dish</span> — Sustainable Food Security & Permission Intelligence
            </span>
          </div>
          <p className="text-[11px] text-charcoal-light/60 max-w-md mx-auto leading-relaxed">
            Free users enjoy full Dashboard access, the first 20 research publications, and foundational courses. Pro users unlock unlimited masterclasses, all 35+ publications, and the Gemini AI Sustainability Advisor.
          </p>
          <div className="text-[10px] text-charcoal-light/40 font-medium">
            © {new Date().getFullYear()} SecureDish Consortium. Secure the future of food.
          </div>
        </div>
      </footer>
    </div>
  );
}
