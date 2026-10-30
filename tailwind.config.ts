import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: {
            DEFAULT: '#4F46E5',
            hover: '#4338CA',
          },
          blue: {
            DEFAULT: '#3B82F6',
            hover: '#2563EB',
          },
          ink: '#0F1222',
          muted: '#64748B',
          surface: '#FAFAFC',
          border: '#E2E8F0',
        },
        primary: {
          50: '#f5f4ff',
          100: '#ede9fe',
          200: '#e0e0ff',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
        'gradient-mesh-hero':
          'radial-gradient(at 8% 10%, rgba(79, 70, 229, 0.2) 0px, transparent 46%), radial-gradient(at 82% 8%, rgba(236, 72, 153, 0.14) 0px, transparent 42%), radial-gradient(at 48% 78%, rgba(167, 139, 250, 0.22) 0px, transparent 48%), radial-gradient(at 92% 72%, rgba(59, 130, 246, 0.18) 0px, transparent 44%)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        full: '9999px',
        pill: '9999px',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg':
          '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        'screen-1200': '1200px',
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out',
        'hover-lift': 'hover-lift 0.2s ease-out',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
