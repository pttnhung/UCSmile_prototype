import React, { useState, useEffect, useRef } from 'react';
import { encodeBooking } from './codec';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Clock,
  X,
  Search,
  ChevronDown,
  Stethoscope,
  Minus,
  Plus
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
  const [searchParams] = useSearchParams();
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
  const [confirmedHour, setConfirmedHour] = useState('');
  
  const [treatment, setTreatment] = useState('Choose your treatment');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Referral state
  const [referralCode, setReferralCode] = useState(() => {
    const fromUrl = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('referrer');
    if (fromUrl) {
      localStorage.setItem('ucsmile_referral_code', fromUrl);
      return fromUrl;
    }
    return localStorage.getItem('ucsmile_referral_code') || '';
  });

  // App states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'confirmed' | 'cancelled' | 'checked_in'>('confirmed');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep treatment selection string in sync for global QR code generation and printable card
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
        
        const savedTreatment = data.treatment || 'Choose your treatment';
        if (savedTreatment && savedTreatment !== 'Choose your treatment') {
          // Reconstruct array of selected services by stripping out the quantity suffix e.g. " (x3)"
          const list = savedTreatment.split(', ').filter(Boolean).map(item => item.replace(/\s*\(x\d+\)/g, ''));
          setSelectedServices(list);
          setTreatment(savedTreatment);

          // Restore quantities
          if (data.serviceQuantities) {
            setServiceQuantities(data.serviceQuantities);
          } else {
            const quants: Record<string, number> = {};
            savedTreatment.split(', ').filter(Boolean).forEach(item => {
              const match = item.match(/(.+?)\s*\(x(\d+)\)/);
              if (match) {
                quants[match[1]] = parseInt(match[2], 10);
              }
            });
            setServiceQuantities(quants);
          }
        } else {
          setSelectedServices([]);
          setServiceQuantities({});
          setTreatment('Choose your treatment');
        }

        setDestination(data.destination || 'danang');
        setClinic(data.clinic || 'Any Vetted Partner Clinic');
        setPreferredDate(data.preferredDate || '');
        setPreferredSession(data.preferredSession || 'morning');
        setConfirmedHour(data.confirmedHour || '');
        setAdditionalDetails(data.additionalDetails || '');
        setBookingId(data.bookingId || '');
        setQrCodeUrl(data.qrCodeUrl || '');
        if (data.referralCode) {
          setReferralCode(data.referralCode);
        }
        setBookingConfirmed(true);

        const currentId = data.bookingId;
        if (currentId) {
          const storedStatus = localStorage.getItem(`ucsmile_status_${currentId}`);
          if (storedStatus === 'cancelled' || storedStatus === 'checked_in' || storedStatus === 'confirmed') {
            setBookingStatus(storedStatus);
          } else {
            setBookingStatus('confirmed');
          }
        }
      } catch (err) {
        console.error('Error restoring active booking session', err);
      }
    }
  }, []);

  // Update status when booking ID is set or loaded
  useEffect(() => {
    if (bookingId) {
      const storedStatus = localStorage.getItem(`ucsmile_status_${bookingId}`);
      if (storedStatus === 'cancelled' || storedStatus === 'checked_in' || storedStatus === 'confirmed') {
        setBookingStatus(storedStatus);
      } else {
        setBookingStatus('confirmed');
      }
    }
  }, [bookingId]);

  // Sync clinic choose when destination changes
  useEffect(() => {
    if (!bookingConfirmed) {
      setClinic(clinicsByDest[destination]?.[0] || 'Any Vetted Partner Clinic');
    }
  }, [destination, bookingConfirmed]);

  // Reset confirmed hour when session changes
  useEffect(() => {
    if (!bookingConfirmed) {
      setConfirmedHour('');
    }
  }, [preferredSession, bookingConfirmed]);

  // Pricing calculation helper for multiple selected services
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

  // Handle Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fullName.trim() || !whatsappPhone.trim() || selectedServices.length === 0 || !preferredDate.trim() || !confirmedHour) {
      setFormError('Please fill in all required fields marked with * and select at least one treatment');
      return;
    }

    setIsSubmitting(true);
    
    // Process dental clinical check-in ticket
    setTimeout(async () => {
      const uniqueId = `UCS-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      
      const formattedSession = `${confirmedHour} (${preferredSession === 'morning' ? 'Morning' : 'Afternoon'} Session)`;

      // Web verification URL inside QR Code (so any standard scanner redirects to a sleek, beautiful check-in pass page)
      const token = encodeBooking({
        id: uniqueId,
        name: fullName,
        service: treatment,
        clinic: clinic,
        date: preferredDate,
        session: formattedSession,
        phone: whatsappPhone,
        nationality: nationality || '',
        destination: destination || '',
        notes: additionalDetails || '',
        email: email || '',
        referral: referralCode
      });
      const qrData = `${window.location.origin}${window.location.pathname || ''}#/verify?p=${token}`;

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

      localStorage.setItem(`ucsmile_status_${uniqueId}`, 'confirmed');
      setBookingStatus('confirmed');
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
        serviceQuantities,
        destination,
        clinic,
        preferredDate,
        preferredSession,
        confirmedHour,
        additionalDetails,
        bookingId: uniqueId,
        qrCodeUrl: generatedUrl,
        referralCode
      };
      localStorage.setItem('ucsmile_saved_booking', JSON.stringify(bookingSessionData));

      // Auto trigger PNG download of the complete Booking Pass (styled ticket format)
      setTimeout(async () => {
        if (passRef.current) {
          try {
             // Retrieve any images inside the ticket (such as the QR code) and verify they are fully loaded
             const images = passRef.current.querySelectorAll('img');
             const loadPromises = Array.from(images).map((el) => {
               const img = el as HTMLImageElement;
               if (img.complete) return Promise.resolve();
               return new Promise<void>((resolve) => {
                 img.onload = () => resolve();
                 img.onerror = () => resolve();
               });
             });
             await Promise.all(loadPromises);

            // High reliability capture settings to bypass iframe layout constraints
            const canvas = await html2canvas(passRef.current, {
              backgroundColor: '#141618',
              scale: 3, // Ultra-crisp rendering
              useCORS: true,
              allowTaint: true,
              logging: false,
              width: passRef.current.offsetWidth,
              height: passRef.current.offsetHeight,
              windowWidth: passRef.current.scrollWidth,
              windowHeight: passRef.current.scrollHeight,
              scrollX: 0,
              scrollY: 0,
              onclone: (clonedDoc) => {
                // Remove transitions, scales, and transforms for stable static screenshot
                const passNode = clonedDoc.querySelector('[data-ticket-pass]');
                if (passNode) {
                  const element = passNode as HTMLElement;
                  element.style.transform = 'none';
                  element.style.transition = 'none';
                  element.style.animation = 'none';
                  element.style.opacity = '1';
                }
              }
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
      }, 1500); // Increased to 1.5s delay to guarantee full state stabilization, animation resolution and image painting

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // Helper function to manual download of full styled booking pass or QR fallback
  const downloadBookingPass = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    // Minor delay to let UI state changes paint nicely
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (passRef.current) {
      try {
        // Retrieve and pre-wait for all image nodes inside the ticket structure to resolve fully
        const images = passRef.current.querySelectorAll('img');
        const loadPromises = Array.from(images).map((el) => {
          const img = el as HTMLImageElement;
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        });
        await Promise.all(loadPromises);

        const canvas = await html2canvas(passRef.current, {
          backgroundColor: '#141618',
          scale: 3, // Ultra crisp high-definition ticket download
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: passRef.current.offsetWidth,
          height: passRef.current.offsetHeight,
          windowWidth: passRef.current.scrollWidth,
          windowHeight: passRef.current.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const passNode = clonedDoc.querySelector('[data-ticket-pass]');
            if (passNode) {
              const element = passNode as HTMLElement;
              element.style.transform = 'none';
              element.style.transition = 'none';
              element.style.animation = 'none';
              element.style.opacity = '1';
            }
          }
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
      } finally {
        setIsDownloading(false);
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
      setIsDownloading(false);
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
    setSelectedServices([]);
    setServiceQuantities({});
    setDestination('danang');
    setPreferredDate('');
    setConfirmedHour('');
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
      `🕒 *Time Session:* ${preferredSession === 'morning' ? '🌞 Morning Session' : '🌙 Afternoon Session'} at ${confirmedHour}\n` +
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
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD151] block font-mono">PRIORITY TICKET</span>
                  <h1 className="font-serif text-4xl md:text-[2.75rem] leading-[1.1] font-bold text-white">
                    Confirm Your<br />Scheduled Visit.
                  </h1>
                  <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm pt-2">
                    This priority form is strictly reserved for patients who have already finalized their itinerary with a UCSmile consultant. Input your pre-arranged details below to generate your check-in pass.
                  </p>
                </div>

                {/* Bullet points with golden dots exactly like the screenshot design */}
                <div className="space-y-8 text-left my-10 relative z-10 max-w-sm">
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      Confirm your pre-arranged treatment & clinic.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      Input your scheduled arrival date.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD151] mt-2 flex-shrink-0 shadow-lg shadow-[#FFD151]/20" />
                    <p className="text-gray-300 text-[15px] md:text-base leading-relaxed font-semibold">
                      Generate your high-priority check-in Pass.
                    </p>
                  </div>
                </div>

                {/* Vetting guarantee footer badge */}
                <div className="pt-8 border-t border-white/5 flex items-center gap-4 text-left relative z-10 mt-auto">
                  <div className="w-11 h-11 rounded-xl bg-[#2a2c2e] border border-[#FFD151]/20 flex items-center justify-center text-[#FFD151] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm leading-snug">5-Star Partner Clinics</h5>
                    <p className="text-[#999999] text-[11px] font-bold uppercase tracking-wider">Quality Vetted Diagnostics</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE Booking Form Segment */}
              <div className="col-span-12 lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
                
                {/* Warning banner specifying pre-finalized schedule only */}
                <div className="mb-6 p-4 rounded-2xl bg-amber-50/50 border border-[#FFD151]/30 text-left">
                  <p className="text-[11px] text-amber-800 font-bold leading-relaxed flex items-start gap-2">
                    <span className="text-sm mt-0.5">⚠️</span>
                    <span>
                      This form only is for patients who have already confirmed their treatment plan with our consultant. Submit it to receive your Check-in Pass instantly.
                    </span>
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-9">
                  
                  {/* Part A: Patient Profile */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-left">
                      <User className="w-5 h-5 text-[#FFB800]" />
                      <h3 className="font-bold text-lg text-gray-900">Patient Identification</h3>
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
                          placeholder="Your complete name"
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
                          placeholder="Registered phone number"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          EMAIL ADDRESS
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
                      <h3 className="font-bold text-lg text-gray-900">Confirmed Appointment Info</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          CONFIRMED DATE <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          placeholder="đd/mm/yyyy (e.g. 15/06/2026)"
                          className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                          CONFIRMED CITY <span className="text-red-500">*</span>
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
                        CONFIRMED CLINIC
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

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="text-left">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                          CONFIRMED SESSION <span className="text-red-500">*</span>
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

                      <div className="text-left font-sans">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                          CONFIRMED HOUR <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            value={confirmedHour}
                            onChange={(e) => setConfirmedHour(e.target.value)}
                            className="w-full bg-[#FAF9F6]/50 border border-gray-200 rounded-xl pl-10 pr-4 py-4 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-semibold text-gray-800"
                            required
                          >
                            <option value="">Select Confirmed Hour</option>
                            {(preferredSession === 'morning' 
                              ? ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] 
                              : ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
                            ).map((hourOpt) => (
                              <option key={hourOpt} value={hourOpt}>
                                {hourOpt} {preferredSession === 'morning' ? 'AM' : 'PM'}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Clock className="w-4.5 h-4.5 text-amber-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part C: Selected Treatment Services */}
                  <div className="space-y-4" ref={dropdownRef}>
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-left">
                      <Stethoscope className="w-5 h-5 text-[#FFB800]" />
                      <h3 className="font-bold text-lg text-gray-900">Select Services <span className="text-red-500">*</span></h3>
                    </div>

                    <div className="relative text-left">
                      {/* Anchor Selector Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full border rounded-[1.2rem] px-5 py-4 text-sm font-semibold flex items-center justify-between cursor-pointer shadow-sm transition-all ${
                          selectedServices.length > 0 
                            ? 'bg-white border-amber-300 ring-2 ring-amber-100/50 text-gray-900' 
                            : 'bg-[#FAF9F6]/50 border-gray-200 text-gray-400 hover:border-amber-300 hover:bg-white'
                        }`}
                      >
                        <span className={selectedServices.length === 0 ? 'text-gray-400 font-normal font-sans' : 'text-gray-900 font-bold font-sans'}>
                          {selectedServices.length === 0 
                            ? 'Choose treatment services...' 
                            : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                          }
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Panel */}
                      {isDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-40 overflow-hidden max-h-[350px] flex flex-col">
                          {/* Search Area */}
                          <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/70">
                            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input 
                              type="text"
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                              placeholder="Search treatment services..."
                              className="w-full bg-transparent text-xs focus:outline-none font-semibold text-gray-800 placeholder:text-gray-400"
                            />
                            {serviceSearch && (
                              <button 
                                type="button" 
                                onClick={() => setServiceSearch('')}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* List of Treatments */}
                          <div className="overflow-y-auto py-1 max-h-[290px] bg-white divide-y divide-gray-50/50">
                            {(() => {
                              const filtered = TREATMENTS.filter(t => 
                                t.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                                t.category.toLowerCase().includes(serviceSearch.toLowerCase())
                              );

                              if (filtered.length === 0) {
                                return (
                                  <div className="p-6 text-center text-xs text-gray-400 font-semibold">
                                    No services match "{serviceSearch}"
                                  </div>
                                );
                              }

                              // Group filtered items by category
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

                              return categories.map((category) => (
                                <div key={category} className="bg-white">
                                  {/* Category Header */}
                                  <div className="px-4.5 py-2.5 text-[10px] font-bold tracking-wider text-slate-400/90 uppercase font-sans select-none bg-gray-50/30 border-b border-gray-100/30">
                                    {category}
                                  </div>
                                  
                                  {/* Group Services */}
                                  <div className="divide-y divide-gray-50/40">
                                    {grouped[category].map((t) => {
                                      const isChecked = selectedServices.includes(t.name);
                                      return (
                                        <div 
                                          key={t.id}
                                          onClick={() => {
                                            if (isChecked) {
                                              setSelectedServices(selectedServices.filter(item => item !== t.name));
                                              const newQuants = {...serviceQuantities};
                                              delete newQuants[t.name];
                                              setServiceQuantities(newQuants);
                                            } else {
                                              setSelectedServices([...selectedServices, t.name]);
                                              if (t.hasQuantity) {
                                                setServiceQuantities(prev => ({ ...prev, [t.name]: 1 }));
                                              }
                                            }
                                          }}
                                          className={`flex items-start gap-3 pl-4 pr-3.5 py-3.5 hover:bg-gray-50/50 cursor-pointer transition-colors select-none ${
                                            isChecked ? 'bg-amber-50/10' : ''
                                          }`}
                                        >
                                          {/* Check Icon Column - indented style */}
                                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                                            {isChecked ? (
                                              <Check className="w-4.5 h-4.5 text-[#FFB800] stroke-[3]" />
                                            ) : null}
                                          </div>
                                          
                                          <div className="flex-1 text-left min-w-0">
                                            <span className={`text-xs sm:text-sm tracking-tight ${
                                              isChecked ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'
                                            }`}>
                                              {t.name}
                                            </span>

                                            {/* Quantity adjustment if checked & supports quantity */}
                                            {t.hasQuantity && isChecked && (
                                              <div 
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 mt-2 bg-white/90 rounded-full px-2 py-0.5 w-max border border-gray-200 shadow-xs"
                                              >
                                                <button 
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentVal = serviceQuantities[t.name] || 1;
                                                    if (currentVal > 1) {
                                                      setServiceQuantities(prev => ({ ...prev, [t.name]: currentVal - 1 }));
                                                    }
                                                  }} 
                                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-700 cursor-pointer"
                                                  title="Decrease quantity"
                                                >
                                                  <Minus className="w-2.5 h-2.5" />
                                                </button>
                                                <span className="text-[10px] font-bold min-w-[0.8rem] text-center text-gray-800 font-mono select-none">
                                                  {serviceQuantities[t.name] || 1}
                                                </span>
                                                <button 
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentVal = serviceQuantities[t.name] || 1;
                                                    setServiceQuantities(prev => ({ ...prev, [t.name]: currentVal + 1 }));
                                                  }} 
                                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-700 cursor-pointer"
                                                  title="Increase quantity"
                                                >
                                                  <Plus className="w-2.5 h-2.5" />
                                                </button>
                                              </div>
                                            )}
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

                    {/* Selected Services Display */}
                    {selectedServices.length > 0 && (
                      <div className="flex flex-col pt-3 border-t border-gray-100/80 divide-y divide-gray-100 text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-1 px-1 select-none">
                          Selected Treatment ({selectedServices.length})
                        </div>
                        {selectedServices.map((serName) => {
                          const tObj = TREATMENTS.find(t => t.name === serName);
                          const qty = serviceQuantities[serName] || 1;
                          const priceStr = getServicePriceRangeText(serName, qty);
                          return (
                            <div 
                              key={serName}
                              className="flex items-center justify-between py-2.5 px-1 hover:bg-gray-50/40 rounded-lg transition-colors"
                            >
                              {/* Left Column: Service Name */}
                              <div className="min-w-0 pr-2">
                                <span className="font-sans font-semibold text-gray-800 text-xs sm:text-sm block truncate">
                                  {serName}
                                </span>
                              </div>

                              {/* Right Columns aligned */}
                              <div className="flex items-center gap-3.5 flex-shrink-0">
                                {/* Quantity Column (only if applies) */}
                                {tObj?.hasQuantity ? (
                                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-0.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (qty > 1) {
                                          setServiceQuantities(prev => ({ ...prev, [serName]: qty - 1 }));
                                        }
                                      }}
                                      className="p-0.5 hover:bg-gray-200 text-gray-500 rounded transition-colors cursor-pointer"
                                      title="Decrease qty"
                                    >
                                      <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="text-[11px] font-bold text-gray-800 font-mono min-w-[10px] text-center select-none">
                                      {qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setServiceQuantities(prev => ({ ...prev, [serName]: qty + 1 }));
                                      }}
                                      className="p-0.5 hover:bg-gray-200 text-gray-500 rounded transition-colors cursor-pointer"
                                      title="Increase qty"
                                    >
                                      <Plus className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-[48px] hidden sm:block" />
                                )}

                                {/* Price Column */}
                                {priceStr && (
                                  <span className="font-mono text-xs text-slate-500 font-medium min-w-[75px] text-right">
                                    {priceStr}
                                  </span>
                                )}

                                {/* Remove Button Column */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedServices(selectedServices.filter(x => x !== serName));
                                    const newQuants = {...serviceQuantities};
                                    delete newQuants[serName];
                                    setServiceQuantities(newQuants);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                                  title="Remove service"
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
              <div ref={passRef} data-ticket-pass="true" className="bg-[#141618] text-white rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col">
                {/* Vintage Ticket tear notches */}
                <span className="absolute left-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -ml-3 z-30" />
                <span className="absolute right-0 top-[32%] w-6 h-6 rounded-full bg-[#FAF9F6] -mr-3 z-30" />

                {/* Header Band */}
                <div className="p-8 text-center border-b border-white/5 bg-gradient-to-r from-gray-900/40 via-[#141618] to-gray-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 px-10">
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#FFD151] uppercase tracking-[0.25em] block mb-1">UCSMILE</span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">Booking QR Pass</h2>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-extrabold block mb-1">Pass Status</span>
                    {bookingStatus === 'checked_in' ? (
                      <span className="inline-flex bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Checked-In
                      </span>
                    ) : bookingStatus === 'cancelled' ? (
                      <span className="inline-flex bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex bg-amber-500/15 border border-amber-500/30 text-[#FFD151] text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>

                {/* Credentials list */}
                <div className="p-8 space-y-6">
                  <div className="text-left border-b border-white/5 pb-4">
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

                  {/* Structured Patient and Booking details */}
                  <div className="space-y-4 text-left text-xs text-gray-300 font-semibold border-b border-white/5 pb-5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Patient Name</span>
                      <span className="text-white font-bold">{fullName}</span>
                    </div>
                    <div className="flex flex-col gap-2 pt-1 font-sans">
                      <div className="flex justify-between font-mono">
                        <span className="text-gray-400 uppercase tracking-wider text-xs">Selected Treatment</span>
                        <span className="text-gray-400 text-[10px]">({selectedServices.length} treatment{selectedServices.length > 1 ? 's' : ''})</span>
                      </div>
                      
                      <div className="border border-white/5 bg-white/5 rounded-2xl divide-y divide-white/10 p-2 text-left">
                        {selectedServices.map((serName) => {
                          const tObj = TREATMENTS.find(t => t.name === serName);
                          const qty = serviceQuantities[serName] || 1;
                          const priceStr = getServicePriceRangeText(serName, qty);

                          return (
                            <div key={serName} className="flex items-center justify-between py-2 px-2 hover:bg-white/5 rounded-lg transition-colors">
                              <div className="min-w-0 pr-2">
                                <span className="font-sans font-semibold text-gray-200 text-xs block truncate">
                                  {serName}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {tObj?.hasQuantity && (
                                  <span className="text-[10px] font-bold text-gray-300 bg-white/10 border border-white/10 rounded px-1.5 py-0.5 font-mono select-none">
                                    Qty: {qty}
                                  </span>
                                )}

                                {priceStr && (
                                  <span className="font-mono text-xs text-amber-350 font-semibold min-w-[75px] text-right">
                                    {priceStr}
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
                      <span className="text-[#FFD151] font-bold">{clinic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Assigned City</span>
                      <span className="text-[#FFD151] font-bold">{destination === 'danang' ? '✈ Da Nang, VN' : '✈ Ho Chi Minh, VN'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-wider">Appointment Date</span>
                      <span className="text-white font-bold">{preferredDate}</span>
                    </div>
                    {confirmedHour && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase tracking-wider">Confirmed Hour</span>
                        <span className="text-[#FFD151] font-bold">
                          {confirmedHour} ({preferredSession === 'morning' ? 'Morning' : 'Afternoon'})
                        </span>
                      </div>
                    )}
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
              </div>

              {/* Action Buttons: Download controllers & reset */}
              <div className="space-y-3">
                
                {/* Download Pass Image Button */}
                <button
                  type="button"
                  onClick={downloadBookingPass}
                  disabled={isDownloading}
                  className={`w-full py-4 font-extrabold text-xs tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    isDownloading 
                      ? 'bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed animate-pulse' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin h-4.5 w-4.5 text-[#FFB800]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating Pass Image...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4.5 h-4.5 text-[#FFB800]" />
                      <span>Download Booking Pass Image (.PNG)</span>
                    </>
                  )}
                </button>

                {/* State resets with confirmation built with React states */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {bookingStatus === 'cancelled' ? (
                    <button
                      onClick={handleReset}
                      className="p-3.5 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-wider hover:bg-gray-50 text-gray-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4.5 h-4.5 text-[#FFB800]" />
                      <span>New Booking Form</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="p-3.5 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-wider hover:bg-[#FFF9F9] text-[#FF4D4D] hover:border-[#FFCCCC] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4.5 h-4.5" />
                      <span>Cancel Appointment</span>
                    </button>
                  )}

                  <Link
                    to="/"
                    className="p-3.5 rounded-xl bg-[#141618] text-white border border-[#141618] text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Back to Home</span>
                  </Link>
                </div>

                {/* Secure custom cancel modal overlay */}
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
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-serif text-xl font-bold text-gray-900">Cancel Appointment?</h3>
                          <p className="text-gray-500 text-xs leading-relaxed">
                            Your guaranteed priority slot and VIP coordinator support will be cancelled. This action is final.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Perform state changes
                              localStorage.setItem(`ucsmile_status_${bookingId}`, 'cancelled');
                              setBookingStatus('cancelled');
                              setShowCancelConfirm(false);
                            }}
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

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
