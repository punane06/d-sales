import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#2C3329',
        sage: '#6B8362',
        offwhite: '#F8F5F0',
        white: '#FFFFFF',
        terracotta: '#E2725B',
        softred: '#D9381E',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        heading: ['var(--font-cormorant)'],
      },
      keyframes: {
        'cta-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.9' },
        },
      },
      animation: {
        'cta-pulse': 'cta-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
