export const MOCK_PROVINCES = [
  { id: 201, name: "Hà Nội" },
  { id: 202, name: "Hồ Chí Minh" },
  { id: 203, name: "Đà Nẵng" }
];

export const MOCK_DISTRICTS: Record<number, { id: number, name: string }[]> = {
  201: [
    { id: 1001, name: "Quận Ba Đình" },
    { id: 1002, name: "Quận Hoàn Kiếm" }
  ],
  202: [
    { id: 2001, name: "Quận 1" },
    { id: 2002, name: "Quận 3" },
    { id: 2003, name: "Quận Bình Thạnh" }
  ],
  203: [
    { id: 3001, name: "Quận Hải Châu" },
    { id: 3002, name: "Quận Liên Chiểu" }
  ]
};

export const MOCK_WARDS: Record<number, { code: string, name: string }[]> = {
  // Quận 1 (TP.HCM)
  2001: [
    { code: "W01", name: "Phường Bến Nghé" },
    { code: "W02", name: "Phường Đa Kao" }
  ],
  // Quận Hoàn Kiếm (Hà Nội)
  1002: [
    { code: "W03", name: "Phường Phan Chu Trinh" },
    { code: "W04", name: "Phường Hàng Bài" }
  ],
  // Quận Hải Châu (Đà Nẵng)
  3001: [
    { code: "W05", name: "Phường Thạch Thang" },
    { code: "W06", name: "Phường Hòa Thuận Đông" }
  ]
};
