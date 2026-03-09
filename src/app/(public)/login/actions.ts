// src/app/(public)/login/actions.ts
'use server';

import { signIn } from '@/lib/authActions/auth';

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const res = await signIn(formData);

  if (res?.error) {
    return { error: res.error };
  }

  return { error: undefined };
}