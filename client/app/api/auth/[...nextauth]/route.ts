import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// نقرأ الدور من داخل الـ JWT اللي راجع من الباك إند (الدور مش موجود في الـ body)
function decodeJwtRole(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
          }),
        });

        const data = await res.json();

        const role = decodeJwtRole(data?.data?.accessToken);

        // 🚫 الأدمن ممنوع يسجّل دخول عن طريق جوجل — لازم يدخل بالإيميل والباسورد
        if (role === "admin") {
          return "/auth/login?error=AdminGoogleBlocked";
        }

        if (data?.data?.accessToken) {
          // ← غيرنا من data.token لـ data.data.accessToken
          user.backendToken = data.data.accessToken;
          user.backendRefreshToken = data.data.refreshToken; // ← جديد
          user.role = role ?? undefined;
        }

        return true;
      } catch (err) {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.backendRefreshToken = user.backendRefreshToken; // ← جديد
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.backendRefreshToken = token.backendRefreshToken as string; // ← جديد
      session.user.role = token.role as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
