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
/*
  {
    name: 'Products Management',
    showInSidebar: true,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Products (full)', href: '/admin/products-full' },
      { name: 'Product View', href: '/admin/product-view' },
      { name: 'Add New Product', href: '/admin/products/new' },
    ],
  },

  {
    name: 'Product Types & Attributes',
    showInSidebar: true,
    children: [
      { name: 'Product Types', href: '/admin/product-types' },
      { name: 'Type Attributes', href: '/admin/product-types/attribute-manager' },
      { name: 'All Attributes', href: '/admin/attributes' },
    ],
  },
*/
  { name: 'Products shop', href: '/products', showInSidebar: true },
  { name: 'About', href: '/about', showInSidebar: true },
  { name: 'Road map', href: '/roadmap', showInSidebar: true },
  { name: 'Markdown', href: '/test', showInSidebar: true },

];







