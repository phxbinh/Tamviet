// src/lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr'

// Thận trọng khi dùng cái này. vì nó bypass mọi rls và policies ở DB
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(
          name: string,
          value: string,
          options: {
            path?: string
            maxAge?: number
            expires?: Date
            httpOnly?: boolean
            secure?: boolean
            sameSite?: 'lax' | 'strict' | 'none'
          }
        ) {
          cookieStore.set({ name, value, ...options })
        },
        remove(
          name: string,
          options: {
            path?: string
            maxAge?: number
            expires?: Date
            httpOnly?: boolean
            secure?: boolean
            sameSite?: 'lax' | 'strict' | 'none'
          }
        ) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

