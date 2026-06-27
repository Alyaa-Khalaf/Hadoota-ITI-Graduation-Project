import apiClient from "@/utils/api";

// ============================================================
// Shared types
// ============================================================

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | undefined;
}

export type UserRole = "parent" | "admin" | "teacher" | "student";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isPending?: boolean;
  schoolId?: string | null;
  subscription?: {
    plan: string;
    status: string;
    expiresAt?: string;
  };
  createdAt: string;
}

export interface AdminChild {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  avatar?: string;
  interests?: string[];
  learningLevel?: string;
  parentId?: { _id: string; name: string; email: string } | null;
  schoolId?: { _id: string; name: string; code: string } | null;
  xp?: number;
  level?: number;
  createdAt: string;
}

export interface AdminStory {
  _id: string;
  title: string;
  character: string;
  topic: string;
  status: "generating" | "completed" | "failed";
  isFavorite?: boolean;
  safetyCheck?: { safe: boolean; flagged: boolean; reason?: string };
  childId?: { _id: string; name: string; age: number } | null;
  createdAt: string;
}

export interface AdminSchool {
  _id: string;
  name: string;
  code: string;
  adminId?: { _id: string; name: string; email: string } | null;
  subscriptionStatus: "pending" | "active" | "trialing" | "past_due" | "canceled";
  subscriptionExpiresAt?: string;
  createdAt: string;
}

export interface AdminQuiz {
  _id: string;
  story?: { _id: string; title: string } | null;
  child?: { _id: string; name: string } | null;
  questionsCount: number;
  bestScore: number;
  createdAt: string;
}

export interface AdminKnowledge {
  _id: string;
  title: string;
  content: string;
  category: string;
  ageRange?: { min: number; max: number };
  tags?: string[];
  lang?: "ar" | "en";
  source?: string;
  isActive?: boolean;
  createdAt: string;
}

export interface AdminTransaction {
  _id: string;
  user?: { _id: string; name: string; email: string; role?: string } | null;
  school?: { _id: string; name: string; code: string } | null;
  amount: number;
  currency: string;
  plan?: string | null;
  status: "succeeded" | "failed" | "pending" | "refunded";
  description?: string;
  provider?: "paymob" | "stripe";
  paymobTransactionId?: string;
  paymobOrderId?: string;
  reference?: string;
  createdAt: string;
}

export interface AdminStats {
  cards: {
    totalUsers: number;
    totalStudents: number;
    totalParents: number;
    totalTeachers: number;
    totalSchools: number;
    totalChildren: number;
    totalStories: number;
    completedStories: number;
    generatingStories: number;
    flaggedStories: number;
    totalQuizzes: number;
    totalKnowledge: number;
    activeSubscriptions: number;
    totalRevenue: number;
  };
}

export interface RecentActivity {
  recentUsers: AdminUser[];
  recentStories: AdminStory[];
  storyStatus: { name: string; value: number }[];
}

async function unwrap<T>(promise: Promise<{ data: { data: T } }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}

// Stats
export const getStats = () => unwrap<AdminStats>(apiClient.get("/admin/stats"));
export const getRecentActivity = () =>
  unwrap<RecentActivity>(apiClient.get("/admin/recent-activity"));

// Users
export const listUsers = (params?: ListParams) =>
  unwrap<Paginated<AdminUser>>(apiClient.get("/admin/users", { params }));
export const createUser = (body: Partial<AdminUser> & { password: string }) =>
  unwrap<AdminUser>(apiClient.post("/admin/users", body));
export const updateUser = (id: string, body: Partial<AdminUser>) =>
  unwrap<AdminUser>(apiClient.put(`/admin/users/${id}`, body));
export const deleteUser = (id: string) => apiClient.delete(`/admin/users/${id}`);
export const getUser = (id: string) => unwrap<AdminUser>(apiClient.get(`/admin/users/${id}`));

// Children
export const listChildren = (params?: ListParams) =>
  unwrap<Paginated<AdminChild>>(apiClient.get("/admin/children", { params }));
export const getChild = (id: string) => unwrap<AdminChild>(apiClient.get(`/admin/children/${id}`));
export const updateChild = (id: string, body: Partial<AdminChild>) =>
  unwrap<AdminChild>(apiClient.put(`/admin/children/${id}`, body));
export const deleteChild = (id: string) => apiClient.delete(`/admin/children/${id}`);

// Stories
export const listStories = (params?: ListParams) =>
  unwrap<Paginated<AdminStory>>(apiClient.get("/admin/stories", { params }));
export const getStory = (id: string) => unwrap<AdminStory>(apiClient.get(`/admin/stories/${id}`));
export const updateStory = (id: string, body: Partial<AdminStory>) =>
  unwrap<AdminStory>(apiClient.put(`/admin/stories/${id}`, body));
export const deleteStory = (id: string) => apiClient.delete(`/admin/stories/${id}`);

// Schools
export const listSchools = (params?: ListParams) =>
  unwrap<Paginated<AdminSchool>>(apiClient.get("/admin/schools", { params }));
export const createSchool = (body: Partial<AdminSchool>) =>
  unwrap<AdminSchool>(apiClient.post("/admin/schools", body));
export const updateSchool = (id: string, body: Partial<AdminSchool>) =>
  unwrap<AdminSchool>(apiClient.put(`/admin/schools/${id}`, body));
export const deleteSchool = (id: string) => apiClient.delete(`/admin/schools/${id}`);

// Quizzes
export const listQuizzes = (params?: ListParams) =>
  unwrap<Paginated<AdminQuiz>>(apiClient.get("/admin/quizzes", { params }));
export const deleteQuiz = (id: string) => apiClient.delete(`/admin/quizzes/${id}`);

// Knowledge Base
export const listKnowledge = (params?: ListParams) =>
  unwrap<Paginated<AdminKnowledge>>(apiClient.get("/admin/knowledge", { params }));
export const getKnowledgeCategories = () =>
  unwrap<string[]>(apiClient.get("/admin/knowledge/categories"));
export const createKnowledge = (body: Partial<AdminKnowledge>) =>
  unwrap<AdminKnowledge>(apiClient.post("/admin/knowledge", body));
export const updateKnowledge = (id: string, body: Partial<AdminKnowledge>) =>
  unwrap<AdminKnowledge>(apiClient.put(`/admin/knowledge/${id}`, body));
export const deleteKnowledge = (id: string) => apiClient.delete(`/admin/knowledge/${id}`);

// Transactions
export const listTransactions = (params?: ListParams) =>
  unwrap<Paginated<AdminTransaction>>(apiClient.get("/admin/transactions", { params }));
export const getTransaction = (id: string) =>
  unwrap<AdminTransaction>(apiClient.get(`/admin/transactions/${id}`));
export const syncTransactions = () =>
  unwrap<{ synced: number }>(apiClient.post("/admin/transactions/sync"));

