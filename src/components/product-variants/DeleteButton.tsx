
// src/components/product-variants/DeleteButton.tsx
/*
"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  variantId,
}: {
  variantId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(
      `/api/admin/product-variants/${variantId}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600"
    >
      Delete
    </button>
  );
}
*/



"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function DeleteButton({
  variantId,
}: {
  variantId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    // Sử dụng Confirm mặc định nhưng với câu lệnh mang tính hệ thống hơn
    if (!confirm("XÁC NHẬN: Bạn có chắc chắn muốn loại biên biến thể này khỏi hệ thống? Hành động này không thể hoàn tác.")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/product-variants/${variantId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        // Refresh để Server Component cập nhật lại danh sách fleet
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`CRITICAL ERROR: ${errorData.error || "Giao thức xóa thất bại"}`);
        setIsDeleting(false);
      }
    } catch (error) {
      alert("NETWORK ERROR: Không thể kết nối tới cơ sở dữ liệu");
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        text-[9px] font-black uppercase tracking-widest 
        transition-all duration-300 shadow-sm
        ${isDeleting 
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
          : "bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
        }
      `}
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
          <span>Decommission</span>
        </>
      )}
    </button>
  );
}






