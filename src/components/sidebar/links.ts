// src/components/links.ts
export type SidebarLink = {
  name: string;
  href?: string;           // nếu có href → là link lá
  icon?: string;           // (tuỳ chọn) có thể thêm icon sau
  showInSidebar?: boolean;
  children?: SidebarLink[]; // sub menu
};

export const sidebarLinks: SidebarLink[] = [
  { name: 'Welcome', href: '/welcomemot', showInSidebar: true },
  { name: 'Signup', href: '/signup', showInSidebar: true },
  { name: 'Forgot pass', href: '/forgot-password-retry', showInSidebar: true },
  { name: 'Change pass', href: '/change-password', showInSidebar: true },
  { name: 'Chat Bot', href: '/chat', showInSidebar: true },

  {
    name: 'Todos',
    showInSidebar: true,
    children: [
      { name: 'Todos', href: '/todos' },
      { name: 'Todo list (no images)', href: '/todoimages' },
      { name: 'Todo with images', href: '/todowithimage' },
      { name: 'TodoImageGrok', href: '/todoImageGrok' },
    ],
  },

  { name: 'About', href: '/about', showInSidebar: true },
  { name: 'Road map', href: '/roadmap', showInSidebar: true },
  { name: 'Markdown', href: '/test', showInSidebar: true },
  { name: 'Test param', href: '/testSearchParam', showInSidebar: true },

];







