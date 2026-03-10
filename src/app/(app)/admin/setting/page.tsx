import { getCurrentUser } from '@/lib/authActions/getUser';
import SettingsAdmin from './SettingAdmin';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground text-sm">
          Quản lý thông tin cá nhân và thiết lập tùy chỉnh tài khoản.
        </p>
      </div>
      
      <SettingsAdmin user={user} />
    </div>
  );
}
