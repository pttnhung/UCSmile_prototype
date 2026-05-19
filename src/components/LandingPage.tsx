import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ShieldCheck, 
  DollarSign, 
  Headset, 
  Stethoscope,
  Star,
  Plus,
  Minus,
  X,
  Plane,
  Search
} from 'lucide-react';
import { blogData, BlogPost } from '../constants/blogData';
import BlogModal from './BlogModal';

// Types
interface PriceRange {
  min: number;
  max: number;
}

interface Treatment {
  id: string;
  name: string;
  prices: Record<string, PriceRange>;
  hasQuantity?: boolean;
  category: string;
  secondaryCategory?: string;
}

const TREATMENTS: Treatment[] = [
  { 
    id: 'cleaning', 
    name: 'Cleaning + Exam', 
    category: 'General',
    prices: {
      vn: { min: 10, max: 40 },
      th: { min: 90, max: 120 },
      au: { min: 270, max: 300 },
      sg: { min: 220, max: 250 },
      kr: { min: 120, max: 150 },
      jp: { min: 150, max: 180 },
      cn: { min: 145, max: 175 },
      ru: { min: 60, max: 90 },
      us: { min: 370, max: 400 },
    }
  },
  { 
    id: 'whitening', 
    name: 'Professional Whitening', 
    category: 'General',
    prices: {
      vn: { min: 60, max: 180 },
      th: { min: 480, max: 600 },
      au: { min: 880, max: 1000 },
      sg: { min: 1080, max: 1200 },
      kr: { min: 580, max: 700 },
      jp: { min: 780, max: 900 },
      cn: { min: 365, max: 485 },
      ru: { min: 380, max: 500 },
      us: { min: 1080, max: 1200 },
    }
  },
  { 
    id: 'filling', 
    name: 'Composite Filling', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 10, max: 60 },
      th: { min: 130, max: 180 },
      au: { min: 400, max: 450 },
      sg: { min: 300, max: 350 },
      kr: { min: 170, max: 220 },
      jp: { min: 250, max: 300 },
      cn: { min: 95, max: 145 },
      ru: { min: 130, max: 180 },
      us: { min: 650, max: 700 },
    }
  },
  { 
    id: 'extraction', 
    name: 'Simple Extraction', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 12, max: 98 },
      th: { min: 94, max: 180 },
      au: { min: 264, max: 350 },
      sg: { min: 214, max: 300 },
      kr: { min: 94, max: 180 },
      jp: { min: 134, max: 220 },
      cn: { min: 132, max: 218 },
      ru: { min: 34, max: 120 },
      us: { min: 414, max: 500 },
    }
  },
  { 
    id: 'surgical-extraction', 
    name: 'Surgical Extraction', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 40, max: 200 },
      th: { min: 290, max: 450 },
      au: { min: 640, max: 800 },
      sg: { min: 740, max: 900 },
      kr: { min: 340, max: 500 },
      jp: { min: 490, max: 650 },
      cn: { min: 345, max: 505 },
      ru: { min: 190, max: 350 },
      us: { min: 1040, max: 1200 },
    }
  },
  { 
    id: 'root-canal', 
    name: 'Root Canal + Crown', 
    category: 'Restorative',
    prices: {
      vn: { min: 80, max: 925 },
      th: { min: 955, max: 1800 },
      au: { min: 3155, max: 4000 },
      sg: { min: 2655, max: 3500 },
      kr: { min: 1355, max: 2200 },
      jp: { min: 1955, max: 2800 },
      cn: { min: 1378, max: 2223 },
      ru: { min: 655, max: 1500 },
      us: { min: 4155, max: 5000 },
    }
  },
  { 
    id: 'porcelain-crown', 
    name: 'Porcelain Crown (Zirconia)', 
    hasQuantity: true, 
    category: 'Restorative',
    prices: {
      vn: { min: 157, max: 394 },
      th: { min: 663, max: 900 },
      au: { min: 1963, max: 2200 },
      sg: { min: 1763, max: 2000 },
      kr: { min: 763, max: 1000 },
      jp: { min: 1263, max: 1500 },
      cn: { min: 682, max: 919 },
      ru: { min: 563, max: 800 },
      us: { min: 2763, max: 3000 },
    }
  },
  { 
    id: 'veneer', 
    name: 'Premium Veneers (per tooth)', 
    hasQuantity: true, 
    category: 'Cosmetic',
    prices: {
      vn: { min: 394, max: 551 },
      th: { min: 1043, max: 1200 },
      au: { min: 2343, max: 2500 },
      sg: { min: 2043, max: 2200 },
      kr: { min: 1043, max: 1200 },
      jp: { min: 1343, max: 1500 },
      cn: { min: 722, max: 879 },
      ru: { min: 643, max: 800 },
      us: { min: 2843, max: 3000 },
    }
  },
  { 
    id: 'implant', 
    name: 'Implant', 
    hasQuantity: true, 
    category: 'Implants',
    secondaryCategory: 'General',
    prices: {
      vn: { min: 670, max: 2285 },
      th: { min: 2385, max: 4000 },
      au: { min: 5385, max: 7000 },
      sg: { min: 4885, max: 6500 },
      kr: { min: 1885, max: 3500 },
      jp: { min: 3885, max: 5500 },
      cn: { min: 2043, max: 3658 },
      ru: { min: 1385, max: 3000 },
      us: { min: 6385, max: 8000 },
    }
  },
  { 
    id: 'all-on-4', 
    name: 'All-on-4 Full Arch', 
    category: 'Implants',
    prices: {
      vn: { min: 4724, max: 7874 },
      th: { min: 14850, max: 18000 },
      au: { min: 36850, max: 40000 },
      sg: { min: 34850, max: 38000 },
      kr: { min: 14850, max: 18000 },
      jp: { min: 31850, max: 35000 },
      cn: { min: 11425, max: 14575 },
      ru: { min: 14850, max: 18000 },
      us: { min: 41850, max: 45000 },
    }
  },
  { 
    id: 'invisalign', 
    name: 'Invisalign (Full Package)', 
    category: 'Orthodontics',
    prices: {
      vn: { min: 4724, max: 5905 },
      th: { min: 5819, max: 7000 },
      au: { min: 7819, max: 9000 },
      sg: { min: 8819, max: 10000 },
      kr: { min: 5319, max: 6500 },
      jp: { min: 7319, max: 8500 },
      cn: { min: 5910, max: 7091 },
      ru: { min: 4819, max: 6000 },
      us: { min: 7819, max: 9000 },
    }
  },
  { 
    id: 'braces', 
    name: 'Braces / Orthodontics', 
    category: 'Orthodontics',
    prices: {
      vn: { min: 984, max: 2755 },
      th: { min: 2729, max: 4500 },
      au: { min: 6229, max: 8000 },
      sg: { min: 6229, max: 8000 },
      kr: { min: 3229, max: 5000 },
      jp: { min: 5229, max: 7000 },
      cn: { min: 3315, max: 5086 },
      ru: { min: 2229, max: 4000 },
      us: { min: 6229, max: 8000 },
    }
  },
  { 
    id: 'smile-makeover', 
    name: 'Full Smile Makeover', 
    category: 'Cosmetic',
    prices: {
      vn: { min: 3780, max: 11020 },
      th: { min: 17760, max: 25000 },
      au: { min: 52760, max: 60000 },
      sg: { min: 47760, max: 55000 },
      kr: { min: 17760, max: 25000 },
      jp: { min: 37760, max: 45000 },
      cn: { min: 17380, max: 24620 },
      ru: { min: 10760, max: 18000 },
      us: { min: 62760, max: 70000 },
    }
  },
  { 
    id: 'sinus-lift', 
    name: 'Sinus Lift (Support)', 
    category: 'Implants',
    prices: {
      vn: { min: 197, max: 590 },
      th: { min: 807, max: 1200 },
      au: { min: 2607, max: 3000 },
      sg: { min: 2107, max: 2500 },
      kr: { min: 1107, max: 1500 },
      jp: { min: 1407, max: 1800 },
      cn: { min: 1204, max: 1597 },
      ru: { min: 507, max: 900 },
      us: { min: 3607, max: 4000 },
    }
  },
];

const CATEGORIES = ['General', 'Restorative', 'Implants', 'Orthodontics', 'Cosmetic'];

const ORIGINS = {
  au: { label: 'Australia', short: 'AUS' },
  us: { label: 'USA', short: 'USA' },
  th: { label: 'Thailand', short: 'THA' },
  sg: { label: 'Singapore', short: 'SGP' },
  kr: { label: 'South Korea', short: 'KOR' },
  jp: { label: 'Japan', short: 'JPN' },
  cn: { label: 'China', short: 'CHN' },
  ru: { label: 'Russia', short: 'RUS' },
};

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
        : 'bg-white border-gray-100 hover:border-gray-200 text-brand-text'
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
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(['cleaning', 'whitening']);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pricingFrom, setPricingFrom] = useState<keyof typeof ORIGINS>('au');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [travelCity, setTravelCity] = useState<'danang' | 'hcm'>('danang');
  const [isComparisonVisible, setIsComparisonVisible] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);

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
      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 text-center max-w-6xl mx-auto bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-5xl md:text-[84px] leading-[0.98] mb-8 tracking-tighter text-brand-text">
            Expert Dental Care. <br className="hidden md:block" />
            Designed for <span className="text-brand-text border-b-4 border-brand-primary/20">Travel.</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed">
            Premium care in Da Nang. We connect international patients with JCI-standard clinics and local concierge support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#book-now" className="btn-luxury px-10 py-5">
              Send Your Request
            </a>
            <a href="#book-now" className="bg-white/95 backdrop-blur border border-gray-200 px-10 py-5 rounded-2xl font-bold text-lg text-brand-text hover:bg-gray-100 transition-all flex items-center gap-2 uppercase tracking-[0.1em]">
              Chat Now
            </a>
          </div>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section id="price-comparison" className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-gray-100">
          {/* Selector Pane */}
          <div className="p-6 md:p-10 lg:w-3/5 bg-gray-50/30">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">PRICE COMPARISON</p>
            <h2 className="font-serif text-2xl md:text-4xl font-black mb-6 leading-tight text-brand-text">Compare treatments at a glance.</h2>
            
            <div className="space-y-4 bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 shadow-sm">
                <label className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-1.5 block">FROM</label>
                <div className="relative">
                  <select 
                    value={pricingFrom}
                    onChange={(e) => setPricingFrom(e.target.value as keyof typeof ORIGINS)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-semibold text-brand-text"
                  >
                    {Object.entries(ORIGINS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500 block mb-0.5">TREATMENTS</label>
                      <span className="text-[9px] font-bold text-gray-400">{selectedTreatments.length} SELECTED</span>
                    </div>
                  </div>
                  {/* Category Selection - Grid for clarity on mobile */}
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => {
                      const count = selectedTreatments.filter(id => {
                        const t = TREATMENTS.find(item => item.id === id);
                        return t?.category === cat || t?.secondaryCategory === cat;
                      }).length;

                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-[0.05em] transition-all duration-300 text-center flex items-center justify-center gap-2 ${
                            activeCategory === cat 
                            ? 'bg-brand-text text-white border-2 border-brand-text shadow-md transform scale-[1.01]' 
                            : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                          }`}
                        >
                          <span>{cat}</span>
                          {count > 0 && (
                            <span className="w-4 h-4 rounded-full bg-brand-primary text-brand-text flex items-center justify-center text-[8px] font-bold">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search dental treatments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border-2 border-gray-50 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-brand-text focus:outline-none focus:border-brand-primary/30 transition-all shadow-sm placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-full">
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
                    <div className="col-span-full py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                      No matches found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Pane */}
          <div ref={comparisonRef} id="comparison-details" className="p-6 md:p-8 lg:w-[42%] md:border-l border-gray-100 bg-white text-left">
            <div className="lg:mt-32 h-full rounded-[1.5rem] bg-gray-50/20 p-5 sm:p-6 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.01)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">ESTIMATED COMPARISON</span>
                <span className="text-[10px] bg-gray-100 px-2.5 py-0.5 rounded-full uppercase font-black text-gray-500">APPROXIMATE</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-12 text-[9px] sm:text-[10px] font-black text-gray-400 pb-2 border-b border-gray-100 uppercase tracking-widest gap-2">
                  <div className="col-span-3 text-left">TREATMENT</div>
                  <div className="col-span-9 grid grid-cols-2 gap-2 text-right">
                    <div className="truncate">~{ORIGINS[pricingFrom].short}</div>
                    <div>~VIETNAM</div>
                  </div>
                </div>
                
                {selectedTreatments.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Pick your services to compare</p>
                ) : (
                  <div className="space-y-0">
                    {selectedTreatments.map(id => {
                      const t = TREATMENTS.find(item => item.id === id);
                      if (!t) return null;
                      return (
                        <div key={id} className="grid grid-cols-12 items-center gap-2 group py-3 border-b border-gray-50 last:border-0 relative">
                          <div className="col-span-3 flex items-start gap-1.5 min-w-0 text-left">
                            <button 
                              onClick={() => toggleTreatment(id)}
                              className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-md bg-gray-100 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                              title="Remove"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                            <div className="min-w-0 pr-0.5">
                                <div className="text-[11px] sm:text-[13px] font-bold text-gray-900 leading-tight">
                                  {t.name}
                                </div>
                                {(quantities[id] > 1) && <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 text-left">Qty: {quantities[id]}</p>}
                            </div>
                          </div>
                          <div className="col-span-9 grid grid-cols-2 gap-2 text-right">
                            <span className="text-[10px] sm:text-[12px] md:text-[13px] font-bold text-gray-400 leading-tight block whitespace-nowrap">
                              ${Math.round((t.prices[originKey]?.min || 0) * (quantities[id] || 1)).toLocaleString()} - ${Math.round((t.prices[originKey]?.max || 0) * (quantities[id] || 1)).toLocaleString()}
                            </span>
                            <span className="text-[10px] sm:text-[12px] md:text-[13px] font-black text-brand-text tracking-tight block whitespace-nowrap">
                              ${Math.round((t.prices.vn.min || 0) * (quantities[id] || 1)).toLocaleString()} - ${Math.round((t.prices.vn.max || 0) * (quantities[id] || 1)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-2 relative z-10">ESTIMATED SAVINGS</span>
                <div className="flex items-end gap-2 mb-4 relative z-10">
                  <span className="text-4xl font-black tracking-tight text-brand-secondary">~${Math.round(totalSavings).toLocaleString()}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">USD</span>
                </div>
                {totalSavings > 0 && (
                  <div className="relative z-10 mb-6 group">
                    <div className="absolute -inset-2 bg-brand-primary/10 rounded-2xl blur-lg transition-all group-hover:bg-brand-primary/20" />
                    <div className="relative bg-white/60 backdrop-blur-sm border border-brand-primary/20 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                          <Plane className="w-4 h-4 text-brand-text" />
                        </div>
                        <p className="text-[12px] text-brand-text font-bold leading-snug italic">
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
                  </div>
                )}
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-tight border-t border-gray-50 pt-3 italic">
                  * Market average estimates. Final costs vary by materials and clinical complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group text-left"
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
            <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden group border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-primary/20 transition-all cursor-pointer">
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

      {/* Footer Form */}
      <section id="book-now" className="py-32 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.08)] border border-gray-100 flex flex-col md:flex-row">
          <div className="bg-brand-section p-10 md:p-14 text-white md:w-[35%]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-4">BOOKING SUPPORT</p>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Dental Advice. Booking Support.</h2>
            <div className="space-y-6 text-sm text-white/70 font-medium">
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-white/20 flex-shrink-0"></span>
                <p>Tell us what treatment you need.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-white/20 flex-shrink-0"></span>
                <p>We’ll suggest suitable clinics and next steps.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-white/20 flex-shrink-0"></span>
                <p>We’ll help you book a time that works.</p>
              </div>
            </div>

          </div>

          <div className="p-10 md:p-14 bg-brand-bg flex-grow">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2 text-left">FULL NAME</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2 text-left">NATIONALITY</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                </div>
              </div>
              <div className="text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2">TREATMENT NEEDED</label>
                <select className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm appearance-none">
                  <option>Choose your treatment</option>
                  {TREATMENTS.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2">PREFERRED DATE</label>
                  <input type="text" placeholder="Flexible or exact date" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2">WHATSAPP / EMAIL</label>
                  <input type="text" placeholder="How we should contact you" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm" />
                </div>
              </div>
              <div className="pb-4 text-left">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 ml-2">FURTHER DETAILS (OPTIONAL)</label>
                <textarea rows={3} placeholder="Any specific requirements or questions?" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm resize-none"></textarea>
              </div>
              <button className="btn-luxury w-full py-5 !shadow-brand-primary/10">
                SUBMIT TO CONCIERGE
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Blog Detail Modal */}
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
