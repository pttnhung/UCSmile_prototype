import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
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
  Clock, 
  X, 
  Search, 
  ChevronDown, 
  Stethoscope, 
  Minus, 
  Plus,
  AlertTriangle,
  FileText,
  Lock,
  UserCheck,
  Shield,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { TREATMENTS, Treatment } from './LandingPage';
import Logo from './Logo';

// Helper for converting 24h to 12h format
function convertTo12HourFormat(timeStr: string): string {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hour = parseInt(parts[0], 10);
    const minute = parts[1].trim();
    if (isNaN(hour)) return timeStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourStr}:${minute} ${ampm}`;
  }
  return timeStr;
}

// Popular visitor nationalities & ISO 2-letter codes for Booking Code generation
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

const NATIONALITY_CODES: Record<string, string> = {
  'Australia': 'AU',
  'United States': 'US',
  'Singapore': 'SG',
  'New Zealand': 'NZ',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Vietnam': 'VN',
  'Germany': 'DE',
  'France': 'FR',
  'Japan': 'JP',
  'South Korea': 'KR',
  'Russia': 'RU',
  'Thailand': 'TH',
  'Other': 'XX'
};

// Unified mock Referrals Database matching AC requirements
interface ReferralRecord {
  name: string;
  code: string;
}

const REFERRALS_DB: ReferralRecord[] = [
  { name: 'Alex Tran', code: 'ALEX2025' },
  { name: 'Sarah Nguyen', code: 'SARAH001' },
  { name: 'John Doe', code: 'JOHN002' },
  { name: 'Jane Smith', code: 'JANE003' },
  { name: 'Elena Rostova', code: 'ELENA2025' }
];

// Initialize mock DB bookings if none exist
function seedMockBookings() {
  const existing = localStorage.getItem('ucsmile_bookings_db');
  if (!existing) {
    const dummy: Record<string, any> = {
      'UCS-1111-VN': {
        bookingId: 'UCS-1111-VN',
        fullName: 'Nguyen Minh An',
        whatsappPhone: '+84905111222',
        email: 'an.nguyen@example.com',
        nationality: 'Vietnam',
        preferredDate: new Date().toISOString().split('T')[0],
        destination: 'danang',
        clinic: 'East Meets West Dental (Da Nang)',
        preferredSession: 'morning',
        confirmedHour: '09:00 AM',
        treatment: 'Teeth Whitening (x1), Clear Aligner consultations',
        selectedServices: ['Teeth Whitening', 'Digital Smile Design & Consult'],
        serviceQuantities: { 'Teeth Whitening': 1 },
        additionalDetails: 'Wants morning priority slot due to travel departure.',
        status: 'confirmed',
        created_by: 'Staff / Consultant',
        referralCode: 'ALEX2025',
        referrerName: 'Alex Tran',
        referralStatus: 'VALID',
        internalNotes: 'Pre-vetted patient from VIP partner program.',
        created_at: new Date().toISOString()
      },
      'UCS-2222-AU': {
        bookingId: 'UCS-2222-AU',
        fullName: 'Sarah Jenkins',
        whatsappPhone: '+61298765432',
        email: 'sarah.j@example.au',
        nationality: 'Australia',
        preferredDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        destination: 'hcm',
        clinic: 'Elite Dental Group (Ho Chi Minh)',
        preferredSession: 'afternoon',
        confirmedHour: '02:30 PM',
        treatment: 'Dental Implants (x1)',
        selectedServices: ['Dental Implants'],
        serviceQuantities: { 'Dental Implants': 1 },
        additionalDetails: 'Requires airport transport support.',
        status: 'booking_requested',
        created_by: 'Patient',
        referralCode: 'SARAH001',
        referrerName: 'Sarah Nguyen',
        referralStatus: 'VALID',
        internalNotes: 'Awaiting digital X-Ray confirmation records.',
        created_at: new Date().toISOString()
      }
    };
    localStorage.setItem('ucsmile_bookings_db', JSON.stringify(dummy));
  }
}

export default function BookingPage() {
  const { bookingCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const referrerSearchRef = useRef<HTMLDivElement>(null);

  // Setup routing mode parameters
  const isPassPage = !!bookingCode;
  const isInternal = location.pathname.includes('/booking/internal');

  // Load baseline mock database
  useEffect(() => {
    seedMockBookings();
  }, []);

  // Load draft from homepage or previous incomplete session
  useEffect(() => {
    if (!isPassPage) {
      const saved = localStorage.getItem('ucsmile_saved_booking');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          
          // If the draft belongs to an already finalized and stored reservation, don't pre-fill to avoid duplicated requests.
          const dbObj = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
          if (data.bookingId && dbObj[data.bookingId]) {
            return;
          }

          if (data.fullName) setFullName(data.fullName);
          if (data.whatsappPhone) setWhatsappPhone(data.whatsappPhone);
          if (data.email) setEmail(data.email);
          if (data.nationality && data.nationality !== 'N/A') setNationality(data.nationality);
          if (data.destination) setDestination(data.destination);
          if (data.clinic) setClinic(data.clinic);
          if (data.preferredDate) {
            // Verify date conforms with standard ISO YYYY-MM-DD picker constraint
            if (/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) {
              setPreferredDate(data.preferredDate);
            } else {
              setPreferredDate(new Date().toISOString().split('T')[0]);
            }
          }
          if (data.preferredSession) setPreferredSession(data.preferredSession);
          if (data.additionalDetails) setAdditionalDetails(data.additionalDetails);
          
          if (data.treatment && data.treatment !== 'Choose your treatment') {
            const foundT = TREATMENTS.find(t => t.name === data.treatment || t.id === data.treatment || data.treatment.includes(t.name));
            if (foundT) {
              setSelectedServices([foundT.name]);
              if (foundT.hasQuantity) {
                setServiceQuantities({ [foundT.name]: 1 });
              }
            }
          }
        } catch (err) {
          console.warn('Error parsing prefilled home draft', err);
        }
      }
    }
  }, [isPassPage]);

  // ----------------------------------------------------
  // PUBLIC & SHARED FORM STATES
  // ----------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('Select Nationality');
  
  const [preferredDate, setPreferredDate] = useState('');
  const [destination, setDestination] = useState('danang');
  const [clinic, setClinic] = useState('Any Vetted Partner Clinic');
  const [preferredSession, setPreferredSession] = useState<'morning' | 'afternoon'>('morning');
  const [confirmedHour, setConfirmedHour] = useState('');
  
  const [treatment, setTreatment] = useState('Choose your treatment');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Auto-capture public referral from URL query params
  const [publicReferralCode] = useState(() => {
    const fromUrl = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('referrer');
    if (fromUrl) {
      localStorage.setItem('ucsmile_referral_code', fromUrl);
      return fromUrl;
    }
    return localStorage.getItem('ucsmile_referral_code') || '';
  });

  // ----------------------------------------------------
  // INTERNAL STAFF-ONLY FORM STATES
  // ----------------------------------------------------
  const [internalStatus, setInternalStatus] = useState('booking_requested');
  const [internalReferrerName, setInternalReferrerName] = useState('');
  const [internalReferralCode, setInternalReferralCode] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [showReferrerSuggestions, setShowReferrerSuggestions] = useState(false);

  // Filter referrers on typing name
  const filteredReferrers = useMemo(() => {
    if (!internalReferrerName.trim()) return [];
    return REFERRALS_DB.filter(r => 
      r.name.toLowerCase().includes(internalReferrerName.toLowerCase())
    );
  }, [internalReferrerName]);

  // Handle staff typing referral code directly
  const handleInternalReferralCodeChange = (codeVal: string) => {
    setInternalReferralCode(codeVal);
    // Find matching referrer
    const match = REFERRALS_DB.find(r => r.code.toUpperCase() === codeVal.toUpperCase().trim());
    if (match) {
      setInternalReferrerName(match.name);
    }
  };

  // Safe check referral alignment & calculate status (EMPTY, VALID, INVALID, CONFLICT)
  const referralValidationStatus = useMemo(() => {
    const trimmedName = internalReferrerName.trim();
    const trimmedCode = internalReferralCode.trim().toUpperCase();

    if (!trimmedCode && !trimmedName) return 'EMPTY';

    const matchByCode = REFERRALS_DB.find(r => r.code === trimmedCode);
    const matchByName = REFERRALS_DB.find(r => r.name.toLowerCase() === trimmedName.toLowerCase());

    if (trimmedName && !trimmedCode) {
      return matchByName ? 'PENDING' : 'INVALID';
    }
    if (!trimmedName && trimmedCode) {
      return matchByCode ? 'VALID' : 'INVALID';
    }

    // Both entered, check consistency
    if (matchByCode && matchByName) {
      return matchByCode.code === matchByName.code ? 'VALID' : 'CONFLICT';
    }
    return (matchByCode || matchByName) ? 'CONFLICT' : 'INVALID';
  }, [internalReferrerName, internalReferralCode]);

  // ----------------------------------------------------
  // SYSTEM / VISUAL / DOWNLOAD & PERSISTENCE STATES
  // ----------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (referrerSearchRef.current && !referrerSearchRef.current.contains(event.target as Node)) {
        setShowReferrerSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Sync clinic choose when destination changes
  useEffect(() => {
    setClinic(clinicsByDest[destination]?.[0] || 'Any Vetted Partner Clinic');
  }, [destination]);

  // Reset confirmed hour when session changes
  useEffect(() => {
    setConfirmedHour('');
  }, [preferredSession]);

  // Maintain joining treatment list for calculations and visual rendering
  useEffect(() => {
    if (selectedServices.length > 0) {
      const textList = selectedServices.map(serName => {
        const tObj = TREATMENTS.find(t => t.name === serName);
        if (tObj?.hasQuantity) {
          const qty = serviceQuantities[serName] || 1;
          if (qty > 1) {
            return `${serName} (x${qty})`;
          }
        }
        return serName;
      });
      setTreatment(textList.join(', '));
    } else {
      setTreatment('Choose your treatment');
    }
  }, [selectedServices, serviceQuantities]);

  // Pricing range calculation
  const getPriceRange = () => {
    if (selectedServices.length === 0) {
      return { min: 0, max: 0 };
    }
    let totalMin = 0;
    let totalMax = 0;
    selectedServices.forEach(serName => {
      const tObj = TREATMENTS.find(t => t.name === serName);
      if (tObj && tObj.prices && tObj.prices.vn) {
        const qty = tObj.hasQuantity ? (serviceQuantities[serName] || 1) : 1;
        totalMin += tObj.prices.vn.min * qty;
        totalMax += tObj.prices.vn.max * qty;
      }
    });
    return { min: totalMin, max: totalMax };
  };

  const getServicePriceRangeText = (serName: string, customQty?: number) => {
    const tObj = TREATMENTS.find(t => t.name === serName);
    if (tObj && tObj.prices && tObj.prices.vn) {
      const qty = customQty !== undefined ? customQty : (tObj.hasQuantity ? (serviceQuantities[serName] || 1) : 1);
      return `$${tObj.prices.vn.min * qty} - $${tObj.prices.vn.max * qty}`;
    }
    return '';
  };

  const { min, max } = getPriceRange();

  // ----------------------------------------------------
  // PUBLIC FORM VALIDATIONS
  // ----------------------------------------------------
  const isNameValid = /^[A-Za-zÀ-ỹ\s]{2,100}$/.test(fullName.trim());
  const isPhoneValid = whatsappPhone.trim().length >= 7;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNationalitySelected = nationality !== 'Select Nationality';
  const isDateValid = preferredDate.trim().length > 0;
  const isHourSelected = confirmedHour !== '';
  const isServiceSelected = selectedServices.length > 0;

  const isPublicFormValid = isNameValid && isPhoneValid && isEmailValid && isNationalitySelected && isDateValid && isHourSelected && isServiceSelected;

  // Internal form disabled if conflict detected
  const isInternalFormValid = isPublicFormValid && referralValidationStatus !== 'CONFLICT';

  // ----------------------------------------------------
  // FORM SUBMISSION (PUBLIC & INTERNAL)
  // ----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Pre-check basic inputs
    if (!fullName.trim() || !whatsappPhone.trim() || !email.trim() || !isNationalitySelected || !preferredDate.trim() || !confirmedHour) {
      setFormError('Please fill in all required fields corrected with *.');
      return;
    }
    if (selectedServices.length === 0) {
      setFormError('Please choose at least one dental treatment package.');
      return;
    }
    if (!isNameValid) {
      setFormError('Please enter a valid Patient Full Name (letters and spaces only, 2-100 characters).');
      return;
    }
    if (!isEmailValid) {
      setFormError('Please enter a valid Email Address format.');
      return;
    }

    // Additional date sanity check (must be today or future date)
    const todayStr = new Date().toISOString().split('T')[0];
    if (preferredDate < todayStr) {
      setFormError('The Preferred Date must be today or a future date.');
      return;
    }

    setIsSubmitting(true);

    // Simulate backend connection delay
    setTimeout(() => {
      // Generate standard booking card ID format: UCS-[4-digit seq]-[2-letter country]
      const countryCode = NATIONALITY_CODES[nationality] || 'XX';
      const randSeq = Math.floor(1000 + Math.random() * 9000);
      const generatedCode = `UCS-${randSeq}-${countryCode}`;

      // Assemble unified schema record
      const bookingRecord = {
        bookingId: generatedCode,
        fullName: fullName.trim(),
        whatsappPhone: whatsappPhone.trim(),
        email: email.trim(),
        nationality,
        preferredDate,
        destination,
        clinic,
        preferredSession,
        confirmedHour,
        treatment,
        selectedServices,
        serviceQuantities,
        additionalDetails: additionalDetails.trim(),
        status: isInternal ? internalStatus : 'booking_requested',
        created_by: isInternal ? 'Staff / Consultant' : 'Patient',
        referralCode: isInternal ? internalReferralCode.trim().toUpperCase() : publicReferralCode,
        referrerName: isInternal ? internalReferrerName.trim() : '',
        referralStatus: isInternal ? referralValidationStatus : (publicReferralCode ? 'VALID' : 'EMPTY'),
        internalNotes: isInternal ? internalNotes.trim() : '',
        created_at: new Date().toISOString()
      };

      // Write booking record into central database
      const existingDb = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
      existingDb[generatedCode] = bookingRecord;
      localStorage.setItem('ucsmile_bookings_db', JSON.stringify(existingDb));

      // Save references locally
      localStorage.setItem(`ucsmile_status_${generatedCode}`, bookingRecord.status);
      localStorage.setItem('ucsmile_current_pass_code', generatedCode);

      // Clean up standalone legacy keys to prevent conflicts
      const bookingSessionLegacy = {
        ...bookingRecord,
        qrCodeUrl: '' // dynamically generated in ticket page
      };
      localStorage.setItem('ucsmile_saved_booking', JSON.stringify(bookingSessionLegacy));

      // Reset local flags
      setIsSubmitting(false);

      // Successfully route to specific Booking pass screen
      navigate(`/booking/pass/${generatedCode}`);
    }, 1200);
  };

  // ----------------------------------------------------
  // PASS VIEW CONTROLLER LOGIC
  // ----------------------------------------------------
  const [ticketData, setTicketData] = useState<any | null>(null);
  const [qrBlobUrl, setQrBlobUrl] = useState('');
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const hasAutoDownloaded = useRef(false);

  // Retrieve current system state (simulate offline check)
  const isDeviceOffline = simulateOffline || !navigator.onLine;

  const loadTicket = () => {
    if (!bookingCode) return;
    if (isDeviceOffline) {
      // In simulated or real offline block, we only show limited view with Booking Code
      setTicketData({ bookingId: bookingCode, isOfflineFallback: true });
    } else {
      const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
      const record = db[bookingCode];
      if (record) {
        setTicketData(record);
      } else {
        // Fallback or legacy lookups
        const legacy = localStorage.getItem('ucsmile_saved_booking');
        if (legacy) {
          try {
            const data = JSON.parse(legacy);
            if (data.bookingId === bookingCode) {
              setTicketData(data);
              return;
            }
          } catch {}
        }
        setTicketData(null);
      }
    }
  };

  // Trigger loading ticket when mounting or changing criteria
  useEffect(() => {
    loadTicket();
  }, [bookingCode, simulateOffline]);

  // Generate QR code (payload carries ONLY the Booking Code for user privacy)
  useEffect(() => {
    if (bookingCode) {
      QRCode.toDataURL(bookingCode, {
        margin: 1.5,
        width: 480,
        color: {
          dark: '#141618',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrBlobUrl(url))
      .catch(err => console.error('Error rendering QR Code', err));
    }
  }, [bookingCode]);

  // Auto-download ticket image once loaded (AC 9.1 requirement)
  useEffect(() => {
    if (ticketData && qrBlobUrl && passRef.current && !hasAutoDownloaded.current) {
      hasAutoDownloaded.current = true;
      // Stagger download slightly to let HTML images finish layout rendering
      const timer = setTimeout(() => {
        downloadBookingPassElement();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ticketData, qrBlobUrl]);

  // Capture static image and save to disk
  const downloadBookingPassElement = async () => {
    if (!passRef.current) return;
    setIsDownloading(true);
    try {
      // Verify images complete
      const imgElements = passRef.current.querySelectorAll('img');
      const waitLoad = Array.from(imgElements).map((el) => {
        const i = el as HTMLImageElement;
        if (i.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          i.onload = () => resolve();
          i.onerror = () => resolve();
        });
      });
      await Promise.all(waitLoad);

      const canvas = await html2canvas(passRef.current, {
        backgroundColor: '#141618',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: passRef.current.offsetWidth,
        height: passRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clDoc) => {
          const clonNode = clDoc.querySelector('[data-ticket-pass]');
          if (clonNode) {
            const el = clonNode as HTMLElement;
            el.style.transform = 'none';
            el.style.animation = 'none';
            el.style.opacity = '1';
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `UCSMILE-Pass-${bookingCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Screenshot capture failed. Falling back to direct QR source download:', err);
      if (qrBlobUrl) {
        const link = document.createElement('a');
        link.href = qrBlobUrl;
        link.download = `UCSMILE-QR-${bookingCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Perform secure client cancellation
  const handleCancelAppointment = () => {
    if (!bookingCode) return;
    // Load existing database
    const db = JSON.parse(localStorage.getItem('ucsmile_bookings_db') || '{}');
    const record = db[bookingCode];
    if (record) {
      record.status = 'cancelled';
      db[bookingCode] = record;
      localStorage.setItem('ucsmile_bookings_db', JSON.stringify(db));
    }
    // Set matching legacy variables
    localStorage.setItem(`ucsmile_status_${bookingCode}`, 'cancelled');

    // Reload ticket view
    loadTicket();
    setShowCancelConfirm(false);
  };

  // Reset form to write a new clinical record
  const handleResetForm = () => {
    setFullName('');
    setWhatsappPhone('');
    setEmail('');
    setNationality('Select Nationality');
    setPreferredDate('');
    setDestination('danang');
    setClinic('Any Vetted Partner Clinic');
    setConfirmedHour('');
    setSelectedServices([]);
    setServiceQuantities({});
    setAdditionalDetails('');
    setFormError('');
    setIsSubmitting(false);
    setInternalStatus('booking_requested');
    setInternalReferrerName('');
    setInternalReferralCode('');
    setInternalNotes('');
    hasAutoDownloaded.current = false;

    // Remove legacy cached booking
    localStorage.removeItem('ucsmile_saved_booking');

    navigate('/booking');
  };

  const handleCopyCodeToClipboard = () => {
    if (!bookingCode) return;
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color mappings for different booking states
  const getBadgeClass = (statusVal: string) => {
    const s = (statusVal || '').toLowerCase();
    if (s === 'confirmed') {
      return { 
        bg: 'bg-amber-500/15 border border-amber-500/35 text-amber-500', 
        dot: 'bg-amber-500', 
        label: 'CONFIRMED' 
      };
    }
    if (s === 'cancelled') {
      return { 
        bg: 'bg-red-500/15 border border-red-500/35 text-red-500 font-bold', 
        dot: 'bg-red-500', 
        label: 'CANCELLED' 
      };
    }
    if (s === 'checked-in' || s === 'checked_in') {
      return { 
        bg: 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-400', 
        dot: 'bg-emerald-400', 
        label: 'CHECKED-IN' 
      };
    }
    return { 
      bg: 'bg-blue-500/15 border border-blue-500/35 text-blue-400', 
      dot: 'bg-blue-400', 
      label: 'BOOKING REQUESTED' 
    };
  };

  // ----------------------------------------------------
  // VIEW RENDERER DISPATCHER
  // ----------------------------------------------------
  if (isPassPage) {
    // PASS TICKET SCREEN
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-4 md:px-8 text-brand-text font-sans">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Top Panel back actions */}
          <div className="flex justify-between items-center px-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-all">
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              <span>UCSMILE Home</span>
            </Link>

            <button 
              onClick={() => setSimulateOffline(!simulateOffline)}
              className={`p-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-widest border transition-all cursor-pointer ${
                simulateOffline 
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              Toggle Simulated Offline
            </button>
          </div>

          {/* Offline alert banner (AC 9.2) */}
          {isDeviceOffline && (
            <div className="bg-white rounded-3xl p-5 border border-gray-100 flex items-center gap-4 text-left shadow-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3px]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-gray-950 text-sm">Booking Saved Offline!</h4>
                <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                  Your booking reference has been saved to your browser. You can return to this tab later to reload your latest booking status.
                </p>
              </div>
            </div>
          )}

          {ticketData ? (
            <>
              {/* Airline Boarding Ticket card */}
              <div 
                ref={passRef} 
                data-ticket-pass="true" 
                className="bg-[#141618] text-white rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col"
              >
                {/* Boarding ticket coupon circular punching notches */}
                <span className="absolute left-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -ml-3 z-30" />
                <span className="absolute right-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -mr-3 z-30" />

                {/* PASS HEADER BAND */}
                <div className="p-8 text-center border-b border-white/5 bg-gradient-to-r from-gray-900/40 via-[#141618] to-gray-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 px-10">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#FFD151] uppercase tracking-[0.25em] block mb-1 font-mono">UCSMILE CONCIERGE</span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">Dental Priority Pass</h2>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-extrabold block mb-1">Pass Status</span>
                    <span className={`inline-flex py-1 px-3.5 rounded-full text-[9px] font-bold tracking-wider items-center gap-1 shadow-md ${
                      getBadgeClass(ticketData.isOfflineFallback ? 'confirmed' : ticketData.status).bg
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        getBadgeClass(ticketData.isOfflineFallback ? 'confirmed' : ticketData.status).dot
                      }`} />
                      {getBadgeClass(ticketData.isOfflineFallback ? 'confirmed' : ticketData.status).label}
                    </span>
                  </div>
                </div>

                {/* RECEPT_VERIFICATION CRITERIA BODY */}
                <div className="p-8 space-y-6">
                  
                  {/* Part 1: Pass Code ID & Copy controllers */}
                  <div className="text-left border-b border-white/5 pb-4">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Booking Code Reference</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-[#FFD151] tracking-tight">{bookingCode}</span>
                      <button 
                        onClick={handleCopyCodeToClipboard}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#FFD151] cursor-pointer transition-colors"
                        title="Copy Booking Code"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {ticketData.isOfflineFallback ? (
                    /* High density minimalistic offline layout view block (AC 9.2) */
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <Lock className="w-7 h-7 text-amber-500 mx-auto mb-2.5" />
                      <p className="text-sm font-bold text-gray-100">Details Sealed Offline</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed font-semibold">
                        This device is currently offline. Connect to the internet to fully synchronize and inspect patient and appointment details.
                      </p>
                    </div>
                  ) : (
                    /* Detailed online values view (Shows all patient-facing credentials) */
                    <div className="space-y-4 text-left text-xs text-gray-300 font-semibold border-b border-white/5 pb-5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Patient Name</span>
                        <span className="text-white font-bold uppercase">{ticketData.fullName}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-1 font-sans">
                        <div className="flex justify-between font-mono">
                          <span className="text-gray-400 uppercase tracking-wider text-xs">Selected Treatment</span>
                          <span className="text-gray-400 text-[10px]">
                            ({(ticketData.selectedServices || []).length} treatment{ (ticketData.selectedServices || []).length > 1 ? 's' : '' })
                          </span>
                        </div>
                        
                        <div className="border border-white/5 bg-white/5 rounded-2xl divide-y divide-white/10 p-2 text-left">
                          {(ticketData.selectedServices || []).map((serName: string) => {
                            const tObj = TREATMENTS.find(t => t.name === serName);
                            const qty = (ticketData.serviceQuantities || {})[serName] || 1;
                            const prText = getServicePriceRangeText(serName, qty);

                            return (
                              <div key={serName} className="flex items-center justify-between py-2 px-2 hover:bg-white/5 rounded-lg transition-colors">
                                <div className="min-w-0 pr-2">
                                  <span className="font-sans font-semibold text-gray-200 text-xs block truncate">{serName}</span>
                                </div>
                                <div className="flex items-center gap-3.5 flex-shrink-0">
                                  {tObj?.hasQuantity && (
                                    <span className="text-[10px] font-bold text-gray-300 bg-white/10 border border-white/10 rounded px-1.5 py-0.5 font-mono select-none">
                                      Qty: {qty}
                                    </span>
                                  )}
                                  {prText && (
                                    <span className="font-mono text-xs text-amber-300 font-semibold min-w-[75px] text-right">
                                      {prText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Dental Clinic</span>
                        <span className="text-[#FFD151] font-bold">{ticketData.clinic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Assigned City</span>
                        <span className="text-[#FFD151] font-bold">
                          {ticketData.destination === 'danang' ? '✈ Da Nang, VN' : '✈ Ho Chi Minh, VN'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Appointment Date</span>
                        <span className="text-white font-bold">{ticketData.preferredDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Confirmed Hour</span>
                        <span className="text-[#FFD151] font-bold">
                          {convertTo12HourFormat(ticketData.confirmedHour)} ({ticketData.preferredSession === 'morning' ? 'Morning' : 'Afternoon'})
                        </span>
                      </div>

                      {ticketData.additionalDetails && (
                        <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-left font-sans">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Patient Note</span>
                          <span className="text-xs text-gray-300 font-medium italic block">"{ticketData.additionalDetails}"</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual QR container */}
                  <div className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl max-w-xs mx-auto shadow-inner border border-white/10 my-4">
                    {qrBlobUrl ? (
                      <div className="relative">
                        <img 
                          src={qrBlobUrl} 
                          alt="Verification QR code" 
                          className="w-48 h-48 md:w-52 md:h-52 object-contain select-none pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#141618] rounded-md border border-[#FFD151] flex items-center justify-center text-[#FFD151] text-[8px] font-black tracking-tighter">
                          UCS
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-300">
                        <span>Generating Secure Pass QR...</span>
                      </div>
                    )}
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-800 mt-2 block font-sans">Present on Arrival</span>
                  </div>

                  {/* Informational Status texts according to Status values (AC 8) */}
                  {!ticketData.isOfflineFallback && (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 text-center text-xs leading-relaxed max-w-sm mx-auto font-sans">
                      {ticketData.status === 'booking_requested' && (
                        <p className="text-blue-300 font-bold">
                          Your booking request has been received. This QR code is used to track your booking request. Your appointment will be confirmed after our consultant contacts you.
                        </p>
                      )}
                      {ticketData.status === 'confirmed' && (
                        <p className="text-amber-300 font-bold">
                          Your dental scheduled window has been finalized! Please present this pass to the clinic receptionist on arrival to log your visit.
                        </p>
                      )}
                      {ticketData.status === 'cancelled' && (
                        <p className="text-red-400 font-bold">
                          This appointment and priority coordinator status have been cancelled.
                        </p>
                      )}
                      {(ticketData.status === 'checked-in' || ticketData.status === 'checked_in') && (
                        <p className="text-emerald-400 font-bold">
                          Your clinical arrival has been successfully verified! Feel free to relax, our dental specialist will be with you shortly.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: download pass / cancels / new forms */}
              <div className="space-y-3.5">
                <button
                  type="button"
                  onClick={downloadBookingPassElement}
                  disabled={isDownloading}
                  className={`w-full py-4 font-extrabold text-xs tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    isDownloading 
                      ? 'bg-gray-100 text-gray-400 border border-gray-150 cursor-not-allowed animate-pulse' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="animate-spin w-4 h-4 text-amber-500" />
                      <span>Generating Pass Image...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4.5 h-4.5 text-amber-500" />
                      <span>Download Booking Pass Card (.PNG)</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3.5">
                  {ticketData.status === 'cancelled' ? (
                    <button
                      onClick={handleResetForm}
                      className="p-4 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-widest hover:bg-gray-50 text-gray-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-500" />
                      <span>NEW BOOKING FORM</span>
                    </button>
                  ) : (
                    <button
                      disabled={ticketData.status !== 'confirmed' && ticketData.status !== 'booking_requested'}
                      onClick={() => setShowCancelConfirm(true)}
                      className={`p-4 rounded-xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
                        ticketData.status === 'confirmed' || ticketData.status === 'booking_requested'
                          ? 'bg-white border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                      title={ticketData.status === 'confirmed' || ticketData.status === 'booking_requested' ? 'Cancel appointment slot' : 'Only editable when status is confirmed or requested'}
                    >
                      <X className="w-4 h-4 text-red-500" />
                      <span>Cancel Appointment</span>
                    </button>
                  )}

                  <Link
                    to="/"
                    className="p-4 rounded-xl bg-[#141618] text-white border border-[#141618] text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-gray-150 p-12 text-center text-[#1a1c1e] shadow-xl space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold font-serif">Priority Pass Not Found</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                We could not retrieve any clinic records corresponding to booking reference <strong>{bookingCode}</strong>. Try typing another correct booking code.
              </p>
              <button 
                onClick={() => navigate('/booking')} 
                className="btn-luxury py-3.5 px-8 text-xs font-black uppercase tracking-wider"
              >
                Return to booking screen
              </button>
            </div>
          )}

          {/* Secure cancellation confirmation overlay */}
          <AnimatePresence>
            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 max-w-sm w-full border border-gray-150 shadow-2xl text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-gray-900">Cancel Appointment?</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                      Your guaranteed priority slot and coordinator support will be cancelled. This action is final.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleCancelAppointment}
                      className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Confirm Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Keep Appointment
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FORM COMPILER SCREEN (PUBLIC & INTERNAL COPIES)
  // ----------------------------------------------------
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-24 px-4 md:px-8 text-brand-text font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Back Link Nav header */}
        <div className="mb-8 flex justify-between items-center max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-all">
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Go Back Home</span>
          </Link>
          
          <div className="flex gap-2">
            {!isInternal ? (
              <Link 
                to="/booking/internal" 
                className="inline-flex items-center gap-1.5 px-4.5 py-2 hover:bg-white text-xs font-black uppercase tracking-widest border border-gray-200 rounded-xl transition-all text-gray-500 hover:text-gray-800 hover:shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Internal Staff Entry</span>
              </Link>
            ) : (
              <Link 
                to="/booking" 
                className="inline-flex items-center gap-1.5 px-4.5 py-2 hover:bg-white text-xs font-black uppercase tracking-widest border border-gray-200 rounded-xl transition-all text-gray-500 hover:text-gray-800 hover:shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Public Patient Form</span>
              </Link>
            )}
          </div>
        </div>

        {/* Form Container Wrapper */}
        <div className="bg-white rounded-[3rem] shadow-[0_45px_120px_rgba(15,23,42,0.03)] border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto">
          
          {/* LEFT SIDE STANDALONE BAR PANEL */}
          <div className="col-span-12 lg:col-span-5 bg-[#141618] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FFD151]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
            
            <div className="text-left relative z-10 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 block font-mono">
                {isInternal ? 'SECURE INTERNAL SYSTEM' : 'PRIORITY APPOINTMENT KEY'}
              </span>
              <h1 className="font-serif text-3.5xl md:text-[2.6rem] leading-[1.1] font-bold text-white">
                {isInternal ? 'Direct Booking Entry.' : 'Confirm Your Dental Visit.'}
              </h1>
              <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm pt-2">
                {isInternal 
                  ? 'Authorized receptionist portal to register verified treatment itineraries, select referral parameters, and instantly authorize check-in codes.'
                  : 'Enter your custom information below to process your reservation. You will instantly receive a clinical boarding pass and a unique secure tracker QR code.'
                }
              </p>
            </div>

            {/* List with golden indicators */}
            <div className="space-y-6 text-left my-10 relative z-10 max-w-sm">
              <div className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-lg shadow-amber-500/20" />
                <p className="text-gray-300 text-sm leading-relaxed font-semibold">
                  Validates letter length and strict formatting criteria automatically.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-lg shadow-amber-500/20" />
                <p className="text-gray-300 text-sm leading-relaxed font-semibold">
                  Generates private tracker QR passes with zero personal metadata leaks.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-lg shadow-amber-500/20" />
                <p className="text-gray-300 text-sm leading-relaxed font-semibold">
                  Saves local sessions dynamically inside secure offline sandbox blocks.
                </p>
              </div>
            </div>

            {/* Quality vetting guarantee badge */}
            <div className="pt-8 border-t border-white/5 flex items-center gap-4 text-left relative z-10 mt-auto">
              <div className="w-11 h-11 rounded-xl bg-[#2a2c2e] border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm leading-snug">UCsmile Guarantee</h5>
                <p className="text-[#999999] text-[10px] font-bold uppercase tracking-wider">Authorized Partner Networks</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM CORE */}
          <div className="col-span-12 lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-9">

              {/* PART A: Patient identification */}
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-left">
                    <User className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-lg text-gray-900">Patient Identification</h3>
                  </div>
                  {isInternal && (
                    <span className="inline-flex bg-amber-50 border border-amber-100 text-amber-800 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-xs items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> STAFF ACCESS
                    </span>
                  )}
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
                      placeholder="e.g. Johnathan Doe"
                      className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-400 font-semibold"
                    />
                    {fullName && !isNameValid && (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">⚠️ Letters & spaces only, 2-100 chars.</p>
                    )}
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
                      placeholder="Include country code (e.g. +61 400)"
                      className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-400 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 text-left">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-400 font-semibold"
                    />
                    {email && !isEmailValid && (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">⚠️ Enter a valid email format.</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                      NATIONALITY <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-semibold"
                      >
                        {NATIONALITIES.map((nat, idx) => (
                          <option key={idx} value={nat} disabled={idx === 0}>{nat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART B: Appointment location session timing selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-left">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-lg text-gray-900">Appointment Schedule</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5 text-left">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                      PREFERRED DATE <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]} // AC restriction validation: must be today or future
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-400 font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                      PREFERRED CITY <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-semibold"
                      >
                        <option value="danang">Da Nang</option>
                        <option value="hcm">Ho Chi Minh</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-left font-sans">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                    PREFERRED CLINIC
                  </label>
                  <div className="relative">
                    <select 
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-semibold"
                    >
                      {clinicsByDest[destination]?.map((cl, i) => (
                        <option key={i} value={cl}>{cl}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                      PREFERRED SESSION <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setPreferredSession('morning')}
                        className={`p-3.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          preferredSession === 'morning' 
                          ? 'bg-amber-50/50 border-amber-400 text-amber-800 ring-1 ring-amber-400/20 shadow-xs' 
                          : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        <Sun className={`w-4.5 h-4.5 ${preferredSession === 'morning' ? 'text-amber-500' : 'text-gray-400'}`} />
                        <span>MORNING</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPreferredSession('afternoon')}
                        className={`p-3.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          preferredSession === 'afternoon' 
                          ? 'bg-amber-50/50 border-amber-400 text-amber-800 ring-1 ring-amber-400/20 shadow-xs' 
                          : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        <Moon className={`w-4.5 h-4.5 ${preferredSession === 'afternoon' ? 'text-amber-500' : 'text-gray-400'}`} />
                        <span>AFTERNOON</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                      PREFERRED HOUR <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={confirmedHour}
                        onChange={(e) => setConfirmedHour(e.target.value)}
                        className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-semibold text-gray-800"
                        required
                      >
                        <option value="">Select Priority Slot</option>
                        {(preferredSession === 'morning' 
                          ? ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] 
                          : ['01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM']
                        ).map((hOpt) => (
                          <option key={hOpt} value={hOpt}>{hOpt}</option>
                        ))}
                      </select>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART C: Select treatment packages services & quantities */}
              <div className="space-y-4 text-left" ref={dropdownRef}>
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Stethoscope className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-lg text-gray-900">Select Treatment Packages <span className="text-red-500">*</span></h3>
                </div>

                <div className="relative text-left">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full border rounded-2xl px-5 py-4 text-sm font-semibold flex items-center justify-between cursor-pointer shadow-xs transition-all ${
                      selectedServices.length > 0 
                        ? 'bg-white border-amber-300 ring-2 ring-amber-100/50 text-gray-900' 
                        : 'bg-[#FAF9F6]/50 border-gray-200 text-gray-400 hover:border-amber-400 hover:bg-white'
                    }`}
                  >
                    <span className={selectedServices.length === 0 ? 'text-gray-400 font-normal font-sans' : 'text-gray-950 font-bold font-sans'}>
                      {selectedServices.length === 0 
                        ? 'Choose available services...' 
                        : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                      }
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 overflow-hidden max-h-[300px] flex flex-col">
                      <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/70">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input 
                          type="text"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder="Search dental solutions..."
                          className="w-full bg-transparent text-xs focus:outline-none font-semibold text-gray-800 placeholder:text-gray-400"
                        />
                        {serviceSearch && (
                          <button 
                            type="button" 
                            onClick={() => setServiceSearch('')}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="overflow-y-auto py-1 divide-y divide-gray-50">
                        {(() => {
                          const filtered = TREATMENTS.filter(t => 
                            t.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                            t.category.toLowerCase().includes(serviceSearch.toLowerCase())
                          );

                          if (filtered.length === 0) {
                            return (
                              <div className="p-6 text-center text-xs text-gray-400 font-semibold">
                                No treatments match "{serviceSearch}"
                              </div>
                            );
                          }

                          const categories: string[] = [];
                          const grouped: Record<string, Treatment[]> = {};
                          
                          filtered.forEach(t => {
                            const cat = t.category || 'Other';
                            if (!grouped[cat]) {
                              grouped[cat] = [];
                              categories.push(cat);
                            }
                            grouped[cat].push(t);
                          });

                          return categories.map((catKey) => (
                            <div key={catKey} className="bg-white">
                              <div className="px-4.5 py-2 text-[9px] font-black tracking-widest text-[#FFB800] uppercase font-sans select-none bg-gray-50/50">
                                {catKey}
                              </div>
                              <div className="divide-y divide-gray-50/45">
                                {grouped[catKey].map((t) => {
                                  const isChecked = selectedServices.includes(t.name);
                                  return (
                                    <div 
                                      key={t.id}
                                      onClick={() => {
                                        if (isChecked) {
                                          setSelectedServices(selectedServices.filter(item => item !== t.name));
                                          const nextQ = {...serviceQuantities};
                                          delete nextQ[t.name];
                                          setServiceQuantities(nextQ);
                                        } else {
                                          setSelectedServices([...selectedServices, t.name]);
                                          if (t.hasQuantity) {
                                            setServiceQuantities(prev => ({ ...prev, [t.name]: 1 }));
                                          }
                                        }
                                      }}
                                      className={`flex items-start gap-3 pl-4 pr-3.5 py-3 hover:bg-gray-50/60 cursor-pointer transition-colors select-none ${
                                        isChecked ? 'bg-amber-50/5' : ''
                                      }`}
                                    >
                                      <div className="w-4 h-4 flex-shrink-0 mt-0.5 border border-gray-300 rounded flex items-center justify-center bg-white">
                                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />}
                                      </div>
                                      <div className="flex-1 text-left">
                                        <span className={`text-xs block ${isChecked ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'}`}>
                                          {t.name}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected packages quantity rows */}
                {selectedServices.length > 0 && (
                  <div className="flex flex-col pt-3 border-t border-gray-100 divide-y divide-gray-100 text-left">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest pb-1.5 px-0.5 select-none">
                      Selected Outpatient Services ({selectedServices.length})
                    </div>
                    {selectedServices.map((serName) => {
                      const tObj = TREATMENTS.find(t => t.name === serName);
                      const qty = serviceQuantities[serName] || 1;
                      const priceT = getServicePriceRangeText(serName, qty);

                      return (
                        <div key={serName} className="flex items-center justify-between py-2.5 px-0.5 hover:bg-gray-50/40 rounded-lg transition-colors">
                          <div className="min-w-0 pr-2">
                            <span className="font-sans font-bold text-gray-800 text-xs sm:text-sm block truncate">{serName}</span>
                          </div>
                          
                          <div className="flex items-center gap-3.5 flex-shrink-0">
                            {tObj?.hasQuantity ? (
                              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (qty > 1) {
                                      setServiceQuantities(prev => ({ ...prev, [serName]: qty - 1 }));
                                    }
                                  }}
                                  className="p-1 hover:bg-gray-200 text-gray-505 rounded cursor-pointer"
                                  title="Reduce quantity"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-xs font-bold text-gray-800 font-mono min-w-[12px] text-center select-none">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setServiceQuantities(prev => ({ ...prev, [serName]: qty + 1 }));
                                  }}
                                  className="p-1 hover:bg-gray-200 text-gray-505 rounded cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-12 hidden sm:block" />
                            )}

                            {priceT && <span className="font-mono text-xs text-gray-500 font-medium min-w-[75px] text-right">{priceT}</span>}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedServices(selectedServices.filter(x => x !== serName));
                                const nextQ = {...serviceQuantities};
                                delete nextQ[serName];
                                setServiceQuantities(nextQ);
                              }}
                              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                              title="Delete package"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* STAFF-ONLY ADDITIONAL ENTRY SEGMENTS (AC 4 / 5) */}
              {isInternal && (
                <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-200 text-left space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2.5">
                    <Shield className="w-4.5 h-4.5 text-amber-500" />
                    <h4 className="font-bold text-sm uppercase text-gray-900 tracking-wider">Internal Coordination Panel</h4>
                  </div>

                  {/* Status Picker Selector */}
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5 ml-0.5">
                      AUTHORIZED BOOKING STATUS <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { val: 'booking_requested', label: 'Requested', desc: 'Patient-led review' },
                        { val: 'confirmed', label: 'Confirmed', desc: 'Secured priority' },
                        { val: 'cancelled', label: 'Cancelled', desc: 'Invalidate pass' },
                        { val: 'checked_in', label: 'Checked-In', desc: 'Logged arrival' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setInternalStatus(item.val)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                            internalStatus === item.val
                              ? 'bg-amber-100/50 border-amber-400 text-amber-900 shadow-xs'
                              : 'bg-white border-gray-250 text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5 font-medium">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Referrer Name Text Field suggestions lookup */}
                    <div className="relative" ref={referrerSearchRef}>
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5 ml-0.5">
                        REFERRER FULL NAME (SEARCH)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={internalReferrerName}
                          onChange={(e) => {
                            setInternalReferrerName(e.target.value);
                            setShowReferrerSuggestions(true);
                          }}
                          onFocus={() => setShowReferrerSuggestions(true)}
                          placeholder="e.g. Sarah Nguyen"
                          className="w-full bg-white border border-gray-250 rounded-xl px-3.5 py-3 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Dropdown suggestions list */}
                      {showReferrerSuggestions && filteredReferrers.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 divide-y divide-gray-50 max-h-40 overflow-y-auto">
                          {filteredReferrers.map((r, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setInternalReferrerName(r.name);
                                setInternalReferralCode(r.code);
                                setShowReferrerSuggestions(false);
                              }}
                              className="p-2.5 px-3 text-xs hover:bg-gray-50 cursor-pointer text-left font-semibold text-gray-800 flex justify-between items-center"
                            >
                              <span>{r.name}</span>
                              <span className="text-[9px] font-black text-amber-500 bg-amber-50/50 border border-amber-300/30 rounded px-1">{r.code}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Referral Code manual inputs */}
                    <div>
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5 ml-0.5">
                        REFERRAL CODE (AUTO-MATCH)
                      </label>
                      <input
                        type="text"
                        value={internalReferralCode}
                        onChange={(e) => handleInternalReferralCodeChange(e.target.value)}
                        placeholder="e.g. SARAH001"
                        className="w-full bg-white border border-gray-250 rounded-xl px-3.5 py-3 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Referral validations prompts indicator (AC 5.4 / 5.5) */}
                  {referralValidationStatus === 'INVALID' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-start gap-2 leading-relaxed">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                      <span>Invalid referral code. Please check again or leave this field blank.</span>
                    </div>
                  )}

                  {referralValidationStatus === 'CONFLICT' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-start gap-2 leading-relaxed">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500 font-bold" />
                      <span>Referrer name and referral code do not match. Please select the correct referrer or remove the referral information.</span>
                    </div>
                  )}

                  {referralValidationStatus === 'VALID' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 font-bold">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Referral parameters matched beautifully! (Status is Valid)</span>
                    </div>
                  )}

                  {/* Staff Internal Notes Area (Will NOT build in patient pass) */}
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5 ml-0.5">
                      INTERNAL CONSULTANT NOTES (CONFIDENTIAL)
                    </label>
                    <textarea
                      rows={2}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="e.g. Patient prefers Da Nang scenic views. Pre-approved for VIP tier pricing discounts."
                      className="w-full bg-white border border-gray-250 rounded-xl px-4 py-3 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-semibold leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Patient general public notes (AC requirement: max 500 characters check) */}
              <div className="space-y-4 text-left">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500">ADDITIONAL ARRIVAL QUESTIONS (OPTIONAL)</h3>
                </div>
                <div>
                  <textarea 
                    rows={2.5}
                    maxLength={500}
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Any flight scheduling, hotel logistics, or specific tooth treatment concerns?"
                    className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none placeholder:text-gray-400 font-semibold"
                  />
                  {additionalDetails.length > 0 && (
                    <p className="text-[9px] text-gray-400 text-right mt-1 font-mono">
                      {additionalDetails.length}/500 chars maximum
                    </p>
                  )}
                </div>
              </div>

              {formError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-[#FF4D4D] font-bold text-xs text-left">
                  ⚠️ {formError}
                </div>
              )}

              {/* ACTION COMPILING FOOTER BAND */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ESTIMATED PRICE SUMMARY</p>
                  <p className="text-4xl font-extrabold text-amber-500 mt-1">
                    {min === 0 ? '$0' : `$${min} - $${max}`}
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || (isInternal ? !isInternalFormValid : !isPublicFormValid)}
                  className={`rounded-full p-4.5 px-11 font-extrabold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 w-full sm:w-auto text-center cursor-pointer ${
                    isSubmitting 
                      ? 'bg-gray-100 border border-gray-150 text-gray-400 cursor-not-allowed animate-pulse'
                      : (isInternal ? isInternalFormValid : isPublicFormValid)
                        ? 'bg-gradient-to-r from-amber-400 to-[#FFB800] hover:from-amber-300 hover:to-[#efa500] text-gray-900 shadow-md shadow-brand-primary/10 active:scale-[0.98]'
                        : 'bg-gray-100 border border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin h-3.5 w-3.5" />
                      <span>AUTHORIZING...</span>
                    </>
                  ) : (
                    <span>{isInternal ? 'Authorize direct booking entry' : 'Submit Booking Request'}</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
