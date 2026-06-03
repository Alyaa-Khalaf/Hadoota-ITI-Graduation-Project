import type { ReactNode } from "react";
// @ts-ignore
import "./globals.css";

export const metadata = {
  title: "Hadoota",
  description: "Hadoota Graduation Project",
};

export default function RootLayout(
    { 
        children 
    }:
    { 
        children: ReactNode 
    }
) {
  return (
    <html lang="ar" dir="rtl">
      <body>{ children }</body>
    </html>
  );
}

