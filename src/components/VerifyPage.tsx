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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-[#F4F3EF] to-[#FAF9F6] text-[#1a1c1e] pt-10 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-start font-sans">
      
      {/* Background radial gradient decor for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#FFD151]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200/40">
          <button 
            id="back-to-home-btn"
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFB800] stroke-[2.5]" /> Back to Home
          </button>
          
          <div className="p-0.5">
            <Logo size="sm" variant="full" />
          </div>
        </div>

        {/* Dynamic Verifiable Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div id="verified-icon-container" className="relative mb-3">
            {/* Smooth animated concentric radial glow rings */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.35, 0.12] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-sm pointer-events-none"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_8px_20px_rgba(16,185,129,0.15)]"
            >
              <Check className="w-6 h-6 text-white stroke-[3.5]" />
            </motion.div>
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#FFB800] mb-0.5">UCSmile Secure Gateway</span>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Booking Verified</h1>
        </div>

        {/* Elegant Boarding Pass Style Card */}
        <div id="boarding-pass-card" className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.05)] relative">
          
          {/* Header Band */}
          <div className="py-3.5 px-6 text-center border-b border-gray-100 bg-[#FAF9F5]/70">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Check-In Pass
            </div>
          </div>

          <div className="p-6 space-y-5">
            
            {/* Top Row: Booking ID & Status */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="text-left font-sans">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-0.5">Pass Code</span>
                <span className="text-base font-mono font-bold text-gray-950 uppercase">{bookingId}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-1">Status</span>
                <span className="inline-flex bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            {/* Core Details Block with Consistent Icon and Typo System */}
            <div className="space-y-4">
              
              {/* Patient Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Patient Name</span>
                  <span className="text-sm font-bold text-gray-900 uppercase">{patientName}</span>
                </div>
              </div>

              {/* Nationality */}
              {nationality && nationality !== 'N/A' && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Nationality</span>
                    <span className="text-sm font-semibold text-gray-700">{nationality}</span>
                  </div>
                </div>
              )}

              {/* Contacts Grid */}
              {(phone || email) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-t border-b border-gray-50/70">
                  {phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Phone</span>
                        <span className="text-xs font-semibold text-gray-700 block truncate">{phone}</span>
                      </div>
                    </div>
                  )}

                  {email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Email</span>
                        <span className="text-xs font-semibold text-gray-700 block truncate" title={email}>{email}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Treatment Selected */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Treatment</span>
                  <span className="text-sm font-semibold text-gray-800">{service}</span>
                </div>
              </div>

              {/* Assigned Dental Clinic */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Dental Clinic</span>
                  <span className="text-sm font-bold text-gray-800">{clinic}</span>
                  {formattedDestination && (
                    <span className="text-[11px] font-medium text-gray-400 block mt-0.5">
                      {formattedDestination}
                    </span>
                  )}
                </div>
              </div>

              {/* Appointment Schedule */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Schedule</span>
                  <span className="text-sm font-semibold text-gray-800 block">{date}</span>
                  <span className="text-[11px] font-medium text-gray-400 block mt-0.5">{session}</span>
                </div>
              </div>

              {/* Specialized patient notes */}
              {notes && (
                <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[9px] uppercase tracking-wider text-orange-600 font-bold block">Special Notes</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium whitespace-pre-wrap leading-relaxed italic bg-[#FAF9F5] p-3 rounded-lg border border-gray-100">
                    "{notes}"
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Ticket structural punched coupon boundary lines */}
          <div className="relative h-4 flex items-center justify-between pointer-events-none">
            <div className="w-3 h-6 rounded-r-full bg-[#FAF9F6] -ml-[1px] border-r border-t border-b border-gray-100" />
            <div className="w-full border-t border-dashed border-gray-200 mx-4" />
            <div className="w-3 h-6 rounded-l-full bg-[#FAF9F6] -mr-[1px] border-l border-t border-b border-gray-100" />
          </div>

          {/* Symmetrical simple bottom spacing */}
          <div className="py-2 bg-gray-50/30" />
        </div>

        {/* Action button redirect */}
        <div className="mt-8 flex flex-col items-center">
          <button 
            id="go-home-footer-btn"
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFB800] hover:text-gray-950 transition-all shadow-[0_12px_25px_rgba(26,28,30,0.1)] flex items-center gap-1.5"
          >
            Return to UCSmile Home
          </button>
        </div>
      </div>
    </div>
  );
}
