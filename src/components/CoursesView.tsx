import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { Course, Lesson, UserPlan } from "../types";
import { FALLBACK_COURSES } from "../data/fallbackData";
import {
  BookOpen,
  Clock,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Award,
  ChevronRight,
  BookOpenCheck,
  RefreshCw,
  Crown,
  Lock,
  Zap,
  Sparkles,
  Search,
  Check,
  X,
  ShieldCheck
} from "lucide-react";

interface CoursesViewProps {
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
}

export default function CoursesView({ userPlan, setUserPlan }: CoursesViewProps) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Filters & Search
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Upgrade Modal State
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [modalCourseTarget, setModalCourseTarget] = useState<Course | null>(null);

  // Completed lessons tracker stored in localStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    // Load local storage completions
    const saved = localStorage.getItem("securedish_completed_lessons") || localStorage.getItem("terraguard_completed_lessons");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved completions:", err);
      }
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const json = await response.json();
          if (json.courses && json.courses.length > 0) {
            setCourses(json.courses);
            return;
          }
        }
        setCourses(FALLBACK_COURSES);
      } catch (err) {
        console.error("Error fetching courses, using fallback:", err);
        setCourses(FALLBACK_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleLessonCompleted = (lessonId: string) => {
    let next;
    if (completedLessons.includes(lessonId)) {
      next = completedLessons.filter((id) => id !== lessonId);
    } else {
      next = [...completedLessons, lessonId];
    }
    setCompletedLessons(next);
    localStorage.setItem("securedish_completed_lessons", JSON.stringify(next));
  };

  const getCourseProgress = (course: Course) => {
    const total = course.lessons.length;
    const completed = course.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleCourseClick = (course: Course) => {
    // Check if course is Pro and user is on Free plan
    if (course.tier === "pro" && userPlan !== "pro") {
      setModalCourseTarget(course);
      setUpgradeModalOpen(true);
      return;
    }

    setSelectedCourse(course);
    if (course.lessons.length > 0) {
      setSelectedLesson(course.lessons[0]);
    } else {
      setSelectedLesson(null);
    }
  };

  const handleUpgradeAndAccess = () => {
    setUserPlan("pro");
    setUpgradeModalOpen(false);
    if (modalCourseTarget) {
      setSelectedCourse(modalCourseTarget);
      if (modalCourseTarget.lessons.length > 0) {
        setSelectedLesson(modalCourseTarget.lessons[0]);
      }
    }
  };

  // Categories list
  const categories = ["all", ...Array.from(new Set(courses.map((c) => c.category)))];

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    const matchesPlan =
      planFilter === "all" ? true : course.tier === planFilter;
    const matchesCategory =
      categoryFilter === "all" ? true : course.category === categoryFilter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPlan && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-charcoal">
        <RefreshCw className="h-8 w-8 animate-spin text-sage" />
        <p className="text-sm font-medium animate-pulse">Loading SecureDish academy & plans...</p>
      </div>
    );
  }

  // Course Details View (LMS Player)
  if (selectedCourse && selectedLesson) {
    const courseProgress = getCourseProgress(selectedCourse);

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            id="btn-back-to-curriculum"
            onClick={() => {
              setSelectedCourse(null);
              setSelectedLesson(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-sage transition-colors focus:outline-none"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Curriculum
          </button>

          {/* Plan badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              selectedCourse.tier === "pro"
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-sm"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {selectedCourse.tier === "pro" ? (
              <>
                <Crown className="h-3.5 w-3.5 text-amber-100" />
                <span>Pro Plan Masterclass</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                <span>Free Plan Course</span>
              </>
            )}
          </span>
        </div>

        {/* Course Header */}
        <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-sage/10 px-2 py-1 text-xs font-semibold text-sage-dark uppercase">
                {selectedCourse.category}
              </span>
              <span className="text-xs text-charcoal-light font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {selectedCourse.duration}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-charcoal">
              {selectedCourse.title}
            </h1>
            <p className="text-xs text-charcoal-light leading-relaxed">
              {selectedCourse.description}
            </p>
          </div>

          {/* Progress gauge */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-sand-dark pt-4 md:pt-0 md:pl-6 shrink-0">
            <div className="relative flex items-center justify-center h-16 w-16">
              <svg className="h-full w-full -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-sand-dark fill-transparent" strokeWidth="6" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-sage fill-transparent transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - courseProgress / 100)}`}
                />
              </svg>
              <span className="absolute text-xs font-bold text-charcoal">{courseProgress}%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal">Course Progress</p>
              <p className="text-xs text-charcoal-light">
                {selectedCourse.lessons.filter((l) => completedLessons.includes(l.id)).length} of{" "}
                {selectedCourse.lessons.length} lessons completed
              </p>
            </div>
          </div>
        </div>

        {/* LMS Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Syllabus List */}
          <div className="glass-card rounded-2xl p-6 h-fit space-y-4 lg:col-span-1">
            <h3 className="font-bold text-charcoal border-b border-sand-dark pb-3 flex items-center justify-between text-sm">
              <span>Syllabus Modules</span>
              <span className="text-xs text-sage font-medium">{selectedCourse.lessons.length} Lessons</span>
            </h3>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {selectedCourse.lessons.map((lesson) => {
                const isActive = selectedLesson.id === lesson.id;
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    id={`lesson-selector-${lesson.id}`}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`flex w-full items-center justify-between text-left p-3.5 rounded-xl border transition-all focus:outline-none ${
                      isActive
                        ? "bg-sage/10 border-sage/30 text-sage-dark shadow-sm"
                        : "bg-white/50 border-sand-dark hover:bg-white hover:border-sage/15"
                    }`}
                  >
                    <div className="flex gap-3 items-start max-w-[85%]">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-sage shrink-0 mt-0.5 fill-sage/10" />
                      ) : (
                        <PlayCircle className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? "text-sage" : "text-charcoal-light/45"}`} />
                      )}
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{lesson.title}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] text-charcoal-light/60 mt-1 font-semibold">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-charcoal-light/40" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reading Material Display */}
          <div className="glass-card rounded-2xl p-8 lg:col-span-2 space-y-6 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4">
              <div className="border-b border-sand-dark pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage-dark font-bold">
                    Module {selectedLesson.order + 1} of {selectedCourse.lessons.length}
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-charcoal mt-1">
                    {selectedLesson.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-charcoal-light bg-sand px-3 py-1.5 rounded-lg border border-sand-dark">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedLesson.duration} Read</span>
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="text-sm leading-relaxed text-charcoal font-sans max-w-3xl py-2 space-y-4 [&>h1]:text-xl [&>h1]:font-extrabold [&>h1]:text-charcoal [&>h1]:mt-6 [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-charcoal [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-charcoal [&>h3]:mt-4 [&>h3]:mb-1.5 [&>p]:text-charcoal-light [&>p]:leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:my-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:my-3 [&>blockquote]:border-l-4 [&>blockquote]:border-sage [&>blockquote]:bg-sage/5 [&>blockquote]:p-3.5 [&>blockquote]:rounded-r-xl [&>blockquote]:my-4 [&>hr]:border-sand-dark [&>hr]:my-6">
                <Markdown>{selectedLesson.content}</Markdown>
              </div>
            </div>

            {/* Complete button */}
            <div className="pt-6 border-t border-sand-dark flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-charcoal-light/70 italic">
                Read carefully to digest. Once read, mark completion.
              </p>
              <button
                id={`btn-complete-lesson-${selectedLesson.id}`}
                onClick={() => toggleLessonCompleted(selectedLesson.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                  completedLessons.includes(selectedLesson.id)
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-sage hover:bg-sage-dark text-white shadow-md shadow-sage/10"
                }`}
              >
                <CheckCircle className="h-4.5 w-4.5" />
                {completedLessons.includes(selectedLesson.id)
                  ? "Completed! (Click to redo)"
                  : "Mark Lesson Completed"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Catalog View
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Academy Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand-dark pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-3 py-0.5 text-xs font-bold text-sage">
              <Sparkles className="h-3.5 w-3.5" />
              SecureDish Learning Portal
            </span>
            {userPlan === "pro" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
                <Crown className="h-3.5 w-3.5 text-amber-100" />
                Pro Subscriber
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                Free Plan Account
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
            Agricultural & Food Security Academy
          </h1>
          <p className="text-charcoal-light text-sm mt-1 max-w-2xl">
            Explore 32 specialized curriculum paths ranging from fundamental food safety to enterprise beef, poultry, hydroponics, and agribusiness management.
          </p>
        </div>

        {/* Plan Upgrade CTA Banner */}
        {userPlan === "free" && (
          <button
            id="btn-upgrade-pro-header-cta"
            onClick={() => {
              setModalCourseTarget(null);
              setUpgradeModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-700 transition-all shrink-0"
          >
            <Crown className="h-4 w-4 text-amber-100" />
            <span>Upgrade to Pro Plan (28 Courses)</span>
          </button>
        )}
      </div>

      {/* Plan Comparison Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Plan Card */}
        <div className={`p-5 rounded-2xl border transition-all ${userPlan === "free" ? "bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-300" : "bg-white/60 border-sand-dark"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-charcoal text-sm">Free Plan</h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Included $0/mo
            </span>
          </div>
          <p className="text-xs text-charcoal-light mb-3">
            Includes foundational courses in sustainable agriculture, climate adaptation, food safety, and supply chain resilience.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>4 Core Foundational Courses Unlocked</span>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className={`p-5 rounded-2xl border transition-all ${userPlan === "pro" ? "bg-gradient-to-br from-amber-50/80 to-yellow-50/80 border-amber-400 shadow-sm ring-2 ring-amber-300/50" : "bg-white/80 border-amber-200/80"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-charcoal text-sm">Pro Plan</h3>
            </div>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Full Masterclass Suite
            </span>
          </div>
          <p className="text-xs text-charcoal-light mb-3">
            Unlocks all 28 specialized courses in Livestock Management (Beef, Poultry, Swine, Dairy), Hydroponics, Permaculture, Export Logistics, Farm Budgets & Agribusiness.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Check className="h-4 w-4 text-amber-600" />
              <span>All 32 Free + Pro Courses Unlocked</span>
            </div>
            {userPlan === "free" ? (
              <button
                id="btn-switch-plan-pro-inline"
                onClick={() => setUserPlan("pro")}
                className="text-xs font-extrabold text-amber-700 underline hover:text-amber-900"
              >
                Switch to Pro
              </button>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 p-4 rounded-2xl border border-sand-dark">
        {/* Plan Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            id="filter-plan-all"
            onClick={() => setPlanFilter("all")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              planFilter === "all"
                ? "bg-sage text-white shadow-sm"
                : "bg-sand/60 text-charcoal-light hover:bg-sand hover:text-charcoal"
            }`}
          >
            All Courses ({courses.length})
          </button>

          <button
            id="filter-plan-free"
            onClick={() => setPlanFilter("free")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              planFilter === "free"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Free Plan ({courses.filter((c) => c.tier === "free").length})
          </button>

          <button
            id="filter-plan-pro"
            onClick={() => setPlanFilter("pro")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              planFilter === "pro"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
            Pro Plan ({courses.filter((c) => c.tier === "pro").length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-light/50" />
          <input
            id="search-courses-input"
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-sand-dark bg-sand/40 pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-sage focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const progress = getCourseProgress(course);
          const completedCount = course.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const isLocked = course.tier === "pro" && userPlan !== "pro";

          return (
            <div
              key={course.id}
              className={`glass-card rounded-2xl p-6 flex flex-col justify-between kinetic-lift relative overflow-hidden transition-all ${
                isLocked ? "border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white/90" : "border-sand-dark bg-white/90"
              }`}
            >
              <div className="space-y-4">
                {/* Upper row: icon, plan tag, category */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-sage/10 px-2.5 py-1 text-xs font-semibold text-sage-dark">
                    {course.category}
                  </span>

                  {/* Plan Badge */}
                  {course.tier === "pro" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                      {isLocked ? <Lock className="h-3 w-3 text-amber-100" /> : <Crown className="h-3 w-3 text-amber-100" />}
                      PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      <Zap className="h-3 w-3 text-emerald-600" />
                      FREE
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-charcoal leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="mt-6 pt-4 border-t border-sand-dark flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-light/70 font-medium">
                  <Clock className="h-3.5 w-3.5 text-sage shrink-0" />
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.lessonsCount} lessons</span>
                </div>

                <button
                  id={`course-enter-btn-${course.id}`}
                  onClick={() => handleCourseClick(course)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                    isLocked
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                      : "bg-sage hover:bg-sage-dark text-white shadow-sm"
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Unlock Pro</span>
                    </>
                  ) : progress > 0 ? (
                    <>
                      <span>Continue</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Start Course</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center glass-card rounded-2xl space-y-3">
          <BookOpen className="h-8 w-8 text-charcoal-light/40 mx-auto" />
          <h3 className="font-bold text-charcoal text-base">No courses found</h3>
          <p className="text-xs text-charcoal-light">
            Try adjusting your search filter or selecting "All Courses".
          </p>
        </div>
      )}

      {/* PRO PLAN UPGRADE MODAL */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              id="close-upgrade-modal-btn"
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal-light hover:bg-sand hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-8 ring-amber-500/5">
                <Crown className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-charcoal font-display">
                Unlock Pro Plan Masterclasses
              </h2>
              <p className="text-xs text-charcoal-light max-w-md mx-auto">
                {modalCourseTarget ? (
                  <>
                    <strong className="text-charcoal font-bold">{modalCourseTarget.title}</strong> is part of the SecureDish Pro Plan suite.
                  </>
                ) : (
                  "Upgrade to gain unrestricted access to all 28 Pro Plan agricultural masterclasses."
                )}
              </p>
            </div>

            {/* Included Courses List Preview */}
            <div className="bg-sand/40 border border-sand-dark rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>All 28 Pro Plan Masterclasses Included:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-charcoal-light max-h-[180px] overflow-y-auto pr-2">
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Beef Production & Feedlots</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Hydroponics</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Poultry Production</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Pig Production</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Dairy Production</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Animal Health & Bio-Security</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Agri-Business Plan</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Farm Budgets</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Farm Layout & Site Selection</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Agricultural Export Logistics</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Permaculture</div>
                <div className="flex items-center gap-1.5 font-medium"><Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Soil Fertility & Plant Nutrition</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-activate-pro-instant"
                onClick={handleUpgradeAndAccess}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-700 transition-all"
              >
                <Crown className="h-4.5 w-4.5 text-amber-100" />
                <span>Activate Pro Plan (Instant Unlocked Access)</span>
              </button>

              <button
                id="btn-cancel-upgrade-modal"
                onClick={() => setUpgradeModalOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-charcoal-light hover:text-charcoal"
              >
                Continue with Free Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
