import React, { useState, useEffect, useRef } from 'react';
import { encodeBooking } from './codec';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  DollarSign, 
  Headset, 
  Stethoscope,
  Star,
  Plus,
  PlusCircle,
  Minus,
  X,
  Trash2,
  Plane,
  Search,
  User,
  Calendar,
  Clock,
  FileText,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  Globe2,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { blogData, BlogPost } from '../constants/blogData';
import BlogModal from './BlogModal';
import { 
  TREATMENTS, 
  CATEGORIES, 
  ORIGINS, 
  NATIONALITIES_LIST,
  Treatment, 
  PriceRange 
} from '../constants/treatmentData';

export type { Treatment, PriceRange };
export { TREATMENTS };

// 4 Hero Carousel Slides (Nomad working on beach vacation, Senior couple walking with luggage/traveling, Clinic Arrival, Dental Suite)
const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    alt: "Person working on laptop while traveling and on vacation",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1777904257177-f520bc1b10c3?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Travel holiday vacation with luggage",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
    alt: "Modern clinic reception welcoming international patients",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&q=80",
    alt: "Modern dental treatment room with advanced equipment",
  }
];

interface TreatmentCardProps {
  key?: string;
  t: Treatment;
  selected: boolean;
  onToggle: () => void;
  quantity: number;
  onUpdateQuantity: (val: number) => void;
}

function TreatmentCard({ 
  t, 
  selected, 
  onToggle, 
  quantity, 
  onUpdateQuantity 
}: TreatmentCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer group relative ${
        selected 
        ? 'border-brand-primary bg-brand-primary/5 shadow-sm' 
        : 'bg-[#FAF9F6] border-gray-200/80 hover:border-gray-300 text-brand-text'
      }`}
    >
      <div className="flex flex-col flex-grow pr-2">
        <div className={`text-[12px] sm:text-[13px] font-bold leading-tight uppercase tracking-tight transition-colors ${selected ? 'text-brand-text' : 'text-gray-800'}`}>
          {t.name}
        </div>
        
        {t.hasQuantity && selected && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-3 mt-2 bg-white rounded-full px-2 py-0.5 self-start border border-brand-primary/30 shadow-sm"
          >
            <button onClick={() => onUpdateQuantity(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <span className="text-[11px] font-black min-w-[0.8rem] text-center text-brand-text">{quantity}</span>
            <button onClick={() => onUpdateQuantity(1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
        selected 
        ? 'bg-brand-text text-white' 
        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
      }`}>
        {selected ? (
          <X className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pricingFrom, setPricingFrom] = useState<keyof typeof ORIGINS>('au');
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [travelCity, setTravelCity] = useState<'danang' | 'hcm'>('danang');
  const [isComparisonVisible, setIsComparisonVisible] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    if (isComparisonModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isComparisonModalOpen]);
  // Hero interactive auto-carousel state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Auto slide timer (every 4.5 seconds)
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHeroPaused, currentHeroSlide]);

  const handleNextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // States for 2-step wizard booking form
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [confirmedHour, setConfirmedHour] = useState('');
  const [preferredCity, setPreferredCity] = useState('Da Nang');
  const [clinic, setClinic] = useState('Any Vetted Partner Clinic');
  const [preferredSession, setPreferredSession] = useState<'morning' | 'afternoon'>('morning');
  const [treatment, setTreatment] = useState('Choose your treatment');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [formError, setFormError] = useState('');

  // Calculate estimated price range string for selected treatment
  const getEstimatedPriceText = () => {
    if (treatment === 'Choose your treatment' || !treatment) return '$0';
    const found = TREATMENTS.find(t => t.name === treatment || t.id === treatment);
    if (found && found.prices && found.prices.vn) {
      if (found.prices.vn.min === found.prices.vn.max) {
        return `$${found.prices.vn.min}`;
      }
      return `$${found.prices.vn.min} - $${found.prices.vn.max}`;
    }
    return '$0';
  };

  // Handle routing state-based smooth scrolling and data passing on initial mount or path change
  useEffect(() => {
    if (location.state) {
      const st = location.state as any;
      if (st.selectedTreatments) {
        setSelectedTreatments(st.selectedTreatments);
      }
      if (st.pricingFrom) {
        setPricingFrom(st.pricingFrom);
      }
      if (st.quantities) {
        setQuantities(st.quantities);
      }
      if (st.scrollTo) {
        const element = document.getElementById(st.scrollTo);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [location.state]);

  const handleFooterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');

    // If currently in step 1 and user clicks Submit Booking Request
    if (currentStep === 1) {
      if (!fullName.trim() || !whatsappPhone.trim()) {
        setFormError('Please enter your Full Name and WhatsApp / Phone number.');
        return;
      }
      // Advance to step 2 if step 2 fields are not complete yet
      setCurrentStep(2);
      return;
    }

    // Step 2 submissions validation
    if (!fullName.trim() || !whatsappPhone.trim()) {
      setFormError('Please fill in your Full Name and WhatsApp / Phone number.');
      setCurrentStep(1);
      return;
    }
    if (!preferredDate.trim()) {
      setFormError('Please select your Preferred Date.');
      return;
    }
    if (treatment === 'Choose your treatment' || !treatment.trim()) {
      setFormError('Please choose a Treatment Package.');
      return;
    }

    // Generate custom booking session data
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChars = alphabet[Math.floor(Math.random() * 26)] + alphabet[Math.floor(Math.random() * 26)];
    const uniqueId = `UCS-${randomNum}-${randomChars}`;

    // Construct elegant verification link
    const token = encodeBooking({
      id: uniqueId,
      name: fullName,
      service: treatment,
      clinic: clinic || 'Any Vetted Partner Clinic',
      date: preferredDate,
      session: preferredSession || 'morning',
      phone: whatsappPhone,
      nationality: nationality || 'N/A',
      destination: preferredCity === 'Ho Chi Minh' ? 'hcm' : 'danang',
      notes: additionalDetails || '',
      email: email || ''
    });
    const qrData = `${window.location.origin}${window.location.pathname || ''}#/verify?p=${token}`;
    const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    const bookingSessionData = {
      fullName,
      whatsappPhone,
      email: email || '',
      nationality: nationality || 'N/A',
      treatment,
      destination: preferredCity === 'Ho Chi Minh' ? 'hcm' : 'danang',
      clinic: clinic || 'Any Vetted Partner Clinic',
      preferredDate,
      preferredSession: preferredSession || 'morning',
      confirmedHour: confirmedHour || '09:00 AM',
      additionalDetails,
      bookingId: uniqueId,
      qrCodeUrl: generatedUrl,
    };

    localStorage.setItem('ucsmile_saved_booking', JSON.stringify(bookingSessionData));
    navigate('/booking');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsComparisonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (comparisonRef.current) {
      observer.observe(comparisonRef.current);
    }

    return () => observer.disconnect();
  }, [selectedTreatments]);

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const TRAVEL_DATA = {
    danang: [
      { 
        name: "My Khe Beach", 
        desc: "Golden sands & crystal waters.",
        tag: "BEACHES",
        img: "https://images.unsplash.com/photo-1559592413-7cea83781fab?auto=format&fit=crop&w=800&q=80" 
      },
      { 
        name: "Ba Na Hills", 
        desc: "European flair in the clouds.",
        tag: "ADVENTURE",
        img: "https://images.unsplash.com/photo-1580983231364-7546ccf76d49?auto=format&fit=crop&w=800&q=80" 
      },
      { 
        name: "Dragon Bridge", 
        desc: "The heartbeat of the city.",
        tag: "CITY LIFE",
        img: "https://images.unsplash.com/photo-1555940280-66bf87aa823d?auto=format&fit=crop&w=800&q=80" 
      },
      { 
        name: "Hoi An Town", 
        desc: "Ancient colors & lanterns.",
        tag: "CULTURE",
        img: "https://images.unsplash.com/photo-1555930606-b6d13bd6e3a5?auto=format&fit=crop&w=800&q=80" 
      }
    ],
    hcm: [
      { 
        name: "Ben Thanh Market", 
        desc: "Iconic market with local flavors.",
        tag: "CULTURE",
        img: "https://i.pinimg.com/736x/e7/0b/b3/e70bb3498307183e82385c13ce987d1f.jpg" 
      },
      { 
        name: "Nguyen Hue Street", 
        desc: "Vibrant pedestrian heart of the city.",
        tag: "CITY LIFE",
        img: "https://i.pinimg.com/1200x/df/a1/fe/dfa1fe84afd4ac5fc6922cae1d12ae61.jpg" 
      },
      { 
        name: "Landmark 81", 
        desc: "Modern skyline with panoramic views.",
        tag: "LUXURY",
        img: "https://i.pinimg.com/736x/1a/20/7c/1a207c5cda790f9bb0be0972963a7f2a.jpg" 
      },
      { 
        name: "Saigon Opera House", 
        desc: "French colonial architecture & art.",
        tag: "ART",
        img: "https://i.pinimg.com/1200x/d4/83/8f/d4838f5d61d6087e8087d539178908f9.jpg" 
      }
    ]
  };

  const filteredTreatments = TREATMENTS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery.trim() !== "") return matchesSearch;
    return (activeCategory === 'All' || t.category === activeCategory || t.secondaryCategory === activeCategory) && matchesSearch;
  });

  const originKey = pricingFrom;

  const totalOrigin = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(t => t.id === id);
    const qty = quantities[id] || 1;
    const price = t?.prices[originKey]?.min || 0;
    return acc + (price * qty);
  }, 0);

  const totalVietnam = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(t => t.id === id);
    const qty = quantities[id] || 1;
    const price = t?.prices.vn.min || 0;
    return acc + (price * qty);
  }, 0);

  const totalSavings = totalOrigin - totalVietnam;

  const toggleTreatment = (id: string) => {
    setSelectedTreatments(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        const next = prev.filter(t => t !== id);
        const nextQuantities = { ...quantities };
        delete nextQuantities[id];
        setQuantities(nextQuantities);
        return next;
      } else {
        return [...prev, id];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const openDestinationBlog = (name: string) => {
    const post = blogData.find(p => p.title.toLowerCase().includes(name.toLowerCase()));
    if (post) setSelectedPost(post);
  };

  return (
    <>
      {/* Hero Section - Matching exact reference design with seamless background image & text */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 max-w-7xl mx-auto">
        <div 
          className="relative rounded-3xl overflow-hidden border border-gray-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] bg-slate-900 min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-center"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          {/* Background Carousel Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={HERO_SLIDES[currentHeroSlide].id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={HERO_SLIDES[currentHeroSlide].image} 
                alt={HERO_SLIDES[currentHeroSlide].alt}
                className="w-full h-full object-cover object-top sm:object-center md:object-right"
              />
              {/* Desktop left gradient (wider, smoother transition) + Mobile bottom-to-top white gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent sm:hidden" />
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% via-white/80 via-60% to-transparent sm:w-[75%] md:w-[70%] lg:w-[62%]" />
            </motion.div>
          </AnimatePresence>

          {/* Left Text Content Floating on Top */}
          <div className="relative z-10 p-5 sm:p-10 md:p-14 max-w-xl text-left flex flex-col justify-end sm:justify-between h-full min-h-[520px] sm:min-h-auto pt-36 sm:pt-10">
            
            {/* Text Content (Anchored towards bottom on mobile so top photo is visible) */}
            <div className="mt-auto sm:mt-0">
              {/* Main Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-gray-950 leading-[1.15] mb-2 sm:mb-4">
                Expert Dental Care. <br />
                <span className="text-amber-600">Designed for Travel.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-gray-700 sm:text-gray-800 text-xs sm:text-base font-medium leading-relaxed mb-3 sm:mb-7 max-w-md">
                Our vetted dental clinics offer premium care in Vietnam. We connect international travelers with accredited specialists, transparent pricing, and dedicated concierge support.
              </p>
            </div>

            {/* Desktop Action Button */}
            <div className="hidden sm:block">
              <a 
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#F5A623] hover:brightness-105 active:scale-95 text-gray-950 font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_10px_25px_rgba(245,166,35,0.35)] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Bottom Bar: Book Now on Left, Carousel Dots on Right */}
            <div className="sm:hidden flex items-center justify-between gap-3 pt-3 border-t border-gray-200/60 mt-1">
              <a 
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#F5A623] hover:brightness-105 active:scale-95 text-gray-950 font-black px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-wider transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Slide Dots */}
              <div className="bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1.5 border border-white/20 flex items-center gap-1 shadow-sm">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentHeroSlide 
                        ? 'w-4 bg-[#F5A623]' 
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Prev & Next Arrows (Clean center alignment with good contrast) */}
          <button 
            onClick={handlePrevHeroSlide}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-95 cursor-pointer border border-gray-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>

          <button 
            onClick={handleNextHeroSlide}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-95 cursor-pointer border border-gray-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>

          {/* Desktop-only Bottom Right Slide Indicators */}
          <div className="hidden sm:flex absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 items-center gap-1.5 shadow-lg">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentHeroSlide 
                    ? 'w-5 bg-[#F5A623]' 
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Calculator Section */}
      <section id="price-comparison" className="pb-16 sm:pb-24 px-3 sm:px-4 max-w-7xl mx-auto">
        <div className="bg-[#FAF9F6] rounded-3xl sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-200/80">
          
          {/* Left Pane: Simple Clean Trigger Pane */}
          <div className="p-5 sm:p-8 lg:p-10 lg:w-1/2 bg-gray-50/40 text-left flex flex-col justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">PRICE COMPARISON</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black mb-2.5 leading-tight text-brand-text">Compare treatments at a glance.</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-5 leading-relaxed max-w-md">
                Choose your country and treatments to view instant price comparisons and estimated savings.
              </p>
            </div>

            {/* Launch Popup Button */}
            <div className="mt-2">
              <button 
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-gray-950 font-black py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{selectedTreatments.length > 0 ? 'Edit Comparison / Add Treatments' : "Let's Start Comparing"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Breakdown Pane: Right Side */}
          <div ref={comparisonRef} id="comparison-details" className="p-4 sm:p-6 lg:p-8 lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200/60 bg-[#FAF9F6] text-left flex flex-col justify-between">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">ESTIMATED COMPARISON</span>
                <span className="text-[9px] bg-gray-200/70 px-2 py-0.5 rounded-full uppercase font-black text-gray-600">APPROXIMATE</span>
              </div>

              {/* Itemized Breakdown Content (only shown when treatments are selected) */}
              {selectedTreatments.length > 0 && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                    className="w-full flex items-center justify-between text-[11px] sm:text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 px-3.5 py-2 sm:py-2.5 rounded-xl transition-all border border-gray-200/70 shadow-2xs cursor-pointer"
                  >
                    <span>{isBreakdownOpen ? 'Hide Itemized Details' : 'Show Itemized Details'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBreakdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isBreakdownOpen && (
                    <div className="bg-white rounded-xl p-3 border border-gray-200/70 shadow-2xs space-y-2 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-12 text-[8px] sm:text-[9px] font-black text-gray-400 pb-1.5 border-b border-gray-100 uppercase tracking-wider gap-1">
                        <div className="col-span-5 text-left">TREATMENT</div>
                        <div className="col-span-7 grid grid-cols-2 gap-1 text-right">
                          <div className="truncate">~{ORIGINS[pricingFrom].short}</div>
                          <div>~VIETNAM</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        {selectedTreatments.map(id => {
                          const t = TREATMENTS.find(item => item.id === id);
                          if (!t) return null;
                          return (
                            <div key={id} className="grid grid-cols-12 items-center gap-1 py-1 border-b border-gray-50 last:border-0">
                              <div className="col-span-5 flex items-start gap-1 min-w-0 text-left">
                                <button 
                                  onClick={() => toggleTreatment(id)}
                                  className="text-gray-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="min-w-0">
                                  <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-snug truncate">
                                    {t.name}
                                  </div>
                                  {(quantities[id] > 1) && <p className="text-[8px] text-gray-400 font-bold uppercase">Qty: {quantities[id]}</p>}
                                </div>
                              </div>
                              <div className="col-span-7 grid grid-cols-2 gap-1 text-right">
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 whitespace-nowrap">
                                  ${Math.round((t.prices[pricingFrom]?.min || 0) * (quantities[id] || 1)).toLocaleString()} - ${Math.round((t.prices[pricingFrom]?.max || 0) * (quantities[id] || 1)).toLocaleString()}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-black text-brand-text whitespace-nowrap">
                                  ${Math.round((t.prices.vn.min || 0) * (quantities[id] || 1)).toLocaleString()} - ${Math.round((t.prices.vn.max || 0) * (quantities[id] || 1)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Prominent Estimated Savings Box */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-full -mr-10 -mt-10 pointer-events-none" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1 relative z-10">ESTIMATED SAVINGS</span>
                {selectedTreatments.length === 0 ? (
                  <p className="text-xs font-medium text-gray-500 py-1.5 relative z-10 leading-relaxed">
                    Click "Let's Start Comparing" on the left to calculate your savings.
                  </p>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5 mb-2.5 relative z-10">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-brand-secondary">~${Math.round(totalSavings).toLocaleString()}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">USD</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="relative z-10 mb-3 bg-amber-50/70 border border-amber-200/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Plane className="w-3 h-3 text-brand-text" />
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium leading-tight italic">
                            {totalSavings < 100 && "Enough for an ocean-view stay or a luxury spa experience in Vietnam."}
                            {totalSavings >= 100 && totalSavings < 300 && "Enough for 1–2 days of spa treatments, fine dining, and premium local experiences in Vietnam."}
                            {totalSavings >= 300 && totalSavings < 800 && "Enough for a 2–4 night beachfront resort escape in Da Nang or Nha Trang."}
                            {totalSavings >= 800 && totalSavings < 1500 && "Enough for a 4–7 day Vietnam getaway with flights and luxury hotel stays included."}
                            {totalSavings >= 1500 && totalSavings < 3000 && "Enough to cover most of a 1–2 week Vietnam vacation with beachfront resorts and unforgettable experiences."}
                            {totalSavings >= 3000 && totalSavings < 5000 && "Enough for a 2–3 week luxury journey across Vietnam with premium resorts and private tours."}
                            {totalSavings >= 5000 && totalSavings < 10000 && "Enough for a 3–4 week luxury Southeast Asia holiday across multiple destinations."}
                            {totalSavings >= 10000 && "Enough for a once-in-a-lifetime luxury Asia travel experience."}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight border-t border-gray-100 pt-2 italic">
                  * Estimated prices only. Exact quote provided after dentist consultation.
                </p>

                {/* Book Consultation Button - Only shown when treatments are selected */}
                {selectedTreatments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('booking');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-gray-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-xs border border-amber-400/80 transition-all active:scale-[0.98] cursor-pointer mt-3 flex items-center justify-center gap-2"
                  >
                    <span>Book Your Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Modal (3 Dropdown / Selection Workflow: FROM -> CATEGORY -> TREATMENTS) */}
      <AnimatePresence>
        {isComparisonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComparisonModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[88vh] flex flex-col text-left"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">PRICE COMPARISON</p>
                  <h3 className="font-serif text-lg font-black text-brand-text">Compare treatments at a glance.</h3>
                </div>
                <button 
                  onClick={() => setIsComparisonModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Compact 2-column Dropdowns + Treatment Picker */}
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                
                {/* 1. FROM & 2. CATEGORY (Side-by-side in grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. FROM Dropdown */}
                  <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-200/80">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      FROM (HOME COUNTRY)
                    </label>
                    <div className="relative">
                      <select 
                        value={pricingFrom}
                        onChange={(e) => setPricingFrom(e.target.value as keyof typeof ORIGINS)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs font-bold text-gray-900 shadow-2xs"
                      >
                        {Object.entries(ORIGINS).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. CATEGORY Dropdown */}
                  <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-200/80">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      CATEGORY
                    </label>
                    <div className="relative">
                      <select 
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs font-bold text-gray-900 shadow-2xs"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 3. TREATMENTS Selection */}
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 block">
                      TREATMENTS ({activeCategory})
                    </label>
                    <span className="text-[9px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {selectedTreatments.length} SELECTED
                    </span>
                  </div>

                  {/* Search inside popup */}
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder={`Search ${activeCategory} treatments...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-medium text-brand-text focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-2xs placeholder:text-gray-400"
                    />
                  </div>

                  {/* Treatment Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {filteredTreatments.length > 0 ? (
                      filteredTreatments.map(t => (
                        <TreatmentCard 
                          key={t.id} 
                          t={t} 
                          selected={selectedTreatments.includes(t.id)}
                          onToggle={() => toggleTreatment(t.id)}
                          quantity={quantities[t.id] || 1}
                          onUpdateQuantity={(val) => updateQuantity(t.id, val)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-5 text-center text-gray-400 text-xs font-bold bg-white rounded-lg border border-dashed border-gray-200">
                        No treatments found in {activeCategory}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer: Action Button */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Selected</span>
                  <span className="text-xs font-black text-gray-900">
                    {selectedTreatments.length} {selectedTreatments.length === 1 ? 'treatment' : 'treatments'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsComparisonModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsComparisonModalOpen(false);
                      const el = document.getElementById('price-comparison');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#F5A623] hover:brightness-105 text-gray-950 font-black px-6 py-2 rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Compare</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section id="why-us" className="py-32 px-4 max-w-7xl mx-auto text-center">
        <span className="text-gray-400 font-bold tracking-[0.2em] mb-4 block uppercase text-sm">THE PLATFORM ADVANTAGE</span>
        <h2 className="font-serif text-3xl md:text-5xl font-black mb-20 text-brand-text">Why smart travelers choose us.</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: ShieldCheck, 
              title: "Expert Vetting", 
              desc: "Our partner clinics are rigorously vetted for high medical standards and expertise.",
              color: "bg-brand-section text-brand-primary"
            },
            { 
              icon: DollarSign, 
              title: "Transparent Pricing", 
              desc: "No hidden fees. We provide clear, upfront costs so you can plan with confidence.",
              color: "bg-brand-section text-brand-primary"
            },
            { 
              icon: Headset, 
              title: "Concierge Support", 
              desc: "From airport pickup to translation, our team is with you every step of the way.",
              color: "bg-brand-section text-brand-primary"
            },
            { 
              icon: Stethoscope, 
              title: "Modern Facilities", 
              desc: "Experience world-class care in clinics equipped with the latest dental technology.",
              color: "bg-brand-section text-brand-primary"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8 }}
              className="bg-[#FAF9F6] p-10 rounded-[2.5rem] border border-gray-200/60 shadow-xs hover:shadow-xl transition-all group text-left"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 border border-white/10 transition-colors group-hover:bg-gray-900 group-hover:text-white`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-text">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Verified Partners */}
      <section id="clinics" className="py-32 px-4 max-w-7xl mx-auto">
        <div className="mb-16 border-l-4 border-gray-100 pl-6">
          <h2 className="text-3xl md:text-5xl font-black text-brand-text mb-2 uppercase tracking-tighter">Verified Partners</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Top Rated Clinics in Da Nang</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { 
              name: "East Meets West Dental", 
              address: "Da Nang", 
              specialty: "Implants & Crowns", 
              img: "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-1/560651685_799475406335450_1769819398433378863_n.jpg?stp=c68.12.1875.1875a_dst-jpg_s480x480_tt6&_nc_cat=110&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=jZJT5R0BJRYQ7kNvwHev9CM&_nc_oc=Adq0biRuLEJcn4YUMaKEsPGVFGvTHeq1iHl4DQ08x2xBa4OrchGbrT91CghqF6DgnuqaeJjvsCJf8zw26gBkMq6h&_nc_zt=24&_nc_ht=scontent.fdad3-6.fna&_nc_gid=ChosV_fkPMeYfmTBB1MzPg&_nc_ss=7b289&oh=00_Af7Vy_w3en3W_16Yp77WMtq21swHOY1HS6jobYWnRG3HiA&oe=6A07EF21"
            },
            { 
              name: "Serenity International", 
              address: "Da Nang", 
              specialty: "Smile Aesthetics", 
              img: "https://lh3.googleusercontent.com/p/AF1QipOYhj3gOtFlLBbfeQKOoXKa_95YDHaAH9SffXBN=s1360-w1360-h1020-rw"
            }
          ].map((partner, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                const element = document.getElementById('booking');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#FAF9F6] rounded-[2.5rem] overflow-hidden group border border-gray-200/60 shadow-xs hover:shadow-2xl hover:border-brand-primary/20 transition-all cursor-pointer"
            >
                <div className="h-64 bg-gray-100 relative overflow-hidden p-3">
                <img 
                  src={partner.img} 
                  alt={partner.name}
                  className="w-full h-full object-cover rounded-[2rem] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black border border-gray-100 uppercase tracking-widest italic">VETTED</div>
              </div>
              <div className="p-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 font-black">PARTNER CLINIC</p>
                <h3 className="font-bold text-brand-text text-2xl mb-5 group-hover:text-gray-900 transition-colors h-14 flex items-center leading-tight">{partner.name}</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-[12px] font-semibold text-gray-500 leading-tight">
                    <span className="mt-1 w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></span>
                    {partner.address}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-[13px] font-bold text-gray-600">{partner.specialty}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-6 text-gray-400 font-black text-[10px] uppercase tracking-widest group-hover:text-brand-text transition-colors">
                   <span>CONTACT CONCIERGE TO BOOK</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Da Nang */}
      <section id="travel" className="bg-brand-section py-24 px-4 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-gray-400 font-bold tracking-[0.2em] mb-4 block uppercase text-sm font-sans">TRAVEL & EXPERIENCE</span>
              <h2 className="font-serif text-4xl md:text-6xl font-black leading-tight text-white italic">Explore {travelCity === 'danang' ? 'Da Nang' : 'Ho Chi Minh'} while you heal.</h2>
              
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setTravelCity('danang')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    travelCity === 'danang' 
                    ? 'bg-brand-primary text-brand-text shadow-lg shadow-brand-primary/20' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  Da Nang
                </button>
                <button 
                  onClick={() => setTravelCity('hcm')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    travelCity === 'hcm' 
                    ? 'bg-brand-primary text-brand-text shadow-lg shadow-brand-primary/20' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  Ho Chi Minh
                </button>
              </div>
            </div>
            <p className="text-white/60 max-w-sm text-lg leading-relaxed font-medium">
              {travelCity === 'danang' 
                ? "Voted one of the most beautiful cities in the world. From white sands to ancient towns, your recovery is a vacation."
                : "The vibrant heartbeat of Vietnam. From historic markets to futuristic skyscrapers, experience the ultimate urban energy."
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAVEL_DATA[travelCity].map((loc, idx) => (
              <motion.div 
                key={`${travelCity}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl"
                onClick={() => openDestinationBlog(loc.name)}
              >
                <img 
                  src={loc.img} 
                  alt={loc.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white mb-2 block bg-white/20 w-fit px-2 py-1 rounded backdrop-blur-sm">
                    {loc.tag}
                  </span>
                  <h3 className="font-serif text-3xl font-black text-white mb-2 leading-tight">{loc.name}</h3>
                  <p className="text-white/70 text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {loc.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Floating Progress Summary */}
      <AnimatePresence>
        {selectedTreatments.length > 0 && !isComparisonVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-4 right-24 z-50 md:hidden"
          >
            <div 
              onClick={scrollToComparison}
              className="bg-brand-text text-white p-2.5 px-5 rounded-2xl shadow-2xl flex items-center border border-white/10 backdrop-blur-xl relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-full -mr-8 -mt-8" />
              
              <div className="relative z-10">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5">EST. SAVINGS</p>
                <p className="text-base font-black text-brand-primary tracking-tight leading-none">~${Math.round(totalSavings).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Form - 2-Step Wizard Design */}
      <section id="booking" className="py-16 md:py-28 px-3 sm:px-4 scroll-mt-24">
        <div className="max-w-xl md:max-w-2xl mx-auto bg-[#FAF9F6] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl border border-gray-200/80 p-3.5 sm:p-6 md:p-8">
          
          {/* Top Progress Indicator Header */}
          <div className="mb-3 text-left">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                STEP {currentStep} OF 2
              </span>
              <span className="text-[10px] font-bold text-gray-700">
                {currentStep === 1 ? 'Personal Details' : 'Appointment Info'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-400 transition-all duration-300 rounded-full"
                style={{ width: currentStep === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Step Switcher Tabs Bar */}
          <div className="bg-[#f0f3f6] p-1 rounded-xl flex gap-1 mb-4 sm:mb-5">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex-1 py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-900 border border-gray-300/80 shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-800 font-medium'
              }`}
            >
              Personal Details
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex-1 py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-gray-200 text-gray-900 border border-gray-300/80 shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-800 font-medium'
              }`}
            >
              Appointment Info
            </button>
          </div>

          <form onSubmit={handleFooterSubmit} className="space-y-3.5">
            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-3.5 text-left">
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-3.5 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                    <User className="w-4 h-4 text-gray-700" />
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Personal Details</h3>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5">
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2.5 text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 font-medium" 
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5">
                      WHATSAPP / PHONE <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={whatsappPhone}
                      onChange={e => setWhatsappPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2.5 text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 font-medium" 
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5">
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2.5 text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 font-medium" 
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5">
                      NATIONALITY <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={nationality}
                        onChange={e => setNationality(e.target.value)}
                        className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl pl-3 pr-8 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer font-medium ${
                          nationality ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {NATIONALITIES_LIST.map((nat, idx) => (
                          <option key={idx} value={idx === 0 ? '' : nat} disabled={idx === 0} className="text-gray-700">
                            {nat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Appointment Info & Treatment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden text-left">
                {/* Section 1: Appointment Info */}
                <div className="p-3.5 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                    <Calendar className="w-4 h-4 text-gray-700" />
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Appointment Info</h3>
                  </div>

                  {/* PREFERRED DATE & PREFERRED CITY on top row */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5 truncate">
                        PREFERRED DATE <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 cursor-pointer ${
                          preferredDate ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5 truncate">
                        PREFERRED CITY <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={preferredCity}
                          onChange={e => setPreferredCity(e.target.value)}
                          className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-6 ${
                            preferredCity ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          <option value="Da Nang" className="text-gray-700">Da Nang</option>
                          <option value="Ho Chi Minh" className="text-gray-700">Ho Chi Minh</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* PREFERRED CLINIC */}
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5 truncate">
                      PREFERRED CLINIC
                    </label>
                    <div className="relative">
                      <select
                        value={clinic}
                        onChange={e => setClinic(e.target.value)}
                        className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-6 truncate ${
                          clinic ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        <option value="Any Vetted Partner Clinic" className="text-gray-700">Any Vetted Partner Clinic</option>
                        <option value="East Meets West Dental (Da Nang)" className="text-gray-700">East Meets West Dental (Da Nang)</option>
                        <option value="Serenity International Dental (Da Nang)" className="text-gray-700">Serenity International Dental (Da Nang)</option>
                        <option value="Elite Dental Group (Ho Chi Minh)" className="text-gray-700">Elite Dental Group (Ho Chi Minh)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* PREFERRED SESSION */}
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5">
                      PREFERRED SESSION <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPreferredSession('morning')}
                        className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          preferredSession === 'morning'
                            ? 'bg-gray-200 text-gray-900 border border-gray-300 shadow-xs'
                            : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        MORNING
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredSession('afternoon')}
                        className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          preferredSession === 'afternoon'
                            ? 'bg-gray-200 text-gray-900 border border-gray-300 shadow-xs'
                            : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        AFTERNOON
                      </button>
                    </div>
                  </div>

                  {/* PREFERRED HOUR (moved below PREFERRED SESSION) */}
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-1 ml-0.5 truncate">
                      PREFERRED HOUR <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={confirmedHour}
                        onChange={e => setConfirmedHour(e.target.value)}
                        className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl pl-8 pr-6 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer ${
                          confirmedHour ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        <option value="" className="text-gray-400">Select Priority</option>
                        <option value="08:00 AM" className="text-gray-700">08:00 AM</option>
                        <option value="09:00 AM" className="text-gray-700">09:00 AM</option>
                        <option value="10:00 AM" className="text-gray-700">10:00 AM</option>
                        <option value="11:00 AM" className="text-gray-700">11:00 AM</option>
                        <option value="01:30 PM" className="text-gray-700">01:30 PM</option>
                        <option value="02:00 PM" className="text-gray-700">02:00 PM</option>
                        <option value="02:30 PM" className="text-gray-700">02:30 PM</option>
                        <option value="03:00 PM" className="text-gray-700">03:00 PM</option>
                        <option value="04:00 PM" className="text-gray-700">04:00 PM</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Select Treatment Packages */}
                <div className="p-3.5 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                    <FileText className="w-4 h-4 text-gray-700" />
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                      Select Treatment Packages <span className="text-red-500">*</span>
                    </h3>
                  </div>
                  <div className="relative">
                    <select
                      value={treatment}
                      onChange={e => setTreatment(e.target.value)}
                      className={`w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-8 ${
                        treatment && treatment !== 'Choose your treatment' ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      <option disabled value="Choose your treatment" className="text-gray-400">Choose your treatment</option>
                      {TREATMENTS.map(t => (
                        <option key={t.id} value={t.name} className="text-gray-700">{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Section 3: Additional Arrival Questions */}
                <div className="p-3.5 sm:p-5 space-y-2">
                  <h3 className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">
                    ADDITIONAL ARRIVAL QUESTIONS
                  </h3>
                  <textarea
                    rows={2.5}
                    maxLength={500}
                    value={additionalDetails}
                    onChange={e => setAdditionalDetails(e.target.value)}
                    placeholder="Any specific requirements or questions?"
                    className="w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl p-3 text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none font-medium"
                  />
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 font-mono">{additionalDetails.length}/500</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Section (Agreement, Price Summary, Submit Button) */}
            <div className="pt-2 space-y-2.5">
              <p className="text-center text-[10px] text-gray-500 italic">
                By completing booking, you agree to our Service Terms & Privacy Policy.
              </p>

              <div className="text-left pt-0.5">
                <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block mb-0.5">
                  ESTIMATED PRICE SUMMARY
                </span>
                <span className="text-2xl font-serif font-extrabold text-[#FFC107] block">
                  {getEstimatedPriceText()}
                </span>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 font-semibold text-[11px] text-center">
                  ⚠️ {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#FFC107] hover:bg-amber-400 text-gray-950 font-black text-[11px] sm:text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                SUBMIT BOOKING REQUEST
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Blog Detail Modal */}
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
