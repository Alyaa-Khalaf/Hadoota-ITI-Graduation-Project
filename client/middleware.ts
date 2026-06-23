import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value 
    || req.headers.get("authorization")?.replace("Bearer ", "");

  const { pathname } = req.nextUrl;

  // الصفحات اللي محتاجة login
  const protectedRoutes = ["/childAdventure", "/dashboard", "/onboarding"];
  
  // الصفحات اللي خاصة بالـ admin بس
  const adminRoutes = ["/dashboard/admin"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  // جيب الـ session من NextAuth
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // لو مش logged in وبيحاول يدخل صفحة محمية
  if (isProtected && !session && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // لو مش admin وبيحاول يدخل admin route
  if (isAdmin && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/childAdventure", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/childAdventure/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};