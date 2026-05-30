// app/reports/page.tsx
/*
import { calculateAerotank, AerotankInputs } from "./cals_";
import { AerotankReportView } from "./AerotankReportView_";

export default async function Page() {
  // Đồng bộ toàn bộ dữ liệu mẫu chính xác từ file tài liệu PDF đầu vào của bạn
  const designInputs: AerotankInputs = {
    q: 20000,
    s_0: 230,           // Biodegradable COD (g/m3)
    bod_in: 144,        // BOD (g/m3)
    nh4_in: 25,         // NH4-N (g/m3)
    alkalinity_in: 129, // Alkalinity as CaCO3
    temp: 20,           // 20°C
    tss_in: 63,         // TSS dòng vào
    vss_in: 53,         // VSS dòng vào
    vss_nb: 20,         // Nonbiodegradable VSS
    x_tss: 2800,        // Thiết kế nồng độ MLSS (g/m3)
    safety_factor: 1.2, // Safety factor
    do_target: 2.0,     // DO duy trì trong bể
    s_eff_target: 1.0,  // Đầu ra bCOD đạt mục tiêu
    nh4_eff_target: 0.40 // Đầu ra NH4-N đạt mục tiêu
  };

  // Tính toán sinh học xử lý tại Server trước khi đổ dữ liệu xuống máy khách
  const calculations = calculateAerotank(designInputs);

  return (
    <AerotankReportView 
      calculations={calculations} 
      rawInputs={designInputs} 
    />
  );
}
*/


// src/app/(public)/wastewater/BodRemoveNitrification/page.tsx

import { calculateAerotank, AerotankInputs } from "./cals_";
import { AerotankReportView } from "./AerotankReportView_";

export default async function Page() {
  // Thay đổi các key cũ sang key mới đã định nghĩa trong Interface AerotankInputs
  const designInputs: AerotankInputs = {
    q: 20000,
    s_0: 230,           // bCOD dòng vào (g/m3)
    bod_in: 144,        // BOD5 dòng vào (g/m3)
    tss_in: 63,         // TSS dòng vào (g/m3)
    vss_in: 53,         // VSS dòng vào (g/m3)
    vss_nb: 20,         // Phần VSS trơ trích từ tài liệu (g/m3)
    nh4_in: 25,         // NH4-N dòng vào (g/m3)
    alkalinity_in: 129, // Độ kiềm tổng dòng vào (g/m3 as CaCO3)
    temp: 20,           // Nhiệt độ thiết kế (°C)
    
    // Khống chế chỉ tiêu dòng ra mục tiêu
    s_eff: 1.0,         // Thay cho s_eff_target (g/m3)
    nh4_eff: 0.40,      // Thay cho nh4_eff_target (g/m3)
    
    // Thông số khống chế vận hành bể
    x_tss: 2800,        // Nồng độ MLSS thiết kế (g/m3)
    safety_factor: 1.2, // Hệ số an toàn (SF)
    do_basin: 2.0,      // Thay cho do_target (g/m3)
  };

  // Tính toán xử lý tại Server
  const calculations = calculateAerotank(designInputs);

  return (
    <AerotankReportView 
      calculations={calculations} 
      rawInputs={designInputs} 
    />
  );
}


