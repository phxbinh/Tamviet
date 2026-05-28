"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export interface AerotankInputs {
  q: number;
  s_0: number;
  temp: number;
  x_tss: number;
  srt: number;
  bcod_bod_ratio: number;
  alpha: number;
  f_factor: number;
  beta: number;
  elevation: number;
  depth_sat: number;
  ote: number;
  do_target: number;
  mu_max: number;
  k_s: number;
  y_h: number;
  b_h: number;
  f_d: number;
}

interface AerotankReportViewProps {
  data: AerotankInputs;
}

export const AerotankReportView: React.FC<AerotankReportViewProps> = ({ data }) => {
  const calculations = useMemo(() => {
    const {
      q, s_0, temp, x_tss, srt, bcod_bod_ratio,
      alpha, f_factor, beta, elevation, depth_sat, ote, do_target,
      mu_max, k_s, y_h, b_h, f_d
    } = data;

    const k_rate = mu_max / y_h;
    const s_eff = (k_s * (1 + b_h * srt)) / (srt * (y_h * k_rate - b_h) - 1);

    const term1 = (q * y_h * (s_0 - s_eff) * srt) / ((1 + b_h * srt) * 0.85 * x_tss);
    const term2 = (f_d * b_h * q * y_h * (s_0 - s_eff) * Math.pow(srt, 2)) / ((1 + b_h * srt) * 0.85 * x_tss);
    const v_tank = term1 + term2;
    const tau_days = v_tank / q;
    const tau_hours = tau_days * 24;

    const p_x_bio = (0.85 * x_tss * v_tank) / srt;
    const r_o_day = q * (s_0 - s_eff) - 1.42 * p_x_bio;
    const aotr_kg_h = (r_o_day / 1000) / 24;

    const p_x_tss_kg = (x_tss * v_tank / srt) / 1000;
    const sbod_eff = s_eff / bcod_bod_ratio;

    const p_b_over_p_s = Math.exp(-(9.81 * 28.97 * elevation) / (8314 * (273.15 + temp)));
    const c_inf_20 = 9.09 * (10.33 + depth_sat) / 10.33;
    const c_s_t_over_c_inf_20 = 10.08 / 9.09;

    const numerator = c_inf_20;
    const denominator = ((beta * p_b_over_p_s * c_s_t_over_c_inf_20 * c_inf_20) - do_target) * alpha * f_factor * Math.pow(1.024, (temp - 20));
    const sotr_over_aotr = numerator / denominator;
    const sotr_kg_h = aotr_kg_h * sotr_over_aotr;

    const rho_air_altitude = p_b_over_p_s * 1.225;
    const o2_per_m3_air = 0.2318 * rho_air_altitude;
    const air_flowrate_m3_min = sotr_kg_h / (ote * 60 * o2_per_m3_air);

    return {
      q, s_0, temp, x_tss, srt, s_eff, v_tank, tau_days, tau_hours,
      r_o_day, aotr_kg_h, p_x_tss_kg, sbod_eff, elevation, sotr_kg_h, air_flowrate_m3_min
    };
  }, [data]);

  // Khởi tạo chuỗi văn bản Markdown phẳng, tách biệt hoàn toàn các cấu trúc toán học phức tạp
  const reportMarkdown = useMemo(() => {
    const c = calculations;
    return `
# BÁO CÁO THUYẾT MINH THIẾT KẾ BỂ SINH HỌC HIẾU KHÍ AEROTANK
*Hệ thống tính toán tự động dựa trên tiêu chuẩn thiết kế quốc tế QCVN & Metcalf_Eddy.*

---

## I. Thông số thiết kế đầu vào

### 1. Chỉ tiêu ô nhiễm nước thải đầu vào
* Lưu lượng nước thải sinh hóa (Q): **${c.q.toLocaleString()}** m³/ngày
* Hàm lượng bCOD ô nhiễm đầu vào (S₀): **${c.s_0.toLocaleString()}** mg/L
* Nồng độ bùn sinh khối hỗn hợp thiết kế (X_TSS): **${c.x_tss.toLocaleString()}** mg/L
* Thời gian lưu bùn sinh học lựa chọn (SRT): **${c.srt}** ngày
* Nhiệt độ nước thải tính toán (T): **${c.temp}** °C

---

## II. Kết quả phân tích động học hệ thống

### Bước 1: Hàm lượng chất hữu cơ bCOD còn lại ở dòng ra (S)
Áp dụng phương trình cân bằng nồng độ cơ chất giới hạn tăng trưởng:

$$S = \\frac{K_s \\cdot [1 + b_H \\cdot SRT]}{SRT \\cdot (Y_H \\cdot k - b_H) - 1}$$

* Kết quả tính toán động học: S = **${c.s_eff.toFixed(1)}** mg/L bCOD

### Bước 2: Xác định kích thước hình học bể Aerotank
Tính toán thể tích vùng phản ứng dựa trên cả lượng bùn hoạt tính sinh ra và phần bùn trơ tích lũy:

$$V = \\frac{Q \\cdot Y_H \\cdot (S_0 - S) \\cdot SRT}{[1 + b_H \\cdot SRT] \\cdot 0.85 \\cdot X_{TSS}} + \\frac{f_d \\cdot b_H \\cdot Q \\cdot Y_H \\cdot (S_0 - S) \\cdot SRT^2}{[1 + b_H \\cdot SRT] \\cdot 0.85 \\cdot X_{TSS}}$$

* **Thể tích bể cần xây dựng (V):** ✨ **${c.v_tank.toFixed(1)}** m³
* **Thời gian lưu nước thủy lực (tau):** **${c.tau_days.toFixed(2)}** ngày (Tương đương **${c.tau_hours.toFixed(1)}** giờ)

### Bước 3: Nhu cầu hấp thụ Oxy sinh học thực tế (R_o)
Lượng oxy cần cấp để vi sinh vật dị dưỡng oxy hóa chất hữu cơ và tự hủy nội bào:

$$R_o = Q \\cdot (S_0 - S) - 1.42 \\cdot P_{X,bio}$$

* Nhu cầu hấp thụ thực tế hàng ngày: **${(c.r_o_day / 1000).toFixed(0)}** kg O₂/ngày
* Nhu cầu hấp thụ trung bình mỗi giờ (AOTR): **${c.aotr_kg_h.toFixed(1)}** kg O₂/giờ

### Bước 4: Khối lượng sinh khối bùn dư xả thải mỗi ngày
Lượng bùn hoạt tính dư cần rút ra khỏi hệ thống để duy trì tuổi bùn:

$$P_{X,TSS} = \\frac{X_{TSS} \\cdot V}{SRT}$$

* Khối lượng bùn khô phát sinh (P_X_TSS): **${c.p_x_tss_kg.toFixed(0)}** kg TSS/ngày

### Bước 5: Đánh giá chất lượng dòng ra theo chỉ tiêu hiệu suất sBOD
* Hàm lượng BOD hòa tan đầu ra (sBOD): **${c.sbod_eff.toFixed(1)}** mg/L
* Hiệu suất loại bỏ chất hữu cơ hòa tan của hệ thống: 📈 **${((1 - c.s_eff / c.s_0) * 100).toFixed(2)}%**

### Bước 6: Thiết kế hệ thống phân phối khí mịn (Fine Bubble Diffusers)
Hiệu chỉnh điều kiện vận hành thực tế tại cao độ ${c.elevation} m về điều kiện tiêu chuẩn mặt nước biển:

$$\\text{Air flowrate} = \\frac{\\text{SOTR}}{\\text{OTE} \\cdot 60 \\cdot (0.2318 \\cdot \\rho_{\\text{air}})}$$

* Tốc độ truyền oxy tiêu chuẩn yêu cầu (SOTR): **${c.sotr_kg_h.toFixed(1)}** kg O₂/giờ
* **LƯU LƯỢNG KHÔNG KHÍ THỰC TẾ CẦN THỔI:** 🚀 **${c.air_flowrate_m3_min.toFixed(1)}** m³/phút
`;
  }, [calculations]);

  // Cấu hình các khối thẻ HTML an toàn, chặn hoàn toàn xung đột Layout trên Safari iOS
  const markdownComponents = useMemo(() => ({
    h1: ({ children }: any) => <h1 className="text-xl font-light tracking-wide text-neutral-950 mt-4 mb-4 uppercase border-b border-neutral-200/80 pb-3">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-semibold tracking-wide text-neutral-900 mt-8 mb-4 border-l-2 border-neutral-900 pl-3 uppercase">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-bold text-neutral-950 mt-5 mb-2">{children}</h3>,
    p: ({ children }: any) => <p className="text-sm text-neutral-600 leading-relaxed my-2.5">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc pl-5 my-3 space-y-1.5 text-sm text-neutral-600">{children}</ul>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="my-6 border-t border-neutral-200/60" />,
    // Thẻ div cô lập cấu hình toán học block khỏi hệ thống bố cục tự động
    div: ({ className, children }: any) => {
      if (className?.includes("math-display")) {
        return (
          <div className="my-6 p-4 bg-neutral-50 border border-neutral-100 rounded-xl overflow-x-auto text-neutral-900 text-center block clear-both scrollbar-none">
            <div className="inline-block min-w-full text-sm sm:text-base py-1 text-left sm:text-center whitespace-nowrap antialiased tracking-normal">
              {children}
            </div>
          </div>
        );
      }
      return <div className={className}>{children}</div>;
    }
  }), []);

  return (
    <div className="min-h-screen bg-neutral-50/40 py-4 sm:py-10 px-2 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-neutral-200/60 shadow-xs rounded-xl overflow-hidden">
        
        {/* Header Cao Cấp */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">Phúc An Lab System</span>
            <h2 className="text-base font-light tracking-wide text-neutral-100 mt-0.5">Biện Luận Kỹ Thuật Bể Sinh Học</h2>
          </div>
          <div className="px-2.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full">
            Metcalf & Eddy Standard
          </div>
        </div>

        {/* Khối Render Báo Cáo */}
        <div className="px-5 sm:px-10 py-6">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {reportMarkdown}
          </ReactMarkdown>
        </div>

        {/* Khối Thông Tin Vận Hành */}
        <div className="mx-5 sm:mx-10 mb-8 p-4 bg-neutral-50 border-l border-neutral-900 rounded-r-md">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">⚠️</span>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">Khuyến nghị vận hành từ AI Agent</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Hệ thống yêu cầu lưu lượng khí duy trì liên tục để đáp ứng nồng độ 
                <span className="font-semibold text-neutral-800"> DO = {data.do_target.toFixed(1)} mg/L</span>. 
                Nếu lưu lượng sục khí thực tế tụt dưới ngưỡng tính toán, hiệu suất xử lý bCOD sẽ sụt giảm cục bộ, gây nguy cơ phá vỡ cấu trúc vi sinh.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
