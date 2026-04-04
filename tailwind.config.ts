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
        mint: '#E6F6E6',
        offwhite: '#F8F5F0',
        white: '#FFFFFF',
        terracotta: '#E2725B',
        softred: '#D9381E',
      },
      fontFamily: {
        sans: ['var(--font-lato)'],
        heading: ['var(--font-lora)'],
      },
    },
  },
  plugins: [],
};

export default config;
