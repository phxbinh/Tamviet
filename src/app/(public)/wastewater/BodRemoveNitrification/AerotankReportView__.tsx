"use client";

import React, { useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useReactToPrint } from "react-to-print";
import { AerotankInputs, AerotankOutputs } from "./cals_";

interface AerotankReportViewProps {
  calculations: AerotankOutputs;
  rawInputs: AerotankInputs;
}

export const AerotankReportView: React.FC<AerotankReportViewProps> = ({ calculations, rawInputs }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Thuyet_Minh_Ky_Thuat_Aerotank_Metcalf_Eddy`,
  });

  const reportMarkdown = useMemo(() => {
    const c = calculations;
    return `
# BÁO CÁO THUYẾT MINH CHI TIẾT THIẾT KẾ BỂ SINH HỌC HOẠT TÍNH AEROTANK
*Phương pháp luận tính toán Động học Hệ thống Vi sinh theo Tiêu chuẩn Quốc tế Metcalf & Eddy.*

---

## I. THÔNG SỐ ĐẦU VÀO VÀ ĐẶC TRƯNG NƯỚC THẢI

### 1. Lưu lượng và nồng độ chất ô nhiễm nền
* Lưu lượng nước thải tính toán ($Q$): **${c.q.toLocaleString()}** $m^3/\\text{ngày}$
* Hàm lượng COD có khả năng phân hủy sinh học ($(\\text{COD})_b$): **${c.s_0.toLocaleString()}** $g/m^3$
* Hàm lượng chất hữu cơ dễ phân hủy ($\\text{BOD}_5$): **${c.bod_in.toLocaleString()}** $g/m^3$
* Tổng chất rắn lơ lửng dải vào ($\\text{TSS}$): **${c.tss_in.toLocaleString()}** $g/m^3$
* Chất rắn lơ lửng bay hơi dòng vào ($\\text{VSS}$): **${c.vss_in.toLocaleString()}** $g/m^3$
* Phần chất rắn lơ lửng trơ không phân hủy ($\\text{VSS}_{nb}$): **${c.vss_nb.toLocaleString()}** $g/m^3$
* Tổng nồng độ Nitơ Amoni ($NH_4\\text{-}N$): **${c.nh4_in.toLocaleString()}** $g/m^3$
* Độ kiềm tổng của nước thải đầu vào ($\\text{Alkalinity}$): **${c.alkalinity_in.toLocaleString()}** $g/m^3 \\text{ as CaCO}_3$
* Tỷ số $(\\text{COD})_b/\\text{BOD}$: **1.6**
* Nhiệt độ làm việc thiết kế ($T$): **${c.temp}** °C

### 2. Các chỉ tiêu đầu ra mục tiêu
* Hàm lượng $(\\text{COD})_b$ dòng ra tiêu chuẩn: **${c.s_eff.toFixed(1)}** $g/m^3$
* Hàm lượng $NH_4\\text{-}N$ dòng ra sau xử lý lắng hai: **${c.nh4_eff.toFixed(2)}** $g/m^3$

### 3. Giả định vận hành kỹ thuật khống chế
* Nồng độ Oxy hòa tan mục tiêu duy trì tại ngăn hiếu khí ($DO$): **${c.do_basin.toFixed(1)}** $g/m^3$
* Nồng độ chất rắn lơ lửng hỗn hợp bùn hoạt tính mục tiêu ($X_{\\text{TSS}}$): **${c.x_tss.toLocaleString()}** $g/m^3$
* Hệ số an toàn thiết kế xử lý sinh học nitơ ($\\text{Safety factor}$): **${c.safety_factor}**
* Thành phần sinh khối duy trì lại cấu trúc trơ ($f_d$): **0.15**

---

## II. QUY TRÌNH LUẬN CHỨNG KỸ THUẬT VÀ TÍNH TOÁN 15 BƯỚC CHUYÊN NGÀNH

### (1) Xác định tốc độ tăng trưởng cụ thể $\\mu_n$ của vi khuẩn nitơ hóa
Áp dụng mô hình toán học tích hợp động học cơ chất giới hạn Monod và nồng độ dưỡng khí $DO$ khuếch tán:

$$mu_n = \\left(\\frac{\\mu_{n,\\text{max}} \\cdot (NH_4\\text{-}N)_e}{K_n + (NH_4\\text{-}N)_e}\\right) \\cdot \\left(\\frac{DO}{K_o + DO}\\right) - k_{dn}$$

Thế số trực tiếp từ bảng hằng số hằng số lý thuyết:
$$mu_n = \\left(\\frac{0.50 \\cdot ${c.nh4_eff.toFixed(2)}}{0.60 + ${c.nh4_eff.toFixed(2)}}\\right) \\cdot \\left(\\frac{${c.do_basin.toFixed(1)}}{0.60 + ${c.do_basin.toFixed(1)}}\\right) - 0.05$$

* Kết quả tính toán: $\\mu_n$ = **${c.mu_n.toFixed(4)}** $g/g \\cdot d$

### (2) Xác định tuổi lưu bùn sinh học thiết kế (SRT)
* Tuổi lưu bùn lý thuyết tối thiểu:
$$SRT_{\\text{theoretical}} = \\frac{1}{\\mu_n} = \\frac{1}{${c.mu_n.toFixed(4)}} = **${c.srt_theoretical.toFixed(1)}** \\text{ ngày}$$

* Tuổi lưu bùn thiết kế an toàn tích hợp hệ số $SF = {c.safety_factor}$:
$$SRT_{\\text{design}} = \\text{Safety Factor} \\times SRT_{\\text{theoretical}} = ${c.safety_factor} \\times ${c.srt_theoretical.toFixed(1)} = **${c.srt_design.toFixed(1)}** \\text{ ngày}$$

### (3) Xác định khối lượng sinh khối vi sinh vật tổng hợp hàng daily ($P_{\\text{bio}}$)
Tính toán phân tách lượng sinh khối hình thành từ tế bào vi khuẩn dị dưỡng dị hóa hữu cơ, phần bùn xác mảnh vỡ tế bào nội bào trơ và vi khuẩn tự dưỡng nitơ hóa:

$$\\large P_{\\text{bio}} = \\frac{Q \\cdot Y \\cdot [{(COD)_b}_{\\text{in}} - {(COD)_b}_e]}{1 + k_d \\cdot SRT} + \\frac{f_d \\cdot k_d \\cdot Q \\cdot Y \\cdot [{(COD)_b}_{\\text{in}} - {(COD)_b}_e] \\cdot SRT}{1 + k_d \\cdot SRT} + \\frac{Q \\cdot Y_n \\cdot (NH_4\\text{-}N)_{\\text{in}}}{1 + k_{dn} \\cdot SRT}$$

* Sinh khối vi khuẩn dị dưỡng hoạt tính phát sinh: **${(c.p_bio_hetero / 1000).toFixed(2)}** $kg\\text{ VSS}/d$
* Khối lượng mảnh vỡ tế bào trơ tích lũy hữu cơ ($f_d$): **${(c.p_debris / 1000).toFixed(2)}** $kg\\text{ VSS}/d$
* Sinh khối vi khuẩn tự dưỡng Nitơ hóa sinh ra: **${(c.p_bio_nitrifier / 1000).toFixed(2)}** $kg\\text{ VSS}/d$
* **Tổng lượng sinh khối tổng hợp phát sinh ($P_{\\text{bio}}$):** 📈 **${c.p_bio_total.toLocaleString(undefined, {maximumFractionDigits:1})}** $g\\text{ VSS}/d$ (Tương đương **${(c.p_bio_total / 1000).toFixed(1)}** $kg\\text{ VSS}/d$)

### (4) Xác định tải lượng Nitơ chuyển hóa oxy hóa thành Nitrat ($NO_x\\text{-}N$)
Lượng cấu phần nitơ bị chuyển hóa oxy hóa sau khi đã bù trừ phần nitơ dùng để đồng hóa xây dựng cấu trúc tế bào vi sinh vật (định mức chiếm 12% hàm lượng sinh khối VSS):

$$NO_x\\text{-}N = (NH_4\\text{-}N)_{\\text{in}} - (NH_4\\text{-}N)_e - 0.12 \\cdot \\frac{P_{\\text{bio}}}{Q}$$

$$NO_x\\text{-}N = ${c.nh4_in} - ${c.nh4_eff} - 0.12 \\times \\frac{${c.p_bio_total.toFixed(1)}}{${c.q}} = **${c.no_x_n.toFixed(2)}** g/m^3$$

### (5) Xác định nồng độ và khối lượng cặn lơ lửng trong hệ thống
* Tốc độ phát sinh chất rắn lơ lửng hữu cơ bay hơi ($P_{\\text{VSS}}$):
$$P_{\\text{VSS}} = P_{\\text{bio}} + Q \\cdot (VSS)_{nb} = **${(c.p_vss_day / 1000).toFixed(1)}** \\text{ kg VSS/ngày}$$

$$P_{\\text{TSS}} = \\frac{P_{\\text{bio}}}{0.85} + Q \\cdot (VSS)_{nb} + Q \\cdot (TSS_{\\text{in}} - VSS_{\\text{in}}) = **${(c.p_tss_day / 1000).toFixed(1)}** \\text{ kg TSS/ngày}$$

* Tổng khối lượng bùn sinh khối cần duy trì cố định trong hệ thống Aerotank:
   * Khối lượng trạng thái VSS: $$M_{\\text{VSS}} = P_{\\text{VSS}} \\cdot SRT = **${c.mass_vss_basin.toLocaleString(undefined, {maximumFractionDigits:1})}** \\text{ kg}$$
   * Khối lượng trạng thái TSS: $$M_{\\text{TSS}} = P_{\\text{TSS}} \\cdot SRT = **${c.mass_tss_basin.toLocaleString(undefined, {maximumFractionDigits:1})}** \\text{ kg}$$

### (6) Tính toán thể tích làm việc hình học của bể Aerotank ($V$)
Dựa trên tải lượng sinh khối trạng thái chất rắn lơ lửng tổng $M_{\\text{TSS}}$ cần tích lũy tại nồng độ thiết kế khống chế $X_{\\text{TSS}} = {c.x_tss} g/m^3$:

$$V = \\frac{M_{\\text{TSS}} \\cdot 1000}{X_{\\text{TSS}}} = \\frac{${c.mass_tss_basin.toFixed(1)} \\times 1000}{${c.x_tss}} = **${c.v_tank.toFixed(0)}** m^3$$

* Phương án xây dựng trạm: Bố trí chia đều làm **2 đơn nguyên bể vận hành song song**, thể tích làm việc mỗi đơn nguyên là **${c.v_per_tank.toFixed(0)}** $m^3$.

### (7) Xác định thời gian lưu nước thủy lực ($HRT$)
$$HRT = \\frac{V}{Q} = \\frac{${c.v_tank.toFixed(0)}}{${c.q}} \\times 24 \\text{ giờ/ngày} = **${c.hrt_hours.toFixed(1)}** \\text{ giờ}$$

### (8) Xác định nồng độ chất hữu cơ bay hơi sinh khối ($X_{\\text{VSS}}$)
Tỷ lệ thành phần hữu cơ vi sinh hoạt tính trong bùn hoạt tính:
$$\\text{Fraction} = \\frac{M_{\\text{VSS}}}{M_{\\text{TSS}}} = \\frac{${c.mass_vss_basin.toFixed(1)}}{${c.mass_tss_basin.toFixed(1)}} = \\mathbf{${c.vss_tss_ratio.toFixed(2)}}$$

$$X_{\\text{VSS}} = \\text{Fraction} \\times X_{\\text{TSS}} = ${c.vss_tss_ratio.toFixed(2)} \\times ${c.x_tss} = \\mathbf{${c.x_vss.toFixed(0)}} \\text{ g/m}^3$$

### (9) Tính toán tỷ số tỷ lệ F/M và Tải trọng thể tích hữu cơ bể phản ứng
* Tỷ số F/M (Tỷ lệ lượng thức ăn hữu cơ trên mật độ khối lượng vi sinh):

$$F/M = \\frac{Q \\cdot \\text{BOD}_{\\text{in}}}{X_{\\text{VSS}} \\cdot V} = **${c.f_m_ratio.toFixed(2)}** \\text{ g BOD/g VSS} \\cdot d$$

* Tải trọng chất hữu cơ theo thể tích bể ($L_{\\text{BOD}}$):

$$L_{\\text{BOD}} = \\frac{Q \\cdot \\text{BOD}_{\\text{in}}}{V \\cdot 1000} = **${c.volumetric_loading.toFixed(2)}** \\text{ kg BOD/m}^3 \\cdot d$$

$$L_{\\text{BOD}} = \\frac{Q \\cdot \\text{BOD}_{\\text{in}}}{V \\cdot 1000} = \\mathbf{${c.volumetric_loading.toFixed(2)}} \\text{ kg BOD/m}^3 \\cdot d$$


### (10) Xác định hệ số năng suất tăng trưởng thực tế quan trắc ($Y_{\\text{obs}}$)
* Tổng lượng hữu cơ chất nền $\text{BOD}$ được phân hủy loại bỏ khỏi hệ thống hàng ngày: **${c.bod_removed_day.toFixed(1)}** $kg\\text{ BOD}/d$
* Hệ số năng suất thực tế quan trắc theo chỉ số tổng cặn chất rắn ($Y_{\\text{TSS}}$): **${c.y_tss_obs.toFixed(2)}**
* Hệ số năng suất thực tế quan trắc theo chỉ số hữu cơ bay hơi ($Y_{\\text{VSS}}$): **${c.y_vss_obs.toFixed(2)}**

### (11) Tính toán lượng nhu cầu khí cấp sục Oxy thực tế ($R_o$)
Lượng oxy cần thiết sục vào dòng để bẻ gãy mạch liên kết hữu cơ carbon kết hợp năng lượng cung cấp cho vi khuẩn tự dưỡng trong phản ứng oxy hóa Nitơ hóa hiếu khí:

$$R_o = Q \\cdot [ {(COD)_b}_{\\text{in}} - {(COD)_b}_e ] - 1.42 \\cdot P_{\\text{bio, total}} + 4.33 \\cdot Q \\cdot (NO_x\\text{-}N)$$

* Nhu cầu hấp thụ Oxy thực tế hàng ngày tính toán ($R_o$): **${c.r_o_day.toLocaleString(undefined, {maximumFractionDigits:0})}** $kg\\ O_2/\\text{ngày}$
* **Nhu cầu lưu lượng Oxy cấp đỉnh trung bình mỗi giờ:** 🚀 **${c.r_o_hour.toFixed(1)}** $kg\\ O_2/\\text{giờ}$

### (12) Đánh giá kiểm soát độ kiềm và cân bằng pH hệ thống
* Độ kiềm hệ thống bị tiêu hao trực tiếp phục vụ phản ứng khử Amoni chuyển hóa Nitơ hiếu khí:

$$\\text{Alkalinity Used} = 7.14 \\times NO_x\\text{-}N = 7.14 \\times ${c.no_x_n.toFixed(2)} = \\mathbf{${c.alkalinity_nitrification.toFixed(1)}} \\text{ g/m}^3\\text{ as CaCO}_3$$

* Nhằm mục tiêu duy trì độ pH dung dịch ổn định trong biên độ tối ưu 6.8 - 7.0 chống ức chế sinh trưởng, nồng độ độ kiềm dư an toàn duy trì tối thiểu là $75 g/m^3$.
* **Khối lượng độ kiềm thiếu hụt cần bổ sung châm hóa chất:** **${c.alkalinity_required_daily.toFixed(0)}** $kg/\\text{ngày}$

### (13) Ước lượng hàm lượng ô nhiễm BOD tổng chất lượng dòng ra ($BOD_e$)
Bao gồm hàm lượng ô nhiễm BOD hòa tan và hàm lượng chất rắn lơ lửng mịn thoát qua máng thu bể lắng hai:

$$\\text{Total BOD} = 3.0 + 0.70 \\times 0.85 \\times 8.0 = **${c.effluent_total_bod.toFixed(1)}** g/m^3$$

### (14) Luận chứng thông số kỹ thuật hệ thống bể lắng thứ cấp (Secondary Clarifier)
* Tỷ lệ dòng bùn tuần hoàn hoạt tính yêu cầu từ đáy bể lắng quay lại đầu bể ($R$):
$$R = \\frac{X_{\\text{TSS}}}{7500 - ${c.x_tss}} = **${c.sludge_return_ratio.toFixed(2)}**$$

$$\\text{Surface Area} = \\frac{Q}{25} = **${c.clarifier_area.toFixed(0)}** m^2$$

* Định hướng bố trí thiết kế phân tách thành 2 bể lắng ly tâm độc lập, đường kính định mức mỗi bể lắng hai: **${c.clarifier_diameter.toFixed(1)}** $m$.

### (15) Kiểm tra kiểm soát tải trọng chất rắn lơ lửng lắng hai ($Solids\\,Loading$)
Kiểm tra an toàn động lực tĩnh bề mặt bể lắng để ngăn ngừa triệt để hiện tượng bùn trào trôi tràn qua máng:

$$\\text{Solids Loading} = ${c.solids_loading_rate.toFixed(2)} \\text{ kg TSS}/m^2 \\cdot h$$

* Đánh giá kết quả kiểm tra kỹ thuật: Chỉ số nằm hoàn toàn trong khung tiêu chuẩn kỹ thuật an toàn cho phép, đạt giới hạn an toàn thiết kế.
`;
  }, [calculations]);

  const markdownComponents = useMemo(() => ({
    h1: ({ children }: any) => (
      <h1 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-950 mt-4 mb-6 uppercase border-b border-neutral-200 pb-4 print:text-lg print:mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-base sm:text-lg font-semibold tracking-wide text-neutral-900 mt-10 mb-4 border-l-2 border-neutral-950 pl-3.5 uppercase page-break-before-avoid print:text-sm print:mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm sm:text-base font-bold text-neutral-950 mt-6 mb-2.5 page-break-before-avoid print:text-xs">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-sm text-neutral-600 leading-relaxed my-3 antialiased print:text-xs print:text-neutral-800">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 my-4 space-y-2 text-sm text-neutral-600 print:text-xs print:my-2 print:space-y-1">
        {children}
      </ul>
    ),
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="my-8 border-t border-neutral-200/60 print:my-4" />,
    div: ({ className, children }: any) => {
      if (className?.includes("math-display")) {
        return (
          <div className="my-6 w-full bg-neutral-50/70 border border-neutral-200/70 rounded-xl overflow-x-auto block clear-both scrollbar-none print:break-inside-avoid print:bg-neutral-50/40 print:my-4">
            <div className="w-full text-center px-4 py-4 sm:px-6 text-sm sm:text-base text-neutral-900 whitespace-nowrap antialiased tracking-normal font-mono print:text-[11px] print:py-2">
              {children}
            </div>
          </div>
        );
      }
      return <div className={className}>{children}</div>;
    }
  }), []);

  return (
    <div className="min-h-screen bg-neutral-50/30 py-6 sm:py-12 px-3 sm:px-6 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Action Bar */}
      <div className="max-w-3xl mx-auto mb-5 flex justify-end print:hidden">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide text-white bg-neutral-950 border border-neutral-900 rounded-lg hover:bg-neutral-800 active:bg-neutral-950 shadow-sm transition-all duration-200 cursor-pointer"
        >
          📄 Xuất thuyết minh kỹ thuật chi tiết (A4 PDF)
        </button>
      </div>

      {/* Main Report Container */}
      <div 
        ref={reportRef} 
        className="max-w-3xl mx-auto bg-white border border-neutral-200/70 shadow-xs rounded-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none"
      >
        {/* Anti-vỡ khung Custom CSS */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
            .page-break-before-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          }
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Premium Corporate Header */}
        <div className="px-6 sm:px-10 py-5 bg-neutral-950 text-white flex justify-between items-center border-b border-neutral-900 print:bg-neutral-950 print:text-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Phúc An</span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded-sm font-mono font-medium tracking-normal">LAB SYSTEM</span>
            </div>
            <h2 className="text-sm sm:text-base font-light tracking-wide text-neutral-100 print:text-xs">
              Hồ Sơ Thiết Kế Biện Luận Công Nghệ Môi Trường
            </h2>
          </div>
          <div className="hidden sm:block px-3 py-1 text-[10px] font-mono font-medium bg-neutral-900 text-neutral-400 border border-neutral-800 rounded-md tracking-tight">
            Metcalf & Eddy Engine v1.1
          </div>
        </div>

        {/* Document Content */}
        <div className="px-5 sm:px-10 pt-8 pb-4 print:px-2 print:pt-4 overflow-hidden">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {reportMarkdown}
          </ReactMarkdown>
        </div>

        {/* Premium AI Agent Notice Box */}
        <div className="mx-5 sm:mx-10 mb-10 p-4 sm:p-5 bg-neutral-50 border-l-2 border-neutral-950 rounded-r-xl page-break-inside-avoid print:mx-2 print:mb-4 print:bg-neutral-50 print:break-inside-avoid">
          <div className="flex items-start gap-3">
            <span className="text-base select-none mt-0.5">⚠️</span>
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider font-mono">
                Cảnh báo vận hành từ AI Agent
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed antialiased print:text-[11px] print:text-neutral-700">
                Hệ thống yêu cầu kiểm soát liên tục nồng độ oxy hòa tan để đạt chỉ tiêu hiệu suất Nitơ hóa mong muốn dòng ra đạt Amoni thấp hơn {rawInputs.nh4_eff} g/m³. Mọi biến động sụt giảm chỉ số khuếch tán oxy trong ngăn hiếu khí (DO &lt; {rawInputs.do_basin} mg/L) sẽ kéo tụt hằng số động học tăng trưởng thực tế, gây nguy cơ quá tải tích lũy hàm lượng độc tính amoni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
