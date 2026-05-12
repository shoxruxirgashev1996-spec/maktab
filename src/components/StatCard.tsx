import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  green: 'bg-emerald-50 text-emerald-600',
};

export default function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 lg:p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-500 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[80px] -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors"></div>
      
      <div className={cn("p-5 rounded-3xl relative z-10", colorMap[color] || colorMap.blue)}>
        <Icon className="w-10 h-10" />
      </div>
      <div className="relative z-10">
        <div className="text-4xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</div>
      </div>
    </div>
  );
}
