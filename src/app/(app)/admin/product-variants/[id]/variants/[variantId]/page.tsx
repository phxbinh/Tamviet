
// src/app/(app)/admin/product-variants/[id]/variants/[variantId]/pqge.tsx
import VariantForm from "@/components/product-variants/VariantForm";

export default async function EditVariantPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Variant</h1>

      <VariantForm
        productId={id}
        variantId={variantId}
      />
    </div>
  );
}