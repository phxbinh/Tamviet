// src/app/(public)/layout.tsx
/*
import PublicShell from "@/components/layout/PublicShell_x";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
*/



import { getCurrentUser } from '@/lib/authActions/getUser';
import PublicShell from "@/components/layout/PublicShell_x_client";
import SupportPolicies from "@/components/chinhsachbaomat/ChinhSachBaoMat_";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return <PublicShell user={user} supportPolicies={<SupportPolicies/>}>{children}</PublicShell>;
}



