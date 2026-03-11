// src/app/(app)/admin/product-variants/[id]/variants/new/page.tsx
import { sql } from "@/lib/neon/sql";
import VariantManager from "./CreateVariant";
import { PackageOpen, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

type ProductRow = {
  id: string;
  product_type_id: string;
};

type Attribute = {
  id: string;
  code: string;
  name: string;
  type: string;
  values: {
    id: string;
    value: string;
  }[];
};

export default async function VariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = id;

  const productRows = (await sql`
    select id, product_type_id, name
    from products
    where id = ${productId}
    limit 1
  `) as (ProductRow & { name: string })[];

  const product = productRows[0];

  if (!product) {
    return (
      <div className="p-20 text-center animate-shake">
        <h2 className="text-xl font-black uppercase tracking-widest text-red-500">Asset Error</h2>
        <p className="text-[10px] font-bold opacity-50 mt-2">Dữ liệu sản phẩm không tồn tại trong Registry.</p>
      </div>
    );
  }

  const attributes = (await sql`
    select
      a.id, a.code, a.name, a.type,
      coalesce(
        json_agg(
          json_build_object('id', av.id, 'value', av.value)
          order by av.sort_order asc
        ) filter (where av.id is not null),
        '[]'
      ) as values
    from product_type_attributes pta
    join attributes a on a.id = pta.attribute_id
    left join attribute_values av on av.attribute_id = a.id
    where pta.product_type_id = ${product.product_type_id}
    group by a.id
    order by a.name asc
  `) as Attribute[];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <Link href={`/admin/product-variants/${productId}/variants`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">
            <ChevronLeft className="w-3 h-3" /> Back to Fleet
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <PackageOpen className="w-8 h-8 text-primary" />
            Registry Deployment
          </h1>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 font-bold border border-primary/20 uppercase tracking-[0.2em]">
              Origin: {product.name}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-neon-cyan" /> Class Validated
            </span>
          </div>
        </div>
      </div>

      {/* MAIN INTERFACE */}
      <VariantManager
        productId={productId}
        attributes={attributes}
      />

      {/* FOOTER CAPTION */}
      <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-[0.5em] opacity-30 pt-10">
        Strategic Command // Product Variant Protocol
      </p>
    </div>
  );
}
