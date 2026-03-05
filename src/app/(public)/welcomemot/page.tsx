import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WelcomeClient from './WelcomeClientGpt1';

export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Nếu không có user, đá về login ngay lập tức ở tầng Server
  if (!user) redirect('/login');

  // Truyền data user vào Client Component
  return <WelcomeClient user={user} />;
}
