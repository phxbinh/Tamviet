// src/app/(public)/welcome/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout';

export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (<>
    <h1>Welcome {user.email}</h1>
    < LogoutButton />
    </>);
}
