// lib/aerotank-calc.ts

export interface AerotankInputs {
  // Thông số lưu lượng và ô nhiễm đầu vào
  q: number;               // Lưu lượng nước thải (Q), m3/day
  s_0: number;             // bCOD đầu vào (COD_b_in), g/m3 (mg/L)
  bod_in: number;          // BOD đầu vào (BOD_in), g/m3
  nh4_in: number;          // NH4-N đầu vào (NH4-N_in), g/m3
  alkalinity_in: number;   // Độ kiềm đầu vào, g/m3 as CaCO3
  temp: number;            // Nhiệt độ thiết kế (T), °C
  
  // Nồng độ chất rắn lơ lửng đầu vào
  tss_in: number;          // TSS dòng vào, g/m3
  vss_in: number;          // VSS dòng vào, g/m3
  vss_nb: number;          // VSS không phân hủy sinh học (VSS_nb), g/m3
  
  // Khống chế vận hành hệ thống
  x_tss: number;           // Nồng độ MLSS thiết kế trong bể (X_TSS), g/m3
  safety_factor: number;   // Hệ số an toàn thiết kế vi sinh nitơ (SF)
  do_target: number;       // Nồng độ DO duy trì trong bể, g/m3
  
  // Chỉ tiêu chất lượng nước đầu ra mục tiêu
  s_eff_target: number;    // bCOD dòng ra mục tiêu, g/m3
  nh4_eff_target: number;  // NH4-N dòng ra mục tiêu, g/m3
}

export interface AerotankOutputs {
  q: number;
  s_0: number;
  nh4_in: number;
  temp: number;
  mu_n: number;            // Tốc độ tăng trưởng cụ thể của VK nitơ, d^-1
  srt_theoretical: number; // Tuổi bùn lý thuyết, ngày
  srt_design: number;      // Tuổi bùn thiết kế, ngày
  p_bio: number;           // Lượng sinh khối tổng hợp, kg VSS/day
  no_x_n: number;          // Lượng Nitơ bị oxy hóa, g/m3
  p_vss: number;           // Lượng bùn xả phát sinh tính theo VSS, kg/day
  p_tss: number;           // Lượng bùn xả phát sinh tính theo TSS, kg/day
  v_tank: number;          // Thể tích bể phản ứng Aerotank yêu cầu, m3
  hrt_hours: number;       // Thời gian lưu nước (HRT), giờ
  f_m_ratio: number;       // Tỷ số F/M, g BOD/g VSS.day
  volumetric_loading: number; // Tải trọng thể tích, kg BOD/m3.day
  r_o_day: number;         // Nhu cầu Oxy sinh học thực tế tổng cộng, kg O2/day
  r_o_hour: number;        // Nhu cầu Oxy sinh học trung bình mỗi giờ, kg O2/hour
  alkalinity_required_daily: number; // Lượng kiềm cần bổ sung thêm, kg/day as CaCO3
  effluent_total_bod: number; // BOD tổng đầu ra dự kiến, g/m3
  sludge_return_ratio: number; // Tỷ lệ tuần hoàn bùn hoạt tính (R)
}

export function calculateAerotank(data: AerotankInputs): AerotankOutputs {
  // 1. Hệ số động học cố định từ tài liệu thiết kế (Metcalf & Eddy)
  const mu_n_max = 0.50; // d^-1 (VK tự dưỡng)
  const k_n = 0.60;      // g/m3
  const k_dn = 0.05;     // d^-1
  const y_n = 0.10;      // g VSS/g NH4-N
  
  const mu_m = 3.5;      // d^-1 (VK dị dưỡng)
  const k_d = 0.088;     // d^-1
  const k_o = 0.60;      // g/m3
  const y_hetero = 0.35; // g VSS/g bCOD
  const f_d = 0.15;      // Thành phần mảnh vỡ tế bào trơ
  
  const {
    q, s_0, bod_in, nh4_in, alkalinity_in, temp,
    tss_in, vss_in, vss_nb, x_tss, safety_factor, do_target,
    s_eff_target, nh4_eff_target
  } = data;

  // Bước 1: Tính toán tốc độ tăng trưởng cụ thể mu_n của vi khuẩn nitơ hóa
  const mu_n = (mu_n_max * nh4_eff_target / (k_n + nh4_eff_target)) * (do_target / (k_o + do_target)) - k_dn;

  // Bước 2: Xác định tuổi lưu bùn sinh học (SRT)
  const srt_theoretical = 1 / mu_n;
  const srt_design = safety_factor * srt_theoretical;

  // Bước 3: Xác định sinh khối vi sinh vật tổng hợp sinh ra hàng ngày (P_bio)
  const bcod_removed = s_0 - s_eff_target;
  const heterotrophic_biomass = (q * y_hetero * bcod_removed) / (1 + k_d * srt_design);
  const cell_debris = (f_d * k_d * q * y_hetero * bcod_removed * srt_design) / (1 + k_d * srt_design);
  const nitrifier_biomass = (q * y_n * nh4_in) / (1 + k_dn * srt_design);
  const p_bio = (heterotrophic_biomass + cell_debris + nitrifier_biomass) / 1000; // Đổi từ g/day sang kg/day

  // Bước 4: Xác định lượng Nitơ chuyển hóa thành Nitrat (NOx-N)
  // Công thức: NOx-N = NH4-N_in - NH4-N_e - 0.12 * (P_bio_g) / Q
  const p_bio_g = p_bio * 1000;
  const no_x_n = nh4_in - nh4_eff_target - (0.12 * p_bio_g / q);

  // Bước 5: Xác định khối lượng và nồng độ chất rắn lơ lửng sinh ra (P_VSS & P_TSS)
  const p_vss = p_bio + (q * vss_nb / 1000);
  const p_tss = (p_bio / 0.85) + (q * vss_nb / 1000) + (q * (tss_in - vss_in) / 1000);

  // Bước 6: Xác định thể tích làm việc của bể Aerotank (V)
  const total_mass_tss_basin = p_tss * srt_design; // kg TSS trong hệ thống
  const v_tank = (total_mass_tss_basin * 1000) / x_tss;

  // Bước 7: Tính toán các chỉ số thủy lực học và tải trọng vận hành
  const hrt_hours = (v_tank / q) * 24;
  const vss_fraction = p_vss / p_tss;
  const x_vss = vss_fraction * x_tss;
  
  const f_m_ratio = (q * bod_in) / (x_vss * v_tank);
  const volumetric_loading = (q * bod_in) / (v_tank * 1000); // kg BOD/m3.day

  // Bước 11: Tính toán nhu cầu hấp thụ Oxy sinh học thực tế (R_o)
  // Ro = Q*(S0 - S) - 1.42*P_bio_hetero_debris + 4.33*Q*(NOx-N)
  const r_o_day = (q * bcod_removed / 1000) - (1.42 * p_bio) + (4.33 * q * no_x_n / 1000);
  const r_o_hour = r_o_day / 24;

  // Bước 12: Kiểm tra độ kiềm hệ thống và lượng kiềm bổ sung để giữ pH ổn định
  const alkalinity_used = 7.14 * no_x_n;
  const alkalinity_target_safety = 75; // Duy trì độ kiềm tối thiểu 75 g/m3 để ổn định pH 6.8-7.0
  const alkalinity_deficit = (alkalinity_target_safety + alkalinity_used) - alkalinity_in;
  const alkalinity_required_daily = alkalinity_deficit > 0 ? (alkalinity_deficit * q / 1000) : 0;

  // Bước 13: Ước tính tổng BOD đầu ra (bao gồm BOD hòa tan và hàm lượng chất rắn lơ lửng đầu ra)
  const tss_effluent_assumed = 8.0; // Tiêu chuẩn giả định dòng ra từ bể lắng sau
  const bod_soluble_effluent = 3.0;
  const effluent_total_bod = bod_soluble_effluent + (0.70 * 0.85 * tss_effluent_assumed);

  // Bước 14: Tỷ lệ tuần hoàn bùn hoạt tính (R), giả định nồng độ bùn tuần hoàn Xr = 7500 g/m3
  const x_r_tss = 7500;
  const sludge_return_ratio = x_tss / (x_r_tss - x_tss);

  return {
    q, s_0, nh4_in, temp, mu_n, srt_theoretical, srt_design, p_bio, no_x_n,
    p_vss, p_tss, v_tank, hrt_hours, f_m_ratio, volumetric_loading,
    r_o_day, r_o_hour, alkalinity_required_daily, effluent_total_bod, sludge_return_ratio
  };
}
