import type { ReactNode } from "react";
// @ts-ignore
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Providers from "./components/Providers";
import GoogleTokenSync from "./components/auth/GoogleTokenSync"; // ← جديد
import { ChildProvider } from "./context/childContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Hadoota",
  description: "Hadoota Graduation Project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cn("font-sans", inter.variable)}>
      <body>
          <ThemeProvider>
        <Providers>
          <AuthProvider>
            <ChildProvider>
              <GoogleTokenSync /> {/* ← جديد */}
              {children}
            </ChildProvider>
          </AuthProvider>
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
