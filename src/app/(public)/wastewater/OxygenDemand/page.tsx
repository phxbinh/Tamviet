//src/app/(public)/wastewater/OxygenDemand/page.tsx
import { AerotankReportView, AerotankInputs } from "./AerationReport";

export default function Page() {
  // Dữ liệu chuẩn từ sách Metcalf & Eddy bài 8-22
  const sampleData: AerotankInputs = {
    q: 3000.0,
    s_0: 1800.0,
    temp: 15.0,
    x_tss: 2500.0,
    srt: 8.0,
    bcod_bod_ratio: 1.6,
    alpha: 0.45,
    f_factor: 0.90,
    beta: 1.0,
    elevation: 300.0,
    depth_sat: 2.5,
    ote: 0.30,
    do_target: 2.0,
    mu_max: 3.0,
    k_s: 60.0,
    y_h: 0.40,
    b_h: 0.08,
    f_d: 0.15
  };

  return <AerotankReportView data={sampleData} />;
}
