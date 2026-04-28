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
  { name: 'Sản phẩm', href: '/testSearchParam', showInSidebar: true },
/*
  { name: 'Welcome', href: '/welcomemot', showInSidebar: true },
  { name: 'Đăng ký', href: '/signup', showInSidebar: true },
  { name: 'Quên mật mã', href: '/forgot-password-retry', showInSidebar: true },
  { name: 'Đổi mật mã', href: '/change-password', showInSidebar: true },
*/
  { name: 'Orders', href: '/orders', showInSidebar: true },
  { name: 'Chat Bot', href: '/chat', showInSidebar: true },
  { name: 'Chat bot Policies', href: '/chatbot-policies', showInSidebar: true },
  { name: 'Chat bot v1 client', href: '/chatbotv1-client', showInSidebar: true },
  { name: 'Bot sell', href: '/chatbot-sell', showInSidebar: true },

  {
    name: 'Environments',
    showInSidebar: true,
    children: [
      { name: 'Hiếu khí', href: '/wastewater/aerationTank' },
    ],
  },

  {
    name: 'Tutorials',
    showInSidebar: true,
    children: [
      { name: 'Danh sách', href: '/tutorials' },
      { name: 'Viết bài', href: '/tutorials/new' },

    ],
  },

  { name: 'Blog', href: '/blog', showInSidebar: true },
  { name: 'Tài liệu', href: '/test', showInSidebar: true },
  { name: 'Bài Viết', href: '/baiviet', showInSidebar: true },
  { name: 'Bài Viết app', href: '/baivietapp', showInSidebar: true },
  { name: 'New post', href: '/baivietapp/new', showInSidebar: true },
  { name: 'Road map', href: '/roadmap', showInSidebar: true },
  { name: 'Giới thiệu', href: '/about', showInSidebar: true },

];







