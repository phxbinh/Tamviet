"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from 'remark-gfm';

// 1. Định nghĩa Interface cấu trúc dữ liệu đầu vào chuẩn hóa
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
  // 2. Sử dụng useMemo để tính toán toán học phía Client-side, tối ưu hiệu năng Core Web Vitals
  const reportMarkdown = useMemo(() => {
    const {
      q, s_0, temp, x_tss, srt, bcod_bod_ratio,
      alpha, f_factor, beta, elevation, depth_sat, ote, do_target,
      mu_max, k_s, y_h, b_h, f_d
    } = data;

    // --- Thực thi thuật toán lõi từ dữ liệu mẫu Metcalf & Eddy 8-22 ---
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

    // 3. Khởi tạo chuỗi dữ liệu Markdown + Biến số động
    return `
# BÁO CÁO THUYẾT MINH THIẾT KẾ BỂ SINH HỌC HIẾU KHÍ AEROTANK
*Hệ thống tính toán tự động dựa trên tiêu chuẩn thiết kế quốc tế Metcalf & Eddy.*

---

## I. Thông số thiết kế đầu vào

### 1. Chỉ tiêu ô nhiễm nước thải đầu vào
* Lưu lượng nước thải sinh hóa ($Q$): **${q.toLocaleString()}** $\\text{m}^3/\\text{ngày}$
* Hàm lượng bCOD ô nhiễm đầu vào ($S_0$): **${s_0.toLocaleString()}** $\\text{mg/L}$
* Nồng độ bùn sinh khối hỗn hợp thiết kế ($X_{\\text{TSS}}$): **${x_tss.toLocaleString()}** $\\text{mg/L}$
* Thời gian lưu bùn sinh học lựa chọn ($\\text{SRT}$): **${srt}** $\\text{ngày}$
* Nhiệt độ nước thải tính toán ($T$): **${temp}** $^\\circ\\text{C}$

### 2. Các hệ số động học vi sinh
* Tốc độ sinh trưởng riêng tối đa ($\\mu_{\\text{max}}$): **${mu_max}** $\\text{g VSS/g VSS}\\cdot\\text{d}$
* Hằng số bán tốc độ ($K_s$): **${k_s}** $\\text{mg/L}$
* Hệ số sản lượng vi sinh vật dị dưỡng ($Y_H$): **${y_h}** $\\text{g VSS/g bCOD}$
* Hệ số phân hủy nội bào tự hủy của bùn ($b_H$): **${b_h}** $\\text{g VSS/g VSS}\\cdot\\text{d}$

---

## II. Kết quả phân tích động học hệ thống

### Bước 1: Hàm lượng chất hữu cơ bCOD còn lại ở dòng ra ($S$)
Áp dụng phương trình cân bằng nồng độ cơ chất giới hạn tăng trưởng:
$$S = \\frac{K_s \\cdot [1 + b_H \\cdot (\\text{SRT})]}{\\text{SRT} \\cdot (Y_H \\cdot k - b_H) - 1}$$

* Kết quả: $S =$ **${s_eff.toFixed(1)}** $\\text{mg/L bCOD}$

### Bước 2: Xác định kích thước hình học bể Aerotank
Tính toán thể tích vùng phản ứng dựa trên cả lượng bùn hoạt tính sinh ra và phần bùn trơ tích lũy:
$$V = \\frac{Q \\cdot Y_H \\cdot (S_0 - S) \\cdot \\text{SRT}}{[1 + b_H \\cdot (\\text{SRT})] \\cdot 0.85 \\cdot X_{\\text{TSS}}} + \\frac{f_d \\cdot b_H \\cdot Q \\cdot Y_H \\cdot (S_0 - S) \\cdot \\text{SRT}^2}{[1 + b_H \\cdot (\\text{SRT})] \\cdot 0.85 \\cdot X_{\\text{TSS}}}$$

* **Thể tích bể cần xây dựng ($V$):** ✨ **${v_tank.toFixed(1)}** $\\text{m}^3$
* **Thời gian lưu nước thủy lực ($\\tau$):** **${tau_days.toFixed(2)}** $\\text{ngày}$ (Tương đương **${tau_hours.toFixed(1)}** $\\text{giờ}$)

### Bước 3: Nhu cầu hấp thụ Oxy sinh học thực tế ($R_o$)
Lượng oxy cần cấp để vi sinh vật dị dưỡng oxy hóa chất hữu cơ và tự hủy nội bào:
$$R_o = Q \\cdot (S_0 - S) - 1.42 \\cdot P_{X,\\text{bio}}$$

* Nhu cầu hấp thụ thực tế hàng ngày: **${(r_o_day / 1000).toFixed(0)}** $\\text{kg O}_2/\\text{ngày}$
* Nhu cầu hấp thụ trung bình mỗi giờ ($\\text{AOTR}$): **${aotr_kg_h.toFixed(1)}** $\\text{kg O}_2/\\text{giờ}$

### Bước 4: Khối lượng sinh khối bùn dư xả thải mỗi ngày
Lượng bùn hoạt tính dư cần rút ra khỏi hệ thống để duy trì tuổi bùn $\\text{SRT} = ${srt}\\,\\text{ngày}$:
$$P_{X,\\text{TSS}} = \\frac{X_{\\text{TSS}} \\cdot V}{\\text{SRT}}$$

* Khối lượng bùn khô phát sinh ($P_{X,\\text{TSS}}$): **${p_x_tss_kg.toFixed(0)}** $\\text{kg TSS/ngày}$

### Bước 5: Đánh giá chất lượng dòng ra theo chỉ tiêu hiệu suất sBOD
* Hàm lượng BOD hòa tan đầu ra ($sBOD$): **${sbod_eff.toFixed(1)}** $\\text{mg/L}$
* Hiệu suất loại bỏ chất hữu cơ hòa tan của hệ thống: 📈 **${((1 - s_eff / s_0) * 100).toFixed(2)}%**

### Bước 6: Thiết kế hệ thống phân phối khí mịn (Fine Bubble Diffusers)
Hiệu chỉnh điều kiện vận hành thực tế tại cao độ ${elevation}m về điều kiện tiêu chuẩn tiêu chuẩn mặt nước biển:
$$\\text{Air flowrate} = \\frac{\\text{SOTR}}{\\text{OTE} \\cdot 60 \\cdot (0.2318 \\cdot \\rho_{\\text{air}})}$$

* Tốc độ truyền oxy tiêu chuẩn yêu cầu ($\\text{SOTR}$): **${sotr_kg_h.toFixed(1)}** $\\text{kg O}_2/\\text{giờ}$
* **LƯU LƯỢNG KHÔNG KHÍ THỰC TẾ CẦN THỔI:** 🚀 **${air_flowrate_m3_min.toFixed(1)}** $\\text{m}^3/\\text{phút}$
`;
  }, [data]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-100">
      <div className="max-w-4xl mx-auto bg-white border border-neutral-200/80 shadow-sm rounded-xl overflow-hidden">
        
        {/* Header Giao diện cao cấp, tinh tế */}
        <div className="px-8 py-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Phúc An Engineering SaaS</span>
            <h2 className="text-xl font-light tracking-wide text-neutral-100 mt-0.5">Bản Thuyết Minh Thiết Kế Aerotank</h2>
          </div>
          <div className="px-3 py-1 text-xs font-medium bg-neutral-700/50 text-neutral-300 border border-neutral-600 rounded-full backdrop-blur-xs">
            Metcalf & Eddy v5 Standard
          </div>
        </div>

        {/* Nội dung báo cáo render qua ReactMarkdown */}
        <div className="p-8 sm:p-10">
          <article className="prose prose-neutral max-w-none prose-headings:font-light prose-h1:text-2xl prose-h1:text-neutral-900 prose-h2:text-xl prose-h2:border-b prose-h2:border-neutral-100 prose-h2:pb-2 prose-strong:font-semibold prose-strong:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkMath, remarkGfm]} 
              rehypePlugins={[rehypeKatex]}
            >
              {reportMarkdown}
            </ReactMarkdown>
          </article>
        </div>

        {/* Khối Cảnh báo AI Agent (RAG Insight Box) mang phong cách luxury tối giản */}
        <div className="mx-8 mb-10 p-5 bg-neutral-50 border-l-2 border-neutral-900 rounded-r-lg">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">⚠️</span>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Khuyến nghị vận hành từ Expert Agent</h4>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Hệ thống yêu cầu lưu lượng khí duy trì liên tục để đáp ứng nồng độ{" "}
                <span className="font-medium text-neutral-900"> DO = {data.do_target.toFixed(1)} mg/L</span>. 
                Nếu lưu lượng sục khí thực tế tụt dưới ngưỡng tính toán, màng sinh khối sẽ xảy ra hiện tượng thiếu khí cục bộ, làm biến đổi cấu trúc bùn hoạt tính và gây ảnh hưởng nghiêm trọng đến hiệu suất xử lý bCOD của trạm.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
