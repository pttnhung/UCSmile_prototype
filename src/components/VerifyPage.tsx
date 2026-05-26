import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, MapPin, User, ChevronLeft, Sparkles, Check, Phone } from 'lucide-react';
import Logo from './Logo';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse parameters from verification URL
  const bookingId = searchParams.get('id') || 'UCS-PENDING-XX';
  const patientName = searchParams.get('name') || 'Valued Guest';
  const service = searchParams.get('service') || 'Premium Dental Solution';
  const clinic = searchParams.get('clinic') || 'Any Vetted Partner Clinic';
  const date = searchParams.get('date') || 'To Be Arranged';
  const session = searchParams.get('session') || 'Flexible Time Window';
  const phone = searchParams.get('phone') || ''; // Optional contact

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-[#F4F3EF] to-[#FAF9F6] text-[#1a1c1e] pt-12 pb-24 px-4 relative overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Soft elegant golden background decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FFD151]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Navigation top link & branded title */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFB800]" /> Back to Home
          </button>
          <Logo size="sm" variant="full" />
        </div>

        {/* Dynamic Verification Icon Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Concentric ripple effects for premium touch feedback */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_15px_35px_rgba(16,185,129,0.25)]"
            >
              <Check className="w-10 h-10 text-white stroke-[3.5]" />
            </motion.div>
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FFB800] mb-1">UCSMILE SECURE GATEWAY</span>
          <h1 className="text-2xl font-black text-[#1a1c1e] tracking-tight uppercase">Booking Verified</h1>
          <p className="text-gray-500 text-xs font-semibold mt-1">Official clinic coordination security ticket</p>
        </div>

        {/* Boarding Pass Style Card - LIGHT THEMED & SEAMLESS */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.06)] relative">
          
          {/* Header Band */}
          <div className="py-6 px-8 text-center border-b border-gray-100 bg-gray-50/50 relative">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-[#FFB800] tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Priority Check-In Pass
            </div>
          </div>

          {/* Details body */}
          <div className="p-8 space-y-7">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Pass ID Code</span>
                <span className="text-base font-black text-[#1a1c1e] tracking-tight font-mono">{bookingId}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Status</span>
                <span className="inline-flex bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">PATIENT NAME</span>
                  <span className="text-sm font-black text-[#1a1c1e] uppercase tracking-wide">{patientName}</span>
                </div>
              </div>

              {phone && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">WHATSAPP CONTACT</span>
                    <span className="text-sm font-bold text-gray-700">{phone}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Sparkles className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">TREATMENT NEEDED</span>
                  <span className="text-sm font-bold text-gray-800">{service}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">DENTAL CLINIC</span>
                  <span className="text-sm font-black text-brand-secondary uppercase tracking-tight">{clinic}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">APPOINTMENT SCHEDULE</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[#1a1c1e]">{date}</span>
                    <span className="text-xs text-gray-500 font-medium mt-0.5">{session}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket style horizontal dashed punch lines */}
          <div className="relative h-4 flex items-center justify-between pointer-events-none">
            <div className="w-5 h-10 rounded-r-full bg-[#FAF9F6] -ml-[10px] border-r border-t border-b border-gray-100" />
            <div className="w-full border-t border-dashed border-gray-200 mx-6" />
            <div className="w-5 h-10 rounded-l-full bg-[#FAF9F6] -mr-[10px] border-l border-t border-b border-gray-100" />
          </div>

          {/* Official Footnote notes area */}
          <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              This check-in pass has been digitally pre-verified and generated by the UCSMILE Global Patient Concierge program. Admitting clinics are requested to extend priority reception service to this patient.
            </p>
          </div>
        </div>

        {/* Bottom verification action controls */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFB800] hover:text-gray-950 transition-all shadow-[0_15px_30px_rgba(26,28,30,0.1)] flex items-center gap-1.5"
          >
            Go to UCSmile Home
          </button>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">Authenticated Security Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
