"use client";

import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <div className="p-6">Loading...</div>;

  if (orders.length === 0) {
    return <div className="p-6">No orders yet</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Orders</h1>

      {orders.map((order) => (
        <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block border p-4 rounded-xl hover:bg-gray-50 transition"
        >
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold capitalize">
                {order.status}
              </p>
              <p className="text-lg font-bold">
                {Number(order.total_price).toLocaleString()}đ
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
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
        </Link>
      ))}
    </div>
  );
}






  








