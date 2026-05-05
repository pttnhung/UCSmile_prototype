import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronDown, 
  ShieldCheck, 
  DollarSign, 
  Headset, 
  Stethoscope,
  Star,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { blogData, BlogPost } from '../constants/blogData';
import BlogModal from './BlogModal';

// Types
interface Treatment {
  id: string;
  name: string;
  vietnamPrice: number;
  hasQuantity?: boolean;
  category: string;
}

const TREATMENTS: Treatment[] = [
  { id: 'cleaning', name: 'Cleaning + Exam', vietnamPrice: 45, category: 'General' },
  { id: 'whitening', name: 'Professional Whitening', vietnamPrice: 150, category: 'General' },
  { id: 'filling', name: 'Composite Filling', vietnamPrice: 40, hasQuantity: true, category: 'General' },
  { id: 'extraction', name: 'Simple Extraction', vietnamPrice: 50, hasQuantity: true, category: 'General' },
  { id: 'surgical-extraction', name: 'Surgical Extraction', vietnamPrice: 120, hasQuantity: true, category: 'General' },
  { id: 'root-canal', name: 'Root Canal + Crown', vietnamPrice: 420, category: 'Restorative' },
  { id: 'porcelain-crown', name: 'Porcelain Crown (Zirconia)', vietnamPrice: 350, hasQuantity: true, category: 'Restorative' },
  { id: 'veneer', name: 'Premium Veneers (per tooth)', vietnamPrice: 280, hasQuantity: true, category: 'Cosmetic' },
  { id: 'implant', name: 'Single Implant (incl. Crown)', vietnamPrice: 780, hasQuantity: true, category: 'Implants' },
  { id: 'all-on-4', name: 'All-on-4 Full Arch', vietnamPrice: 7500, category: 'Implants' },
  { id: 'all-on-6', name: 'All-on-6 Full Arch', vietnamPrice: 9500, category: 'Implants' },
  { id: 'invisalign', name: 'Invisalign (Full Package)', vietnamPrice: 1800, category: 'Orthodontics' },
  { id: 'braces', name: 'Braces / Orthodontics', vietnamPrice: 1200, category: 'Orthodontics' },
  { id: 'smile-makeover', name: 'Full Smile Makeover', vietnamPrice: 2200, category: 'Cosmetic' },
  { id: 'sinus-lift', name: 'Sinus Lift (Support)', vietnamPrice: 800, category: 'Implants' },
];

const CATEGORIES = ['General', 'Restorative', 'Implants', 'Orthodontics', 'Cosmetic'];

const ORIGINS = {
  aus: { label: 'Australia', factor: 4.8 },
  usa: { label: 'USA', factor: 5.5 },
  kor: { label: 'South Korea', factor: 3.4 },
  jpn: { label: 'Japan', factor: 4.1 },
  chn: { label: 'China', factor: 3.0 },
  rus: { label: 'Russia', factor: 3.2 },
  can: { label: 'Canada', factor: 5.0 },
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
      className={`flex flex-col p-3 rounded-xl border transition-all duration-300 text-left ${
        selected 
        ? 'bg-brand-primary text-brand-text border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]' 
        : 'bg-white border-gray-100 hover:border-brand-primary/40 text-brand-text hover:bg-gray-50 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div onClick={onToggle} className="cursor-pointer flex-grow pr-2">
          <div className={`text-xs font-bold leading-tight ${selected ? 'text-brand-text' : 'text-brand-text/90'}`}>{t.name}</div>
        </div>
        <button 
          onClick={onToggle} 
          className={`p-1 rounded-full transition-colors ${selected ? 'bg-black/10 text-brand-text' : 'bg-gray-50 text-brand-primary hover:bg-brand-primary hover:text-brand-text'}`}
        >
          {selected ? (
            <Minus className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </button>
      </div>
      
      {t.hasQuantity && selected && (
        <div className="flex items-center gap-2 mt-1.5 bg-black/5 rounded-lg p-1 self-start ring-1 ring-black/5">
          <button onClick={() => onUpdateQuantity(-1)} className="p-0.5 hover:bg-black/10 rounded transition-colors">
            <Minus className="w-2 h-2 text-brand-text" />
          </button>
          <span className="text-[10px] font-black min-w-[0.5rem] text-center text-brand-text">{quantity}</span>
          <button onClick={() => onUpdateQuantity(1)} className="p-0.5 hover:bg-black/10 rounded transition-colors">
            <Plus className="w-2 h-2 text-brand-text" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(['cleaning', 'whitening']);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pricingFrom, setPricingFrom] = useState<keyof typeof ORIGINS>('aus');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('General');

  const filteredTreatments = TREATMENTS.filter(t => t.category === activeCategory);

  const factor = ORIGINS[pricingFrom].factor;

  const totalOrigin = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(t => t.id === id);
    const qty = quantities[id] || 1;
    return acc + ((t?.vietnamPrice || 0) * factor * qty);
  }, 0);

  const totalVietnam = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(t => t.id === id);
    const qty = quantities[id] || 1;
    return acc + ((t?.vietnamPrice || 0) * qty);
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
            Expert Dental <br />
            Care. Designed <br />
            for <span className="text-brand-secondary">Travel.</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed">
            Premium care in Da Nang. We connect international patients with JCI-standard clinics and local concierge support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#book-now" className="btn-luxury px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform text-center">
              Send Your Request
            </a>
            <a href="#book-now" className="bg-white/95 backdrop-blur border border-gray-200 px-10 py-5 rounded-2xl font-bold text-lg text-brand-text hover:bg-white transition-all flex items-center gap-2">
              Chat Now
            </a>
          </div>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section id="price-comparison" className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-gray-100">
          {/* Selector Pane */}
          <div className="p-6 md:p-10 lg:w-3/5 bg-gray-50/50">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary mb-3">PRICE COMPARISON</p>
            <h2 className="font-serif text-2xl md:text-4xl font-black mb-6 leading-tight text-brand-text">Compare treatments at a glance.</h2>
            
            <div className="space-y-4 bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 shadow-sm">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 block mb-0.5">TREATMENTS</label>
                    <span className="text-[10px] font-bold text-gray-400">{selectedTreatments.length} SELECTED</span>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                        activeCategory === cat 
                        ? 'bg-brand-primary text-brand-text shadow-lg shadow-brand-primary/20' 
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                    <div className="col-span-full py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                      No treatments found in this category
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Pane */}
          <div className="p-6 md:p-8 lg:w-[42%] md:border-l border-gray-100 bg-white text-left">
            <div className="lg:mt-32 h-full rounded-[1.5rem] bg-gray-50/30 p-5 sm:p-6 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-secondary">PRICE BREAKDOWN</span>
                <span className="text-[10px] bg-brand-primary/10 px-2.5 py-0.5 rounded-full uppercase font-black text-brand-secondary">APPROXIMATE</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-12 text-[9px] font-black text-gray-400 pb-2 border-b border-gray-100 uppercase tracking-widest">
                  <div className="col-span-6">TREATMENT</div>
                  <div className="col-span-3 text-right">{ORIGINS[pricingFrom].label}</div>
                  <div className="col-span-3 text-right">VIETNAM</div>
                </div>
                
                {selectedTreatments.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 italic text-sm">Pick one or more services to compare</p>
                ) : (
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedTreatments.map(id => {
                      const t = TREATMENTS.find(item => item.id === id);
                      if (!t) return null;
                      return (
                        <div key={id} className="grid grid-cols-12 items-center gap-2 group py-2 border-b border-gray-50 last:border-0 relative">
                          <div className="col-span-6 flex items-start gap-2 min-w-0">
                            <button 
                              onClick={() => toggleTreatment(id)}
                              className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-md bg-brand-secondary/10 text-brand-secondary transition-all hover:bg-brand-secondary hover:text-white"
                              title="Remove treatment"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="min-w-0 pr-1">
                                <div className="text-[12px] font-bold text-brand-text leading-tight md:leading-snug">
                                  {t.name}
                                </div>
                                {(quantities[id] > 1) && <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Quantity: {quantities[id]}</p>}
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-[12px] font-black text-gray-400/80">~${Math.round(t.vietnamPrice * factor * (quantities[id] || 1)).toLocaleString()}</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-[12px] font-black text-brand-primary uppercase tracking-tight">${Math.round(t.vietnamPrice * (quantities[id] || 1)).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.25em] block mb-2">ESTIMATED SAVINGS</span>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-black tracking-tight text-brand-text">~${Math.round(totalSavings).toLocaleString()}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">USD</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  {selectedTreatments.length > 0 ? "Estimated savings for selected treatments." : "Choose one or more treatments to compare."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-32 px-4 max-w-7xl mx-auto text-center">
        <span className="text-brand-primary font-bold tracking-[0.2em] mb-4 block uppercase text-sm">THE PLATFORM ADVANTAGE</span>
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
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 border border-white/10 transition-colors group-hover:bg-brand-primary group-hover:text-white`}>
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
        <div className="mb-16 border-l-4 border-brand-secondary pl-6">
          <h2 className="text-3xl md:text-5xl font-black text-brand-text mb-2 uppercase tracking-tighter">Verified Partners</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Top Rated Clinics in Da Nang</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { 
              name: "East Meets West Dental", 
              address: "Son Tra district, near My Khe beach", 
              specialty: "Implants & Crowns", 
              price: "$30 - $800",
              img: "https://images.unsplash.com/photo-1629909613654-28a3a7c45701?auto=format&fit=crop&w=400&q=80"
            },
            { 
              name: "Serenity International", 
              address: "Hai Chau, central city access", 
              specialty: "Smile Aesthetics", 
              price: "$150 - $4500",
              img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80"
            }
          ].map((partner, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden group border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-primary/20 transition-all cursor-pointer">
              <div className="h-64 bg-gray-100 relative overflow-hidden p-3">
                <img 
                  src={partner.img} 
                  alt={partner.name}
                  className="w-full h-full object-cover rounded-[2rem] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-brand-secondary px-3 py-1 rounded-lg text-[10px] font-black border border-brand-secondary/30 uppercase tracking-widest italic">VETTED</div>
              </div>
              <div className="p-8">
                <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-2 font-black">PARTNER CLINIC</p>
                <h3 className="font-bold text-brand-text text-2xl mb-5 group-hover:text-brand-primary transition-colors h-14 flex items-center leading-tight">{partner.name}</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2 text-[12px] font-semibold text-gray-500 leading-tight">
                    <span className="mt-1 w-2 h-2 rounded-full bg-brand-secondary flex-shrink-0"></span>
                    {partner.address}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-[13px] font-bold text-gray-600">{partner.specialty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <DollarSign className="w-3 h-3" />
                    </div>
                    <span className="text-[14px] font-black text-brand-text">{partner.price}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-6 text-brand-secondary font-black text-[10px] uppercase tracking-widest">
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-brand-primary font-bold tracking-[0.2em] mb-4 block uppercase text-sm">LOCAL EXPERIENCE</span>
              <h2 className="font-serif text-4xl md:text-6xl font-black leading-tight text-white italic">Explore Da Nang while you heal.</h2>
            </div>
            <p className="text-white/60 max-w-sm text-lg leading-relaxed font-medium">
              Voted one of the most beautiful cities in the world. From white sands to ancient towns, your recovery is a vacation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: "My Khe Beach", 
                desc: "Golden sands & crystal waters.",
                tag: "BEACHES",
                img: "https://images.unsplash.com/photo-1540202404-a2f290328292?auto=format&fit=crop&q=80" 
              },
              { 
                name: "Ba Na Hills", 
                desc: "European flair in the clouds.",
                tag: "ADVENTURE",
                img: "https://images.unsplash.com/photo-1599385559639-6f9037cba4ca?auto=format&fit=crop&q=80" 
              },
              { 
                name: "Dragon Bridge", 
                desc: "The heartbeat of the city.",
                tag: "CITY LIFE",
                img: "https://images.unsplash.com/photo-1582233479373-add29e612edb?auto=format&fit=crop&q=80" 
              },
              { 
                name: "Hoi An Town", 
                desc: "Ancient colors & lanterns.",
                tag: "CULTURE",
                img: "https://images.unsplash.com/photo-1596701062351-be129a18286c?auto=format&fit=crop&q=80" 
              }
            ].map((loc, idx) => (
              <motion.div 
                key={idx}
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
                  <span className="text-[10px] font-black tracking-[0.2em] text-brand-primary mb-2 block bg-white/10 w-fit px-2 py-1 rounded backdrop-blur-sm">
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

      {/* Footer Form */}
      <section id="book-now" className="py-32 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.08)] border border-gray-100 flex flex-col md:flex-row">
          <div className="bg-brand-section p-10 md:p-14 text-white md:w-[35%]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-brand-primary mb-4">BOOKING SUPPORT</p>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Dental Advice. Booking Support.</h2>
            <div className="space-y-6 text-sm text-white/70 font-medium">
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-primary flex-shrink-0"></span>
                <p>Tell us what treatment you need.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-primary flex-shrink-0"></span>
                <p>We’ll suggest suitable clinics and next steps.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-primary flex-shrink-0"></span>
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
              <button className="btn-luxury w-full py-5 rounded-2xl font-black text-lg tracking-[0.2em] shadow-xl shadow-brand-primary/10">
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
