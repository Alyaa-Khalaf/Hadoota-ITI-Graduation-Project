// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ["class"],

//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],

//   theme: {
//     extend: {
//       colors: {
//         // الألوان الأساسية التي تستخدمها shadcn/ui عادةً
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
        
//         // الألوان الخاصة بمشروعك (هنا التعديل الأساسي)
//         primary: {
//           DEFAULT: "var(--primary)", // حذفنا hsl()
//           foreground: "var(--primary-foreground)",
//         },
//         // ... (عدّل باقي الألوان بنفس الطريقة)
        
//         // الألوان المخصصة (أضفها كقيم مباشرة)
//         sunny: "var(--sunny)",
//         meadow: "var(--meadow)",
//         sky: "var(--sky)",
//         magic: "var(--magic)",
//         blossom: "var(--blossom)",
//         rose: "var(--rose)",
//         ink: "var(--ink)",
//         "ink-muted": "var(--ink-muted)",
//         "page-warm": "var(--page-warm)",
//         "page-sky": "var(--page-sky)",
//         "page-dreamy": "var(--page-dreamy)",
//         "primary-light": "var(--primary-light)",
//         "primary-wash": "var(--primary-wash)",
//         "border-warm": "var(--border-warm)",
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//         xl: "1rem",
//         "2xl": "1.5rem",
//         "3xl": "2rem",
//       },

//       fontFamily: {
//         sans: ["Noto Kufi Arabic", "sans-serif"],
//       },

//       boxShadow: {
//         card: "0 8px 24px rgba(255,155,184,.12)",
//         button: "0 4px 14px rgba(255,155,184,.25)",
//         story: "0 12px 32px rgba(74,58,42,.08)",
//       },
//       fontSize: {
//       // تعديل الأحجام الافتراضية لتكون أكبر وأوضح
//       'sm': '0.9rem',    // كان 0.875rem
//       'base': '1.05rem', // كان 1rem
//       'lg': '1.2rem',    // كان 1.125rem
//       'xl': '1.35rem',   // كان 1.25rem
//       '2xl': '1.6rem',   // كان 1.5rem
//     },
//     },
//   },

//   plugins: [require("tailwindcss-animate")],




// }




import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          success: "hsl(var(--accent-success))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
