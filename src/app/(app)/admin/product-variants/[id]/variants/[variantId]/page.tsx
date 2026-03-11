
// src/app/(app)/admin/product-variants/[id]/variants/[variantId]/pqge.tsx
import VariantForm from "@/components/product-variants/VariantForm";
import { ChevronLeft, Edit3 } from "lucide-react";
import Link from "next/link";

export default async function EditVariantPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 animate-fade-in">
      <div className="border-l-4 border-primary pl-6 py-2">
        <Link 
          href={`/admin/product-variants/${id}/variants`}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-3"
        >
          <ChevronLeft className="w-3 h-3" /> Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Edit3 className="w-8 h-8 text-primary" />
          Hiệu chỉnh Variant
        </h1>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
          Cập nhật thông số kỹ thuật và định danh thương mại
        </p>
      </div>

      <VariantForm productId={id} variantId={variantId} />
    </div>
  );
}
