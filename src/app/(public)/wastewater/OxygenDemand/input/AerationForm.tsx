import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aerotankInputsSchema, AerotankInputs } from "./schema";

interface Props {
  defaultData: AerotankInputs;
  onSubmitData: (data: AerotankInputs) => void;
}

export default function AerotankForm({ defaultData, onSubmitData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AerotankInputs>({
    resolver: zodResolver(aerotankInputsSchema),
    defaultValues: defaultData,
  });

  const onSubmit = (data: AerotankInputs) => {
    onSubmitData(data);
  };

  // Helper render ô input nhanh gọn
  const renderInput = (name: keyof AerotankInputs, label: string, unit: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label} ({unit})</label>
      <input
        type="number"
        step="any"
        {...register(name, { valueAsNumber: true })}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {errors[name] && (
        <span className="text-xs text-red-500 font-medium">{errors[name]?.message}</span>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Nhập Thông Số Thiết Kế Aerotank</h2>

      {/* Nhóm 1: Nước thải & Vận hành */}
      <div>
        <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">1. Nước thải & Vận hành chính</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderInput("q", "Lưu lượng dòng vào (q)", "m³/d")}
          {renderInput("s_0", "BOD vào (s_0)", "mg/L")}
          {renderInput("temp", "Nhiệt độ (temp)", "°C")}
          {renderInput("x_tss", "Nồng độ bùn hoạt tính (x_tss)", "mg/L")}
          {renderInput("srt", "Thời gian lưu bùn (srt)", "ngày")}
          {renderInput("bcod_bod_ratio", "Tỷ lệ bCOD/BOD", "lần")}
        </div>
      </div>

      <hr />

      {/* Nhóm 2: Hệ số vi sinh */}
      <div>
        <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">2. Động học vi sinh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderInput("mu_max", "Tốc độ sinh trưởng max (μ_max)", "1/d")}
          {renderInput("k_s", "Hằng số nửa tốc độ (k_s)", "mg/L")}
          {renderInput("y_h", "Hệ số sản lượng (y_h)", "g/g")}
          {renderInput("b_h", "Hệ số nội bào (b_h)", "1/d")}
          {renderInput("f_d", "Phần bùn trơ (f_d)", "đơn vị")}
        </div>
      </div>

      <hr />

      {/* Nhóm 3: Sục khí & Hiện trường */}
      <div>
        <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">3. Hệ thống sục khí & Địa hình</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderInput("alpha", "Hệ số Alpha (α)", "đơn vị")}
          {renderInput("beta", "Hệ số Beta (β)", "đơn vị")}
          {renderInput("f_factor", "Hệ số bám bẩn (F-factor)", "đơn vị")}
          {renderInput("elevation", "Độ cao so với mực nước biển", "m")}
          {renderInput("depth_sat", "Chiều sâu đặt thiết bị sục khí", "m")}
          {renderInput("ote", "Hiệu suất chuyển oxy chuẩn (OTE)", "%")}
          {renderInput("do_target", "DO mục tiêu trong bể", "mg/L")}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow"
        >
          Cập nhật thông số & Tính toán
        </button>
      </div>
    </form>
  );
}
