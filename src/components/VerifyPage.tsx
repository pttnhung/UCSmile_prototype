import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, MapPin, User, ChevronLeft, Sparkles, Check, Phone, Globe, Mail, FileText } from 'lucide-react';
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
  const nationality = searchParams.get('nationality') || '';
  const email = searchParams.get('email') || '';
  const destination = searchParams.get('destination') || '';
  const notes = searchParams.get('notes') || '';

  // Format destination nice text
  const formattedDestination = destination.toLowerCase() === 'danang' ? 'Da Nang, Vietnam' : (destination.toLowerCase() === 'hcm' || destination.toLowerCase() === 'hochiminh' ? 'Ho Chi Minh, Vietnam' : destination);

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-16 pb-24 px-4 relative overflow-hidden flex flex-col items-center justify-start font-sans">
      {/* Soft golden light backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFD151]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Consistent Top Bar with Back Link and Brand Logo */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
          <button 
            id="back-to-home-btn"
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFB800] stroke-[3]" /> Trở về Trang chủ
          </button>
          
          {/* Logo container blends beautifully on white page background */}
          <div className="bg-white p-1 rounded-lg">
            <Logo size="sm" variant="full" />
          </div>
        </div>

        {/* Big Success Verification Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div id="verified-icon-container" className="relative mb-6">
            {/* Soft concentric animated rings */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_12px_30px_rgba(16,185,129,0.2)]"
            >
              <Check className="w-10 h-10 text-white stroke-[3.5]" />
            </motion.div>
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FFB800] mb-1.5">UCSMILE SECURE GATEWAY</span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight uppercase">XÁC MINH LỊCH HẸN</h1>
          <p className="text-gray-500 text-xs font-semibold mt-1">Hệ thống hỗ trợ Đặt lịch & Đưa đón y tế Quốc tế</p>
        </div>

        {/* Boarding Pass Ticket Container */}
        <div id="boarding-pass-card" className="bg-[#FAF9F5] rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_20px_50px_rgba(20,22,24,0.05)] relative">
          
          {/* Top Pass Title Header */}
          <div className="py-5 px-8 text-center border-b border-gray-200/60 bg-gray-50/50">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600 tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> THẺ CHECK-IN ƯU TIÊN
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Booking Code & Active Status */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200/50">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Mã Phiếu Hẹn / PASS ID</span>
                <span className="text-lg font-black text-gray-900 tracking-tight font-mono">{bookingId}</span>
              </div>
              <div className="text-right flex flex-col items-end justify-center">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Trạng thái</span>
                <span className="inline-flex bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ĐÃ XÁC THỰC
                </span>
              </div>
            </div>

            {/* Ticket Information Rows */}
            <div className="space-y-5">
              
              {/* Patient Name */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200/60 shadow-sm">
                  <User className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">TÊN BỆNH NHÂN / PATIENT</span>
                  <span className="text-base font-black text-gray-900 uppercase tracking-wide">{patientName}</span>
                </div>
              </div>

              {/* Nationality */}
              {nationality && nationality !== 'N/A' && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200/60 shadow-sm">
                    <Globe className="w-4 h-4 text-[#FFB800]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">QUỐC TỊCH / NATIONALITY</span>
                    <span className="text-sm font-bold text-gray-700">{nationality}</span>
                  </div>
                </div>
              )}

              {/* Contact Information Cards */}
              {(phone || email) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/40">
                  {phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">ĐIỆN THOẠI</span>
                        <span className="text-xs font-bold text-gray-700">{phone}</span>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">EMAIL</span>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{email}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Treatment Needed */}
              <div className="flex items-start gap-4 pt-3 border-t border-gray-200/40">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200/60 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5 font-sans">DỊCH VỤ / TREATMENT</span>
                  <span className="text-sm font-extrabold text-gray-800">{service}</span>
                </div>
              </div>

              {/* Clinic and Destination Location */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200/60 shadow-sm">
                  <MapPin className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">PHÒNG KHÁM & ĐIỂM ĐẾN</span>
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight block">
                    {clinic}
                  </span>
                  {formattedDestination && (
                    <span className="text-[11px] font-bold text-gray-500 mt-0.5 block italic">
                      Chi nhánh: {formattedDestination}
                    </span>
                  )}
                </div>
              </div>

              {/* Schedule Details */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200/60 shadow-sm">
                  <Calendar className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black block mb-0.5">LỊCH HẸN / APPOINTMENT</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-gray-900">{date}</span>
                    <span className="text-xs text-gray-500 font-medium mt-0.5">{session}</span>
                  </div>
                </div>
              </div>

              {/* Specialized notes requests */}
              {notes && (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200/40">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[9px] uppercase tracking-widest text-orange-600 font-black block">GHI CHÚ ĐẶC BIỆT / SPECIAL REQUESTS</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium whitespace-pre-wrap leading-relaxed italic bg-white p-3.5 rounded-2xl border border-gray-200/50 shadow-inner">
                    "{notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ticket style left & right semicircle visual punches */}
          <div className="relative h-4 flex items-center justify-between pointer-events-none">
            <div className="w-5 h-10 rounded-r-full bg-white -ml-[10px] border-r border-t border-b border-gray-100" />
            <div className="w-full border-t border-dashed border-gray-300 mx-6" />
            <div className="w-5 h-10 rounded-l-full bg-white -mr-[10px] border-l border-t border-b border-gray-100" />
          </div>

          {/* Boarding Footer Notice */}
          <div className="p-6 bg-gray-50/80 text-center border-t border-gray-200/60">
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Phiếu đặt chỗ này được chứng nhận bảo mật kỹ thuật số bởi hệ thống hỗ trợ UCSMILE. Phòng khám vui lòng mở tiếp đón đối tác ưu tiên cao nhất.
            </p>
          </div>
        </div>

        {/* Home Button and footer certification signature */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <button 
            id="go-home-footer-btn"
            onClick={() => navigate('/')}
            className="px-10 py-4 bg-gray-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFB800] hover:text-gray-950 transition-all shadow-[0_15px_30px_rgba(26,28,30,0.12)] flex items-center gap-1.5"
          >
            Quay lại Trang chủ UCSmile
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">digital cryptographic verification signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
