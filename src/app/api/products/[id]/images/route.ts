import { NextRequest } from "next/server";
import { sql } from "@/lib/neon/sql";

/**
 * GET: Lấy danh sách hình ảnh của sản phẩm theo ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Sử dụng cú pháp sql của Neon tương tự như bạn đã gửi
    const rows = await sql`
      SELECT
        id,
        image_url,
        alt_text,
        display_order,
        is_thumbnail
      FROM product_images
      WHERE product_id = ${id}
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
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { imageUrl, altText } = await req.json();

    if (!imageUrl) {
      return Response.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Thực hiện chèn dữ liệu mới vào PostgreSQL
    const result = await sql`
      INSERT INTO product_images (
        product_id, 
        image_url, 
        alt_text, 
        is_active
      )
      VALUES (
        ${id}, 
        ${imageUrl}, 
        ${altText || 'Product Image'}, 
        true
      )
      RETURNING id, image_url, alt_text
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("[PRODUCT_IMAGES_POST_ERROR]", error);
    return Response.json(
      { error: "Failed to synchronize image data" },
      { status: 500 }
    );
  }
}
