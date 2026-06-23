import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendToken: string;
    backendRefreshToken: string; // ← جديد
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    backendToken?: string;
    backendRefreshToken?: string; // ← جديد
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    backendRefreshToken?: string; // ← جديد
    role?: string;
  }
}
