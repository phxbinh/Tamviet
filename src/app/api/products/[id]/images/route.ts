import { NextRequest } from "next/server";
import { sql } from "@/lib/neon/sql";

/**
 * GET: Lấy danh sách hình ảnh của sản phẩm theo ID
 */


export async function GET(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  
  try {
    const { productId } = await context.params

    // Sử dụng cú pháp sql của Neon tương tự như bạn đã gửi
    const rows = await sql`
      SELECT
        id,
        image_url,
        alt_text,
        display_order,
        is_thumbnail
      FROM product_images
      WHERE product_id = ${productId}
        AND is_active = true
      ORDER BY display_order ASC
    `;

    return Response.json(rows);
  } catch (error) {
    console.error("[PRODUCT_IMAGES_GET_ERROR]", error);
    return Response.json(
      { error: "Failed to fetch images from system" },
      { status: 500 }
    );
  }
}

/**
 * POST: Upload và lưu thông tin ảnh mới
 */
export async function POST(req: Request) {

  const { productId, variantId, paths } = await req.json()

  if (!Array.isArray(paths) || paths.length === 0) {
    return new Response("Invalid paths", { status: 400 })
  }

  if (!productId && !variantId) {
    return new Response("Missing productId or variantId", { status: 400 })
  }

  const rows = await sql`
    insert into product_images (
      product_id,
      variant_id,
      image_url
    )
    select
      ${productId ?? null},
      ${variantId ?? null},
      p
    from unnest(${paths}::text[]) as p
    returning id
  `

  return Response.json({
    ok: true,
    inserted: rows.length
  })
}

