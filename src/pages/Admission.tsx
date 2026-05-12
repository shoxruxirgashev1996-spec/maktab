import React, { useState } from 'react';
import { ChevronDown, Send, FileText, Calendar, CheckSquare, Search, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const steps = [
  { title: 'Qabul shartlari', content: 'Maktabimizga qabul qilish uchun o\'quvchilar ma\'lum bir sinovlardan o\'tishlari kerak. Sinovlar matematika, ona tili va mantiqiy fikrlash yo\'nalishlari bo\'yicha o\'tkaziladi.' },
  { title: 'Kerakli hujjatlar', content: '1. Tug\'ilganlik haqida guvohnoma nusxasi. 2. 3x4 rasm (4 dona). 3. Tibbiy ma\'lumotnoma. 4. Avvalgi maktabdan o\'rin-joy ma\'lumotnomasi.' },
  { title: 'Imtihon fanlari', content: 'Asosiy fanlar: Matematika, Ona tili va adabiyoti, Ingliz tili. Ixtisoslashtirilgan yo\'nalishlar uchun qo\'shimcha fanlar bo\'lishi mumkin.' },
];

export default function Admission() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', birthDate: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const path = 'admissions';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', phone: '', birthDate: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em]">Qabul 2024</h2>
        <h1 className="text-4xl font-black text-gray-900 uppercase">Qabul sahifasi</h1>
        <p className="text-gray-500 leading-relaxed">
          Ixtisoslashtirilgan maktabimizga hujjat topshirish va qabul jarayoni haqida to'liq ma'lumot olishingiz mumkin.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Accordion */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#003366] uppercase mb-8">Qabul haqida</h3>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900">{step.title}</span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", activeStep === idx && "rotate-180")} />
                </button>
                <div className={cn(
                  "px-6 transition-all duration-300 ease-in-out",
                  activeStep === idx ? "pb-6 max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {step.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mt-12">
             <h4 className="font-bold text-[#003366] mb-4 flex items-center">
               <Calendar className="w-5 h-5 mr-2" />
               Imtihon sanalari
             </h4>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">1-bosqich (online test)</span>
                 <span className="font-bold text-[#003366]">10-iyun – 12-iyun</span>
               </div>
               <div className="flex justify-between items-center text-sm border-t border-blue-200/50 pt-4">
                 <span className="text-gray-600">2-bosqich (yozma imtihon)</span>
                 <span className="font-bold text-[#003366]">15-iyun – 17-iyun</span>
               </div>
               <div className="flex justify-between items-center text-sm border-t border-blue-200/50 pt-4">
                 <span className="text-gray-600">3-bosqich (og'zaki suhbat)</span>
                 <span className="font-bold text-[#003366]">20-iyun – 22-iyun</span>
               </div>
             </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-black text-[#003366] uppercase mb-8">Onlayn ro'yxatdan o'tish</h3>
          {submitted ? (
            <div className="bg-green-50 p-8 rounded-2xl text-center space-y-4 border border-green-100">
               <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckSquare className="w-8 h-8" />
               </div>
               <h4 className="text-xl font-black text-green-900 uppercase">Muvaffaqiyatli!</h4>
               <p className="text-green-700">Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
               <button onClick={() => setSubmitted(false)} className="text-sm font-bold text-green-900 underline">Yana bitta ariza yuborish</button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ism</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Ismingizni kiriting"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:bg-white transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Familiya</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Familiyangizni kiriting"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Telefon raqam</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+998</span>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(__) ___-__-__"
                    className="w-full pl-16 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Tug'ilgan sana</label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:bg-white transition-all text-sm text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-[#003366] hover:bg-[#004a99] text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/40 flex items-center justify-center group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Yuborish <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Result Checker */}
      <section className="bg-blue-50/50 p-8 md:p-12 rounded-3xl border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
           <h3 className="text-2xl font-black text-[#003366] uppercase">Natijani tekshirish</h3>
           <p className="text-sm text-gray-500">ID raqamingiz orqali imtihon natijalarini bilib oling.</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
           <input
             type="text"
             placeholder="ID raqamingizni kiriting"
             className="flex-grow md:w-80 px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 text-sm shadow-sm"
           />
           <button className="px-8 py-4 bg-[#003366] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#004a99] transition-colors shadow-md">
             Tekshirish
           </button>
        </div>
      </section>
    </div>
  );
}
