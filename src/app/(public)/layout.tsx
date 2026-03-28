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

/*
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden border-3 border-red-500">
      <div className="w-full flex-none md:w-64">
 
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
*/


// layout.tsx cải tiến
//export default
function Layout____({ children }: { children: React.ReactNode }) {
  return (
    /* Sử dụng h-svh (Small Viewport Height) để fix lỗi tràn trên iPhone.
       overflow-hidden ở đây để khóa không cho cả trang cuộn hỗn loạn.
    */
    <div className="flex h-svh w-full flex-col md:flex-row overflow-hidden border-3 border-red-500">
      
      {/* SIDEBAR AREA */}
      <div className="w-full flex-none md:w-64 border-b md:border-b-0 md:border-r border-border">
        {/* Sidebar content here */}
      </div>

      {/* MAIN CONTENT AREA 
          min-w-0: Cực kỳ quan trọng để các thẻ con (như Swiper) không đẩy tràn khung.
          overflow-y-auto: Chỉ cho phép vùng này được cuộn.
      */}
      <main className="grow min-w-0 relative overflow-y-auto bg-background p-1 md:p-6 lg:p-12">
        <div className="mx-auto max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}



//export default 
function Layout_ok({ children }: { children: React.ReactNode }) {
  return (
    /* Thẻ cha ngoài cùng - Chỉnh lại để mobile landscape ~800px và canh giữa */
    <div className="flex h-svh w-full flex-col md:flex-row overflow-hidden 
                    landscape:max-w-[800px] landscape:mx-auto 
                    border-3 border-red-500">

      {/* SIDEBAR AREA */}
      <div className="w-full flex-none md:w-64 border-b md:border-b-0 md:border-r border-border">
        {/* Sidebar content here */}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="grow min-w-0 relative overflow-y-auto bg-background p-1 md:p-6 lg:p-12">
        <div className="mx-auto max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}




export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    /* 1. Thay h-svh bằng min-h-svh: Để chiều cao ít nhất bằng màn hình, 
          nhưng vẫn có thể nới rộng nếu con cao hơn.
       2. Bỏ overflow-hidden: Để trang có thể scroll tự nhiên khi thẻ cha dài ra.
       3. Thêm flex-1 cho các phần tử bên trong nếu cần thiết.
    */
    <div className="flex min-h-svh w-full flex-col md:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    border-3 border-red-500 bg-background">

      {/* SIDEBAR AREA 
          Trên mobile (flex-col): Nó nằm trên.
          Trên desktop (flex-row): Nó nằm trái.
      */}
      <div className="w-full flex-none md:w-64 border-b md:border-b-0 md:border-r border-border bg-card">
        {/* Sidebar content here */}
        <div className="p-4">Sidebar</div>
      </div>

      {/* MAIN CONTENT AREA 
          Bỏ overflow-y-auto ở đây vì bây giờ chúng ta muốn cả thẻ cha ngoài cùng 
          cuộn theo nội dung thay vì chỉ cuộn trong main.
      */}
      <main className="flex-1 min-w-0 relative p-1 md:p-6 lg:p-12">
        <div className="mx-auto max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}



