import { pool } from "@/lib/db/pg";
import { getCurrentUser } from "@/lib/authActions/getUser";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await context.params;

    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestId = cookieStore.get("guest_id")?.value;

    const orderRes = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      AND (
        (user_id = $2 AND $2 IS NOT NULL)
        OR
        (guest_id = $3 AND $3 IS NOT NULL)
      )
      LIMIT 1
      `,
      [id, user?.id ?? null, guestId ?? null]
    );

    if (orderRes.rows.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderRes.rows[0];

/*
    const itemsRes = await client.query(
      `
      SELECT 
        oi.variant_id,
        oi.quantity,
        oi.price_at_time,
        p.name,
        p.slug
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE oi.order_id = $1
      `,
      [id]
    );
*/

const itemsRes = await client.query(
  `
  SELECT 
    oi.variant_id,
    oi.quantity,
    oi.price_at_time,
    p.name,
    p.slug,

    -- 👇 thêm ảnh
    img.image_url as image_item

  FROM order_items oi

  JOIN product_variants pv 
    ON pv.id = oi.variant_id

  JOIN products p 
    ON p.id = pv.product_id

  -- 👇 lấy đúng 1 ảnh
  LEFT JOIN LATERAL (
    SELECT image_url
    FROM product_images
    WHERE 
      variant_id = pv.id
      OR (product_id = p.id AND variant_id IS NULL)
    ORDER BY 
      (variant_id IS NOT NULL) DESC,
      id ASC
    LIMIT 1
  ) img ON true

  WHERE oi.order_id = $1
  `,
  [id]
);

    return Response.json({
      ...order,
      items: itemsRes.rows,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}