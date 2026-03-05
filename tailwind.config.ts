import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. ĐỊNH NGHĨA NHỊP ĐIỆU (KEYFRAMES)
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
      // 2. BIẾN THÀNH CLASS ĐỂ SỬ DỤNG (ANIMATION)
      animation: {
        'breathe-slow': 'breathe 3s infinite ease-in-out',
        'breathe-fast': 'breathe 1.5s infinite ease-in-out',
        'breathe-danger': 'breathe 0.6s infinite ease-in-out',
      },
      // Bạn có thể thêm các màu sắc Neon của Tâm Việt ở đây nếu chưa có
      colors: {
        'neon-cyan': '#22d3ee',
        'neon-purple': '#a855f7',
      }
    },
  },
  plugins: [],
};
export default config;
