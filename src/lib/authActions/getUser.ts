// src/lib/authSctions/getUser.ts
// lấy thông tin user để hiển thị lên dashboard
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getMyProfile } from '@/lib/sqlQueries/profiles';

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  
  // 1. Lấy thông tin user từ session của Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  try {
    // 2. Sử dụng hàm getMyProfile của bạn để lấy data từ Neon
    const profile = await getMyProfile(user.id);
    console.log("profileData: ",profile)

    // Trả về một object gộp cả Email (từ Auth) và Profile (từ Neon)
    return {
      id: user.id,
      email: user.email!,
      ...profile, // user_id, role, avatar_url...
    };
  } catch (err) {
    console.error("Lỗi khi fetch profile từ Neon:", err);
    // Trả về dữ liệu tối thiểu nếu profile chưa tồn tại
    return {
      id: user.id,
      email: user.email!,
      role: 'user',
      avatar_url: null
    };
  }
}
