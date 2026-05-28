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
  // 1. Thực thi thuật toán lõi tính toán động học
  const reportMarkdown = useMemo(() => {
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

    // Chuỗi dữ liệu Markdown phẳng, sử dụng cặp $$ đối xứng tuyệt đối cho khối phương trình
    return `
# BÁO CÁO THUYẾT MINH THIẾT KẾ BỂ SINH HỌC HIẾU KHÍ AEROTANK
*Hệ thống tính toán tự động dựa trên tiêu chuẩn thiết kế quốc tế QCVN & Metcalf_Eddy.*

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

$$\\text{S} = \\frac{K_s \\cdot [1 + b_H \\cdot (\\text{SRT})]}{\\text{SRT} \\cdot (Y_H \\cdot k - b_H) - 1}$$

* Kết quả tính toán động học: $S =$ **${s_eff.toFixed(1)}** $\\text{mg/L bCOD}$

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
Hiệu chỉnh điều kiện vận hành thực tế tại cao độ ${elevation} $\\text{m}$ về điều kiện tiêu chuẩn mặt nước biển:

$$\\text{Air flowrate} = \\frac{\\text{SOTR}}{\\text{OTE} \\times 60 \\times (0.2318 \\times \\rho_{\\text{air}})}$$

* Tốc độ truyền oxy tiêu chuẩn yêu cầu ($\\text{SOTR}$): **${sotr_kg_h.toFixed(1)}** $\\text{kg O}_2/\\text{giờ}$
* **LƯU LƯỢNG KHÔNG KHÍ THỰC TẾ CẦN THỔI:** 🚀 **${air_flowrate_m3_min.toFixed(1)}** $\\text{m}^3/\\text{phút}$
`;
  }, [data]);

  // 2. Custom Components Map: Định nghĩa padding, margin và phong cách cho từng thẻ HTML được sinh ra từ Markdown
  const markdownComponents = useMemo(() => ({
    h1: ({ children }: any) => (
      <h1 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-900 mt-2 mb-4 uppercase border-b border-neutral-200 pb-3 leading-snug">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-base sm:text-lg font-medium tracking-wide text-neutral-800 mt-8 mb-4 border-l-2 border-neutral-900 pl-3 uppercase">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mt-6 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-sm text-neutral-600 leading-relaxed my-3">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 my-3 space-y-2 text-sm text-neutral-600">
        {children}
      </ul>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    hr: () => <hr className="my-8 border-t border-neutral-200/60" />,
    // Tinh chỉnh riêng khoảng cách (Padding/Margin) cho khối công thức toán học lớn ($$...$$)
/*
    div: ({ className, children }: any) => {
      if (className?.includes("math-display")) {
        return (
          <div className="my-6 p-4 sm:p-6 bg-neutral-50 border border-neutral-100 rounded-lg overflow-x-auto text-neutral-900 flex justify-center items-center shadow-xs scrollbar-thin">
            {children}
          </div>
        );
      }
      return <div className={className}>{children}</div>;
    },
    // Tinh chỉnh riêng cho công thức toán học nhỏ nằm trên dòng ($...$)
    span: ({ className, children }: any) => {
      if (className?.includes("math-inline")) {
        return <span className="px-1 py-0.5 bg-neutral-100/60 text-neutral-900 rounded font-mono text-[13px]">{children}</span>;
      }
      return <span className={className}>{children}</span>;
    }
*/

    // Tinh chỉnh riêng khoảng cách và cấu trúc hiển thị cho khối công thức toán học lớn ($$...$$)
    div: ({ className, children }: any) => {
      if (className?.includes("math-display")) {
        return (
          <div className="my-8 p-5 bg-neutral-50 border border-neutral-100 rounded-xl overflow-x-auto text-neutral-950 text-center block clear-both scrollbar-none">
            <span className="inline-block min-w-full text-base sm:text-lg md:text-xl py-2 leading-relaxed tracking-wide dynamic-katex-block">
              {children}
            </span>
          </div>
        );
      }
      return <div className={className}>{children}</div>;
    },
    // Tinh chỉnh riêng cho công thức toán học nhỏ nằm trên dòng ($...$) để tránh đè chữ
    span: ({ className, children }: any) => {
      if (className?.includes("math-inline")) {
        return (
          <span className="px-1.5 py-0.5 bg-neutral-100/70 text-neutral-900 rounded font-mono text-[13px] inline-block align-middle whitespace-nowrap mx-0.5">
            {children}
          </span>
        );
      }
      return <span className={className}>{children}</span>;
    }



  }), []);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans selection:bg-neutral-200">
      <div className="max-w-3xl mx-auto bg-white border border-neutral-200/60 shadow-xs rounded-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-neutral-900 text-white flex justify-between items-center border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">Phúc An Lab System</span>
            <h2 className="text-base font-light tracking-wide text-neutral-100 mt-0.5">Biện Luận Kỹ Thuật Bể Sinh Học</h2>
          </div>
          <div className="px-2.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full">
            M&E v5 Standard
          </div>
        </div>

        {/* Khối Render Markdown kết hợp Custom Padding & Margin */}
        <div className="px-6 sm:px-10 py-8">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {reportMarkdown}
          </ReactMarkdown>
        </div>

        {/* Khối Cảnh báo Expert RAG Box */}
        <div className="mx-6 sm:mx-10 mb-10 p-4 bg-neutral-50 border-l border-neutral-900 rounded-r-md">
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
