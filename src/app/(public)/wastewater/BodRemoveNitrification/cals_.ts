// src/lib/aerotank-calc.ts

export interface AerotankInputs {
  q: number;               // Lưu lượng nước thải (Q), m3/d
  s_0: number;             // bCOD dòng vào (COD_b_in), g/m3 (mg/L)
  bod_in: number;          // BOD5 dòng vào, g/m3
  tss_in: number;          // TSS dòng vào, g/m3
  vss_in: number;          // VSS dòng vào, g/m3
  vss_nb: number;          // Phần VSS trơ trích từ tài liệu (VSS_nb), g/m3
  nh4_in: number;          // NH4-N dòng vào, g/m3
  alkalinity_in: number;   // Độ kiềm tổng dòng vào, g/m3 as CaCO3
  temp: number;            // Nhiệt độ thiết kế (T), °C
  
  // Khống chế chỉ tiêu dòng ra mục tiêu
  s_eff: number;           // bCOD dòng ra mục tiêu, g/m3
  nh4_eff: number;         // NH4-N dòng ra mục tiêu, g/m3
  
  // Thông số vận hành hệ thống khống chế
  x_tss: number;           // Nồng độ MLSS thiết kế trong bể Aerotank, g/m3
  safety_factor: number;   // Hệ số an toàn thiết kế vi sinh (SF)
  do_basin: number;        // Nồng độ DO duy trì tại vùng hiếu khí, g/m3
}

export interface AerotankOutputs {
  q: number;
  s_0: number;
  bod_in: number;
  tss_in: number;
  vss_in: number;
  vss_nb: number;
  nh4_in: number;
  alkalinity_in: number;
  temp: number;
  s_eff: number;
  nh4_eff: number;
  x_tss: number;
  safety_factor: number;
  do_basin: number;
  
  // Kết quả các bước tính toán động học chi tiết
  mu_n: number;                   // Tốc độ tăng trưởng cụ thể vi khuẩn tự dưỡng, d^-1
  srt_theoretical: number;        // Tuổi bùn lý thuyết, ngày
  srt_design: number;             // Tuổi bùn thiết kế hiệu chỉnh, ngày
  p_bio_hetero: number;           // Sinh khối vi khuẩn dị dưỡng, g VSS/d
  p_debris: number;               // Mảnh vỡ nội bào tích lũy, g VSS/d
  p_bio_nitrifier: number;        // Sinh khối vi khuẩn tự dưỡng nitơ hóa, g VSS/d
  p_bio_total: number;            // Tổng lượng sinh khối tổng hợp, g VSS/d
  no_x_n: number;                 // Hàm lượng Nitơ bị oxy hóa, g/m3
  p_vss_day: number;              // Tốc độ phát sinh cặn hữu cơ bay hơi, g VSS/d
  p_tss_day: number;              // Tổng lượng bùn dư phát sinh trạng thái khô, g TSS/d
  mass_vss_basin: number;         // Tổng khối lượng VSS cần duy trì trong bể, kg
  mass_tss_basin: number;         // Tổng khối lượng TSS cần duy trì trong bể, kg
  v_tank: number;                 // Tổng thể tích làm việc hình học của bể, m3
  v_per_tank: number;             // Thể tích làm việc trên mỗi đơn nguyên bể, m3
  hrt_hours: number;              // Thời gian lưu nước thủy lực, giờ
  vss_tss_ratio: number;          // Tỷ lệ VSS/TSS của bùn hoạt tính
  x_vss: number;                  // Nồng độ MLVSS tính toán trong bể, g/m3
  f_m_ratio: number;              // Tỷ số F/M, g BOD/g VSS.d
  volumetric_loading: number;     // Tải trọng thể tích hữu cơ, kg BOD/m3.d
  cod_removed_day: number;        // Tải lượng bCOD loại bỏ, kg/d
  bod_removed_day: number;        // Tải lượng BOD loại bỏ, kg/d
  y_tss_obs: number;              // Hệ số năng suất thực tế quan trắc theo TSS, g TSS/g BOD
  y_vss_obs: number;              // Hệ số năng suất thực tế quan trắc theo VSS, g VSS/g BOD
  r_o_day: number;                // Nhu cầu hấp thụ Oxy sinh học thực tế, kg O2/d
  r_o_hour: number;               // Nhu cầu Oxy đỉnh trung bình mỗi giờ, kg O2/h
  alkalinity_nitrification: number; // Độ kiềm tiêu hao cho Nitơ hóa, g/m3 as CaCO3
  alkalinity_required_total: number; // Tổng độ kiềm yêu cầu bao gồm lượng dư, g/m3
  alkalinity_required_daily: number; // Khối lượng hóa chất nâng kiềm cần châm thêm, kg/d
  effluent_total_bod: number;     // Tổng hàm lượng BOD đầu ra dự kiến, g/m3
  sludge_return_ratio: number;    // Tỷ lệ dòng tuần hoàn bùn hoạt tính (R)
  clarifier_area: number;         // Tổng diện tích bề mặt vùng công tác bể lắng hai, m2
  clarifier_diameter: number;     // Đường kính hình học tiêu chuẩn mỗi bể lắng hai, m
  solids_loading_rate: number;    // Tải trọng chất rắn lơ lửng bề mặt lắng hai, kg TSS/m2.h
}

export function calculateAerotank(data: AerotankInputs): AerotankOutputs {
  // Hệ số động học thực nghiệm cố định từ tài liệu tiêu chuẩn quốc tế Metcalf & Eddy
  const mu_n_max = 0.50;  // d^-1 (VK tự dưỡng)
  const k_n = 0.60;       // g/m3
  const k_dn = 0.05;      // d^-1
  const y_n = 0.10;       // g VSS/g NH4-N
  
  const k_d = 0.088;      // d^-1 (VK dị dưỡng)
  const k_o = 0.60;       // g/m3
  const y_hetero = 0.35;  // g VSS/g bCOD
  const f_d = 0.15;       // Thành phần mảnh vỡ tế bào không phân hủy
  
  const {
    q, s_0, bod_in, tss_in, vss_in, vss_nb, nh4_in, alkalinity_in, temp,
    s_eff, nh4_eff, x_tss, safety_factor, do_basin
  } = data;

  // (1) Xác định tốc độ tăng trưởng cụ thể mu_n của vi khuẩn nitơ hóa
  const mu_n = (mu_n_max * nh4_eff / (k_n + nh4_eff)) * (do_basin / (k_o + do_basin)) - k_dn;

  // (2) Xác định tuổi lưu bùn sinh học lý thuyết và thiết kế
  const srt_theoretical = 1 / mu_n;
  const srt_design = safety_factor * srt_theoretical;

  // (3) Xác định khối lượng từng thành phần sinh khối vi sinh tổng hợp sinh ra hàng ngày
  const bcod_removed = s_0 - s_eff;
  const p_bio_hetero = (q * y_hetero * bcod_removed) / (1 + k_d * srt_design);
  const p_debris = (f_d * k_d * q * y_hetero * bcod_removed * srt_design) / (1 + k_d * srt_design);
  const p_bio_nitrifier = (q * y_n * nh4_in) / (1 + k_dn * srt_design);
  const p_bio_total = p_bio_hetero + p_debris + p_bio_nitrifier; // Đơn vị: g VSS/d

  // (4) Xác định lượng Nitơ chuyển hóa thành Nitrat (NOx-N)
  const no_x_n = nh4_in - nh4_eff - (0.12 * p_bio_total / q);

  // (5) Xác định nồng độ, khối lượng cặn xả cặn VSS & TSS phát sinh mỗi ngày
  const p_vss_day = p_bio_total + (q * vss_nb); // g VSS/d
  const p_tss_day = (p_bio_total / 0.85) + (q * vss_nb) + (q * (tss_in - vss_in)); // g TSS/d

  const mass_vss_basin = (p_vss_day * srt_design) / 1000; // Đổi sang kg
  const mass_tss_basin = (p_tss_day * srt_design) / 1000; // Đổi sang kg

  // (6) Xác định thể tích làm việc hình học của bể phản ứng Aerotank (V)
  const v_tank = (mass_tss_basin * 1000) / x_tss; // m3
  const v_per_tank = v_tank / 2; // Phân chia module làm 2 đơn nguyên bể chạy song song

  // (7) Xác định thời gian lưu nước thủy lực (HRT) của dòng chảy
  const hrt_hours = (v_tank / q) * 24;

  // (8) Xác định tỷ lệ thành phần hữu cơ và nồng độ MLVSS thực tế (X_vss)
  const vss_tss_ratio = mass_vss_basin / mass_tss_basin;
  const x_vss = vss_tss_ratio * x_tss;

  // (9) Tính toán chỉ số công tác kiểm tra: tỷ số F/M và tải trọng hữu cơ thể tích
  const f_m_ratio = (q * bod_in) / (x_vss * v_tank);
  const volumetric_loading = (q * bod_in) / (v_tank * 1000); // kg BOD/m3.d

  // (10) Xác định hệ số năng suất tăng trưởng thực tế quan trắc (Observed Yield)
  const cod_removed_day = (q * bcod_removed) / 1000; // kg/d
  const bod_removed_day = (q * (bod_in - 3.0)) / 1000; // kg/d loại bỏ (giả định soluble effluent BOD = 3)
  const y_tss_obs = (p_tss_day / 1000) / bod_removed_day;
  const y_vss_obs = (p_vss_day / 1000) / bod_removed_day;

  // (11) Tính toán nhu cầu hấp thụ Oxy sinh học thực tế tổng cộng (Ro)
  const r_o_day = (q * bcod_removed / 1000) - (1.42 * p_bio_total / 1000) + (4.33 * q * no_x_n / 1000);
  const r_o_hour = r_o_day / 24;

  // (12) Kiểm soát cân bằng hóa học độ kiềm hệ thống nhằm duy trì pH dung dịch
  const alkalinity_nitrification = 7.14 * no_x_n;
  const alkalinity_safety_residual = 75; // Đảm bảo lượng dư an toàn ổn định pH chống sốc vi sinh
  const alkalinity_required_total = alkalinity_safety_residual + alkalinity_nitrification;
  const alkalinity_deficit = alkalinity_required_total - alkalinity_in;
  const alkalinity_required_daily = alkalinity_deficit > 0 ? (alkalinity_deficit * q / 1000) : 0;

  // (13) Ước tính tổng nồng độ ô nhiễm hữu cơ BOD dòng ra sau bể lắng hai
  const tss_effluent_assumed = 8.0; 
  const bod_soluble_effluent = 3.0;
  const effluent_total_bod = bod_soluble_effluent + (1 / 1.42) * 0.85 * tss_effluent_assumed;

  // (14) Luận chứng kích thước và thiết kế thông số cơ bản bể lắng thứ cấp
  const x_r_tss = 7500; // Giả định nồng độ bùn đặc dòng tuần hoàn lắng hai đạt 7,500 g/m3
  const sludge_return_ratio = x_tss / (x_r_tss - x_tss);
  const hydraulic_application_rate = 25; // Tải trọng thủy lực chuẩn m3/m2.ngày
  const clarifier_area = q / hydraulic_application_rate;
  const clarifier_diameter = Math.sqrt(((clarifier_area / 2) * 4) / Math.PI); // Thiết kế phân tách cho 2 bể lắng ly tâm

  // (15) Kiểm tra kiểm soát tải trọng chất rắn lơ lửng bề mặt lắng hai (Solids Loading Rate)
  const solids_loading_rate = ((1 + sludge_return_ratio) * q * x_tss) / (clarifier_area * 24 * 1000);

  return {
    q, s_0, bod_in, tss_in, vss_in, vss_nb, nh4_in, alkalinity_in, temp, s_eff, nh4_eff, x_tss, safety_factor, do_basin,
    mu_n, srt_theoretical, srt_design, p_bio_hetero, p_debris, p_bio_nitrifier, p_bio_total, no_x_n, p_vss_day, p_tss_day,
    mass_vss_basin, mass_tss_basin, v_tank, v_per_tank, hrt_hours, vss_tss_ratio, x_vss, f_m_ratio, volumetric_loading,
    cod_removed_day, bod_removed_day, y_tss_obs, y_vss_obs, r_o_day, r_o_hour, alkalinity_nitrification,
    alkalinity_required_total, alkalinity_required_daily, effluent_total_bod, sludge_return_ratio,
    clarifier_area, clarifier_diameter, solids_loading_rate
  };
}
