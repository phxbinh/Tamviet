
/*
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Toast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";
*/
/*
export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
*/

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50">
        
      </header>

      {/* MAIN */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer>
        
      </footer>
    </div>
  );
}





