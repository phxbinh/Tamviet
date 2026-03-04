
/*
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getCurrentUser } from '@/lib/authActions/getUser';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex h-full w-full overflow-hidden">
      
      <DashboardSidebar user={user} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader onMenuClick={() => {}} />
        
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
*/



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












