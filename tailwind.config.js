/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ice: {
          pink: '#FF70A6',
          peach: '#FF9770',
          yellow: '#FFD670',
          mint: '#70D6BC',
          sky: '#70C1B3',
          purple: '#A06CD5',
          cream: '#FFF9F0',
          cone: '#D4A373',
          coneDark: '#BC6C25',
          dark: '#1F1A24',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'drip': 'drip 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drip: {
          '0%': { height: '8px', opacity: '0.8' },
          '60%': { height: '32px', opacity: '1' },
          '100%': { height: '8px', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
};
