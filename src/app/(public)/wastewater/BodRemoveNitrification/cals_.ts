// lib/aerotank-calc.ts

export interface AerotankInputs {
  q: number;               // Lưu lượng nước thải (Q), m3/d
  s_0: number;             // Biodegradable COD dòng vào (COD_b_in), g/m3
  bod_in: number;          // BOD5 dòng vào, g/m3
  tss_in: number;          // TSS dòng vào, g/m3
  vss_in: number;          // VSS dòng vào, g/m3
  vss_nb: number;          // Nonbiodegradable VSS dòng vào, g/m3
  nh4_in: number;          // NH4-N dòng vào, g/m3
  alkalinity_in: number;   // Độ kiềm tổng dòng vào, g/m3 as CaCO3
  temp: number;            // Nhiệt độ vận hành calculations, °C
  
  // Khống chế chỉ tiêu dòng ra mục tiêu
  s_eff: number;           // Biodegradable COD dòng ra, g/m3
  nh4_eff: number;         // NH4-N dòng ra mục tiêu, g/m3
  
  // Thông số thiết kế hệ thống
  x_tss: number;           // Nồng độ MLSS thiết kế trong bể Aerotank, g/m3
  safety_factor: number;   // Hệ số an toàn thiết kế vi sinh (SF)
  do_basin: number;        // Nồng độ DO duy trì trong bể sục khí, g/m3
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
  
  // Kết quả các bước chi tiết
  mu_n: number;
  srt_theoretical: number;
  srt_design: number;
  p_bio_hetero: number;
  p_debris: number;
  p_bio_nitrifier: number;
  p_bio_total: number;
  no_x_n: number;
  p_vss_day: number;
  p_tss_day: number;
  mass_vss_basin: number;
  mass_tss_basin: number;
  v_tank: number;
  v_per_tank: number;
  hrt_hours: number;
  vss_tss_ratio: number;
  x_vss: number;
  f_m_ratio: number;
  volumetric_loading: number;
  cod_removed_day: number;
  bod_removed_day: number;
  y_tss_obs: number;
  y_vss_obs: number;
  r_o_day: number;
  r_o_hour: number;
  alkalinity_nitrification: number;
  alkalinity_required_total: number;
  alkalinity_required_daily: number;
  effluent_total_bod: number;
  sludge_return_ratio: number;
  clarifier_area: number;
  clarifier_diameter: number;
  solids_loading_rate: number;
}

export function calculateAerotank(data: AerotankInputs): AerotankOutputs {
  // Hệ số động học cố định theo tài liệu tiêu chuẩn Metcalf & Eddy
  const mu_n_max = 0.50; // d^-1
  const k_n = 0.60;      // g/m3
  const k_dn = 0.05;     // d^-1
  const y_n = 0.10;      // g VSS/g NH4-N
  
  const mu_m = 3.5;      // d^-1
  const k_d = 0.088;     // d^-1
  const k_o = 0.60;      // g/m3
  const y_hetero = 0.35; // g VSS/g bCOD
  const f_d = 0.15;      
  
  const {
    q, s_0, bod_in, tss_in, vss_in, vss_nb, nh4_in, alkalinity_in, temp,
    s_eff, nh4_eff, x_tss, safety_factor, do_basin
  } = data;

  // (1) Determine the specific growth rate mu_n for nitrifying bacteria
  const mu_n = (mu_n_max * nh4_eff / (k_n + nh4_eff)) * (do_basin / (k_o + do_basin)) - k_dn;

  // (2) Determine the theoretical SRT and design SRT
  const srt_theoretical = 1 / mu_n;
  const srt_design = safety_factor * srt_theoretical;

  // (3) Determine biomass synthesized (P_bio) phân rã từng cấu phần
  const bcod_removed = s_0 - s_eff;
  const p_bio_hetero = (q * y_hetero * bcod_removed) / (1 + k_d * srt_design);
  const p_debris = (f_d * k_d * q * y_hetero * bcod_removed * srt_design) / (1 + k_d * srt_design);
  const p_bio_nitrifier = (q * y_n * nh4_in) / (1 + k_dn * srt_design);
  const p_bio_total = p_bio_hetero + p_debris + p_bio_nitrifier; // đơn vị: g VSS/d

  // (4) Determine the amount of nitrogen oxidized to nitrate (NOx-N)
  const no_x_n = nh4_in - nh4_eff - (0.12 * p_bio_total / q);

  // (5) Determine the concentration and mass of VSS and TSS in the aeration basin
  const p_vss_day = p_bio_total + (q * vss_nb); // g VSS/d
  const p_tss_day = (p_bio_total / 0.85) + (q * vss_nb) + (q * (tss_in - vss_in)); // g TSS/d

  const mass_vss_basin = (p_vss_day * srt_design) / 1000; // kg
  const mass_tss_basin = (p_tss_day * srt_design) / 1000; // kg

  // (6) Determine the aeration tank volume (V)
  const v_tank = (mass_tss_basin * 1000) / x_tss; // m3
  const v_per_tank = v_tank / 2; // Chia làm 2 đơn nguyên bể

  // (7) Determine the hydraulic retention time (HRT)
  const hrt_hours = (v_tank / q) * 24;

  // (8) Determine VSS (X_vss) fraction and concentration
  const vss_tss_ratio = mass_vss_basin / mass_tss_basin;
  const x_vss = vss_tss_ratio * x_tss;

  // (9) Determine F/M ratio and BOD volumetric loading rate
  const f_m_ratio = (q * bod_in) / (x_vss * v_tank);
  const volumetric_loading = (q * bod_in) / (v_tank * 1000); // kg BOD/m3.d

  // (10) Determine the observed growth yield based on TSS and VSS
  const cod_removed_day = q * bcod_removed / 1000; // kg/d
  const bod_removed_day = cod_removed_day / 1.6;  // kg/d
  const y_tss_obs = (p_tss_day / 1000) / bod_removed_day;
  const y_vss_obs = (p_vss_day / 1000) / bod_removed_day;

  // (11) Calculate the oxygen demand (Ro)
  const r_o_day = (q * bcod_removed / 1000) - (1.42 * p_bio_total / 1000) + (4.33 * q * no_x_n / 1000);
  const r_o_hour = r_o_day / 24;

  // (12) Check alkalinity
  const alkalinity_nitrification = 7.14 * no_x_n;
  const alkalinity_safety_residual = 75;
  const alkalinity_required_total = alkalinity_safety_residual + alkalinity_nitrification;
  const alkalinity_deficit = alkalinity_required_total - alkalinity_in;
  const alkalinity_required_daily = alkalinity_deficit > 0 ? (alkalinity_deficit * q / 1000) : 0;

  // (13) Estimate the total BOD in effluent
  const tss_effluent_assumed = 8.0; 
  const bod_soluble_effluent = 3.0;
  const effluent_total_bod = bod_soluble_effluent + (1 / 1.42) * 0.85 * tss_effluent_assumed;

  // (14) Design the secondary clarifier
  const x_r_tss = 7500;
  const sludge_return_ratio = x_tss / (x_r_tss - x_tss);
  const hydraulic_application_rate = 25; // m3/m2.d
  const clarifier_area = q / hydraulic_application_rate;
  const clarifier_diameter = Math.sqrt((clarifier_area / 2 * 4) / Math.PI); // tính riêng từng cái (2 bể lắng)

  // (15) Check solids loading to the secondary clarifier
  const solids_loading_rate = ((1 + sludge_return_ratio) * q * x_tss) / (clarifier_area * 24 * 1000); // kg TSS/m2.h
// lib/aerotank-calc.ts
// ... (Các phần tính toán phía trên giữ nguyên)

  return {
    q, s_0, bod_in, tss_in, vss_in, vss_nb, nh4_in, alkalinity_in, temp, s_eff, nh4_eff, x_tss, safety_factor, do_basin,
    mu_n, srt_theoretical, srt_design, 
    p_bio_hetero, p_debris, p_bio_nitrifier, // ✨ ĐẢM BẢO ĐÃ THÊM 3 DÒNG NÀY VÀO ĐÂY
    p_bio_total, no_x_n, p_vss_day, p_tss_day,
    mass_vss_basin, mass_tss_basin, v_tank, v_per_tank, hrt_hours, vss_tss_ratio, x_vss, f_m_ratio, volumetric_loading,
    cod_removed_day, bod_removed_day, y_tss_obs, y_vss_obs, r_o_day, r_o_hour, alkalinity_nitrification,
    alkalinity_required_total, alkalinity_required_daily, effluent_total_bod, sludge_return_ratio,
    clarifier_area, clarifier_diameter, solids_loading_rate
  };
}


/*
  return {
    q, s_0, bod_in, tss_in, vss_in, vss_nb, nh4_in, alkalinity_in, temp, s_eff, nh4_eff, x_tss, safety_factor, do_basin,
    mu_n, srt_theoretical, srt_design, p_bio_hetero, p_debris, p_bio_nitrifier, p_bio_total, no_x_n, p_vss_day, p_tss_day,
    mass_vss_basin, mass_tss_basin, v_tank, v_per_tank, hrt_hours, vss_tss_ratio, x_vss, f_m_ratio, volumetric_loading,
    cod_removed_day, bod_removed_day, y_tss_obs, y_vss_obs, r_o_day, r_o_hour, alkalinity_nitrification,
    alkalinity_required_total, alkalinity_required_daily, effluent_total_bod, sludge_return_ratio,
    clarifier_area, clarifier_diameter, solids_loading_rate
  };
}
*/
