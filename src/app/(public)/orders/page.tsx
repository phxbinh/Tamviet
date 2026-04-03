/*"use client";

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
      <h1 className="text-2xl font-bold">Your Orders: {orders.length} đơn</h1>

      {orders.map((order) => (
        <Link
            key={order.id}
            href={`/orders/${order.id}`} prefetch={true}
            className="block border p-4 rounded-xl hover:bg-gray-50 transition"
        >

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
        </Link>
      ))}
    </div>
  );
}
*/


"use client";

import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";
import { ShoppingBag, Calendar, CreditCard, ChevronRight } from "lucide-react";
import SkeletonOrders from "./SkeletonOrders";


export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <SkeletonOrders />;

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center border-2 border-dashed border-border rounded-3xl text-muted-foreground mt-10">
        <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
        <p>Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Đơn hàng của bạn</h1>
          <p className="text-sm opacity-60 mt-1">Quản lý và theo dõi lịch sử mua hàng</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-2xl shadow-sm self-start">
          <span className="font-bold text-primary">{orders.length}</span> đơn hàng
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm animate-in fade-in">
        {/* VIEW CHO DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636] text-black"> {/* Giữ màu vàng đặc trưng của shop */}
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Mã đơn</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Ngày đặt</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Trạng thái</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Tổng tiền</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-background/50 transition-colors group">
                  <td className="p-5">
                    <span className="font-mono font-bold opacity-80 group-hover:text-primary">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-5 text-sm opacity-70">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      order.status === 'completed' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-black text-primary text-lg">
                    {Number(order.total_price).toLocaleString()}đ
                  </td>
                  <td className="p-5 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      prefetch={true}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs font-bold rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Chi tiết <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW CHO MOBILE */}
        <div className="md:hidden divide-y divide-border">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block p-5 hover:bg-muted/50 active:bg-muted transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <p className="font-black text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <div className="flex items-center gap-1 text-[10px] opacity-50 uppercase font-bold tracking-widest">
                    <Calendar size={10} />
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg leading-none">
                    {Number(order.total_price).toLocaleString()}đ
                  </p>
                  <span className="text-[10px] font-bold text-primary/70 uppercase">{order.status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                 <span className="text-[10px] opacity-40 italic">Click để xem chi tiết đơn hàng</span>
                 <ChevronRight size={16} className="text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}




  








