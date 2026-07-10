import type { ReactNode } from "react";
import './globals.css';
import { Baloo_Bhaijaan_2 } from "next/font/google"; // استيراد الخط الجديد

import { AuthProvider } from "./context/AuthContext";
import Providers from "./components/Providers";
import GoogleTokenSync from "./components/auth/GoogleTokenSync";
import { ChildProvider } from "./context/childContext";
import { ThemeProvider } from "./context/ThemeContext";
// 1. استيراد Tajawal
import { Tajawal } from "next/font/google";
import { cn } from "@/lib/utils";

// 2. إعداد الخط
const baloo = Baloo_Bhaijaan_2({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-baloo", // متغير جديد
});

export const metadata = {
  title: "Hadoota",
  description: "Hadoota Graduation Project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 3. إضافة المتغير للكلاسات وتطبيق الخط على body
    <html lang="ar" dir="rtl" className={cn(baloo.variable)}>
      <body className={cn("font-sans antialiased", baloo.className)}>
        <ThemeProvider>
          <Providers>
            <AuthProvider>
              <ChildProvider>
                <GoogleTokenSync />
                {children}
              </ChildProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}