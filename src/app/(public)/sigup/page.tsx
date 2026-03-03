// src/app/(public)/sigup/page.tsx
// src/app/(public)/signup/page.tsx
'use client';

import { useActionState } from 'react';
import { signUp } from '@/lib/authActions/auth';

type FormState =
  | {
      error?: string;
      success?: boolean;
      message?: string;
    }
  | null;

export default function SignupPage() {
  const [state, formAction, isPending] =
    useActionState<FormState, FormData>(signUp, null);

  return (
    <form
      action={formAction}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full border p-2"
      />

      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full border p-2"
      />

      {state?.error && (
        <p className="text-red-500 text-sm">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white p-2 disabled:opacity-50"
      >
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}