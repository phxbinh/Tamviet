// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // thêm nếu có folder khác
  ],
  theme: {
    extend: {
      colors: {
        neonCyan: '#22d3ee',
        neonPurple: '#a855f7',
      },
      zIndex: {
        100: '100',
        550: '500',
        999: '999',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
} satisfies Config;