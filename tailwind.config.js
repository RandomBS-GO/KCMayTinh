/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Brand blue (primary CTA, links, highlights)
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Violet accent (secondary highlights)
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        // Zinc-based dark theme (premium, true dark)
        dark: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(145deg, #09090b 0%, #18181b 60%, #0d1117 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0.95) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'glow-gradient': 'radial-gradient(ellipse at top, rgba(37,99,235,0.12) 0%, transparent 65%)',
        'grid-bg': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%2327272a' stroke-width='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float':          'float 4s ease-in-out infinite',
        'pulse-glow':     'pulseGlow 3s ease-in-out infinite',
        'slide-up':       'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in':        'fadeIn 0.4s ease-out',
        'shimmer':        'shimmer 2s linear infinite',
        'bounce-subtle':  'bounceSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.3)' },
          '50%':       { boxShadow: '0 0 40px rgba(37,99,235,0.55)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(37,99,235,0.25)',
        'glow':    '0 0 24px rgba(37,99,235,0.35)',
        'glow-lg': '0 0 48px rgba(37,99,235,0.45)',
        'card':       '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)',
        'inner-glow': 'inset 0 0 24px rgba(37,99,235,0.08)',
        'elevation-1': '0 1px 2px rgba(0,0,0,0.5)',
        'elevation-2': '0 2px 8px rgba(0,0,0,0.4)',
        'elevation-3': '0 8px 32px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
