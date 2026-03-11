
// src/app/(app)/admin/product-variants/[id]/variants/[variantId]/pqge.tsx
// src/app/(app)/admin/product-variants/[id]/variants/[variantId]/page.tsx
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
    <div className="max-w-6xl mx-auto space-y-10 py-8 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <Link 
          href={`/admin/product-variants/${id}/variants`}
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          Back to Inventory
        </Link>

        <div className="border-l-4 border-primary pl-6 py-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <Edit3 className="w-8 h-8 text-primary" />
            Parameter Adjustment
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-1 opacity-60">
            Hiệu chỉnh mã định danh và thông số thương mại
          </p>
        </div>
      </div>

      {/* FORM INTERFACE */}
      <VariantForm
        productId={id}
        variantId={variantId}
      />

      {/* FOOTER CAPTION */}
      <div className="pt-12 border-t border-border/50">
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.5em] opacity-30">
          Core Management System // Security Protocol Active
        </p>
      </div>
    </div>
  );
}
