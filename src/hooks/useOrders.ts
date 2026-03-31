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