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
    <div className="min-h-screen bg-[#111214] text-white pt-28 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Top Logo and back link */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-brand-primary" /> Back to Home
          </button>
          <Logo size="sm" variant="full" />
        </div>

        {/* Pulse Check Animation */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full bg-[#10B981]/20 blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-tr from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center border-4 border-emerald-950/50 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
            >
              <Check className="w-10 h-10 text-[#111214] stroke-[3.5]" />
            </motion.div>
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FFD151] mb-1">UCSmile Secure Gateway</span>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Booking Verified</h1>
          <p className="text-gray-400 text-xs mt-1">Official clinic coordination security ticket</p>
        </div>

        {/* Boarding Pass Style Card */}
        <div className="bg-[#1a1c1f]/80 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
          
          {/* Header Band */}
          <div className="p-6 text-center border-b border-white/5 bg-gradient-to-r from-[#212328] via-[#1a1c1f] to-[#212328] relative">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-primary tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" /> Priority Check-In Pass
            </div>
          </div>

          {/* Details body */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/5">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Pass ID Code</span>
                <span className="text-base font-black text-brand-primary tracking-tight font-mono">{bookingId}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Status</span>
                <span className="inline-block bg-emerald-950/60 border border-emerald-500/20 text-[#34D399] text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full">
                  ● ACTIVE
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-brand-primary mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-black block">PATIENT NAME</span>
                  <span className="text-sm font-bold text-white uppercase">{patientName}</span>
                </div>
              </div>

              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-primary mt-0.5" />
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-black block">WHATSAPP CONTACT</span>
                    <span className="text-sm font-bold text-gray-200">{phone}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-brand-primary mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-black block">TREATMENT SCHEDULED</span>
                  <span className="text-sm font-bold text-white">{service}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-primary mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-black block">DENTAL CLINIC</span>
                  <span className="text-sm font-bold text-brand-primary uppercase">{clinic}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand-primary mt-0.5" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-black block">APPOINTMENT SCHEDULE</span>
                  <div className="text-sm font-bold text-white flex flex-col">
                    <span>{date}</span>
                    <span className="text-xs text-gray-400 font-normal mt-0.5">{session}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket styling visual left/right semi-circle ticket punches */}
          <div className="relative h-4 flex items-center justify-between pointer-events-none">
            <div className="w-5 h-10 rounded-r-full bg-[#111214] -ml-[10px] border-r border-t border-b border-white/5" />
            <div className="w-full border-t border-dashed border-white/10 mx-6" />
            <div className="w-5 h-10 rounded-l-full bg-[#111214] -mr-[10px] border-l border-t border-b border-white/5" />
          </div>

          {/* Info note segment at the ticket root */}
          <div className="p-8 bg-[#212328]/35 border-t border-white/5 flex flex-col items-center">
            <p className="text-[11px] text-gray-400 text-center leading-relaxed font-semibold">
              Presented check-in ticket is securely authenticated under the UCSmile international concierge program. Clinics are requested to extend priority service booking arrangements to this passenger.
            </p>
          </div>
        </div>

        {/* Verification footer actions */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-brand-primary text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white hover:text-gray-900 transition-all shadow-[0_10px_25px_rgba(255,209,81,0.15)] flex items-center gap-1.5"
          >
            Go to UCSmile Home
          </button>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">Powered by UCSMILE Platform</p>
        </div>
      </div>
    </div>
  );
}
