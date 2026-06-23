import type { ReactNode } from "react";
// @ts-ignore
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Providers from "./components/Providers";
import GoogleTokenSync from "./components/auth/GoogleTokenSync"; // ← جديد

export const metadata = {
  title: "Hadoota",
  description: "Hadoota Graduation Project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <AuthProvider>
            <GoogleTokenSync /> {/* ← جديد */}
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
