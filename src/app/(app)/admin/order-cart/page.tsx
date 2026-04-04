import { auditCartAndOrders } from "@/lib/cart/auditCartOrder";
import { Section } from "./Section";

export default async function SystemHealthPage() {
  const data = await auditCartAndOrders();

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          System Health
        </h1>
        <p className="text-muted-foreground text-sm">
          Kiểm tra toàn bộ carts và orders
        </p>
      </div>

      <Section title="🛒 Cart Issues" data={data.carts} />
      <Section title="📦 Order Issues" data={data.orders} />
    </div>
  );
}