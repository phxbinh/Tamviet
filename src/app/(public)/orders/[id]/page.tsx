/*
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
*/
// src/app/(public)/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailSkeleton from "@/components/order/OrderDetailSkeleton";

export default function OrderDetailPage() {
  const params = useParams(); // Next 13 App Router hook
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AnimatePresence mode="wait">
      {loading || !order ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <OrderDetailSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key={order.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-4xl mx-auto p-6 space-y-6"
        >
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
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="border rounded-xl p-4 space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.variant_id}
                className="flex justify-between border p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p>{Number(item.price_at_time).toLocaleString()}đ</p>
                  <p className="font-semibold">
                    {(item.price_at_time * item.quantity).toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="border rounded-xl p-4 flex justify-between">
            <span>Total</span>
            <span className="font-bold text-lg">
              {Number(order.total_price).toLocaleString()}đ
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




//export default
function OrderDetailPage_() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    fetch(`/api/order/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setOrder(data);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setOrder(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!order || order.error) {
    return <div className="p-6">Order not found</div>;
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
  };

  const steps = ["pending", "paid", "shipped", "completed"];

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
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColor[order.status] || "bg-gray-100"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* TIMELINE (xịn hơn bản cũ) */}
      <div className="border rounded-xl p-4">
        <p className="font-semibold mb-3">Order Status</p>

        <div className="flex justify-between text-sm">
          {steps.map((step) => {
            const isActive = step === order.status;

            return (
              <div
                key={step}
                className={`flex flex-col items-center flex-1 ${
                  isActive ? "text-black font-semibold" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mb-1 ${
                    isActive ? "bg-black" : "bg-gray-300"
                  }`}
                />
                {step}
              </div>
            );
          })}
        </div>
      </div>

      {/* ITEMS */}
      <div className="border rounded-xl p-4 space-y-4">
        <p className="font-semibold">Items</p>

        {order.items?.map((item: any) => (
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
                {(
                  Number(item.price_at_time) * item.quantity
                ).toLocaleString()}
                đ
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