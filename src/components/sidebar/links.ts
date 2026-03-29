// src/components/links.ts
export type SidebarLink = {
  name: string;
  href?: string;           // nếu có href → là link lá
  icon?: string;           // (tuỳ chọn) có thể thêm icon sau
  showInSidebar?: boolean;
  children?: SidebarLink[]; // sub menu
};

export const sidebarLinks: SidebarLink[] = [
  { name: 'Trang chủ', href: '/', showInSidebar: true },
  { name: 'Welcome', href: '/welcomemot', showInSidebar: true },
  { name: 'Đăng ký', href: '/signup', showInSidebar: true },
  { name: 'Quên mật mã', href: '/forgot-password-retry', showInSidebar: true },
  { name: 'Đổi mật mã', href: '/change-password', showInSidebar: true },
  { name: 'Chat Bot', href: '/chat', showInSidebar: true },

  {
    name: 'Bảng nhiệm vụ',
    showInSidebar: true,
    children: [
      { name: 'Todos', href: '/todos' },
      { name: 'Todo list (no images)', href: '/todoimages' },
      { name: 'Todo with images', href: '/todowithimage' },
      { name: 'TodoImageGrok', href: '/todoImageGrok' },
    ],
  },
  {
    name: 'Environments',
    showInSidebar: true,
    children: [
      { name: 'Todos', href: '/wastewater/aerationTank' },
    ],
  },

  { name: 'Giới thiệu', href: '/about', showInSidebar: true },
  { name: 'Road map', href: '/roadmap', showInSidebar: true },
  { name: 'Tài liệu', href: '/test', showInSidebar: true },
  { name: 'Sản phẩm', href: '/testSearchParam', showInSidebar: true },

];







