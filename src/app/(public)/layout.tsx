// src/app/(public)/layout.tsx
// src/app/(public)/layout.tsx
import PublicShell from "@/components/layout/PublicShell";

/*
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
*/

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden border-3 border-red-500">
      <div className="w-full flex-none md:w-64">
 
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}