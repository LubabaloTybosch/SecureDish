export type ActiveView = "landing" | "dashboard" | "courses" | "resources" | "chat";

export type UserPlan = "free" | "pro";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserPlan;
  avatar?: string;
  joinedDate: string;
  organization?: string;
}

export interface SupplyDataPoint {
  month: string;
  grains: number;
  vegetables: number;
  dairy: number;
  proteins: number;
}

export interface RiskAlert {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  region: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  total: number;
  completed: number;
}

export interface QuickStats {
  totalSupplyIndex: number;
  activeRisks: number;
  regionsMonitored: number;
  coursesCompleted: number;
  courseProgress: CourseProgress[];
}

export interface RegionDataPoint {
  region: string;
  supply: number;
  trend: "up" | "down" | "stable";
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  order: number;
  videoUrl: string | null;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessonsCount: number;
  thumbnail: string;
  tier: "free" | "pro";
  lessons: Lesson[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  author: string;
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}
