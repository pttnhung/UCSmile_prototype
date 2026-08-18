import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Plus, PlusCircle, Trash2, ArrowRight, Calculator, Plane } from 'lucide-react';
import { TREATMENTS, CATEGORIES, ORIGINS } from '../constants/treatmentData';

export default function ComparisonPage() {
  const navigate = useNavigate();

  // 1. Country State
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof ORIGINS>('au');

  // 2. Category State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 3. Treatment State (start empty with placeholder)
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>('');

  // List of selected treatments for calculation (starts empty)
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Filter treatments by selected category
  const filteredTreatments = TREATMENTS.filter(t => {
    if (selectedCategory === 'All') return true;
    return t.category === selectedCategory || t.secondaryCategory === selectedCategory;
  });

  // Handle adding treatment to list
  const handleAddTreatment = () => {
    if (!selectedTreatmentId) return;
    if (!selectedTreatments.includes(selectedTreatmentId)) {
      setSelectedTreatments(prev => [...prev, selectedTreatmentId]);
      setQuantities(prev => ({ ...prev, [selectedTreatmentId]: 1 }));
      setSelectedTreatmentId(''); // reset selection after adding
    }
  };

  const handleRemoveTreatment = (id: string) => {
    setSelectedTreatments(prev => prev.filter(item => item !== id));
    setQuantities(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  // Calculation logic
  const originKey = selectedCountry;

  const totalOrigin = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(item => item.id === id);
    const qty = quantities[id] || 1;
    const price = t?.prices[originKey]?.min || 0;
    return acc + (price * qty);
  }, 0);

  const totalVietnam = selectedTreatments.reduce((acc, id) => {
    const t = TREATMENTS.find(item => item.id === id);
    const qty = quantities[id] || 1;
    const price = t?.prices.vn.min || 0;
    return acc + (price * qty);
  }, 0);

  const totalSavings = Math.max(0, totalOrigin - totalVietnam);

  const handleApply = () => {
    navigate('/', {
      state: {
        selectedTreatments,
        pricingFrom: selectedCountry,
        quantities,
        scrollTo: 'price-comparison'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f3f6] pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-[#FAF9F6] px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            Price Calculator
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-xs text-left space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <Calculator className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 leading-tight">
            Compare Treatment Prices
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Select your country, category, and treatment to see your estimated savings when getting dental care in Vietnam.
          </p>
        </div>

        {/* 3 Dropdowns Form Section */}
        <div className="bg-[#FAF9F6] rounded-3xl p-5 sm:p-7 border border-gray-200/60 shadow-xs space-y-5 text-left">
          
          {/* Dropdown 1: Country */}
          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5 ml-0.5">
              1. Select Your Country / Origin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value as keyof typeof ORIGINS)}
                className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-10"
              >
                {Object.entries(ORIGINS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.short})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: Category */}
          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5 ml-0.5">
              2. Select Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setSelectedTreatmentId('');
                }}
                className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-10"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 3: Treatment */}
          <div>
            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5 ml-0.5">
              3. Select Treatment <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedTreatmentId}
                  onChange={e => setSelectedTreatmentId(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-300 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-gray-800 appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled>Select a treatment...</option>
                  {filteredTreatments.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={handleAddTreatment}
                disabled={!selectedTreatmentId}
                className={`font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedTreatmentId
                    ? 'bg-gray-800 hover:bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Selected Treatments List */}
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
              Selected Treatments ({selectedTreatments.length})
            </label>
            
            {selectedTreatments.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-2xl bg-white/80 border border-dashed border-gray-200 my-1 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">No treatments added yet</p>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Select a treatment from the dropdown above and click <strong className="text-gray-800">+ Add</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedTreatments.map(id => {
                  const t = TREATMENTS.find(item => item.id === id);
                  if (!t) return null;
                  const qty = quantities[id] || 1;
                  return (
                    <div key={id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs font-bold text-gray-900 truncate">{t.name}</span>
                        <span className="text-[10px] font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200 shrink-0">
                          {t.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {t.hasQuantity && (
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden text-xs">
                            <button
                              onClick={() => updateQuantity(id, -1)}
                              className="px-2 py-1 hover:bg-gray-100 font-bold text-gray-600"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold text-gray-800">{qty}</span>
                            <button
                              onClick={() => updateQuantity(id, 1)}
                              className="px-2 py-1 hover:bg-gray-100 font-bold text-gray-600"
                            >
                              +
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleRemoveTreatment(id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove treatment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live Savings Quick Card */}
        <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-gray-200/60 shadow-xs relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC107]/10 rounded-full -mr-12 -mt-12 pointer-events-none" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-2 relative z-10">
            ESTIMATED SAVINGS VS {ORIGINS[selectedCountry].short}
          </span>

          {selectedTreatments.length === 0 ? (
            <p className="text-xs font-medium text-gray-500 py-2 relative z-10 leading-relaxed">
              Select a treatment above and click <span className="font-bold text-gray-800">+ Add</span> to calculate savings.
            </p>
          ) : (
            <>
              <div className="flex items-end gap-2 mb-4 relative z-10">
                <span className="text-4xl font-black tracking-tight text-[#FFC107]">
                  ~${Math.round(totalSavings).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">USD</span>
              </div>

              {totalSavings > 0 && (
                <div className="relative z-10 mb-4 group">
                  <div className="absolute -inset-2 bg-[#FFC107]/10 rounded-2xl blur-lg transition-all group-hover:bg-[#FFC107]/20" />
                  <div className="relative bg-white/80 backdrop-blur-sm border border-[#FFC107]/20 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0 mt-0.5">
                        <Plane className="w-3.5 h-3.5 text-gray-950" />
                      </div>
                      <p className="text-[11px] text-gray-500 font-normal leading-snug italic">
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
            </>
          )}

          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-tight border-t border-gray-50 pt-3 italic mt-3">
            * Market average estimates. Final costs vary by materials and clinical complexity.
          </p>
        </div>

        {/* Submit Compare CTA */}
        <button
          onClick={handleApply}
          className="w-full bg-[#FFC107] hover:bg-amber-400 text-gray-950 font-black text-xs sm:text-sm uppercase tracking-wider py-4 rounded-2xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Apply & View Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

