/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },

      animation: {
        wiggle: 'wiggle 3s ease-in-out infinite',
      },

      colors: {
  // Backgrounds
  "story-bg": "var(--story-bg)",
  "page-warm": "var(--page-warm)",
  "page-sky": "var(--page-sky)",
  "page-dreamy": "var(--page-dreamy)",

  // Primary
  primary: "var(--primary)",
  "primary-light": "var(--primary-light)",
  "primary-wash": "var(--primary-wash)",

  // Accent
  sunny: "var(--sunny)",
  meadow: "var(--meadow)",
  sky: "var(--sky)",
  magic: "var(--magic)",
  blossom: "var(--blossom)",
  rose: "var(--rose)",

  // Categories
  "cat-adventure": "var(--cat-adventure)",
  "cat-animals": "var(--cat-animals)",
  "cat-magic": "var(--cat-magic)",
  "cat-nature": "var(--cat-nature)",
  "cat-family": "var(--cat-family)",

  // Typography
  ink: "var(--ink)",
  "ink-muted": "var(--ink-muted)",
  "border-warm": "var(--border-warm)",
  header: "var(--header)",
},

      fontFamily: {
  sans: ['Noto Kufi Arabic', 'sans-serif'],
},

      boxShadow: {
        card: '0 8px 24px rgba(255, 155, 184, 0.12)',
        button: '0 4px 14px rgba(255, 155, 184, 0.25)',
        story: '0 12px 32px rgba(74, 58, 42, 0.08)',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },

  plugins: [],
}