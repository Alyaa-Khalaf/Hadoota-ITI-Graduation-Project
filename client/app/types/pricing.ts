// نوع خطة الاشتراك كما يرجع من GET /api/plans
export interface Plan {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  features?: string[];
  badge?: string;
  highlight?: boolean;
  audience: "parent" | "school" | "all";
  isActive: boolean;
  sortOrder?: number;
}
