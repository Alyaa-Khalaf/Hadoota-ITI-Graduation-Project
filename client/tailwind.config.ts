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
        'story-bg': '#FFFDF7',
        'page-warm': '#FFF7EC',
        'page-sky': '#F5FAFF',
        'page-dreamy': '#F8F5FF',

        // Primary (Pastel Pink Theme)
        primary: '#d5456e',
        'primary-light': '#FFC2D3',
        'primary-wash': '#FFF3F7',

        // Accent Pastels
        sunny: '#FFE58A',
        meadow: '#9AD9A4',
        sky: '#8CC8FF',
        magic: '#D8B4FE',
        blossom: '#FFB3C7',
        rose: '#FF95B5',

        // Story Categories
        'cat-adventure': '#DDF4FF',
        'cat-animals': '#FFF0DB',
        'cat-magic': '#F1E3FF',
        'cat-nature': '#DDF9E7',
        'cat-family': '#FFE2E2',

        // Typography
        ink: '#4A3A2A',
        'ink-muted': '#8B7765',
        'border-warm': '#EFE6DD',
        header: '#7A4E68',
      },

      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        serif: ['Amiri', 'serif'],
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