"use client";

import React, { useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useReactToPrint } from "react-to-print";
import { AerotankInputs, AerotankOutputs } from "./cals";

interface AerotankReportViewProps {
  calculations: AerotankOutputs;
  rawInputs: AerotankInputs;
}

export const AerotankReportView: React.FC<AerotankReportViewProps> = ({ calculations, rawInputs }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Thuyet_Minh_Thiet_Ke_Aerotank_Metcalf_${Date.now()}`,
  });

  const reportMarkdown = useMemo(() => {
    const c = calculations;
    return `
# BÁO CÁO THUYẾT MINH THIẾT KẾ BỂ HOẠT TÍNH AEROTANK (XỬ LÝ NITƠ)
*Hệ thống tính toán tự động dựa trên tiêu chuẩn động học vi sinh quốc tế Metcalf & Eddy.*

---

## I. Thông số thiết kế đầu vào

### 1. Chỉ tiêu ô nhiễm & Đặc trưng dòng vào
* Lưu lượng nước thải thiết kế ($Q$): **${c.q.toLocaleString()}** m³/ngày
* Hàm lượng bCOD ô nhiễm đầu vào ($S_0$): **${c.s_0.toLocaleString()}** g/m³
* Hàm lượng Amoni dòng vào ($NH_4\text{-}N_{\\text{in}}$): **${c.nh4_in.toLocaleString()}** g/m³
* Nồng độ bùn sinh khối hỗn hợp khống chế ($X_{\\text{TSS}}$): **${rawInputs.x_tss.toLocaleString()}** g/m³
* Nhiệt độ nước thải tính toán ($T$): **${c.temp}** °C

---

## II. Các bước tính toán động học hệ thống

### Bước 1: Xác định tốc độ tăng trưởng và Tuổi lưu bùn (SRT)
Áp dụng phương trình tăng trưởng chất nền Monod kết hợp ảnh hưởng nồng độ Oxy hòa tan ($DO$) cho vi khuẩn tự dưỡng nitơ hóa:

$$\\mu_n = \\left( \\frac{\\mu_{n,\\text{max}} \\cdot [NH_4\\text{-}N]_e}{K_n + [NH_4\\text{-}N]_e} \\right) \\cdot \\left( \\frac{DO}{K_o + DO} \\right) - k_{dn}$$

* Tốc độ tăng trưởng thực tế của vi khuẩn Nitơ hóa ($\\mu_n$): **${c.mu_n.toFixed(3)}** d⁻¹
* Thời gian lưu bùn lý thuyết ($SRT_{\\text{theo}}$): **${c.srt_theoretical.toFixed(1)}** ngày
* **Thời gian lưu bùn thiết kế hiệu chỉnh ($SRT_{\\text{design}}$):** ✨ **${c.srt_design.toFixed(1)}** ngày (Hệ số an toàn: ${rawInputs.safety_factor})

### Bước 2: Xác định lượng sinh khối tổng hợp ($P_{\\text{bio}}$)
Lượng sinh khối sinh ra từ sự tổng hợp của vi khuẩn dị dưỡng, mảnh vỡ nội bào tự hủy và tế bào nitơ hóa:

$$P_{\\text{bio}} = \\frac{QY(S_0 - S)}{1 + k_d \\cdot SRT} + \\frac{f_d k_d QY(S_0 - S)SRT}{1 + k_d \\cdot SRT} + \\frac{QY_n(NH_4\\text{-}N_{\\text{in}})}{1 + k_{dn} \\cdot SRT}$$

* Tổng sinh khối tổng hợp phát sinh hoạt tính: **${c.p_bio.toFixed(1)}** kg VSS/ngày

### Bước 3: Hàm lượng Nitơ bị oxy hóa sinh học ($NO_x\\text{-}N$)
Lượng Amoni chuyển hóa thành dạng Nitrat sau khi trừ đi lượng Nitơ đồng hóa vào tế bào vi sinh:

$$NO_x\\text{-}N = (NH_4\\text{-}N)_{\\text{in}} - (NH_4\\text{-}N)_e - 0.12 \\cdot \\frac{P_{\\text{bio, g}}}{Q}$$

* Hàm lượng Nitơ chuyển hóa thành Nitrat: **${c.no_x_n.toFixed(2)}** g/m³

### Bước 4: Khối lượng cặn xả cặn bùn dư hàng ngày
* Lượng bùn dư tính theo trạng thái hữu cơ ($P_{\\text{VSS}}$): **${c.p_vss.toFixed(1)}** kg VSS/ngày
* **Tổng lượng bùn khô xả thải ra ngoài ($P_{\\text{TSS}}$):** **${c.p_tss.toFixed(1)}** kg TSS/ngày

### Bước 5: Tính toán kích thước hình học bể phản ứng
Thể tích vùng sục khí được tính toán trực tiếp dựa trên tổng khối lượng sinh khối cần duy trì:

$$V = \\frac{P_{\\text{TSS}} \\cdot SRT \\cdot 1000}{X_{\\text{TSS}}}$$

* **THỂ TÍCH BỂ AEROTANK YÊU CẦU ($V$):** 📐 **${c.v_tank.toFixed(0)}** m³
* **Thời gian lưu nước thủy lực ($HRT$):** **${c.hrt_hours.toFixed(1)}** giờ

### Bước 6: Kiểm tra tải trọng vận hành hệ thống
* Tỷ số F/M (Thức ăn/Vi sinh vật): **${c.f_m_ratio.toFixed(2)}** g BOD/g VSS·ngày
* Tải trọng thể tích hữu cơ chất nền: **${c.volumetric_loading.toFixed(2)}** kg BOD/m³·ngày
* Tỷ lệ tuần hoàn bùn hoạt tính yêu cầu ($R$): **${(c.sludge_return_ratio * 100).toFixed(0)}%**

### Bước 7: Nhu cầu hấp thụ Oxy sinh học thực tế ($R_o$)
Lượng oxy cần thiết cung cấp đồng thời cho quá trình khử chất hữu cơ cacbon và nitơ hóa:

$$R_o = Q(S_0 - S) - 1.42 \\cdot P_{\\text{bio}} + 4.33 \\cdot Q \\cdot (NO_x\\text{-}N)$$

* Nhu cầu hấp thụ Oxy thực tế hàng ngày: **${c.r_o_day.toFixed(0)}** kg O₂/ngày
* **Nhu cầu Oxy đỉnh trung bình mỗi giờ:** 🚀 **${c.r_o_hour.toFixed(1)}** kg O₂/giờ

### Bước 8: Kiểm soát cân bằng hóa học độ kiềm hệ thống
Để duy trì độ kiềm an toàn ổn định pH ($75\\text{ g/m}^3\\text{ as CaCO}_3$) nhằm tránh ức chế vi sinh vật nitơ:
* Khối lượng độ kiềm tiêu tốn do quá trình Nitơ hóa: **${(7.14 * c.no_x_n).toFixed(1)}** g/m³ as $CaCO_3$
* **Khối lượng hóa chất kiềm cần bổ sung thêm:** **${c.alkalinity_required_daily.toFixed(0)}** kg/ngày as $CaCO_3$
`;
  }, [calculations, rawInputs]);

  const markdownComponents = useMemo(() => ({
    h1: ({ children }: any) => <h1 className="text-xl font-light tracking-wide text-neutral-950 mt-4 mb-4 uppercase border-b border-neutral-200/80 pb-3 print:text-lg">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-semibold tracking-wide text-neutral-900 mt-8 mb-4 border-l-2 border-neutral-900 pl-3 uppercase page-break-before-avoid print:text-sm">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-bold text-neutral-950 mt-5 mb-2 page-break-before-avoid">{children}</h3>,
    p: ({ children }: any) => <p className="text-sm text-neutral-600 leading-relaxed my-2.5 print:text-xs print:text-neutral-800">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc pl-5 my-3 space-y-1.5 text-sm text-neutral-600 print:text-xs">{children}</ul>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="my-6 border-t border-neutral-200/60 print:my-4" />,
    div: ({ className, children }: any) => {
      if (className?.includes("math-display")) {
        return (
          <div className="my-6 p-4 bg-neutral-50 border border-neutral-100 rounded-xl overflow-x-auto text-neutral-900 text-center block clear-both scrollbar-none print:break-inside-avoid print:bg-neutral-50/50 print:my-4">
            <div className="inline-block min-w-full text-sm sm:text-base py-1 text-left sm:text-center whitespace-nowrap antialiased tracking-normal print:text-[11px]">
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
      <div className="max-w-3xl mx-auto mb-4 flex justify-end print:hidden">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide text-white bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 active:bg-neutral-950 shadow-xs transition-all duration-150"
        >
          <span>📄</span> Xuất thuyết minh PDF kỹ thuật
        </button>
      </div>

      <div ref={reportRef} className="max-w-3xl mx-auto bg-white border border-neutral-200/60 shadow-xs rounded-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
            .page-break-before-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          }
        `}} />

        <div className="px-6 py-4 bg-neutral-900 text-white flex justify-between items-center print:bg-neutral-900 print:text-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">Phúc An Lab System</span>
            <h2 className="text-base font-light tracking-wide text-neutral-100 mt-0.5 print:text-sm">Biện Luận Công Nghệ Sinh Học</h2>
          </div>
          <div className="px-2.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full print:border-neutral-600">
            Metcalf & Eddy Dynamic Modeling
          </div>
        </div>

        <div className="px-5 sm:px-10 py-6 print:px-4 print:py-4">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {reportMarkdown}
          </ReactMarkdown>
        </div>

        <div className="mx-5 sm:mx-10 mb-8 p-4 bg-neutral-50 border-l border-neutral-900 rounded-r-md page-break-inside-avoid print:mx-4 print:mb-4 print:bg-neutral-50 print:break-inside-avoid">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">⚠️</span>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider print:text-[10px]">Cảnh báo điều khiển từ kỹ sư vận hành AI</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed print:text-[11px] print:text-neutral-700">
                Để hệ thống đạt chỉ tiêu dòng ra chất lượng cao đạt nồng độ mục tiêu Amoni dưới 
                <span className="font-semibold text-neutral-800"> {rawInputs.nh4_eff_target} g/m³</span>, yêu cầu nồng độ Oxy hòa tan thực tế duy trì liên tục trong ngăn hiếu khí không được giảm dưới ngưỡng chỉ định 
                <span className="font-semibold text-neutral-800"> DO = {rawInputs.do_target.toFixed(1)} g/m³</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
