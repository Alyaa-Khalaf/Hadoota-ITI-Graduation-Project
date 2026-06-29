import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function decodeJwtRole(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function getAccessToken(req: NextRequest): string | null {
  return (
    req.cookies.get("accessToken")?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    null
  );
}

export async function middleware(req: NextRequest) {
  const accessToken = getAccessToken(req);
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/childAdventure", "/dashboard", "/onboarding"];
  const adminRoutes = ["/dashboard/admin"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role =
    (typeof nextAuthToken?.role === "string" ? nextAuthToken.role : null) ||
    decodeJwtRole(accessToken);

  const isAuthenticated = Boolean(nextAuthToken || accessToken);

  // Unauthenticated users on protected pages → prefer client-side redirect
  // During development we avoid server-side redirects so the client can read localStorage tokens
  if (isProtected && !isAuthenticated && !isAdminRoute) {
    // Allow the request to proceed; client-side `ProtectedLayout` will redirect unauthenticated users.
    return NextResponse.next();
  }

  // Non-admin users must not access admin dashboard
  if (isAdminRoute) {
    if (role && role !== "admin") {
      return NextResponse.redirect(new URL("/childAdventure", req.url));
    }
    // role unknown server-side (token in localStorage) → client RoleGuard decides
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
