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
import { formatCurrency } from "@/utils/formatNumber"; // Giả định bạn có hàm này, nếu không dùng .toLocaleString()

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return (
    <div className="p-6 text-center animate-pulse font-medium">Đang tải danh sách đơn hàng...</div>
  );

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-3xl text-gray-400">
        Bạn chưa có đơn hàng nào.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-black text-gray-800">Đơn hàng của bạn</h1>
        <span className="bg-gray-100 px-4 py-1 rounded-full text-sm font-bold text-gray-600">
          {orders.length} đơn
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
        {/* VIEW CHO DESKTOP & TABLET */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636] text-gray-800">
                <th className="p-4 font-bold text-sm uppercase tracking-wider">Mã đơn hàng</th>
                <th className="p-4 font-bold text-sm uppercase tracking-wider">Ngày đặt</th>
                <th className="p-4 font-bold text-sm uppercase tracking-wider">Trạng thái</th>
                <th className="p-4 font-bold text-sm uppercase tracking-wider text-right">Tổng cộng</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-700">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-[#1D8252] text-lg">
                    {Number(order.total_price).toLocaleString()}đ
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      prefetch={true}
                      className="inline-block px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW CHO MOBILE (CHUYỂN THÀNH LIST) */}
        <div className="md:hidden divide-y divide-gray-100">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block p-5 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="text-sm font-black text-[#1D8252]">
                  {Number(order.total_price).toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Trạng thái: {order.status}
                 </span>
                 <span className="text-blue-600 text-xs font-bold">Xem chi tiết →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}




  








