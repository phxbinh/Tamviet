"use client";

import { useEffect, useState } from "react";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!order || order.error) {
    return <div className="p-6">Order not found</div>;
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
  } as any;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      {/* TIMELINE (Shopee style fake) */}
      <div className="border rounded-xl p-4 space-y-4">
        <p className="font-semibold">Order Status</p>

        <div className="space-y-2 text-sm">
          <div>🟡 Pending</div>
          <div>🟢 Paid</div>
          <div>🔵 Shipped</div>
          <div>⚪ Completed</div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="border rounded-xl p-4 space-y-4">
        <p className="font-semibold">Items</p>

        {order.items.map((item: any) => (
          <div
            key={item.variant_id}
            className="flex justify-between border p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                x{item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p>
                {Number(item.price_at_time).toLocaleString()}đ
              </p>
              <p className="font-semibold">
                {(item.price_at_time * item.quantity).toLocaleString()}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold text-lg">
            {Number(order.total_price).toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  );
}