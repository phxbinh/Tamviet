import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WelcomeClient from './WelcomeClientGpt1';

import { getCurrentUser } from '@/lib/authActions/getUser';
  






export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Nếu không có user, đá về login ngay lập tức ở tầng Server
  if (!user) redirect('/login');
  const userCurrent = await getCurrentUser();

  // Truyền data user vào Client Component
  return <WelcomeClient user={userCurrent} />;
}
