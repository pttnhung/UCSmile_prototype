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
  FileText,
  X,
  AlertTriangle,
  Lock
} from 'lucide-react';
import Logo from './Logo';
import { decodeBooking } from './codec';
import { TREATMENTS } from './LandingPage';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = React.useState<'confirmed' | 'cancelled' | 'checked_in'>('confirmed');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  // Secure Receptionist Access Control
  const [pin, setPin] = React.useState<string[]>(['', '', '', '']);
  const [pinError, setPinError] = React.useState(false);
  const [isPinVerified, setIsPinVerified] = React.useState<boolean>(() => {
    return sessionStorage.getItem('ucsmile_pin_unlocked') === 'true';
  });

  const pinRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null)
  ];

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
  React.useEffect(() => {
    if (!isPinVerified && pin.every(digit => digit !== '')) {
      verifyPin(pin);
    }
  }, [pin, isPinVerified]);

  // Parse parameters from verification URL (supporting compressed token 'p' first)
  const token = searchParams.get('p');
  const decoded = token ? decodeBooking(token) : null;

  const bookingId = decoded ? decoded.id : (searchParams.get('id') || 'UCS-PENDING-XX');
  const patientName = decoded ? decoded.name : (searchParams.get('name') || searchParams.get('nm') || 'Valued Guest');
  const service = decoded ? decoded.service : (searchParams.get('service') || searchParams.get('sv') || 'Premium Dental Solution');
  const clinic = decoded ? decoded.clinic : (searchParams.get('clinic') || searchParams.get('cl') || 'Any Vetted Partner Clinic');
  const date = decoded ? decoded.date : (searchParams.get('date') || searchParams.get('dt') || 'To Be Arranged');
  const session = decoded ? decoded.session : (searchParams.get('session') || searchParams.get('sn') || 'Flexible Time Window');
  const phone = decoded ? decoded.phone : (searchParams.get('phone') || searchParams.get('ph') || ''); 
  const nationality = decoded ? decoded.nationality : (searchParams.get('nationality') || searchParams.get('na') || '');
  const email = decoded ? decoded.email : (searchParams.get('email') || searchParams.get('em') || '');
  const destination = decoded ? decoded.destination : (searchParams.get('destination') || searchParams.get('ds') || '');
  const notes = decoded ? decoded.notes : (searchParams.get('notes') || searchParams.get('ns') || '');

  // Parse service details
  const parsedServices = React.useMemo(() => {
    if (!service) return [];
    return service.split(', ').filter(Boolean).map(item => {
      const match = item.match(/(.+?)\s*\(x(\d+)\)/);
      if (match) {
        const name = match[1].trim();
        const qty = parseInt(match[2], 10);
        return { name, qty };
      }
      return { name: item.trim(), qty: 1 };
    });
  }, [service]);

  React.useEffect(() => {
    const savedStatus = localStorage.getItem(`ucsmile_status_${bookingId}`);
    if (savedStatus === 'checked_in' || savedStatus === 'cancelled' || savedStatus === 'confirmed') {
      setBookingStatus(savedStatus);
    } else {
      setBookingStatus('confirmed');
    }
  }, [bookingId]);

  // Format destination nice text
  const formattedDestination = destination.toLowerCase() === 'danang' 
    ? 'Da Nang, Vietnam' 
    : (destination.toLowerCase() === 'hcm' || destination.toLowerCase() === 'hochiminh' 
      ? 'Ho Chi Minh, Vietnam' 
      : destination);

  if (!isPinVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-[#F4F3EF] to-[#FAF9F6] text-[#1a1c1e] pt-12 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-center font-sans">
        {/* Background radial gradient decor for depth */}
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
            {/* Top Security Emblem */}
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

            <div className="space-y-2 mb-8">
              <h2 className="font-serif text-xl font-bold text-gray-900">Clinic Verification Code</h2>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                Enter the secure 4-digit receptionist PIN to access client credentials and log clinical arrival.
              </p>
            </div>

            {/* Standard Key-in fields (Hidden or styled as passive preview) */}
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

              {/* Seamless dynamic button confirmation callback (Fallback for manual submit) */}
              <button 
                type="button"
                onClick={() => verifyPin(pin)}
                className="w-full py-3.5 bg-gray-900 text-white hover:bg-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Access Dashboard
              </button>
            </form>
          </motion.div>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-[#1a1c1e] transition-colors"
          >
            ← Exit System
          </button>
        </div>
      </div>
    );
  }

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
            {bookingStatus === 'cancelled' ? (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.35, 0.12] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="absolute -inset-4 rounded-full bg-red-500/10 blur-sm pointer-events-none"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="w-14 h-14 bg-gradient-to-tr from-red-500 to-red-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_8px_20px_rgba(239,68,68,0.15)]"
                >
                  <X className="w-6 h-6 text-white stroke-[3.5]" />
                </motion.div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#FFB800] mb-0.5">UCSmile Secure Gateway</span>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
            {bookingStatus === 'cancelled' ? 'Booking Cancelled' : 'Booking Verified'}
          </h1>
        </div>

        {/* Elegant Boarding Pass Style Card */}
        <div id="boarding-pass-card" className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.05)] relative">
          
          {/* Header Band */}
          <div className="py-3.5 px-6 text-center border-b border-gray-100 bg-[#FAF9F5]/70">
            {bookingStatus === 'cancelled' ? (
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-red-600 tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> Invalid / Cancelled Pass
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Check-In Pass
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            
            {/* Top Row: Booking ID & Dynamic Status */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="text-left font-sans">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-0.5">Pass Code</span>
                <span className="text-base font-mono font-bold text-gray-950 uppercase">{bookingId}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block mb-1">Status</span>
                {bookingStatus === 'checked_in' ? (
                  <span className="inline-flex bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Checked-In
                  </span>
                ) : bookingStatus === 'cancelled' ? (
                  <span className="inline-flex bg-red-50 border border-red-100 text-red-600 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Cancelled
                  </span>
                ) : (
                  <span className="inline-flex bg-amber-50 border border-amber-100 text-amber-600 dark:text-amber-600 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Confirmed
                  </span>
                )}
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
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Selected Treatments</span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      ({parsedServices.length || 1} treatment{parsedServices.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                <div className="ml-11 border border-gray-100 bg-gray-50/30 rounded-2xl divide-y divide-gray-100 p-2 text-left text-[#1a1c1e]">
                  {parsedServices.map(({ name, qty }) => {
                    const tObj = TREATMENTS.find(t => t.name === name);
                    const priceItem = tObj?.prices?.vn;
                    const minPrice = priceItem ? priceItem.min * qty : null;
                    const maxPrice = priceItem ? priceItem.max * qty : null;
                    const priceStr = minPrice && maxPrice ? `$${minPrice} - $${maxPrice}` : '';

                    return (
                      <div key={name} className="flex items-center justify-between py-2 px-2 hover:bg-white/40 rounded-lg transition-colors">
                        <div className="min-w-0 pr-2">
                          <span className="font-sans font-semibold text-gray-800 text-xs sm:text-sm block truncate">
                            {name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {tObj?.hasQuantity && (
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono select-none">
                              Qty: {qty}
                            </span>
                          )}

                          {priceStr && (
                            <span className="font-mono text-xs text-amber-600 font-bold min-w-[75px] text-right">
                              {priceStr}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
        <div className="mt-8 flex flex-col items-center gap-3 w-full">
          <button 
            type="button"
            onClick={() => {
              if (bookingStatus === 'checked_in') {
                // If already checked in, toggle back to confirmed
                localStorage.setItem(`ucsmile_status_${bookingId}`, 'confirmed');
                setBookingStatus('confirmed');
              } else {
                setShowConfirmModal(true);
              }
            }}
            className={`w-full py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              bookingStatus === 'checked_in' 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10 hover:bg-emerald-600' 
                : bookingStatus === 'cancelled'
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-red-500/5'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {bookingStatus === 'checked_in' ? (
              <>
                <Check className="w-4 h-4 stroke-[3px]" />
                <span>Patient Check-In Confirmed</span>
              </>
            ) : bookingStatus === 'cancelled' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Re-activate & Check-In Patient</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Confirm Patient Arrival</span>
              </>
            )}
          </button>

          <button 
            id="go-home-footer-btn"
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-gray-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFB800] hover:text-gray-950 transition-all shadow-[0_12px_25px_rgba(26,28,30,0.1)] flex items-center justify-center gap-1.5"
          >
            Return to UCSmile Home
          </button>
        </div>

        {/* Secure modal confirmation overlay for dental clinic arrival check-in */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full border border-gray-100 shadow-2xl text-center space-y-6">
              {bookingStatus === 'cancelled' ? (
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  {bookingStatus === 'cancelled' ? 'Re-activate & Confirm Arrival?' : 'Confirm Patient Arrival?'}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {bookingStatus === 'cancelled' ? (
                    <span>
                      This booking was previously <strong>cancelled</strong>. Re-activating will update patient <strong>{patientName}</strong>'s status to Checked-In at the clinic.
                    </span>
                  ) : (
                    <span>
                      The appointment status for patient <strong>{patientName}</strong> will be updated to Checked-In at the clinic to proceed with treatment.
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(`ucsmile_status_${bookingId}`, 'checked_in');
                    setBookingStatus('checked_in');
                    setShowConfirmModal(false);
                  }}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  {bookingStatus === 'cancelled' ? 'Re-activate & Check-In' : 'Confirm Check-In'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Cancel / Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
