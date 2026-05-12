import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ManagementCardProps {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export default function ManagementCard({ name, role, image, bio }: ManagementCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-all duration-500">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="md:w-2/3 p-8 flex flex-col justify-center bg-white">
          <h3 className="text-2xl font-black text-gray-900 mb-1 leading-tight">{name}</h3>
          <p className="text-sm font-bold text-[#003366] uppercase tracking-wider mb-6">{role}</p>
          {bio && (
            <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
              "{bio}"
            </p>
          )}
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-50 hover:bg-blue-50 text-[#003366] rounded-lg transition-colors border border-gray-100">
               <Mail className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-50 hover:bg-blue-50 text-[#003366] rounded-lg transition-colors border border-gray-100">
               <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
