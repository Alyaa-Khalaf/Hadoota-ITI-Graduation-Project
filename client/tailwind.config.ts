
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
        'story-bg':    '#FFFBF0',
        'page-warm':   '#FFF5E6',
        'page-sky':    '#F0F8FF',
        'page-dreamy': '#F3F0FF',

        // Primary
        primary:         '#FF7043',
        'primary-light': '#FF9A70',
        'primary-wash':  '#FFF0EB',

        // Accent
        sunny:   '#FFD93D',
        meadow:  '#6BCB77',
        sky:     '#4D96FF',
        magic:   '#C77DFF',
        blossom: '#FF6B9D',
        rose: "#FF4D8D", 
       

        // Story categories
        'cat-adventure': '#D0F0FD',
        'cat-animals':   '#FDE8D0',
        'cat-magic':     '#E8D0FD',
        'cat-nature':    '#D0FDE8',
        'cat-family':    '#FDD0D0',

        // Typography
        ink:           '#3D2C1E',
        'ink-muted':   '#7A6552',
        'border-warm': '#E8DED4',
        'header':'#511D43'
      },


      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },

      boxShadow: {
        card:   '0 8px 24px rgba(255, 112, 67, 0.12)',
        button: '0 4px 14px rgba(255, 112, 67, 0.28)',
        story:  '0 12px 32px rgba(61, 44, 30, 0.08)',
      },

      borderRadius: {
        xl:   '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      

    
    },
  },


  plugins: [],
}

