import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { 
  Calendar, 
  MapPin, 
  User, 
  Globe, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck,
  Send,
  MessageCircle,
  Copy,
  Check,
  Sun,
  Moon,
  Mail,
  Download,
  RefreshCw,
  Clock
} from 'lucide-react';
import { TREATMENTS, Treatment } from './LandingPage';
import QRCode from 'qrcode';

// List of popular visitor nationalities
const NATIONALITIES = [
  'Select Nationality',
  'Australia',
  'United States',
  'Singapore',
  'New Zealand',
  'United Kingdom',
  'Canada',
  'Vietnam',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'Russia',
  'Thailand',
  'Other'
];

export default function BookingPage() {
  const passRef = useRef<HTMLDivElement>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('Select Nationality');
  
  const [preferredDate, setPreferredDate] = useState('');
  const [destination, setDestination] = useState('danang');
  const [clinic, setClinic] = useState('Any Vetted Partner Clinic');
  const [preferredSession, setPreferredSession] = useState<'morning' | 'afternoon'>('morning');
  
  const [treatment, setTreatment] = useState('Choose your treatment');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // App states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Vetted clinics list mapping
  const clinicsByDest: Record<string, string[]> = {
    danang: [
      'Any Vetted Partner Clinic',
      'East Meets West Dental (Da Nang)',
      'Serenity International Dental (Da Nang)',
      'Amaris Dental Clinic'
    ],
    hcm: [
      'Any Vetted Partner Clinic',
      'Elite Dental Group (Ho Chi Minh)',
      'Worldwide Dental Specialists (Ho Chi Minh)'
    ],
    any: [
      'Any Vetted Partner Clinic'
    ]
  };

  // Restore saved pass if user refreshes or returns later
  useEffect(() => {
    const saved = localStorage.getItem('ucsmile_saved_booking');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFullName(data.fullName || '');
        setWhatsappPhone(data.whatsappPhone || '');
        setEmail(data.email || '');
        setNationality(data.nationality || 'Select Nationality');
        setTreatment(data.treatment || 'Choose your treatment');
        setDestination(data.destination || 'danang');
        setClinic(data.clinic || 'Any Vetted Partner Clinic');
        setPreferredDate(data.preferredDate || '');
        setPreferredSession(data.preferredSession || 'morning');
        setAdditionalDetails(data.additionalDetails || '');
        setBookingId(data.bookingId || '');
        setQrCodeUrl(data.qrCodeUrl || '');
        setBookingConfirmed(true);
      } catch (err) {
        console.error('Error restoring active booking session', err);
      }
    }
  }, []);

  // Sync clinic choose when destination changes
  useEffect(() => {
    if (!bookingConfirmed) {
      setClinic(clinicsByDest[destination]?.[0] || 'Any Vetted Partner Clinic');
    }
  }, [destination, bookingConfirmed]);

  // Pricing calculation helper
  const getPriceRange = () => {
    if (treatment === 'Choose your treatment' || !treatment) {
      return { min: 0, max: 0 };
    }
    const tObj = TREATMENTS.find(t => t.name === treatment);
    if (!tObj || !tObj.prices || !tObj.prices.vn) {
      return { min: 0, max: 0 };
    }
    return tObj.prices.vn; // VN clinic price estimator
  };

  const { min, max } = getPriceRange();

  // Handle Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fullName.trim() || !whatsappPhone.trim() || treatment === 'Choose your treatment' || !preferredDate.trim()) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    
    // Process dental clinical check-in ticket
    setTimeout(async () => {
      const uniqueId = `UCS-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      
      // Clear pure check-in pass payload
      const qrData = JSON.stringify({
        org: 'UCSMILE',
        type: 'Dental Tourist Check-In Pass',
        passId: uniqueId,
        patientName: fullName,
        service: treatment,
        destination: destination === 'danang' ? 'Da Nang' : 'Ho Chi Minh',
        facility: clinic,
        appointmentDate: preferredDate,
        timeWindow: preferredSession === 'morning' ? 'Morning Session (08:00 - 12:00)' : 'Afternoon Session (13:30 - 17:30)',
        verified: true
      });

      let generatedUrl = '';
      try {
        generatedUrl = await QRCode.toDataURL(qrData, {
          margin: 1.5,
          width: 400,
          color: {
            dark: '#1A1C1E', // Match dark slate layout keys
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(generatedUrl);
      } catch (err) {
        console.error('Error generating QR', err);
      }

      setBookingId(uniqueId);
      setBookingConfirmed(true);
      setIsSubmitting(false);

      // Save to localStorage immediately so user never loses it when they reopen page
      const bookingSessionData = {
        fullName,
        whatsappPhone,
        email,
        nationality,
        treatment,
        destination,
        clinic,
        preferredDate,
        preferredSession,
        additionalDetails,
        bookingId: uniqueId,
        qrCodeUrl: generatedUrl
      };
      localStorage.setItem('ucsmile_saved_booking', JSON.stringify(bookingSessionData));

      // Auto trigger PNG download of the complete Booking Pass (styled ticket format)
      setTimeout(async () => {
        if (passRef.current) {
          try {
            // Use window scroll offset to prevent cut off inside iframe
            const canvas = await html2canvas(passRef.current, {
              backgroundColor: '#141618',
              scale: 2,
              useCORS: true,
              logging: false,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = `UCSMILE-Booking-Pass-${uniqueId}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } catch (downloadErr) {
            console.warn('Auto high-res voucher capture failed, fallback to raw QR url:', downloadErr);
            if (generatedUrl) {
              const downloadLink = document.createElement('a');
              downloadLink.href = generatedUrl;
              downloadLink.download = `UCSMILE-QR-Pass-${uniqueId}.png`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }
        } else {
          if (generatedUrl) {
            const downloadLink = document.createElement('a');
            downloadLink.href = generatedUrl;
            downloadLink.download = `UCSMILE-QR-Pass-${uniqueId}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        }
      }, 1200); // 1.2s delay ensures that CSS transitions & framer motion entry animations are completely finished

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // Helper function to manual download of full styled booking pass or QR fallback
  const downloadBookingPass = async () => {
    if (passRef.current) {
      try {
        const canvas = await html2canvas(passRef.current, {
          backgroundColor: '#141618',
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `UCSMILE-Booking-Pass-${bookingId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.warn('html2canvas screenshot failed. Falling back to downloading raw QR code:', err);
        if (qrCodeUrl) {
          const link = document.createElement('a');
          link.href = qrCodeUrl;
          link.download = `UCSMILE-QR-Pass-${bookingId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } else {
      if (qrCodeUrl) {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `UCSMILE-QR-Pass-${bookingId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    localStorage.removeItem('ucsmile_saved_booking');
    setFullName('');
    setWhatsappPhone('');
    setEmail('');
    setNationality('Select Nationality');
    setTreatment('Choose your treatment');
    setDestination('danang');
    setPreferredDate('');
    setAdditionalDetails('');
    setBookingId('');
    setQrCodeUrl('');
    setBookingConfirmed(false);
    setFormError('');
  };

  // Formulate absolute premium text for official WhatsApp thread integration
  const getWhatsAppLink = () => {
    const text = `Hi UCSMILE VIP Service! 🌟 I have successfully generated a dental check-in appointment pass on your platform:\n\n` +
      `🎫 *Check-In Pass ID:* ${bookingId}\n` +
      `👤 *Patient Full Name:* ${fullName}\n` +
      `📞 *Whatsapp Phone:* ${whatsappPhone}\n` +
      `✉ *Email Address:* ${email || 'Not specified'}\n` +
      `🌍 *Nationality:* ${nationality !== 'Select Nationality' ? nationality : 'Not specified'}\n` +
      `🦷 *Treatment:* ${treatment}\n` +
      `📍 *City:* ${destination === 'danang' ? 'Da Nang' : 'Ho Chi Minh'}\n` +
      `🏥 *Dental Facility:* ${clinic}\n` +
      `📅 *Date:* ${preferredDate}\n` +
      `🕒 *Time Session:* ${preferredSession === 'morning' ? '🌞 Morning Session' : '🌙 Afternoon Session'}\n` +
      `💰 *Estimated Cost:* $${min} - $${max} USD\n` +
      `📝 *Additional Notes:* ${additionalDetails || 'None'}\n\n` +
      `Please register my private diagnostic appointment window and secure local coordination support! 💎`;
    
    return `https://wa.me/84905000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-4 md:px-8 text-brand-text font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Bar Header */}
        <div className="mb-8 flex justify-between items-center max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-all">
            <ArrowLeft className="w-4 h-4 text-[#FFD151]" />
            <span>Back to Home</span>
          </Link>
          <div className="bg-white px-4 py-2 rounded-full border border-gray-100/90 flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">UCSMILE STANDALONE CONCIERGE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!bookingConfirmed ? (
            <motion.div
              key="booking-standalone-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(15,23,42,0.04)] border border-gray-100/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto"
            >
              
              {/* Standalone Left Column: Content Header Info */}
              <div className="col-span-12 lg:col-span-5 bg-[#141618] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FFD151]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
                
                <div className="text-left relative z-10 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD151] block">BOOKING SUPPORT</span>
                  <h1 className="font-serif text-4xl md:text-[2.75rem] leading-[1.1] font-bold text-white">
                    Dental Advice.<br />Booking Support.
                  </h1>
                  <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm pt-2">
                    Enter your consultation or clinical visit requirements. We will secure priority local booking arrangements and coordinates.
                  </p>
                </div>

                {/* Bullet points with golden dots exactly like the screenshot design */}
                <div className="space-y-8 text-left my-10 relative z-10 max-w-sm">
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      Tell us what treatment you need.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      We'll suggest suitable clinics and next steps.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      We'll help you book a time that works.
                    </p>
                  </div>
                </div>

                {/* Vetting guarantee footer badge */}
                <div className="pt-8 border-t border-white/5 flex items-center gap-4 text-left relative z-10 mt-auto">
                  <div className="w-11 h-11 rounded-xl bg-[#2a2c2e] border border-[#FFD151]/20 flex items-center justify-center text-[#FFD151] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm leading-snug">5-Star Rated Practice</h5>
                    <p className="text-[#999999] text-[11px] font-bold uppercase tracking-wider">Join 12,000+ happy patients.</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE Booking Form Segment */}
              <div className="col-span-12 lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
                <form onSubmit={handleBookingSubmit} className="space-y-9">
                  
                  {/* Part A: Patient Profile */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-left">
                      <User className="w-5 h-5 text-[#FFB800]" />
                      <h3 className="font-bold text-lg text-gray-900">Personal Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          FULL NAME <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          WHATSAPP / PHONE <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          EMAIL
                        </label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          NATIONALITY
                        </label>
                        <select 
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                          {NATIONALITIES.map((nat, idx) => (
                            <option key={idx} value={nat} disabled={idx === 0}>{nat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Part B: timing Location / Session Selection */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-left">
                      <Calendar className="w-5 h-5 text-[#FFB800]" />
                      <h3 className="font-bold text-lg text-gray-900">Appointment Info</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          PREFERRED DATE <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          placeholder="dd/mm/yyyy or Flexible Week"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          CITY <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                          <option value="danang">Da Nang</option>
                          <option value="hcm">Ho Chi Minh</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                        PREFERRED CLINIC
                      </label>
                      <select 
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                      >
                        {clinicsByDest[destination]?.map((cl, i) => (
                          <option key={i} value={cl}>{cl}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                        PREFERRED SESSION
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPreferredSession('morning')}
                          className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                            preferredSession === 'morning' 
                            ? 'bg-amber-50/50 border-[#FFD151] text-[#FFB800] ring-1 ring-[#FFD151]/20' 
                            : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Sun className={`w-5 h-5 ${preferredSession === 'morning' ? 'text-[#FFB800]' : 'text-gray-400'}`} />
                          <span className="font-black tracking-[0.1em]">MORNING</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setPreferredSession('afternoon')}
                          className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                            preferredSession === 'afternoon' 
                            ? 'bg-amber-50/50 border-[#FFD151] text-[#FFB800] ring-1 ring-[#FFD151]/20' 
                            : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Moon className={`w-5 h-5 ${preferredSession === 'afternoon' ? 'text-[#FFB800]' : 'text-gray-400'}`} />
                          <span className="font-black tracking-[0.1em]">AFTERNOON</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Part C: Selected Treatment Services */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-left">
                      <span className="text-[#FFB800] text-lg font-bold">🩺</span>
                      <h3 className="font-bold text-lg text-gray-900">Select Services</h3>
                    </div>

                    <div className="text-left">
                      <select 
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.85rem_center] bg-no-repeat font-medium text-gray-700"
                      >
                        <option disabled>Choose your treatment</option>
                        {TREATMENTS.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Part D: Notes */}
                  <div className="space-y-4 text-left">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FFB800]">FURTHER DETAILS (OPTIONAL)</h3>
                    </div>
                    <div>
                      <textarea 
                        rows={3}
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        placeholder="Any specific requirements or questions?"
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all resize-none placeholder:text-gray-400"
                      ></textarea>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-[#FF4D4D] font-semibold text-xs text-left">
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* Submission and Pricing Section */}
                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-left w-full sm:w-auto">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOTAL ESTIMATED PRICE</p>
                      <p className="text-4xl font-extrabold text-[#FFD151] mt-1">
                        {min === 0 ? '$0' : `$${min} - $${max}`}
                      </p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#FFD151] to-[#FFB800] hover:from-[#fccd3c] hover:to-[#efa500] text-gray-900 border border-transparent shadow-lg shadow-brand-primary/10 transition-all duration-300 active:scale-[0.97] rounded-full p-4 px-10 font-bold text-[15px] select-none flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Booking...</span>
                        </>
                      ) : (
                        <span>Submit to Book</span>
                      )}
                    </button>
                  </div>

                </form>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="booking-success-standalone"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="max-w-xl mx-auto space-y-6"
            >
              
              {/* Top Alert notification specifying offline saving exactly */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100/90 flex items-center gap-4 text-left shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                  <Check className="w-5 h-5 stroke-[3px]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#141618] text-sm">Booking Saved Offline!</h4>
                  <p className="text-gray-400 text-xs mt-0.5 font-semibold">Your booking QR pass has been auto-saved to your browser. You can return to this tab anytime without losing it.</p>
                </div>
              </div>

              {/* CLEAN DENTAL APPOINTMENT PASS (Pristine, focused completely on pass + QR code) */}
              <div ref={passRef} className="bg-[#141618] text-white rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col">
                {/* Vintage Ticket tear notches */}
                <span className="absolute left-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -ml-3 z-30" />
                <span className="absolute right-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -mr-3 z-30" />

                {/* Header Band */}
                <div className="p-8 text-center border-b border-white/5 bg-gradient-to-r from-gray-900/40 via-[#141618] to-gray-900/40">
                  <span className="text-[10px] font-black text-[#FFD151] uppercase tracking-[0.25em] block mb-1">UCSMILE</span>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Booking QR Pass</h2>
                </div>

                {/* Credentials list */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-left border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Booking Code</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-[#FFD151] tracking-tight">{bookingId}</span>
                        <button 
                          onClick={copyToClipboard}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#FFD151] cursor-pointer transition-colors"
                          title="Copy Code"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Verification</span>
                      <div className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wide border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* Structured Patient and Booking details */}
                  <div className="space-y-4 text-left text-xs text-gray-300 font-semibold border-b border-white/5 pb-5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Patient Name</span>
                      <span className="text-white font-bold">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Selected Treatment</span>
                      <span className="text-white font-bold">{treatment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Dental Clinic</span>
                      <span className="text-[#FFD151] font-bold">{clinic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Assigned City</span>
                      <span className="text-[#FFD151] font-bold">{destination === 'danang' ? '✈ Da Nang, VN' : '✈ Ho Chi Minh, VN'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Appointment Date</span>
                      <span className="text-white font-bold">{preferredDate} ({preferredSession === 'morning' ? 'Morning' : 'Afternoon'})</span>
                    </div>
                  </div>

                  {/* Clean Visual QR container */}
                  <div className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl max-w-xs mx-auto shadow-inner border border-white/10 my-4">
                    {qrCodeUrl ? (
                      <div className="relative">
                        <img 
                          src={qrCodeUrl} 
                          alt="Booking verification QR" 
                          className="w-48 h-48 md:w-52 md:h-52 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#141618] rounded-md border border-[#FFD151] flex items-center justify-center text-[#FFD151] text-[8px] font-black tracking-tighter">
                          UCS
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-300">
                        <span>Generating QR...</span>
                      </div>
                    )}
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#141618] mt-2 block">Present on Arrival</p>
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-sm mx-auto text-center">
                    Show this Booking QR Pass to the clinic's front desk upon check-in to instantly verify priority scheduling details.
                  </p>
                </div>

                {/* Secure match info timestamp */}
                <div className="bg-white/5 py-4 px-6 flex items-center justify-between text-left text-xs border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 text-[#FFD151]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Booking Verified</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#FFD151]">{String(new Date().getFullYear())} SECURITY MATCH</span>
                </div>
              </div>

              {/* Action Buttons: Download controllers & reset */}
              <div className="space-y-3">
                
                {/* Download Pass Image Button */}
                <button
                  type="button"
                  onClick={downloadBookingPass}
                  className="w-full py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm font-extrabold text-xs tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <Download className="w-4.5 h-4.5 text-[#FFB800]" />
                  <span>Download Booking Pass Image (.PNG)</span>
                </button>

                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 bg-[#25D366] hover:bg-[#1ebd5d] text-gray-900 shadow-md font-extrabold text-sm tracking-widest uppercase rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current text-gray-900" />
                  <span>Connect Concierge via WhatsApp</span>
                </a>

                {/* State resets */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={handleReset}
                    className="p-3.5 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-wider hover:bg-[#FFF9F9] text-[#FF4D4D] hover:border-[#FFCCCC] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                    <span>Cancel / New Booking</span>
                  </button>

                  <Link
                    to="/"
                    className="p-3.5 rounded-xl bg-[#141618] text-white border border-[#141618] text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Back to Home</span>
                  </Link>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
