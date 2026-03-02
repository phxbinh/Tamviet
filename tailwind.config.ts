import type { Config } from 'tailwindcss';

export default {
  // 1. Kích hoạt chế độ Dark mode dựa trên class
  darkMode: 'class', 
  
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Thêm src nếu bạn dùng folder này
  ],
  theme: {
    extend: {
      colors: {
        // Giữ lại các màu Neon của bạn cho đúng chất "todo-neon-2026"
        neonCyan: '#22d3ee',
        neonPurple: '#a855f7',
        
        // Gợi ý: Thêm các biến HSL nếu bạn muốn dùng CSS Variables như đã nói ở trên
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      zIndex: {
        100: '100',
        500: '500', // Sửa lại cho đúng logic
        999: '999',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
