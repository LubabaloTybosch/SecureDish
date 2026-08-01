import React from "react";
import { ActiveView, UserPlan } from "../types";
import { Shield, ArrowRight, BookOpen, Activity, AlertTriangle, Cpu } from "lucide-react";
import { motion, Variants } from "motion/react";

interface LandingViewProps {
  setActiveView: (view: ActiveView) => void;
  userPlan?: UserPlan;
  setUserPlan?: (plan: UserPlan) => void;
}

export default function LandingView({ setActiveView, userPlan, setUserPlan }: LandingViewProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const featureCards = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Track food supply indices, regional availability, and seasonal trends across 47 monitored regions with live data feeds.",
    },
    {
      icon: Cpu,
      title: "Risk Intelligence",
      description: "AI-powered early warning system detects supply chain disruptions, climate threats, and market volatility before they escalate.",
    },
    {
      icon: BookOpen,
      title: "Free Learning Paths",
      description: "Expert-curated courses on sustainable agriculture, climate adaptation, and supply chain resilience — accessible to everyone.",
    },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-sand">
      {/* Decorative ambient background curves */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-sage/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-sage-light/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 px-4 py-1.5 text-sm font-semibold text-sage-dark"
          >
            <Shield className="h-4 w-4" />
            Open-Access Food Security Intelligence
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 font-display text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl md:text-6xl max-w-3xl leading-[1.1]"
          >
            Secure the Future <br />
            <span className="text-sage">of Our Food</span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-light"
          >
            Monitor global food supply levels, track emerging risks, and build resilience through free expert-led courses — all in one integrated platform.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <button
              id="hero-dashboard-btn"
              onClick={() => setActiveView("dashboard")}
              className="group inline-flex items-center gap-2 rounded-xl bg-sage px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-sage/10 transition-all hover:bg-sage-dark hover:scale-[1.02] focus:outline-none"
            >
              Enter Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="hero-courses-btn"
              onClick={() => setActiveView("courses")}
              className="inline-flex items-center gap-2 rounded-xl border border-sage/20 bg-white/50 px-6 py-3.5 text-base font-semibold text-charcoal backdrop-blur-sm transition-all hover:border-sage/40 hover:bg-white/80 hover:scale-[1.02] focus:outline-none"
            >
              Browse Courses
            </button>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={itemVariants}
            className="mt-24 w-full"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-8 text-left kinetic-lift"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage/10 text-sage mb-6">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-3">
                      {card.title}
                    </h3>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
