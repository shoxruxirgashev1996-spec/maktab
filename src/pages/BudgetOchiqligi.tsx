import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign, Calendar, ChevronDown } from 'lucide-react';

const budgetData = [
  { name: 'Daromad', value: 6800000000, color: '#003366' },
  { name: 'Xarajat', value: 6800000000, color: '#10b981' },
];

const expenditureDetails = [
  { item: 'O\'qituvchilar maoshi', amount: 3200000000 },
  { item: 'O\'quv jihozlari va inventarlar', amount: 1250000000 },
  { item: 'Kommunal xizmatlar', amount: 650000000 },
  { item: "Ta'mirlash ishlari", amount: 800000000 },
  { item: 'Boshqa xarajatlar', amount: 900000000 },
];

const tenders = [
  { name: 'Kompyuter uskunalari', provider: 'Techno Servis MCHJ', amount: 450000000, date: '12.04.2024' },
  { name: 'Maktab mebellari', provider: 'School Furniture MCHJ', amount: 300000000, date: '18.04.2024' },
  { name: 'Laboratoriya jihozlari', provider: 'LabTech MCHJ', amount: 500000000, date: '25.04.2024' },
];

export default function BudgetOchiqligi() {
  const totalBudget = 6800000000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em]">Moliyaviy hisobotlar</h2>
           <h1 className="text-4xl font-black text-gray-900 uppercase">Budjet ochiqligi</h1>
        </div>
        <div className="flex space-x-4">
           <div className="relative group">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold flex items-center shadow-sm">
               Yil tanlang: <span className="text-[#003366] ml-2">2024</span> <ChevronDown className="ml-2 w-4 h-4" />
             </button>
           </div>
           <div className="relative group">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold flex items-center shadow-sm">
               Chorak: <span className="text-[#003366] ml-2">2-chorak</span> <ChevronDown className="ml-2 w-4 h-4" />
             </button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Daromad va Xarajatlar Chart */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
          <h3 className="text-xl font-black text-[#003366] uppercase mb-10 self-start">Daromad va xarajatlar</h3>
          <div className="w-full h-80 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900">6.8</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">milliard so'm</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 w-full">
             <div className="flex items-center space-x-3">
               <div className="w-3 h-3 rounded-full bg-[#003366]"></div>
               <div className="text-xs font-bold text-gray-500 uppercase">Daromad: 6.8 mlrd</div>
             </div>
             <div className="flex items-center space-x-3">
               <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
               <div className="text-xs font-bold text-gray-500 uppercase">Xarajat: 6.8 mlrd</div>
             </div>
          </div>
        </div>

        {/* Xarajatlar Tafsiloti */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-black text-[#003366] uppercase mb-10">Xarajatlar tafsiloti</h3>
          <div className="space-y-6">
            {expenditureDetails.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">{item.item}</span>
                  <span className="font-bold text-gray-900">{item.amount.toLocaleString()} so'm</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#003366] rounded-full"
                    style={{ width: `${(item.amount / totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
               <span className="text-lg font-black text-[#003366] uppercase">Jami</span>
               <span className="text-xl font-black text-gray-900">{totalBudget.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hisobotlar */}
        <div className="space-y-8">
           <h3 className="text-2xl font-black text-[#003366] uppercase">Hisobotlar</h3>
           <div className="space-y-4">
              {[1, 2, 3].map((q) => (
                <div key={q} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-[#003366] rounded-xl group-hover:bg-[#003366] group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">2024-yil {q}-chorak hisoboti</h4>
                      <p className="text-xs text-gray-400 uppercase font-bold">PDF | 1.4 MB</p>
                    </div>
                  </div>
                  <button className="p-3 text-gray-400 hover:text-[#003366] transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Davlat xaridlari (Tenderlar) */}
        <div className="space-y-8">
           <div className="flex justify-between items-end">
             <h3 className="text-2xl font-black text-[#003366] uppercase">Davlat xaridlari (Tenderlar)</h3>
             <button className="text-sm font-bold text-gray-400 hover:text-[#003366] flex items-center">
               Barchasi <TrendingUp className="ml-1 w-4 h-4" />
             </button>
           </div>
           <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
             <table className="w-full text-left bg-white min-w-[500px]">
               <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                   <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Nomi</th>
                   <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Yetkazib beruvchi</th>
                   <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Summa (so'm)</th>
                   <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Sana</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {tenders.map((t, i) => (
                   <tr key={i} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-sm font-bold text-gray-900">{t.name}</td>
                     <td className="px-6 py-4 text-sm text-gray-500 italic">"{t.provider}"</td>
                     <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">{t.amount.toLocaleString()}</td>
                     <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">{t.date}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
