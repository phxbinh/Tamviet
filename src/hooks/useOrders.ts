/*
"use client";
import { useEffect, useState } from "react";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, fetchOrders };
}
*/


"use client";
import { getOrdersAction } from "./testServerAction_useOrders";
import { useEffect, useState } from "react";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      // Gọi trực tiếp Server Action như một hàm async bình thường
      const res = await getOrdersAction();

      if (res.success) {
        setOrders(res.data || []);
      } else {
        // Xử lý lỗi trả về từ server (nếu có)
        setError(res.error || "Có lỗi xảy ra khi tải đơn hàng");
      }
    } catch (err) {
      console.error("Client Error:", err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, fetchOrders };
}







/*
Responsive shape
type Order = {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  items: {
    variant_id: string;
    quantity: number;
    price_at_time: number;
    name: string;
    slug: string;
  }[];
};
*/