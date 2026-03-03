// src/lib/authActions/auth.ts
'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../supabase/server';

import { sql } from '@/lib/neon/sql';

import { syncUser, ensureProfile } from '../neon/users';

/**
 * SIGN UP
 * - Supabase tạo user
 * - KHÔNG sync Neon ở đây (chưa login / chưa verify email)
 */
export async function signUp(
  prevState: any,
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Vui lòng nhập email và password' };
  }

  if (password.length < 6) {
    return { error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.',
  };
}

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Auth session not found' };
  }

  // Đồn bộ data Auth user supabase sang neon
  // ✅ SYNC SUPABASE → NEON (KHÔNG CONTEXT)
  await syncUser({
    id: user.id,
    email: user.email!,
  });

  await ensureProfile(user.id);

  // 🔎 LẤY ROLE TỪ NEON
  const rows = await sql`
    select role
    from profiles
    where user_id = ${user.id}
    limit 1
  `;

  const role = (rows as { role: string }[])[0]?.role;
console.log('role', role)

  if (role === 'admin') {
    redirect('/admin');
  }

  redirect('/welcome');
}

/**
 * SIGN OUT
 * - Chỉ logout Supabase
 * - Neon tự chặn bằng RLS
 */
export async function signOut() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect('/login');
}


/**
 * QUÊN MẬT KHẨU
 */
export async function requestPasswordReset(
  prevState: any, // Thêm vào đây
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  const email = (formData.get('email') as string)?.trim();

  if (!email) return { error: 'Vui lòng nhập địa chỉ email' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/change-password`,
  });

  if (error) return { error: error.message };

  return { success: true, message: 'Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư.' };
}


/**
 * ĐỔI MẬT KHẨU MỚI (Cập nhật trực tiếp)
 */
export async function updatePassword(
  prevState: any, // Thêm tham số này vào đầu
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) return { error: 'Vui lòng nhập đầy đủ thông tin' };
  if (password !== confirmPassword) return { error: 'Mật khẩu xác nhận không khớp' };
  if (password.length < 6) return { error: 'Mật khẩu phải từ 6 ký tự trở lên' };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };

  return { success: true, message: 'Cập nhật mật khẩu thành công!' };
}





