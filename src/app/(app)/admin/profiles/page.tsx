// src/app/(app)/admin/profiles/page.tsx
import { redirect } from 'next/navigation';
import { getAllProfiles_ } from '@/lib/neon/profiles';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminProfilesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Lấy dữ liệu profile (Ưu tiên dùng getAllProfiles_ với RLS để bảo mật)
  const profiles = await getAllProfiles_(user.id);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage roles, permissions and account status.
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 text-sm font-medium">
            Total Users: {profiles.length}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground text-center">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">Joined Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map((p) => (
                  <tr key={p.user_id} className="hover:bg-muted/30 transition-colors">
                    {/* User Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {p.avatar_url ? (
                            <img
                              src={p.avatar_url}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {p.user_id.substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          {/* Indicator cho Admin */}
                          {p.role === 'admin' && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card animate-breathe-fast"></span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm font-mono">
                            {p.user_id.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-muted-foreground">ID: {p.user_id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        p.role === 'admin' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {p.role}
                      </span>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Actions Column - Nơi đặt logic Change Role & Block */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Nút Change Role */}
                        <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-all active:scale-95">
                          Change Role
                        </button>
                        
                        {/* Nút Block - Sử dụng animate-shake khi hover hoặc click */}
                        <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-600 hover:text-white hover:animate-shake transition-all">
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
