//src/app/(public)/wastewater/OxygenDemand/page.tsx
//import { AerotankReportView, AerotankInputs } from "./AerationReport__";

//-> OK
//import { AerotankReportView, AerotankInputs } from "./AerationTank__";

/*
import { AerotankReportView, AerotankInputs } from "./AerationRepot_To_Pdf";


export default function Page() {
  // Dữ liệu chuẩn từ sách Metcalf & Eddy bài 8-22
  const sampleData: AerotankInputs = {
    q: 2500.0,
    s_0: 1200.0,
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
*/

"use client"; // Dùng nếu bạn đang ở Next.js App Router

import { useState } from "react";
import AerotankForm from "./input/AerationForm";
import { AerotankInputs } from "./input/schema";
import { AerotankReportView } from "./AerationRepot_To_Pdf";

export default function Page() {
  // Dữ liệu chuẩn ban đầu từ sách Metcalf & Eddy bài 8-22
  const [data, setData] = useState<AerotankInputs>({
    q: 2500.0,
    s_0: 1200.0,
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
  });

  return (
    <>
      {/* Form nhập liệu */}
      <AerotankForm defaultData={data} onSubmitData={setData} />
      
      {/* View báo cáo / Kết quả tính toán */}
      <div className="bg-white p-0 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Kết Quả Báo Cáo</h2>
        <AerotankReportView data={data} />
      </div>
    </>
  );
}

/*
    <div className="max-w-6xl mx-auto p-4 space-y-8 bg-gray-50 min-h-screen">

      <AerotankForm defaultData={data} onSubmitData={setData} />
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Kết Quả Báo Cáo</h2>
        <AerotankReportView data={data} />
      </div>
    </div>

*/


