import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  FileText,
  X,
  AlertTriangle,
  Lock,
  Search,
  Clipboard,
  Shield,
  Briefcase
} from 'lucide-react';
import Logo from './Logo';
import { decodeBooking } from './codec';
import { TREATMENTS } from './LandingPage';

// Helper for 12h format
function formatSessionString(sessionStr: string): string {
  if (!sessionStr) return '';
  if (sessionStr.toLowerCase().includes('am') || sessionStr.toLowerCase().includes('pm')) {
    return sessionStr;
  }
  const match = sessionStr.match(/^(\d{2}):(\d{2})(.*)$/);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const rest = match[3];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourStr}:${minute} ${ampm}${rest}`;
  }
  return sessionStr;
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Secure Receptionist Access Control State
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [pinError, setPinError] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('ucsmile_pin_unlocked') === 'true';
  });

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Auto-focus first input when PIN overlay is visual
  useEffect(() => {
    if (!isPinVerified) {
      setTimeout(() => {
        pinRefs[0].current?.focus();
      }, 300);
    }
  }, [isPinVerified]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setPinError(false);

    // Auto focus next input
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
        pinRefs[index - 1].current?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
      setPinError(false);
    }
  };

  const verifyPin = (currentPinArray: string[]) => {
    const joined = currentPinArray.join('');
    if (joined === '1234') {
      setIsPinVerified(true);
      sessionStorage.setItem('ucsmile_pin_unlocked', 'true');
    } else {
      setPinError(true);
      setPin(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  };

  // Check and auto-verify when fully populated
  useEffect(() => {
    if (!isPinVerified && pin.every(digit => digit !== '')) {
      verifyPin(pin);
    }
  }, [pin, isPinVerified]);

  // ----------------------------------------------------
  // CENTRALIZED BOOKING DISCOVERY LOGIC
  // ----------------------------------------------------
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBookings = useMemo(() => {
    const input = searchInput.trim().toLowerCase();
    if (!input) return [];
    
    try {
      const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
      return Object.keys(db)
        .map(key => db[key])
        .filter(b => 
          b.fullName?.toLowerCase().includes(input) || 
          b.bookingId?.toLowerCase().includes(input) ||
          b.whatsappPhone?.toLowerCase().includes(input)
        )
        .slice(0, 5); // Limit to top 5 matches
    } catch {
      return [];
    }
  }, [searchInput]);
  
  // Backwards compatibility url loaders
  const token = searchParams.get('p') || searchParams.get('token');
  const decoded = token ? decodeBooking(token) : null;
  const initialId = decoded ? decoded.id : (searchParams.get('id') || searchParams.get('code') || '');

  const [activeCode, setActiveCode] = useState(initialId);
  const [bookingStatus, setBookingStatus] = useState<'confirmed' | 'cancelled' | 'checked_in' | 'booking_requested'>('confirmed');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sync state on change activeCode
  useEffect(() => {
    if (activeCode) {
      const storedStatus = localStorage.getItem(`ucsmile_status_${activeCode}`);
      if (storedStatus) {
        setBookingStatus(storedStatus as any);
      } else {
        setBookingStatus('confirmed');
      }
    }
  }, [activeCode]);

  // Load from db vs fallback url parameters
  const resolvedTicket = useMemo(() => {
    const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
    
    if (activeCode && db[activeCode]) {
      const rec = db[activeCode];
      return {
        id: rec.bookingId,
        name: rec.fullName,
        service: rec.treatment,
        clinic: rec.clinic,
        date: rec.preferredDate,
        session: rec.confirmedHour,
        phone: rec.whatsappPhone,
        nationality: rec.nationality,
        email: rec.email,
        destination: rec.destination,
        notes: rec.additionalDetails,
        status: rec.status,
        referralCode: rec.referralCode,
        referrerName: rec.referrerName,
        internalNotes: rec.internalNotes
      };
    }

    // Default parameters fallback for backwards validation compatibility
    if (decoded) {
      return {
        id: decoded.id || 'UCS-DECODED-XX',
        name: decoded.name || 'Valued Guest',
        service: decoded.service || 'Dental Consult & Alignment',
        clinic: decoded.clinic || 'Any Vetted Partner Clinic',
        date: decoded.date || 'TBD',
        session: decoded.session || 'Morning',
        phone: decoded.phone || '',
        nationality: decoded.nationality || '',
        email: decoded.email || '',
        destination: decoded.destination || 'danang',
        notes: decoded.notes || '',
        status: 'confirmed'
      };
    }

    if (searchParams.get('id')) {
      return {
        id: searchParams.get('id') || '',
        name: searchParams.get('name') || searchParams.get('nm') || 'Patient Guest',
        service: searchParams.get('service') || searchParams.get('sv') || 'Teeth Whitening',
        clinic: searchParams.get('clinic') || searchParams.get('cl') || 'Any Vetted Partner Clinic',
        date: searchParams.get('date') || searchParams.get('dt') || 'Today',
        session: searchParams.get('session') || searchParams.get('sn') || '',
        phone: searchParams.get('phone') || searchParams.get('ph') || '',
        nationality: searchParams.get('nationality') || searchParams.get('na') || '',
        email: searchParams.get('email') || searchParams.get('em') || '',
        destination: searchParams.get('destination') || searchParams.get('ds') || 'danang',
        notes: searchParams.get('notes') || searchParams.get('ns') || '',
        status: 'confirmed'
      };
    }

    // Return first item in DB if exists, so active review screen isn't empty
    const keys = Object.keys(db);
    if (keys.length > 0) {
      const rec = db[keys[0]];
      return {
        id: rec.bookingId,
        name: rec.fullName,
        service: rec.treatment,
        clinic: rec.clinic,
        date: rec.preferredDate,
        session: rec.confirmedHour,
        phone: rec.whatsappPhone,
        nationality: rec.nationality,
        email: rec.email,
        destination: rec.destination,
        notes: rec.additionalDetails,
        status: rec.status,
        referralCode: rec.referralCode,
        referrerName: rec.referrerName,
        internalNotes: rec.internalNotes
      };
    }

    return null;
  }, [activeCode, decoded, searchParams]);

  // Sync final status
  useEffect(() => {
    if (resolvedTicket) {
      const dbStatus = localStorage.getItem(`ucsmile_status_${resolvedTicket.id}`) || resolvedTicket.status;
      setBookingStatus(dbStatus as any);
    }
  }, [resolvedTicket]);

  // Extract parsed services array
  const parsedServices = useMemo(() => {
    if (!resolvedTicket || !resolvedTicket.service) return [];
    return resolvedTicket.service.split(', ').filter(Boolean).map(item => {
      const match = item.match(/(.+?)\s*\(x(\d+)\)/);
      if (match) {
        return { name: match[1].trim(), qty: parseInt(match[2], 10) };
      }
      return { name: item.trim(), qty: 1 };
    });
  }, [resolvedTicket]);

  const handleSearchCommit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const code = searchInput.trim().toUpperCase();
    if (!code) return;

    const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
    if (db[code]) {
      setActiveCode(code);
      setSearchInput('');
    } else {
      setSearchError(`Booking Code "${code}" not found. Try UCS-1111-VN or UCS-2222-AU.`);
    }
  };

  const handleToggleCheckIn = () => {
    if (!resolvedTicket) return;
    const originalStatus = resolvedTicket.status || 'confirmed';
    const targetStatus = bookingStatus === 'checked_in' ? originalStatus : 'checked_in';
    
    // Save to db
    const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
    if (db[resolvedTicket.id]) {
      db[resolvedTicket.id].status = targetStatus;
      localStorage.setItem('ucsmile_bookings_db', JSON.stringify(db));
    }
    localStorage.setItem(`ucsmile_status_${resolvedTicket.id}`, targetStatus);
    setBookingStatus(targetStatus);
    setShowConfirmModal(false);
  };

  // Vetted clinics list mapping
  const formattedDestination = useMemo(() => {
    if (!resolvedTicket?.destination) return '';
    const d = resolvedTicket.destination.toLowerCase();
    if (d === 'danang') return 'Da Nang, Vietnam';
    if (d === 'hcm' || d === 'hochiminh') return 'Ho Chi Minh, Vietnam';
    return resolvedTicket.destination;
  }, [resolvedTicket]);

  // Access screening overlay
  if (!isPinVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-[#F4F3EF] to-[#FAF9F6] text-[#1a1c1e] pt-12 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-center font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#FFD151]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm z-10 text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="md" variant="full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative overflow-hidden"
          >
            <div className="relative mb-5 flex justify-center">
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute w-14 h-14 bg-[#FFB800]/10 rounded-full blur-md"
              />
              <div className="w-12 h-12 bg-[#FFB800]/15 rounded-2xl flex items-center justify-center text-[#E6A600] border border-[#FFB800]/20 z-10">
                <Lock className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="space-y-2 mb-8 text-center">
              <h2 className="font-serif text-xl font-bold text-gray-900">Clinic Verification Code</h2>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto font-medium">
                Enter the secure 4-digit receptionist PIN to access client credentials and log clinical arrival.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="flex justify-center gap-3">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={pinRefs[idx]}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all ${
                      pinError 
                        ? 'border-red-400 bg-red-50 text-red-600 focus:ring-red-500' 
                        : 'border-gray-200 bg-gray-50/50 text-gray-900 focus:border-[#FFB800] focus:bg-white focus:ring-2 focus:ring-[#FFB800]/25'
                    } focus:outline-none focus:scale-105`}
                  />
                ))}
              </div>

              {pinError && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500 text-[11px] font-bold tracking-wide"
                >
                  Incorrect security validation. Clear and retry.
                </motion.p>
              )}

              <button 
                type="button"
                onClick={() => verifyPin(pin)}
                className="w-full py-4 bg-gray-900 text-white hover:bg-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Access Dashboard
              </button>
            </form>
          </motion.div>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            ← Exit System
          </button>
        </div>
      </div>
    );
  }

  // RECEPT PORTAL CORES
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1a1c1e] pt-24 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-start font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#FFD151]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT/LOBBY QUEUE COLUMN */}
        <div className="col-span-12 md:col-span-5 space-y-6 text-left">
          
          {/* Header section back actions */}
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#FFB800] stroke-[2.5]" /> Back Home
            </button>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mt-2">Clinic lobby.</h2>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">RECEPTION & ARRIVAL PORTAL</p>
          </div>

          {/* Core Code Verification Search tool form with custom drop down search logs suggestions */}
          <div ref={searchContainerRef} className="space-y-2 relative">
            <label className="text-[9px] font-black tracking-widest uppercase text-gray-400 block mb-1">Search Pass reference / Patient Name</label>
            <form onSubmit={handleSearchCommit} className="relative">
              <input 
                type="text"
                value={searchInput}
                onFocus={() => setShowSearchSuggestions(true)}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSearchSuggestions(true);
                  setSearchError('');
                }}
                placeholder="Type Patient Name or Booking Code..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold font-sans"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500 hover:text-black transition-all"
                title="Search verification database"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <AnimatePresence>
              {showSearchSuggestions && filteredBookings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] z-30 max-h-60 overflow-y-auto divide-y divide-gray-100"
                >
                  {filteredBookings.map((b) => {
                    const statusVal = b.status || 'confirmed';
                    return (
                      <div
                        key={b.bookingId}
                        onClick={() => {
                          setActiveCode(b.bookingId);
                          setSearchInput('');
                          setShowSearchSuggestions(false);
                        }}
                        className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center text-xs"
                      >
                        <div className="text-left min-w-0 pr-2">
                          <span className="font-bold text-gray-900 block truncate">{b.fullName}</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">
                            {b.bookingId} • {b.nationality || b.destination}
                          </span>
                        </div>
                        <span className={`text-[8px] font-black tracking-wider uppercase py-0.5 px-2 rounded-full border shrink-0 ${
                          statusVal === 'checked_in' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : statusVal === 'cancelled'
                              ? 'bg-red-50 text-red-650 border-red-100'
                              : statusVal === 'booking_requested'
                                ? 'bg-purple-50 text-purple-600 border-purple-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {statusVal === 'checked_in' ? 'ARRIVED' : statusVal === 'booking_requested' ? 'REQUESTED' : statusVal.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {searchError && (
              <p className="text-[10px] text-red-500 font-bold leading-normal">⚠️ {searchError}</p>
            )}
          </div>

          {/* Dynamic lobby queue table cards derived from current localStorage database list */}
          <div className="space-y-3 pt-2">
            <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 block mb-1 select-none">Lobby Booking Logs</span>
            <div className="border border-gray-150 rounded-2xl bg-white p-3 divide-y divide-gray-100 shadow-xs max-h-[280px] overflow-y-auto">
              {(() => {
                const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
                const keys = Object.keys(db);
                if (keys.length === 0) {
                  return (
                    <div className="p-6 text-center text-xs text-gray-400 font-bold">Lobby dashboard empty. Create booking records first.</div>
                  );
                }
                return keys.map((key) => {
                  const b = db[key];
                  const active = activeCode === key;
                  const st = (localStorage.getItem(`ucsmile_status_${key}`) || b.status || '').toLowerCase();
                  
                  return (
                    <div 
                      key={key}
                      onClick={() => setActiveCode(key)}
                      className={`py-3.5 px-2 px-3 border-l-3 transition-all cursor-pointer rounded-lg flex items-center justify-between hover:bg-gray-50 ${
                        active 
                          ? 'bg-amber-50/20 border-amber-400' 
                          : 'border-transparent'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-gray-900 block truncate">{b.fullName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-gray-450 font-bold">{key}</span>
                          <span className="text-[9px] text-gray-400">•</span>
                          <span className="text-[10px] font-sans text-gray-400 font-semibold">{b.nationality}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {st === 'checked_in' ? (
                          <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full border border-emerald-100">ARRIVED</span>
                        ) : st === 'cancelled' ? (
                          <span className="bg-red-50 text-red-650 text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full border border-red-100">CANCEL</span>
                        ) : st === 'booking_requested' ? (
                          <span className="bg-purple-100 text-purple-600 text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full border border-purple-200 font-sans">REQUESTED</span>
                        ) : (
                          <span className="bg-amber-100/40 text-amber-600 text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full border border-amber-200/50 font-sans">CONFIRMED</span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* RIGHT CLINICAL VERIFICATION TARGET TICKET WINDOW */}
        <div className="col-span-12 md:col-span-7">
          
          {resolvedTicket ? (
            <motion.div
              key={resolvedTicket.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Core Boarding card header status info indicator */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3.5">
                  {bookingStatus === 'cancelled' ? (
                    <div className="w-14 h-14 bg-gradient-to-tr from-red-500 to-red-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-red-500/10">
                      <X className="w-6 h-6 text-white stroke-[3.5]" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-emerald-500/10">
                      <Check className="w-6 h-6 text-white stroke-[3.5]" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#FFB800] mb-0.5">UCSmile Secure Gateway</span>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
                  {bookingStatus === 'cancelled' ? 'Booking Cancelled' : 'Pass Verified'}
                </h1>
              </div>

              {/* Verified clinical paper boarding coupon */}
              <div className="bg-white rounded-[2.5rem] border border-gray-150/70 overflow-hidden shadow-xl relative text-left">
                
                {/* Header Coupon indicator */}
                <div className="py-4 px-8 text-center border-b border-gray-100 bg-[#FAF9F5]/70 flex justify-between items-center px-8">
                  {bookingStatus === 'cancelled' ? (
                    <span className="flex items-center gap-1 text-[10px] font-black text-red-650 tracking-wider uppercase">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> CANCELLED APPOINTMENT PASS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 tracking-wider uppercase">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURED PRIORITY APPOINTMENT SLOT
                    </span>
                  )}

                  <span className="text-[9px] font-black tracking-widest text-[#FFB800] border border-amber-300/30 rounded px-1.5 py-0.5 font-mono select-none bg-amber-50/10">UCSMILE RECEPT</span>
                </div>

                <div className="p-8 space-y-6">
                  
                  {/* Row 1: Code and status Badge */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-0.5 font-sans">Pass Reference Code</span>
                      <span className="text-lg font-mono font-bold text-gray-950 uppercase">{resolvedTicket.id}</span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-1">Clinic Status</span>
                      {bookingStatus === 'checked_in' ? (
                        <span className="inline-flex bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full items-center gap-1.5 shadow-xs font-sans font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Checked-In
                        </span>
                      ) : bookingStatus === 'cancelled' ? (
                        <span className="inline-flex bg-red-50 border border-red-100 text-red-650 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full items-center gap-1.5 shadow-xs font-sans font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Cancelled
                        </span>
                      ) : bookingStatus === 'booking_requested' ? (
                        <span className="inline-flex bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full items-center gap-1.5 shadow-xs font-sans font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          Requested
                        </span>
                      ) : (
                        <span className="inline-flex bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full items-center gap-1.5 shadow-xs font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Core fields with icons */}
                  <div className="space-y-4 font-sans font-semibold text-gray-700">
                    
                    {/* Patient detail */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <User className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Patient Name</span>
                        <span className="text-sm font-bold text-gray-900 uppercase">{resolvedTicket.name}</span>
                      </div>
                    </div>

                    {/* Nationality detail */}
                    {resolvedTicket.nationality && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <Globe className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Nationality</span>
                          <span className="text-xs font-bold text-gray-900">{resolvedTicket.nationality}</span>
                        </div>
                      </div>
                    )}

                    {/* Contact row (Phone, Email) */}
                    {(resolvedTicket.phone || resolvedTicket.email) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
                        {resolvedTicket.phone && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <Phone className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                            <div className="text-left min-w-0 font-sans">
                              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Emergency Phone</span>
                              <span className="text-xs font-bold text-gray-800 truncate block">{resolvedTicket.phone}</span>
                            </div>
                          </div>
                        )}

                        {resolvedTicket.email && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <Mail className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                            <div className="text-left min-w-0 font-sans">
                              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Patient Email</span>
                              <span className="text-xs font-bold text-gray-800 truncate block">{resolvedTicket.email}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Treatment package detail */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Selected Treatment Packages</span>
                        </div>
                      </div>

                      <div className="ml-11 border border-gray-100 bg-gray-50/20 rounded-2xl p-3 divide-y divide-gray-150">
                        {parsedServices.map(({ name, qty }) => {
                          const tObj = TREATMENTS.find(t => t.name === name);
                          const valStr = tObj?.prices?.vn ? `$${tObj.prices.vn.min * qty} - $${tObj.prices.vn.max * qty}` : '';

                          return (
                            <div key={name} className="flex justify-between items-center py-2 px-1 text-xs">
                              <span className="font-bold text-gray-800 min-w-0 pr-2 truncate">{name}</span>
                              <div className="flex items-center gap-2.5 flex-shrink-0">
                                {tObj?.hasQuantity && (
                                  <span className="text-[9px] font-black text-gray-500 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono">Qty: {qty}</span>
                                )}
                                {valStr && <span className="font-mono font-bold text-amber-600 shrink-0">{valStr}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dentist Assignment location detail */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <MapPin className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Dental Clinic</span>
                        <span className="text-xs font-bold text-gray-900 block leading-snug">{resolvedTicket.clinic}</span>
                        {formattedDestination && (
                          <span className="text-[10px] text-gray-400 mt-0.5 block">{formattedDestination}</span>
                        )}
                      </div>
                    </div>

                    {/* Schedule date details */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <Calendar className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Appointment Slot</span>
                        <span className="text-xs font-bold text-gray-900 block">{resolvedTicket.date}</span>
                        {resolvedTicket.session && (
                          <span className="text-[10px] text-gray-400 mt-0.5 block">{formatSessionString(resolvedTicket.session)}</span>
                        )}
                      </div>
                    </div>

                    {/* Referrals tracker details */}
                    {resolvedTicket.referralCode && (
                      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Referrer Name</span>
                          <span className="text-xs font-bold text-gray-955">{resolvedTicket.referrerName || 'Affiliate Referral'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Referral Code</span>
                          <span className="text-xs font-mono font-bold text-amber-600">{resolvedTicket.referralCode}</span>
                        </div>
                      </div>
                    )}

                    {/* Special clinical notes details */}
                    {resolvedTicket.notes && (
                      <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-100 text-left font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-amber-600 font-bold block">Special Booking Request</span>
                        <p className="text-xs font-semibold leading-relaxed italic text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          "{resolvedTicket.notes}"
                        </p>
                      </div>
                    )}

                    {/* Receptionist private comment details */}
                    {resolvedTicket.internalNotes && (
                      <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-100 text-left font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-purple-600 font-bold block">Internal Consultant notes</span>
                        <p className="text-xs font-bold leading-relaxed text-purple-900 bg-purple-50/40 p-3 rounded-xl border border-purple-100 border-dashed">
                          {resolvedTicket.internalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Symmetrical boarding ticket punched lines separator */}
                <div className="relative h-4 flex items-center justify-between pointer-events-none bg-white">
                  <div className="w-3.5 h-7 rounded-r-full bg-[#FAF9F6] -ml-[1px] border-r border-t border-b border-gray-150" />
                  <div className="w-full border-t border-dashed border-gray-200 mx-4" />
                  <div className="w-3.5 h-7 rounded-l-full bg-[#FAF9F6] -mr-[1px] border-l border-t border-b border-gray-150" />
                </div>

                <div className="py-2.5 bg-gray-50/20" />
              </div>

              {/* Patient lobby direct arrival tools (Check-in toggles) */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (bookingStatus === 'checked_in') {
                      handleToggleCheckIn();
                    } else {
                      setShowConfirmModal(true);
                    }
                  }}
                  className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer ${
                    bookingStatus === 'checked_in' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10 hover:bg-emerald-600 shadow-md' 
                      : bookingStatus === 'cancelled'
                        ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-xs'
                  }`}
                >
                  {bookingStatus === 'checked_in' ? (
                    <>
                      <Check className="w-4 h-4 text-white stroke-[3.5]" />
                      <span>CHECK-IN CONFIRMED (LOGGED)</span>
                    </>
                  ) : bookingStatus === 'cancelled' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                      <span>Re-activate Slot & Check-In</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Confirm Patient Arrival</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center text-[#1a1c1e] shadow-lg space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-lg font-bold font-serif">Reception Empty</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                No bookings successfully located in local storage. Submit a booking via /booking or search an active Booking Code inside the sidebar.
              </p>
            </div>
          )}
        </div>

        {/* Secure modal check-in confirmation overlay */}
        <AnimatePresence>
          {showConfirmModal && resolvedTicket && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full border border-gray-150 shadow-2xl text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    {bookingStatus === 'cancelled' ? 'Re-activate & Check-In?' : 'Confirm Patient Arrival?'}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                    The priority clinical pass for <strong>{resolvedTicket.name}</strong> ({resolvedTicket.id}) will be marked as Checked-In inside our live database.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleToggleCheckIn}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Confirm Check-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Cancel / Go Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
