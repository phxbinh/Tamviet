
// src/app/(app)/admin/layout.tsx
// làm việc trên tài khoản của user

import { getCurrentUser } from '@/lib/authActions/getUser';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Ở đây không truyền hàm, chỉ truyền dữ liệu (Data)
  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}












