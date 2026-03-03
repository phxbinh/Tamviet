// src/app/(public)/login/page.tsx
'use client';

import { signIn } from '@/lib/authActions/auth';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');

  return (
    <form
      action={async (formData) => {
        const res = await signIn(formData);
        if (res?.error) setError(res.error);
      }}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2 w-full"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 w-full"
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}