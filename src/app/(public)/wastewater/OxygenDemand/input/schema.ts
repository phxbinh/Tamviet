import { z } from "zod";

export const aerotankInputsSchema = z.object({
  q: z.number().positive("Lưu lượng (q) phải lớn hơn 0"),
  s_0: z.number().positive("BOD vào (s_0) phải lớn hơn 0"),
  temp: z.number().min(0, "Nhiệt độ không được âm"),
  x_tss: z.number().positive("Nồng độ bùn (x_tss) phải lớn hơn 0"),
  srt: z.number().positive("Thời gian lưu bùn (srt) phải lớn hơn 0"),
  bcod_bod_ratio: z.number().positive("Tỷ lệ bCOD/BOD phải lớn hơn 0"),
  alpha: z.number().min(0).max(1, "Alpha phải nằm trong khoảng 0 - 1"),
  f_factor: z.number().min(0).max(1, "F-factor phải nằm trong khoảng 0 - 1"),
  beta: z.number().min(0).max(1, "Beta phải nằm trong khoảng 0 - 1"),
  elevation: z.number().min(0, "Độ cao không được âm"),
  depth_sat: z.number().positive("Chiều sâu (depth_sat) phải lớn hơn 0"),
  ote: z.number().min(0).max(1, "Hiệu suất chuyển oxy (ote) từ 0 - 1"),
  do_target: z.number().min(0, "DO mục tiêu không được âm"),
  mu_max: z.number().positive("Tốc độ sinh trưởng tối đa (mu_max) phải lớn hơn 0"),
  k_s: z.number().positive("Hằng số nửa tốc độ (k_s) phải lớn hơn 0"),
  y_h: z.number().positive("Hệ số năng suất (y_h) phải lớn hơn 0"),
  b_h: z.number().positive("Hệ số nội bào (b_h) phải lớn hơn 0"),
  f_d: z.number().min(0).max(1, "Hệ số f_d phải nằm trong khoảng 0 - 1"),
});

// Export kiểu dữ liệu infer từ Zod để đồng bộ với AerotankInputs của bạn
export type AerotankInputs = z.infer<typeof aerotankInputsSchema>;
