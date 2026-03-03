// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Trang này không tồn tại hoặc đã bị xoá.
      </p>

      <Link
        href="/"
        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-80"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}



