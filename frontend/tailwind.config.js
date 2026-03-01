/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ── Brand Colour Palette ───────────────────────────────────────────
      colors: {
        espresso: {
          50:  '#fdf7f0',
          100: '#f5e6d3',
          200: '#e8c8a0',
          300: '#d4a362',
          400: '#c0822e',
          500: '#8B4513', // Primary brand colour
          600: '#7a3d11',
          700: '#63300d',
          800: '#4a2409',
          900: '#1a0d03',
        },
        latte: {
          50:  '#fffdf7',
          100: '#fef8e8',
          200: '#fcf0c8',
          300: '#f7e099',
          400: '#f0c860',
          500: '#D4A853', // Warm amber accent
          600: '#b8893a',
        },
        cream: {
          50:  '#fffffe',
          100: '#FFF8F0', // Off-white page background
          200: '#f5ede0',
          300: '#e8d8c3',
        },
        bark: {
          800: '#2c1a0e', // Deep text colour
          900: '#1a0d03',
        }
      },

      // ── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        // Display: editorial serif with character — used for headings
        display: ['"Cormorant Garamond"', '"Garamond"', 'Georgia', 'serif'],
        // Body: geometric humanist sans — clean and readable
        body:    ['"DM Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        // Accent: flowing script — used for decorative labels
        script:  ['"Pinyon Script"', '"Brush Script MT"', 'cursive'],
      },

      // ── Spacing ────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      // ── Custom Animations ──────────────────────────────────────────────
      animation: {
        'fade-up':     'fadeUp 0.6s ease-out both',
        'fade-in':     'fadeIn 0.5s ease-out both',
        'slide-right': 'slideRight 0.7s ease-out both',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // ── Box Shadow ─────────────────────────────────────────────────────
      boxShadow: {
        'card':    '0 2px 20px rgba(139,69,19,0.08)',
        'card-lg': '0 8px 40px rgba(139,69,19,0.14)',
        'inner-warm': 'inset 0 1px 3px rgba(139,69,19,0.12)',
      },

      // ── Border radius ──────────────────────────────────────────────────
      borderRadius: {
        'xl2': '1.25rem',
      },
    },
  },
  plugins: [],
};
