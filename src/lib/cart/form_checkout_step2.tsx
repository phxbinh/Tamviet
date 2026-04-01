"use client";

import { checkoutAction } from "./checkout_step2";

export function CheckoutForm() {
  return (
    <form action={checkoutAction} className="border p-4 rounded-xl space-y-3">
      <h2 className="font-semibold">Thông tin nhận hàng</h2>

      <input
        name="fullName"
        placeholder="Tên"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="phone"
        placeholder="SĐT"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="addressLine1"
        placeholder="Địa chỉ"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="city"
        placeholder="Thành phố"
        className="w-full border p-2 rounded"
        required
      />

      <button className="w-full bg-green-600 text-white py-2 rounded">
        Xác nhận đặt hàng
      </button>
    </form>
  );
}