
// src/app/(app)/admin/layout.tsx
// làm việc trên tài khoản của user

import { getCurrentUser } from '@/lib/authActions/getUser';
import AdminShell from '@/components/admin/AdminShell';
import { Toaster } from "sonner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Ở đây không truyền hàm, chỉ truyền dữ liệu (Data)
  return (
    <AdminShell user={user}>
      {children}
       <Toaster />
    </AdminShell>
  );
}












