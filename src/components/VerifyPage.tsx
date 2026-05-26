import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  ChevronLeft, 
  Sparkles, 
  Check, 
  Phone, 
  Globe, 
  Mail, 
  FileText 
} from 'lucide-react';
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
  const phone = searchParams.get('phone') || ''; 
  const nationality = searchParams.get('nationality') || '';
  const email = searchParams.get('email') || '';
  const destination = searchParams.get('destination') || '';
  const notes = searchParams.get('notes') || '';

  // Format destination nice text
  const formattedDestination = destination.toLowerCase() === 'danang' 
    ? 'Da Nang, Vietnam' 
    : (destination.toLowerCase() === 'hcm' || destination.toLowerCase() === 'hochiminh' 
      ? 'Ho Chi Minh, Vietnam' 
      : destination);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-[#F4F3EF] to-[#FAF9F6] text-[#1a1c1e] pt-8 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-start font-sans">
      
      {/* Background radial gradient decor for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#FFD151]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/50">
          <button 
            id="back-to-home-btn"
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-950 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFB800] stroke-[3]" /> Back to Home
          </button>
          
          <div className="p-0.5">
            <Logo size="sm" variant="full" />
          </div>
        </div>

        {/* Dynamic Verifiable Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div id="verified-icon-container" className="relative mb-4">
            {/* Smooth animated concentric radial glow rings */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.35, 0.12] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-5 rounded-full bg-emerald-500/20 blur-md pointer-events-none"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_10px_25px_rgba(16,185,129,0.22)]"
            >
              <Check className="w-8 h-8 text-white stroke-[3.5]" />
            </motion.div>
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FFB800] mb-1">UCSMILE SECURE GATEWAY</span>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight uppercase">Booking Verified</h1>
        </div>

        {/* Elegant Boarding Pass Style Card */}
        <div id="boarding-pass-card" className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.06)] relative">
          
          {/* Header Band */}
          <div className="py-4 px-8 text-center border-b border-gray-100 bg-[#FAF9F5]/80">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-emerald-600 tracking-[0.25em] uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Check-In Pass
            </div>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Top Row: Booking ID & Status with Symmetrical Flex */}
            <div className="flex justify-between items-start pb-5 border-b border-gray-100">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-extrabold block mb-1">PASS CODE</span>
                <span className="text-base font-black text-gray-950 tracking-tight font-mono uppercase">{bookingId}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-extrabold block mb-1.5">STATUS</span>
                <span className="inline-flex bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            {/* Core Details Grid / Column Stack */}
            <div className="space-y-5">
              
              {/* Patient Block */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-[#FFB800] border border-[#FFB800]/10 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold block mb-0.5">Patient Name</span>
                  <span className="text-base font-black text-gray-950 uppercase tracking-wide">{patientName}</span>
                </div>
              </div>

              {/* Nationality Information */}
              {nationality && nationality !== 'N/A' && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-[#FFB800] border border-[#FFB800]/10 shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-grow">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold block mb-0.5">Nationality</span>
                    <span className="text-sm font-bold text-gray-800">{nationality}</span>
                  </div>
                </div>
              )}

              {/* Patient Contact Cards (Grid-optimized) */}
              {(phone || email) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  {phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500 border border-emerald-100">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold block">Phone Contact</span>
                        <span className="text-xs font-bold text-gray-700 block truncate">{phone}</span>
                      </div>
                    </div>
                  )}

                  {email && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 border border-blue-100">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold block">Email Address</span>
                        <span className="text-xs font-bold text-gray-700 block truncate" title={email}>{email}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Treatment Selected */}
              <div className="flex items-start gap-4 pt-3 border-t border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-[#FFB800] border border-[#FFB800]/10 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold block mb-0.5">Requested Treatment</span>
                  <span className="text-sm font-extrabold text-[#1a1c1e]">{service}</span>
                </div>
              </div>

              {/* Medical Dental Clinic & Target Destination Destination details */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-[#FFB800] border border-[#FFB800]/10 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold block mb-0.5">Assigned Dental Clinic</span>
                  <span className="text-sm font-black text-[#FFB800] uppercase tracking-tight block">
                    {clinic}
                  </span>
                  {formattedDestination && (
                    <span className="text-[11px] font-bold text-gray-500 mt-1 block">
                      Location Venue: {formattedDestination}
                    </span>
                  )}
                </div>
              </div>

              {/* Appointment Schedule Time block */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-[#FFB800] border border-[#FFB800]/10 shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold block mb-0.5">Appointment Schedule</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-gray-950">{date}</span>
                    <span className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">{session}</span>
                  </div>
                </div>
              </div>

              {/* Specialized patient notes */}
              {notes && (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] uppercase tracking-widest text-orange-600 font-extrabold block">Special Requests & Notes</span>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold whitespace-pre-wrap leading-relaxed italic bg-[#FAF9F5] p-3.5 rounded-xl border border-gray-200/50">
                    "{notes}"
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Ticket structural punched coupon boundary lines */}
          <div className="relative h-4 flex items-center justify-between pointer-events-none">
            <div className="w-4 h-8 rounded-r-full bg-[#FAF9F6] -ml-[1px] border-r border-t border-b border-gray-100" />
            <div className="w-full border-t border-dashed border-gray-200 mx-5" />
            <div className="w-4 h-8 rounded-l-full bg-[#FAF9F6] -mr-[1px] border-l border-t border-b border-gray-100" />
          </div>
        </div>

        {/* Action button redirect & status footprint signature */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <button 
            id="go-home-footer-btn"
            onClick={() => navigate('/')}
            className="px-10 py-3.5 bg-gray-950 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FFB800] hover:text-gray-950 transition-all shadow-[0_15px_30px_rgba(26,28,30,0.12)] flex items-center gap-1.5"
          >
            Return to UCSmile Home
          </button>
          
        </div>
      </div>
    </div>
  );
}
