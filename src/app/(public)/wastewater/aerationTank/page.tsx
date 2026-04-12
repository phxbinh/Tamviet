import AerationTank from "@/components/environments/wastewater/AerationTank"
import React from 'react';
export default function AerationTankCal() {



const NitrogenTable = () => {
  const data = [
    { form: 'Ammonia gas', abbrev: 'NH₃', definition: 'NH₃' },
    { form: 'Ammonium ion', abbrev: 'NH₄⁺', definition: 'NH₄⁺' },
    { form: 'Total ammonia nitrogen', abbrev: 'TANᵃ', definition: 'NH₃ + NH₄⁺' },
    { form: 'Nitrite', abbrev: 'NO₂⁻', definition: 'NO₂⁻' },
    { form: 'Nitrate', abbrev: 'NO₃⁻', definition: 'NO₃⁻' },
    { form: 'Total inorganic nitrogen', abbrev: 'TINᵃ', definition: 'NH₃ + NH₄⁺ + NO₂⁻ + NO₃⁻' },
    { form: 'Total Kjeldahl nitrogen', abbrev: 'TKNᵃ', definition: 'Organic N + NH₃ + NH₄⁺' },
    { form: 'Organic nitrogen', abbrev: 'Organic Nᵃ', definition: 'TKN – (NH₃ + NH₄⁺)' },
    { form: 'Total nitrogen', abbrev: 'TNᵃ', definition: 'Organic N + NH₃ + NH₄⁺ + NO₂⁻ + NO₃⁻' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-gray-800">
          <thead>
            <tr className="border-t-2 border-b-2 border-gray-300 bg-gray-50">
              <th className="py-3 px-4 font-bold text-lg">Form of nitrogen</th>
              <th className="py-3 px-4 font-bold text-lg">Abbrev.</th>
              <th className="py-3 px-4 font-bold text-lg">Definition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-700">{row.form}</td>
                <td className="py-3 px-4 font-medium">{row.abbrev}</td>
                <td className="py-3 px-4 text-gray-600">{row.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 border-t border-gray-300 pt-2 text-sm text-gray-500 italic">
        ᵃ All species expressed as N.
      </div>
    </div>
  );
};




    return (
<>
      <h1 className="text-2xl font-bold mb-6 text-center">Nitrogen Forms Table</h1>
      <NitrogenTable />


       <AerationTank />
</>
    );
}