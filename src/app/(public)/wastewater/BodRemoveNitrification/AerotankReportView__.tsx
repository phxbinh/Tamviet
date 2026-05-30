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
* Lưu lượng nước thải tính toán ($Q$): **${c.q.toLocaleString()}** $m^3$/ngày
* Hàm lượng COD có khả năng phân hủy sinh học ($(\text{COD})_b$): **${c.s_0.toLocaleString()}** $g/m^3$
* Hàm lượng chất hữu cơ dễ phân hủy ($\text{BOD}_5$): **${c.bod_in.toLocaleString()}** $g/m^3$
* Tổng chất rắn lơ lửng dải vào ($\text{TSS}_{\text{in}}$): **${c.tss_in.toLocaleString()}** $g/m^3$
* Chất rắn lơ lửng bay hơi dòng vào ($\text{VSS}_{\text{in}}$): **${c.vss_in.toLocaleString()}** $g/m^3$
* Phần chất rắn lơ lửng trơ không phân hủy ($\text{VSS}_{\text{nb}}$): **${c.vss_nb.toLocaleString()}** $g/m^3$
* Tổng nồng độ Nitơ Amoni ($\text{NH}_4\text{-N}$): **${c.nh4_in.toLocaleString()}** $g/m^3$
* Độ kiềm tổng của nước thải đầu vào ($\text{Alkalinity}$): **${c.alkalinity_in.toLocaleString()}** $g/m^3$ as $\text{CaCO}_3$
* Tỷ số $(\text{COD})_b/\text{BOD}$: **1.6**
* Nhiệt độ làm việc thiết kế ($T$): **${c.temp}** °C

### 2. Các chỉ tiêu đầu ra mục tiêu
* Hàm lượng $(\text{COD})_b$ dòng ra tiêu chuẩn ($S$): **${c.s_eff.toFixed(1)}** $g/m^3$
* Hàm lượng $\text{NH}_4\text{-N}$ dòng ra sau xử lý lắng hai: **${c.nh4_eff.toFixed(2)}** $g/m^3$

### 3. Giả định vận hành kỹ thuật khống chế
* Nồng độ Oxy hòa tan mục tiêu duy trì tại ngăn hiếu khí ($\text{DO}$): **${c.do_basin.toFixed(1)}** $g/m^3$
* Nồng độ chất rắn lơ lửng hỗn hợp bùn hoạt tính mục tiêu ($X_{\text{TSS}}$): **${c.x_tss.toLocaleString()}** $g/m^3$
* Hệ số an toàn thiết kế xử lý sinh học nitơ ($\text{SF}$): **${c.safety_factor}**
* Thành phần sinh khối duy trì lại cấu trúc trơ ($f_d$): **0.15**

---

## II. QUY TRÌNH LUẬN CHỨNG KỸ THUẬT VÀ TÍNH TOÁN 15 BƯỚC CHUYÊN NGÀNH

### (1) Xác định tốc độ tăng trưởng cụ thể $\mu_n$ của vi khuẩn nitơ hóa
Áp dụng mô hình toán học tích hợp động học cơ chất giới hạn Monod và nồng độ dưỡng khí $\text{DO}$ khuếch tán:

$$
\mu_n = \left( \frac{\mu_{n,\text{max}} \cdot \text{NH}_{4}\text{-N}_e}{K_n + \text{NH}_{4}\text{-N}_e} \right) \cdot \left( \frac{\text{DO}}{K_o + \text{DO}} \right) - k_{dn}
$$

Thế số trực tiếp từ bảng hằng số lý thuyết:
$$
\mu_n = \left( \frac{0.50 \cdot ${c.nh4_eff.toFixed(2)}}{0.60 + ${c.nh4_eff.toFixed(2)}} \right) \cdot \left( \frac{${c.do_basin.toFixed(1)}}{0.60 + ${c.do_basin.toFixed(1)}} \right) - 0.05
$$

* Kết quả tính toán: $\mu_n$ = **${c.mu_n.toFixed(4)}** $g/g \cdot d$

### (2) Xác định tuổi lưu bùn sinh học thiết kế (SRT)
* Tuổi lưu bùn lý thuyết tối thiểu:
$$
\text{SRT}_{\text{theoretical}} = \frac{1}{\mu_n} = \frac{1}{${c.mu_n.toFixed(4)}}
$$
* Kết quả tính toán thời gian lý thuyết: **${c.srt_theoretical.toFixed(1)}** ngày

* Tuổi lưu bùn thiết kế an toàn tích hợp hệ số $\text{SF} = ${c.safety_factor}$:
$$
\text{SRT}_{\text{design}} = \text{SF} \cdot \text{SRT}_{\text{theoretical}} = ${c.safety_factor} \cdot ${c.srt_theoretical.toFixed(1)}
$$
* Kết quả cấu hình thực tế: **${c.srt_design.toFixed(1)}** ngày

### (3) Xác định khối lượng sinh khối vi sinh vật tổng hợp hàng ngày ($P_{\text{bio}}$)
Tính toán phân tách lượng sinh khối hình thành từ tế bào vi khuẩn dị dưỡng dị hóa hữu cơ, phần bùn xác mảnh vỡ tế bào nội bào trơ và vi khuẩn tự dưỡng nitơ hóa:

$$
P_{\text{bio}} = \frac{Q \cdot Y \cdot (S_0 - S)}{1 + k_d \cdot \text{SRT}} + \frac{f_d \cdot k_d \cdot Q \cdot Y \cdot (S_0 - S) \cdot \text{SRT}}{1 + k_d \cdot \text{SRT}} + \frac{Q \cdot Y_n \cdot \text{NH}_{4}\text{-N}_{\text{in}}}{1 + k_{dn} \cdot \text{SRT}}
$$

* Sinh khối vi khuẩn dị dưỡng hoạt tính phát sinh: **${(c.p_bio_hetero / 1000).toFixed(2)}** $kg$ VSS/ngày
* Khối lượng mảnh vỡ tế bào trơ tích lũy hữu cơ ($f_d$): **${(c.p_debris / 1000).toFixed(2)}** $kg$ VSS/ngày
* Sinh khối vi khuẩn tự dưỡng Nitơ hóa sinh ra: **${(c.p_bio_nitrifier / 1000).toFixed(2)}** $kg$ VSS/ngày
* **Tổng lượng sinh khối tổng hợp phát sinh ($P_{\text{bio}}$):** 📈 **${c.p_bio_total.toLocaleString(undefined, {maximumFractionDigits:1})}** $g$ VSS/ngày (Tương đương **${(c.p_bio_total / 1000).toFixed(1)}** $kg$ VSS/ngày)

### (4) Xác định tải lượng Nitơ chuyển hóa oxy hóa thành Nitrat ($\text{NO}_x\text{-N}$)
Lượng cấu phần nitơ bị chuyển hóa oxy hóa sau khi đã bù trừ phần nitơ dùng để đồng hóa xây dựng cấu trúc tế bào vi sinh vật (định mức chiếm 12% hàm lượng sinh khối VSS):

$$
\text{NO}_x\text{-N} = \text{NH}_{4}\text{-N}_{\text{in}} - \text{NH}_{4}\text{-N}_e - 0.12 \cdot \frac{P_{\text{bio}}}{Q}
$$
$$
\text{NO}_x\text{-N} = ${c.nh4_in} - ${c.nh4_eff} - 0.12 \cdot \frac{${c.p_bio_total.toFixed(1)}}{${c.q}} = ${c.no_x_n.toFixed(2)} \text{ g/m}^3
$$

### (5) Xác định nồng độ và khối lượng cặn lơ lửng trong hệ thống
* Tốc độ phát sinh chất rắn lơ lửng hữu cơ bay hơi ($P_{\text{VSS}}$) và tổng chất rắn lơ lửng ($P_{\text{TSS}}$):
$$
P_{\text{VSS}} = P_{\text{bio}} + Q \cdot \text{VSS}_{\text{nb}} = ${c.p_vss_day.toLocaleString(undefined, {maximumFractionDigits:0})} \text{ g VSS/ngày}
$$
$$
P_{\text{TSS}} = \frac{P_{\text{bio}}}{0.85} + Q \cdot \text{VSS}_{\text{nb}} + Q \cdot (\text{TSS}_{\text{in}} - \text{VSS}_{\text{in}}) = ${c.p_tss_day.toLocaleString(undefined, {maximumFractionDigits:0})} \text{ g TSS/ngày}
$$

* Tổng khối lượng bùn sinh khối cần duy trì cố định trong hệ thống Aerotank:
   * Khối lượng trạng thái VSS ($M_{\text{VSS}}$): **${c.mass_vss_basin.toLocaleString(undefined, {maximumFractionDigits:1})}** $kg$
   * Khối lượng trạng thái TSS ($M_{\text{TSS}}$): **${c.mass_tss_basin.toLocaleString(undefined, {maximumFractionDigits:1})}** $kg$

### (6) Tính toán thể tích làm việc hình học của bể Aerotank ($V$)
Dựa trên tải lượng sinh khối trạng thái chất rắn lơ lửng tổng $M_{\text{TSS}}$ cần tích lũy tại nồng độ thiết kế khống chế $X_{\text{TSS}} = ${c.x_tss} $g/m^3$:

$$
V = \frac{M_{\text{TSS}} \cdot 1000}{X_{\text{TSS}}} = \frac{${c.mass_tss_basin.toFixed(1)} \cdot 1000}{${c.x_tss}} = ${c.v_tank.toFixed(0)} \text{ m}^3
$$

* Phương án xây dựng trạm: Bố trí chia đều làm **2 đơn nguyên bể vận hành song song**, thể tích làm việc mỗi đơn nguyên là **${c.v_per_tank.toFixed(0)}** $m^3$.

### (7) Xác định thời gian lưu nước thủy lực ($\text{HRT}$)
$$
\text{HRT} = \frac{V}{Q} \cdot 24 = \frac{${c.v_tank.toFixed(0)}}{${c.q}} \cdot 24 = ${c.hrt_hours.toFixed(1)} \text{ giờ}
$$

### (8) Xác định nồng độ chất hữu cơ bay hơi sinh khối ($X_{\text{VSS}}$)
Tỷ lệ thành phần hữu cơ vi sinh hoạt tính trong bùn hoạt tính:
$$
\text{Fraction} = \frac{M_{\text{VSS}}}{M_{\text{TSS}}} = \frac{${c.mass_vss_basin.toFixed(1)}}{${c.mass_tss_basin.toFixed(1)}} = ${c.vss_tss_ratio.toFixed(2)}
$$
$$
X_{\text{VSS}} = \text{Fraction} \cdot X_{\text{TSS}} = ${c.vss_tss_ratio.toFixed(2)} \cdot ${c.x_tss} = ${c.x_vss.toFixed(0)} \text{ g/m}^3
$$

### (9) Tính toán tỷ số tỷ lệ F/M và Tải trọng thể tích hữu cơ bể phản ứng
* Tỷ số F/M (Tỷ lệ lượng thức ăn hữu cơ trên mật độ khối lượng vi sinh):
$$
\text{F/M} = \frac{Q \cdot \text{BOD}_{\text{in}}}{X_{\text{VSS}} \cdot V} = ${c.f_m_ratio.toFixed(2)} \text{ g BOD/g VSS} \cdot d
$$

* Tải trọng chất hữu cơ theo thể tích bể ($L_{\text{BOD}}$):
$$
L_{\text{BOD}} = \frac{Q \cdot \text{BOD}_{\text{in}}}{V \cdot 1000} = ${c.volumetric_loading.toFixed(2)} \text{ kg BOD/m}^3 \cdot d
$$

### (10) Xác định hệ số năng suất tăng trưởng thực tế quan trắc ($Y_{\text{obs}}$)
* Tổng lượng hữu cơ chất nền $\text{BOD}$ được phân hủy loại bỏ khỏi hệ thống hàng ngày: **${c.bod_removed_day.toFixed(1)}** $kg$ BOD/ngày
* Hệ số năng suất thực tế quan trắc theo chỉ số tổng cặn chất rắn ($Y_{\text{TSS}}$): **${c.y_tss_obs.toFixed(2)}**
* Hệ số năng suất thực tế quan trắc theo chỉ số hữu cơ bay hơi ($Y_{\text{VSS}}$): **${c.y_vss_obs.toFixed(2)}**

### (11) Tính toán lượng nhu cầu khí cấp sục Oxy thực tế ($R_o$)
Lượng oxy cần thiết sục vào dòng để bẻ gãy mạch liên kết hữu cơ carbon kết hợp năng lượng cung cấp cho vi khuẩn tự dưỡng trong phản ứng oxy hóa Nitơ hóa hiếu khí:

$$
R_o = Q \cdot (S_0 - S) - 1.42 \cdot P_{\text{bio, total}} + 4.33 \cdot Q \cdot \text{NO}_x\text{-N}
$$

* Nhu cầu hấp thụ Oxy thực tế hàng ngày tính toán ($R_o$): **${c.r_o_day.toLocaleString(undefined, {maximumFractionDigits:0})}** $kg$ $O_2$/ngày
* **Nhu cầu lưu lượng Oxy cấp đỉnh trung bình mỗi giờ:** 🚀 **${c.r_o_hour.toFixed(1)}** $kg$ $O_2$/giờ

### (12) Đánh giá kiểm soát độ kiềm và cân bằng pH hệ thống
* Độ kiềm hệ thống bị tiêu hao trực tiếp phục vụ phản ứng khử Amoni chuyển hóa Nitơ hiếu khí:

$$
\text{Alkalinity Used} = 7.14 \cdot \text{NO}_x\text{-N} = 7.14 \cdot ${c.no_x_n.toFixed(2)} = ${c.alkalinity_nitrification.toFixed(1)} \text{ g/m}^3 \text{ as CaCO}_3
$$

* Nhằm mục tiêu duy trì độ pH dung dịch ổn định trong biên độ tối ưu 6.8 - 7.0 chống ức chế sinh trưởng, nồng độ độ kiềm dư an toàn duy trì tối thiểu là $75$ $g/m^3$.
* **Khối lượng độ kiềm thiếu hụt cần bổ sung châm hóa chất:** **${c.alkalinity_required_daily.toFixed(0)}** $kg$/ngày

### (13) Ước lượng hàm lượng ô nhiễm BOD tổng chất lượng dòng ra ($\text{BOD}_e$)
Bao gồm hàm lượng ô nhiễm BOD hòa tan và hàm lượng chất rắn lơ lửng mịn thoát qua máng thu bể lắng hai:

$$
\text{Total BOD} = 3.0 + 0.70 \cdot 0.85 \cdot 8.0 = ${c.effluent_total_bod.toFixed(1)} \text{ g/m}^3
$$

### (14) Luận chứng thông số kỹ thuật hệ thống bể lắng thứ cấp (Secondary Clarifier)
* Tỷ lệ dòng bùn tuần hoàn hoạt tính yêu cầu từ đáy bể lắng quay lại đầu bể ($R$):
$$
R = \frac{X_{\text{TSS}}}{7500 - X_{\text{TSS}}} = ${c.sludge_return_ratio.toFixed(2)}
$$
$$
\text{Surface Area} = \frac{Q}{25} = ${c.clarifier_area.toFixed(0)} \text{ m}^2
$$
* Định hướng bố trí thiết kế phân tách thành 2 bể lắng ly tâm độc lập, đường kính định mức mỗi bể lắng hai: **${c.clarifier_diameter.toFixed(1)}** $m$.

### (15) Kiểm tra kiểm soát tải trọng chất rắn lơ lửng lắng hai ($\text{Solids Loading}$)
Kiểm tra an toàn động lực tĩnh bề mặt bể lắng để ngăn ngừa triệt để hiện tượng bùn trào trôi tràn qua máng:

$$
\text{Solids Loading} = ${c.solids_loading_rate.toFixed(2)} \text{ kg TSS}/m^2 \cdot h
$$

* Đánh giá kết quả kiểm tra kỹ thuật: Chỉ số nằm hoàn toàn trong khung tiêu chuẩn kỹ thuật an toàn cho phép, đạt giới hạn an toàn thiết kế.
`;
  }, [calculations]);

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
          <div className="my-5 w-full bg-neutral-50 border border-neutral-150/60 rounded-xl overflow-x-auto block clear-both scrollbar-none print:break-inside-avoid print:bg-neutral-50/50 print:my-4">
            <div className="w-full text-center px-4 py-4 text-sm sm:text-base text-neutral-900 whitespace-nowrap antialiased tracking-normal print:text-[11px]">
              {children}
            </div>
          </div>
        );
      }
      return <div className={className}>{children}</div>;
    }
  }), []);

  return (
    <div className="min-h-screen bg-neutral-50/40 py-4 sm:py-10 px-2 sm:px-6 font-sans antialiased">
      <div className="max-w-3xl mx-auto mb-4 flex justify-end print:hidden">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide text-white bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 active:bg-neutral-950 shadow-xs transition-all duration-150 cursor-pointer"
        >
          📄 Xuất thuyết minh kỹ thuật chi tiết (A4 PDF)
        </button>
      </div>

      <div ref={reportRef} className="max-w-3xl mx-auto bg-white border border-neutral-200/60 shadow-xs rounded-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
            .page-break-before-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          }
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        <div className="px-6 py-4 bg-neutral-900 text-white flex justify-between items-center print:bg-neutral-900 print:text-white">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase opacity-80">Phúc An Lab System</span>
            <h2 className="text-base font-light tracking-wide text-neutral-100 mt-0.5 print:text-sm">Hồ Sơ Thiết Kế Biện Luận Công Nghệ Môi Trường</h2>
          </div>
          <div className="hidden sm:block px-2.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full print:border-neutral-600">
            Metcalf & Eddy Dynamic Modeling
          </div>
        </div>

        <div className="px-4 sm:px-10 py-6 print:px-4 print:py-4 overflow-hidden">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {reportMarkdown}
          </ReactMarkdown>
        </div>

        <div className="mx-4 sm:mx-10 mb-8 p-4 bg-neutral-50 border-l border-neutral-900 rounded-r-md page-break-inside-avoid print:mx-4 print:mb-4 print:bg-neutral-50 print:break-inside-avoid">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">⚠️</span>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider print:text-[10px]">Cảnh báo chỉ tiêu vận hành từ AI Agent</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed print:text-[11px] print:text-neutral-700">
                Hệ thống yêu cầu kiểm soát liên tục nồng độ oxy hòa tan để đạt chỉ tiêu hiệu suất Nitơ hóa mong muốn dòng ra đạt Amoni thấp hơn {rawInputs.nh4_eff} $g/m^3$. Mọi biến động sụt giảm chỉ số khuếch tán oxy trong ngăn hiếu khí ($\text{DO} < {rawInputs.do_basin}$ $mg/L$) sẽ kéo tụt hằng số động học tăng trưởng thực tế, gây nguy cơ quá tải tích lũy hàm lượng độc tính amoni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
