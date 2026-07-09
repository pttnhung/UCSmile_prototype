import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Globe, 
  MapPin, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Clock, 
  FileText, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Calendar,
  CheckCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';

// Step definition
interface Step {
  id: number;
  name: string;
  desc: string;
}

const ONBOARDING_STEPS: Step[] = [
  { id: 1, name: 'Clinic Profile', desc: 'Describe your specialties & languages' },
  { id: 2, name: 'Services & Pricing', desc: 'Configure treatments and prices' },
  { id: 3, name: 'Working Hours', desc: 'Set opening & closing schedules' },
  { id: 4, name: 'Additional Info', desc: 'Add branches, dentists, & documents' },
  { id: 5, name: 'Partnership Agreement', desc: 'Review and sign terms of service' },
  { id: 6, name: 'Admin Review', desc: 'Submit for UCSmile verification' }
];

const STANDARD_SERVICES = [
  // General Category
  { id: 'gen-1', category: 'General', name: 'Cleaning', range: '$30 - $70', defaultPrice: 50, treatmentUnit: 'Visit', priceUnit: 'per Visit', currency: 'USD' },
  { id: 'gen-2', category: 'General', name: 'Teeth Whitening', range: '$100 - $250', defaultPrice: 150, treatmentUnit: 'Session', priceUnit: 'per Session', currency: 'USD' },
  { id: 'gen-3', category: 'General', name: 'Braces', range: '$1200 - $3500', defaultPrice: 1800, treatmentUnit: 'Case', priceUnit: 'per Case', currency: 'USD' },
  { id: 'gen-4', category: 'General', name: 'Dental Implant', range: '$800 - $1800', defaultPrice: 1200, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'gen-5', category: 'General', name: 'Wisdom Tooth Extraction', range: '$100 - $300', defaultPrice: 180, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'gen-6', category: 'General', name: 'Composite Filling', range: '$40 - $100', defaultPrice: 60, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'gen-7', category: 'General', name: 'Tooth Extraction', range: '$50 - $150', defaultPrice: 80, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },

  // Restorative Category
  { id: 'res-1', category: 'Restorative', name: 'Composite Filling', range: '$40 - $100', defaultPrice: 60, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'res-2', category: 'Restorative', name: 'Root Canal Treatment', range: '$150 - $350', defaultPrice: 220, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'res-3', category: 'Restorative', name: 'Pulp Treatment', range: '$100 - $250', defaultPrice: 150, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'res-4', category: 'Restorative', name: 'Inlay Onlay Overlay', range: '$300 - $600', defaultPrice: 400, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },

  // Prosthodontics Category
  { id: 'pro-1', category: 'Prosthodontics', name: 'Dental Crown', range: '$200 - $500', defaultPrice: 350, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'pro-2', category: 'Prosthodontics', name: 'Veneers', range: '$300 - $800', defaultPrice: 450, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'pro-3', category: 'Prosthodontics', name: 'Dental Bridge', range: '$700 - $1500', defaultPrice: 900, treatmentUnit: 'Bridge', priceUnit: 'per Bridge', currency: 'USD' },

  // Oral Surgery Category
  { id: 'sur-1', category: 'Oral Surgery', name: 'Tooth Extraction', range: '$50 - $150', defaultPrice: 80, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'sur-2', category: 'Oral Surgery', name: 'Wisdom Tooth Extraction', range: '$100 - $300', defaultPrice: 180, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'sur-3', category: 'Oral Surgery', name: 'Pre-prosthetic Surgery', range: '$200 - $500', defaultPrice: 300, treatmentUnit: 'Visit', priceUnit: 'per Visit', currency: 'USD' },
  { id: 'sur-4', category: 'Oral Surgery', name: 'Apicoectomy', range: '$150 - $400', defaultPrice: 250, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'sur-5', category: 'Oral Surgery', name: 'Gum Surgery', range: '$100 - $400', defaultPrice: 200, treatmentUnit: 'Segment', priceUnit: 'per Segment', currency: 'USD' },

  // Implants Category
  { id: 'imp-1', category: 'Implants', name: 'Dental Implant', range: '$800 - $1800', defaultPrice: 1200, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'imp-2', category: 'Implants', name: 'Bone Graft', range: '$200 - $600', defaultPrice: 350, treatmentUnit: 'Site', priceUnit: 'per Site', currency: 'USD' },
  { id: 'imp-3', category: 'Implants', name: 'Full Arch Implants', range: '$5000 - $12000', defaultPrice: 6500, treatmentUnit: 'Arch', priceUnit: 'per Arch', currency: 'USD' },

  // Orthodontics Category
  { id: 'ort-1', category: 'Orthodontics', name: 'Braces', range: '$1200 - $3500', defaultPrice: 1800, treatmentUnit: 'Case', priceUnit: 'per Case', currency: 'USD' },
  { id: 'ort-2', category: 'Orthodontics', name: 'Invisalign', range: '$2000 - $4500', defaultPrice: 2800, treatmentUnit: 'Case', priceUnit: 'per Case', currency: 'USD' },
  { id: 'ort-3', category: 'Orthodontics', name: 'Growth Orthodontics', range: '$800 - $2000', defaultPrice: 1200, treatmentUnit: 'Case', priceUnit: 'per Case', currency: 'USD' },

  // Pediatric Dentistry Category
  { id: 'ped-1', category: 'Pediatric Dentistry', name: 'Pediatric Extraction', range: '$30 - $70', defaultPrice: 45, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'ped-2', category: 'Pediatric Dentistry', name: 'Pediatric Root Canal', range: '$80 - $200', defaultPrice: 120, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'ped-3', category: 'Pediatric Dentistry', name: 'Pediatric Crown', range: '$100 - $250', defaultPrice: 150, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'ped-4', category: 'Pediatric Dentistry', name: 'Pediatric Filling', range: '$25 - $60', defaultPrice: 40, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' },
  { id: 'std-others', category: 'Other Specialty', name: 'Others', range: '', defaultPrice: 0, treatmentUnit: 'Tooth', priceUnit: 'per Tooth', currency: 'USD' }
];

const POPULAR_SPECIALTIES = [
  'General',
  'Restorative',
  'Prosthodontics',
  'Oral Surgery',
  'Implants',
  'Orthodontics',
  'Pediatric Dentistry'
];

const POPULAR_FACILITIES = [
  '3D CT Scanner',
  'English Speaking Staff',
  'Korean Speaking Staff',
  'Free Airport Pickup',
  'Private Treatment Rooms',
  'Wheelchair Accessible',
  'Sedation Dentistry',
  'Free WiFi & Coffee Bar',
  'Waiting Lounge',
  'Kids Play Area'
];

const POPULAR_LANGUAGES = [
  'Vietnamese',
  'English',
  'Korean',
  'Japanese',
  'Chinese',
  'French',
  'German',
  'Russian'
];

export function ClinicOnboardingPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'register' | 'login' | 'onboarding' | 'success'>('register');
  
  // Session details
  const [adminUser, setAdminUser] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    clinicName: '',
    contactPersonName: '',
    contactPhoneNumber: '',
    contactEmail: '',
    primaryBranchName: '',
    city: 'Da Nang',
    clinicAddress: '',
    website: '',
    adminFullName: '',
    adminEmail: '',
    password: ''
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI States
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('ucsmile_clinic_admin');
    const savedClinic = localStorage.getItem('ucsmile_clinic_data');
    const savedOnb = localStorage.getItem('ucsmile_clinic_onboarding');
    
    if (savedAdmin && savedClinic && savedOnb) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
        setClinic(JSON.parse(savedClinic));
        setOnboarding(JSON.parse(savedOnb));
        setActiveView('onboarding');
        
        // Fetch fresh state from server
        const parsedClinic = JSON.parse(savedClinic);
        fetchClinicOnboarding(parsedClinic.id);
      } catch (e) {
        localStorage.removeItem('ucsmile_clinic_admin');
        localStorage.removeItem('ucsmile_clinic_data');
        localStorage.removeItem('ucsmile_clinic_onboarding');
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fillRegistrationDemoData = () => {
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    setRegForm({
      clinicName: `Elite Dental Care Da Nang`,
      contactPersonName: 'Phan Minh Nhung',
      contactPhoneNumber: '+84905123456',
      contactEmail: `contact${randomSuffix}@elitedentaldanang.com`,
      primaryBranchName: 'Elite Dental Main Branch',
      city: 'Da Nang',
      clinicAddress: '150 Bach Dang Street, Hai Chau District, Da Nang',
      website: 'https://elitedentaldanang.com',
      adminFullName: 'Nhung Phan',
      adminEmail: `admin${randomSuffix}@elitedentaldanang.com`,
      password: 'password123'
    });
    showToast("Filled registration form with premium Da Nang clinic details!");
  };

  const fetchClinicOnboarding = async (clinicId: string) => {
    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}`);
      if (res.ok) {
        const data = await res.json();
        setClinic(data.clinic);
        setOnboarding(data.onboarding);
        setBranches(data.branches);
        localStorage.setItem('ucsmile_clinic_data', JSON.stringify(data.clinic));
        localStorage.setItem('ucsmile_clinic_onboarding', JSON.stringify(data.onboarding));
      } else if (res.status === 404) {
        // If server restarted, let's try to restore the in-memory session using client cached data
        const savedAdmin = localStorage.getItem('ucsmile_clinic_admin');
        const savedClinic = localStorage.getItem('ucsmile_clinic_data');
        const savedOnb = localStorage.getItem('ucsmile_clinic_onboarding');
        if (savedAdmin && savedClinic && savedOnb) {
          const restoreRes = await fetch('/api/clinic/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clinic: JSON.parse(savedClinic),
              admin: JSON.parse(savedAdmin),
              onboarding: JSON.parse(savedOnb),
              branches: []
            })
          });
          if (restoreRes.ok) {
            // Re-fetch now that session is restored on server
            const retryRes = await fetch(`/api/clinic/onboarding/${clinicId}`);
            if (retryRes.ok) {
              const data = await retryRes.json();
              setClinic(data.clinic);
              setOnboarding(data.onboarding);
              setBranches(data.branches);
              showToast("Your session has been seamlessly restored!");
              return;
            }
          }
        }
        // Fallback if restoration is not possible or failed
        localStorage.removeItem('ucsmile_clinic_admin');
        localStorage.removeItem('ucsmile_clinic_data');
        localStorage.removeItem('ucsmile_clinic_onboarding');
        setAdminUser(null);
        setClinic(null);
        setOnboarding(null);
        setActiveView('register');
        showToast("Session expired or server restarted. Please register again.");
      }
    } catch (err) {}
  };

  // AC 4 & AC 1 Required Field Validation and Submit Basic Clinic Info
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    // Required fields as per AC 4
    const required = [
      'clinicName', 'contactPersonName', 'contactPhoneNumber', 'contactEmail',
      'primaryBranchName', 'city', 'clinicAddress', 'adminFullName', 'adminEmail', 'password'
    ];

    const missing = required.filter(field => !regForm[field as keyof typeof regForm]?.trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields marked with *.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/clinic/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed. Please check your inputs.");
      }

      // AC 7 Registration Confirmation message
      setSuccessMsg(result.message);
      setClinic(result.clinic);
      setAdminUser(result.admin);
      setOnboarding(result.onboarding);

      // Save to localStorage
      localStorage.setItem('ucsmile_clinic_admin', JSON.stringify(result.admin));
      localStorage.setItem('ucsmile_clinic_data', JSON.stringify(result.clinic));
      localStorage.setItem('ucsmile_clinic_onboarding', JSON.stringify(result.onboarding));

      setActiveView('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clinic Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setError("Please provide both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/clinic/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      setAdminUser(result.admin);
      setClinic(result.clinic);
      setOnboarding(result.onboarding);

      localStorage.setItem('ucsmile_clinic_admin', JSON.stringify(result.admin));
      localStorage.setItem('ucsmile_clinic_data', JSON.stringify(result.clinic));
      localStorage.setItem('ucsmile_clinic_onboarding', JSON.stringify(result.onboarding));

      setActiveView('onboarding');
      showToast("Logged in successfully! Continuing your onboarding.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('ucsmile_clinic_admin');
    localStorage.removeItem('ucsmile_clinic_data');
    localStorage.removeItem('ucsmile_clinic_onboarding');
    setAdminUser(null);
    setClinic(null);
    setOnboarding(null);
    setActiveView('login');
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-28 pb-20 font-sans" id="clinic-onboarding-portal">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
              id="onboarding-toast"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portal Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 rounded-3xl mb-4 border border-amber-200/50">
            <Building className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 font-extrabold tracking-tight">
            UCSmile Clinic Partner Portal
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Become an accredited UCSmile clinic partner and reach international dental tourists.
          </p>
        </div>

        {/* Dynamic Views */}
        <AnimatePresence mode="wait">
          
          {/* VIEW: REGISTER */}
          {activeView === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 md:p-10"
              id="view-register-container"
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="font-serif text-xl text-gray-900 font-bold">Register Your Dental Clinic</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-extrabold mt-1">Step 1: Create Account & Basic Listing</p>
                </div>
                <button 
                  onClick={() => setActiveView('login')}
                  className="text-xs font-black uppercase tracking-wider text-amber-600 hover:text-amber-500 border border-amber-200 hover:border-amber-300 px-4 py-2 rounded-xl transition-all cursor-pointer"
                  id="btn-goto-login"
                >
                  Log In Instead
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-8 flex items-start gap-3" id="error-alert">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wide text-red-800">Registration Check Alert</h4>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                    {error.includes("already registered") && (
                      <button 
                        onClick={() => { setError(null); setActiveView('login'); }}
                        className="text-xs font-extrabold underline text-red-800 mt-2 block"
                      >
                        Click here to go to Log In →
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-8" id="register-form">
                
                {/* Auto-Fill Demo Button */}
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={fillRegistrationDemoData}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                    id="btn-fill-reg-demo"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" /> Điền thông tin mẫu (Auto-Fill Demo)
                  </button>
                </div>
                
                {/* SECTION 1: Clinic Information */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Clinic details (Basic Information)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Name *</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          required
                          placeholder="e.g., SmileCare International Dental"
                          value={regForm.clinicName}
                          onChange={e => setRegForm({...regForm, clinicName: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-clinicName"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Branch Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g., Da Nang Central Branch"
                        value={regForm.primaryBranchName}
                        onChange={e => setRegForm({...regForm, primaryBranchName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                        id="input-primaryBranchName"
                      />
                      <p className="text-[10px] text-gray-400 font-medium mt-1">If only one branch, same as Clinic Name.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Person Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          required
                          placeholder="Main registration contact person"
                          value={regForm.contactPersonName}
                          onChange={e => setRegForm({...regForm, contactPersonName: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-contactPersonName"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="email"
                          required
                          placeholder="Contact email for correspondence"
                          value={regForm.contactEmail}
                          onChange={e => setRegForm({...regForm, contactEmail: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-contactEmail"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          required
                          placeholder="Communication phone"
                          value={regForm.contactPhoneNumber}
                          onChange={e => setRegForm({...regForm, contactPhoneNumber: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-contactPhoneNumber"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City *</label>
                      <select 
                        value={regForm.city}
                        onChange={e => setRegForm({...regForm, city: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                        id="input-city"
                      >
                        <option value="Da Nang">Da Nang</option>
                        <option value="Ho Chi Minh">Ho Chi Minh</option>
                        <option value="Hanoi">Hanoi</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Branch Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          required
                          placeholder="Physical address of your primary clinic branch"
                          value={regForm.clinicAddress}
                          onChange={e => setRegForm({...regForm, clinicAddress: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-clinicAddress"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Website / Social Links (Optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="url"
                          placeholder="https://yourclinic.com or Facebook page link"
                          value={regForm.website}
                          onChange={e => setRegForm({...regForm, website: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-website"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Clinic Admin Account */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Clinic Admin Account
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          required
                          placeholder="Full name of clinic admin"
                          value={regForm.adminFullName}
                          onChange={e => setRegForm({...regForm, adminFullName: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-adminFullName"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Login Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="email"
                          required
                          placeholder="admin@yourclinic.com"
                          value={regForm.adminEmail}
                          onChange={e => setRegForm({...regForm, adminEmail: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-adminEmail"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Secret Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="password"
                          required
                          placeholder="Secure login password"
                          value={regForm.password}
                          onChange={e => setRegForm({...regForm, password: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                          id="input-password"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">Used to log in and resume onboarding.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
                    id="btn-submit-registration"
                  >
                    {loading ? 'Validating & Registering...' : 'Register Clinic & Create Admin Account'}
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {/* VIEW: LOGIN */}
          {activeView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 md:p-10 max-w-md mx-auto"
              id="view-login-container"
            >
              <div className="text-center mb-8 pb-6 border-b border-gray-100">
                <h2 className="font-serif text-xl text-gray-900 font-bold">Clinic Admin Login</h2>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-extrabold mt-1">Resume Onboarding or Manage Profile</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-6 flex items-start gap-3" id="login-error-alert">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5" id="login-form">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Login Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="email"
                      required
                      placeholder="admin@yourclinic.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                      id="login-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="password"
                      required
                      placeholder="Enter your secret password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                      id="login-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
                  id="btn-login-submit"
                >
                  {loading ? 'Logging in...' : 'Sign In To Onboarding'}
                </button>

                <div className="pt-4 text-center">
                  <p className="text-xs text-gray-400 font-bold">New to UCSmile?</p>
                  <button 
                    type="button"
                    onClick={() => setActiveView('register')}
                    className="text-xs font-black uppercase text-amber-600 hover:text-amber-500 mt-2 block mx-auto hover:underline"
                    id="btn-goto-register"
                  >
                    Register Your Clinic Now →
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* VIEW: REGISTRATION SUCCESS CONFIRMATION */}
          {activeView === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 md:p-12 text-center"
              id="view-success-container"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl text-gray-900 font-bold mb-4">Registration Created Successfully!</h2>
              
              {/* AC 7 Success message requirement */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-xl mx-auto mb-8">
                <p className="text-xs text-gray-600 leading-relaxed font-bold italic">
                  “Your clinic registration has been created successfully. Please continue completing your clinic onboarding information for UCSmile review.”
                </p>
              </div>

              <div className="border border-amber-100 bg-amber-50/40 p-6 rounded-2xl max-w-xl mx-auto mb-8 text-left space-y-3">
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> Account Created Records
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px]">Dental Clinic:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{clinic?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px]">Primary Branch:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{clinic?.primaryBranchId ? 'Linked Branch Created' : 'Created'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px]">Admin Account:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{adminUser?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px]">Initial Status:</span>
                    <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200 mt-1">
                      {clinic?.status}
                    </span>
                  </div>
                </div>

                {clinic?.flaggedForReview && (
                  <div className="p-3 bg-amber-100/50 border border-amber-200 rounded-xl mt-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      <strong>Dual Registration Audit:</strong> A similar clinic name or address exists. Your application has been logged and flagged for Admin verification review. You can continue onboarding normally.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setActiveView('onboarding');
                    showToast("Loading your custom onboarding workspace!");
                  }}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  id="btn-continue-onboarding"
                >
                  Continue Onboarding Flow <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW: ONBOARDING WIZARD */}
          {activeView === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              id="view-onboarding-container"
            >
              
              {/* Profile Bar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.01)] font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    {clinic?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 leading-tight">{clinic?.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Admin: {adminUser?.fullName} | {adminUser?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                    clinic?.status === 'APPROVED' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : clinic?.status === 'PENDING_REVIEW'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {clinic?.status?.replace(/_/g, ' ')}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Wizard Nav Track */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] mb-8 overflow-x-auto custom-scrollbar">
                <div className="min-w-[650px] flex items-center justify-between relative">
                  
                  {/* Track connection line */}
                  <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 z-0">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500" 
                      style={{ width: `${((onboarding?.currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  {ONBOARDING_STEPS.map((step) => {
                    const isCompleted = step.id < onboarding?.currentStep || 
                                       (step.id === 1 && onboarding?.profileSetupCompleted) ||
                                       (step.id === 2 && onboarding?.servicesCompleted) ||
                                       (step.id === 3 && onboarding?.workingHoursCompleted) ||
                                       (step.id === 4 && onboarding?.additionalInfoCompleted) ||
                                       (step.id === 5 && onboarding?.agreementCompleted);
                    const isActive = step.id === onboarding?.currentStep;
                    
                    return (
                      <div 
                        key={step.id} 
                        onClick={() => {
                          if (step.id <= onboarding?.currentStep + 1) {
                            setOnboarding({ ...onboarding, currentStep: step.id });
                          }
                        }}
                        className={`flex flex-col items-center relative z-10 font-sans cursor-pointer group text-center px-2`}
                        style={{ width: '15%' }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black text-xs transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : isActive 
                            ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-110' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-wider mt-3 transition-colors ${
                          isActive ? 'text-amber-500' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                        }`}>{step.name}</p>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Onboarding Wizard Active step panel */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 md:p-10">
                {onboarding?.currentStep === 1 && (
                  <StepProfileSetup 
                    clinicId={clinic?.id} 
                    clinic={clinic}
                    onboarding={onboarding} 
                    onSave={(updatedOnb) => {
                      setOnboarding(updatedOnb);
                      showToast("Step 1: Profile details saved. Advanced to Services Setup.");
                    }} 
                  />
                )}

                {onboarding?.currentStep === 2 && (
                  <StepServicesSetup 
                    clinicId={clinic?.id} 
                    onboarding={onboarding} 
                    onSave={(updatedOnb) => {
                      setOnboarding(updatedOnb);
                      showToast("Step 2: Service lists & prices saved. Advanced to Hours Setup.");
                    }}
                    onPrev={() => setOnboarding({ ...onboarding, currentStep: 1 })}
                  />
                )}

                {onboarding?.currentStep === 3 && (
                  <StepHoursSetup 
                    clinicId={clinic?.id} 
                    onboarding={onboarding} 
                    onSave={(updatedOnb) => {
                      setOnboarding(updatedOnb);
                      showToast("Step 3: Operational hours saved. Advanced to Additional Information.");
                    }}
                    onPrev={() => setOnboarding({ ...onboarding, currentStep: 2 })}
                  />
                )}

                {onboarding?.currentStep === 4 && (
                  <StepAdditionalInfo 
                    clinicId={clinic?.id} 
                    clinic={clinic}
                    onboarding={onboarding} 
                    onSave={(updatedOnb) => {
                      setOnboarding(updatedOnb);
                      showToast("Step 4: Additional clinic information saved.");
                    }}
                    onPrev={() => setOnboarding({ ...onboarding, currentStep: 3 })}
                  />
                )}

                {onboarding?.currentStep === 5 && (
                  <StepAgreementSetup 
                    clinicId={clinic?.id} 
                    clinicName={clinic?.name}
                    adminName={adminUser?.fullName}
                    onboarding={onboarding} 
                    onSave={(updatedOnb) => {
                      setOnboarding(updatedOnb);
                      showToast("Step 5: Partnership agreement digitally signed.");
                    }}
                    onPrev={() => setOnboarding({ ...onboarding, currentStep: 4 })}
                  />
                )}

                {onboarding?.currentStep === 6 && (
                  <StepSubmissionReview 
                    clinicId={clinic?.id} 
                    onboarding={onboarding} 
                    clinic={clinic}
                    admin={adminUser}
                    onSubmitted={(updatedOnb, updatedClinic) => {
                      setOnboarding(updatedOnb);
                      setClinic(updatedClinic);
                      showToast("Your clinic onboarding profile has been submitted for Admin Review!");
                    }}
                    onPrev={() => setOnboarding({ ...onboarding, currentStep: 5 })}
                  />
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: STEP 1 - PROFILE SETUP
   ========================================== */
function StepProfileSetup({ clinicId, clinic, onboarding, onSave }: { clinicId: string, clinic: any, onboarding: any, onSave: (onb: any) => void }) {
  const [displayName, setDisplayName] = useState(onboarding?.profileDetails?.clinicDisplayName || clinic?.name || '');
  const [desc, setDesc] = useState(onboarding?.profileDetails?.description || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(onboarding?.profileDetails?.whatsAppNumber || '');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(onboarding?.profileDetails?.languages || []);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(onboarding?.profileDetails?.specialties || []);
  const [selectedFacs, setSelectedFacs] = useState<string[]>(onboarding?.profileDetails?.facilities || []);
  const [logoUrl, setLogoUrl] = useState(onboarding?.profileDetails?.logoUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop');
  const [clinicImages, setClinicImages] = useState<string[]>(onboarding?.profileDetails?.clinicImages || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Drag and Drop States
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverImages, setDragOverImages] = useState(false);

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const toggleSpec = (spec: string) => {
    setSelectedSpecs(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
  };

  const toggleFac = (fac: string) => {
    setSelectedFacs(prev => prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]);
  };

  const fillProfileDemoData = () => {
    setDisplayName(clinic?.name || "Elite Dental Care");
    setDesc("Elite Dental Care Da Nang is a state-of-the-art dental clinic providing world-class implants, veneers, and orthodontics to international dental tourists. Our clinical team is fully bilingual (English & Vietnamese), using advanced 3D CT scan technology and top-grade materials imported from Switzerland and Germany.");
    setWhatsAppNumber("+84905987654");
    setSelectedLangs(["Vietnamese", "English", "Korean"]);
    setSelectedSpecs(["Restorative", "Prosthodontics", "Implants", "Orthodontics"]);
    setSelectedFacs(["3D CT Scanner", "English Speaking Staff", "Korean Speaking Staff", "Private Treatment Rooms", "Free WiFi & Coffee Bar"]);
    setLogoUrl("https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop");
    setClinicImages([
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=600&fit=crop"
    ]);
    setSuccess("Successfully populated clinic profile with premium demo details!");
  };

  // Helper file validator (AC 6)
  const validateAndReadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate File Type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error(`Invalid file type "${file.type}". Supported types: JPEG, PNG, WEBP, GIF.`));
        return;
      }

      // Validate File Size (Limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        reject(new Error(`File size "${(file.size / (1024 * 1024)).toFixed(2)} MB" exceeds the 5MB maximum limit.`));
        return;
      }

      // Read File
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to parse file data. Please try again.'));
        }
      };
      reader.onerror = () => {
        reject(new Error('File upload read failed.'));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handlers for Logo Upload
  const handleLogoUpload = async (file: File) => {
    setError(null);
    setSuccess(null);
    try {
      const dataUri = await validateAndReadFile(file);
      setLogoUrl(dataUri);
      setSuccess("Clinic logo uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload logo.");
    }
  };

  // Handlers for Clinic Gallery Images Upload
  const handleImagesUpload = async (files: FileList) => {
    setError(null);
    setSuccess(null);
    const newImages: string[] = [];
    let fileCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const dataUri = await validateAndReadFile(files[i]);
        newImages.push(dataUri);
        fileCount++;
      } catch (err: any) {
        setError(err.message || "One or more image files failed validation.");
      }
    }

    if (newImages.length > 0) {
      setClinicImages(prev => [...prev, ...newImages]);
      setSuccess(`Successfully uploaded ${fileCount} clinic display image(s)!`);
    }
  };

  const removeClinicImage = (index: number) => {
    setClinicImages(prev => prev.filter((_, idx) => idx !== index));
    setSuccess("Clinic image removed.");
  };

  // Save draft vs save & continue
  const handleSave = async (isDraft: boolean) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    // If saving & continuing (not draft), perform AC 4 required field validation
    if (!isDraft) {
      if (!displayName.trim()) {
        setError("Clinic Display Name is a required field.");
        setLoading(false);
        return;
      }
      if (!desc.trim()) {
        setError("Clinic Description is a required field.");
        setLoading(false);
        return;
      }
      if (selectedLangs.length === 0) {
        setError("Please select at least one Supported Language.");
        setLoading(false);
        return;
      }
      if (selectedSpecs.length === 0) {
        setError("Please select at least one Key Service / Specialty.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      isDraft,
      clinicDisplayName: displayName.trim(),
      description: desc.trim(),
      whatsAppNumber: whatsAppNumber.trim(),
      languages: selectedLangs,
      specialties: selectedSpecs,
      facilities: selectedFacs,
      logoUrl,
      clinicImages
    };

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1, data: payload })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save profile details.");
      
      if (isDraft) {
        setSuccess("Clinic profile draft saved successfully! The onboarding status remains in progress, and you can continue editing at any time.");
        onSave(result.onboarding);
      } else {
        onSave(result.onboarding);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans" id="step-profile-setup-container">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Clinic Profile Setup</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Configure your branding, facilities, and languages</p>
        </div>
        <button
          type="button"
          onClick={fillProfileDemoData}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
          id="btn-fill-profile-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Điền thông tin mẫu (Demo Fill)
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 animate-fade-in" id="profile-error-alert">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase text-red-800">Profile Setup Warning</h4>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2 animate-fade-in" id="profile-success-alert">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700">{success}</p>
        </div>
      )}

      {/* AC 1: Base Clinic Record Display (Read-only) */}
      <div className="bg-amber-50/20 border border-amber-100/30 rounded-2xl p-5 space-y-3" id="base-clinic-record-panel">
        <h3 className="text-xs font-black uppercase tracking-widest text-amber-800 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-amber-500" /> Clinic Registration Records (Read-Only)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Registered Legal Name</span>
            <span className="font-bold text-gray-800">{clinic?.name}</span>
          </div>
          <div>
            <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Contact Person</span>
            <span className="font-bold text-gray-800">{clinic?.contactPerson}</span>
          </div>
          <div>
            <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Official Email</span>
            <span className="font-bold text-gray-800">{clinic?.contactEmail}</span>
          </div>
          <div>
            <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Registration Phone</span>
            <span className="font-bold text-gray-800">{clinic?.contactPhone}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Accredited Base Address</span>
            <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {clinic?.primaryBranchAddress || "Viet Nam Branch Office"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* PUBLIC PROFILE INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Clinic Display Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Display Name *</label>
            <div className="relative">
              <Building className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                placeholder="Clinic name shown to public patients"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                id="input-displayname"
              />
            </div>
          </div>

          {/* WhatsApp number */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="e.g., +84 901 234 567"
                value={whatsAppNumber}
                onChange={e => setWhatsAppNumber(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                id="input-whatsapp"
              />
            </div>
          </div>
        </div>

        {/* Clinic Description */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Description *</label>
          <textarea 
            required
            rows={4}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Introduce your dental clinic, specialties, diagnostics, doctor credentials, and medical philosophy..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-medium text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
            id="input-description-textarea"
          />
        </div>

        {/* Key Services / Specialties (AC 4) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Services / Specialties *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {POPULAR_SPECIALTIES.filter(spec => spec !== 'General').map(spec => {
              const isSelected = selectedSpecs.includes(spec);
              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => toggleSpec(spec)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                  }`}
                  id={`btn-spec-${spec.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supported Languages (AC 4) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Supported Languages *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {POPULAR_LANGUAGES.map(lang => {
              const isSelected = selectedLangs.includes(lang);
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => toggleLang(lang)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                  }`}
                  id={`btn-lang-${lang.toLowerCase()}`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* BRAND LOGO UPLOADER (AC 6: Drag-and-drop & File check) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic Logo (Optional)</label>
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative group shrink-0">
              <img 
                src={logoUrl} 
                alt="Clinic Logo Preview" 
                className="w-20 h-20 rounded-2xl border border-gray-200 object-cover bg-white shadow-sm"
                onError={() => setLogoUrl('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop')}
              />
              <button 
                type="button"
                onClick={() => setLogoUrl('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop')}
                className="absolute -top-1.5 -right-1.5 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Reset to Placeholder Logo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOverLogo(true); }}
              onDragLeave={() => setDragOverLogo(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverLogo(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleLogoUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => document.getElementById('logo-file-input')?.click()}
              className={`flex-1 w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragOverLogo 
                  ? 'border-amber-500 bg-amber-50/30' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              id="logo-drag-drop-zone"
            >
              <input 
                type="file"
                id="logo-file-input"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLogoUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Drag & drop clinic logo here or <span className="text-amber-500 hover:underline">browse files</span></p>
              <p className="text-[10px] text-gray-400 mt-1">Supports JPEG, PNG, WEBP, GIF. Max file size: 5MB.</p>
            </div>
          </div>
        </div>

        {/* CLINIC DISPLAY IMAGES GALLERY UPLOADER (AC 2, AC 6: Multi drag-and-drop & validate) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic Gallery Images (Optional)</label>
          
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragOverImages(true); }}
            onDragLeave={() => setDragOverImages(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverImages(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleImagesUpload(e.dataTransfer.files);
              }
            }}
            onClick={() => document.getElementById('gallery-file-input')?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              dragOverImages 
                ? 'border-amber-500 bg-amber-50/30' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            id="gallery-drag-drop-zone"
          >
            <input 
              type="file"
              id="gallery-file-input"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImagesUpload(e.target.files);
                }
              }}
            />
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-700">Drag & drop multiple clinic images here or <span className="text-amber-500 hover:underline">browse files</span></p>
            <p className="text-[10px] text-gray-400 mt-1">Supports JPEG, PNG, WEBP, GIF. Max file size: 5MB per image.</p>
          </div>

          {/* Image Previews */}
          {clinicImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl mt-4">
              {clinicImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-video">
                  <img src={img} alt={`Clinic upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeClinicImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    title="Delete Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 bg-gray-900/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                    Image {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Action Buttons (Drafting and Step Continuation - AC 3 & AC 7) */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={loading}
          className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 cursor-pointer disabled:opacity-50"
          id="btn-save-draft"
        >
          {loading ? 'Processing...' : 'Save as Draft'}
        </button>

        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={loading}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 cursor-pointer"
          id="btn-save-profile"
        >
          {loading ? 'Saving Profile...' : 'Save & Continue to Services'}
        </button>
      </div>

    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: STEP 2 - SERVICES SETUP
   ========================================== */
function StepServicesSetup({ clinicId, onboarding, onSave, onPrev }: { clinicId: string, onboarding: any, onSave: (onb: any) => void, onPrev: () => void }) {
  const [services, setServices] = useState<any[]>(() => {
    let saved = onboarding?.services || [];
    if (saved.length > 0) {
      // Find all standard services and load them
      const initialServices = STANDARD_SERVICES.map(std => {
        const savedItem = saved.find((s: any) => 
          s.serviceId === std.id || 
          (s.serviceName === std.name && s.category === std.category)
        );
        return {
          serviceId: std.id,
          category: std.category,
          serviceName: std.name,
          priceRange: std.range,
          customPrice: savedItem ? (savedItem.customPrice !== undefined ? savedItem.customPrice : (savedItem.price || std.defaultPrice)) : std.defaultPrice,
          treatmentUnit: savedItem?.treatmentUnit || std.treatmentUnit,
          customUnitName: savedItem?.customUnitName || '',
          priceUnit: savedItem?.priceUnit || std.priceUnit,
          currency: savedItem?.currency || std.currency,
          enabled: savedItem ? (savedItem.enabled !== undefined ? savedItem.enabled : true) : (std.id === 'gen-1' || std.id === 'gen-2' || std.id === 'gen-4' || std.id === 'std-others'), // default popular ones on
          isDetail: false
        };
      });

      // Also map saved custom / detailed services
      const savedDetails = saved.filter((s: any) => s.isDetail || s.parentServiceId || !STANDARD_SERVICES.some(std => std.id === s.serviceId || (std.name === s.serviceName && std.category === s.category)))
        .map((s: any) => ({
          serviceId: s.serviceId || `S-DETAIL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          parentServiceId: s.parentServiceId,
          category: s.category || 'General',
          serviceName: s.serviceName,
          customPrice: s.customPrice !== undefined ? s.customPrice : (s.price || 0),
          treatmentUnit: s.treatmentUnit || 'Tooth',
          customUnitName: s.customUnitName || '',
          priceUnit: s.priceUnit || 'per Tooth',
          currency: s.currency || 'USD',
          enabled: s.enabled !== undefined ? s.enabled : true,
          isDetail: s.isDetail !== undefined ? s.isDetail : (s.parentServiceId ? true : false)
        }));

      return [...initialServices, ...savedDetails];
    }

    // Default configuration for new clinics:
    return STANDARD_SERVICES.map(s => ({
      serviceId: s.id,
      category: s.category,
      serviceName: s.name,
      priceRange: s.range,
      customPrice: s.defaultPrice,
      treatmentUnit: s.treatmentUnit,
      customUnitName: '',
      priceUnit: s.priceUnit,
      currency: s.currency,
      enabled: s.id === 'gen-1' || s.id === 'gen-2' || s.id === 'gen-4' || s.id === 'std-others', // Enable Cleaning, Teeth Whitening, Dental Implant in General by default
      isDetail: false
    }));
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Expanded row tracking for editing inline (kept for custom services or editing)
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Nested sub-service / detailed service form state
  const [detailFormServiceId, setDetailFormServiceId] = useState<string | null>(null);
  const [detailName, setDetailName] = useState('');
  const [detailPrice, setDetailPrice] = useState<number | ''>('');
  const [detailCurrency, setDetailCurrency] = useState('USD');
  const [detailUnit, setDetailUnit] = useState('Session');
  const [detailCustomUnitName, setDetailCustomUnitName] = useState('');

  const fillServicesDemoData = () => {
    // Enable only gen-1 (Cleaning), gen-2 (Teeth Whitening), gen-4 (Dental Implant)
    const customId1 = `S-DETAIL-DEMO1-${Date.now()}`;
    const customId2 = `S-DETAIL-DEMO2-${Date.now()}`;
    const customId3 = `S-DETAIL-DEMO3-${Date.now()}`;

    const demoServices = STANDARD_SERVICES.map(std => {
      const isDemoEnabled = std.id === 'gen-1' || std.id === 'gen-2' || std.id === 'gen-4' || std.id === 'std-others';
      return {
        serviceId: std.id,
        category: std.category,
        serviceName: std.name,
        priceRange: std.range,
        customPrice: std.defaultPrice,
        treatmentUnit: std.treatmentUnit,
        customUnitName: '',
        priceUnit: std.priceUnit,
        currency: std.currency,
        enabled: isDemoEnabled,
        isDetail: false
      };
    });

    const demoDetails = [
      {
        serviceId: customId1,
        parentServiceId: 'gen-1',
        category: 'General',
        serviceName: 'Ultrasonic Scaling & Air Polish',
        customPrice: 55,
        treatmentUnit: 'Session',
        customUnitName: '',
        priceUnit: 'per Session',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: customId2,
        parentServiceId: 'gen-2',
        category: 'General',
        serviceName: 'In-office Laser Whitening (Zoom II)',
        customPrice: 180,
        treatmentUnit: 'Session',
        customUnitName: '',
        priceUnit: 'per Session',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: customId3,
        parentServiceId: 'gen-4',
        category: 'General',
        serviceName: 'Premium Straumann Implant Restoration',
        customPrice: 1450,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      }
    ];

    setServices([...demoServices, ...demoDetails]);
    setSuccess("Successfully loaded standard services with fully filled-out specific treatments!");
  };

  // Handle service field changes for existing services
  const updateServiceField = (idx: number, field: string, val: any) => {
    setServices(prev => {
      const copy = [...prev];
      const updatedItem = { ...copy[idx], [field]: val };

      if (field === 'treatmentUnit') {
        if (val === 'Custom Unit') {
          updatedItem.priceUnit = updatedItem.customUnitName ? `per ${updatedItem.customUnitName}` : 'per Custom Unit';
        } else {
          updatedItem.priceUnit = `per ${val}`;
        }
      } else if (field === 'customUnitName' && updatedItem.treatmentUnit === 'Custom Unit') {
        updatedItem.priceUnit = val ? `per ${val}` : 'per Custom Unit';
      }

      copy[idx] = updatedItem;
      return copy;
    });
  };

  const toggleService = (idx: number) => {
    const service = services[idx];
    const willBeEnabled = !service.enabled;

    setServices(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], enabled: willBeEnabled };
      return copy;
    });

    if (willBeEnabled) {
      // Find if this service already has any nested specific treatments
      const nestedDetails = services.filter(d => d.parentServiceId === service.serviceId && d.isDetail);
      if (nestedDetails.length === 0) {
        // Auto-open specific treatment form directly under the selected service
        setDetailFormServiceId(service.serviceId);
        setDetailName('');
        setDetailPrice('');
      }
    } else {
      if (detailFormServiceId === service.serviceId) {
        setDetailFormServiceId(null);
      }
    }
  };

  const deleteService = (idx: number) => {
    setServices(prev => prev.filter((_, i) => i !== idx));
    setSuccess("Service treatment removed successfully!");
  };

  // Add specific sub-service
  const handleAddDetailService = (parentId: string, parentCategory: string) => {
    setError(null);
    setSuccess(null);

    if (!detailName.trim()) {
      setError("Please enter a Specific Treatment name.");
      return;
    }

    if (detailPrice === '' || detailPrice === undefined || detailPrice === null) {
      setError("Please enter a price for the specific treatment.");
      return;
    }

    const priceVal = Number(detailPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      setError("Please enter a valid non-negative price.");
      return;
    }

    if (detailUnit === 'Custom Unit' && !detailCustomUnitName.trim()) {
      setError("Please specify a unit name for the Custom Unit.");
      return;
    }

    const customId = `S-DETAIL-${Date.now()}`;
    const newDetail = {
      serviceId: customId,
      parentServiceId: parentId,
      category: parentCategory,
      serviceName: detailName.trim(),
      customPrice: priceVal,
      treatmentUnit: detailUnit,
      customUnitName: detailUnit === 'Custom Unit' ? detailCustomUnitName.trim() : '',
      priceUnit: detailUnit === 'Custom Unit' ? `per ${detailCustomUnitName.trim()}` : `per ${detailUnit}`,
      currency: 'USD',
      enabled: true,
      isDetail: true
    };

    setServices(prev => [...prev, newDetail]);
    
    // Reset form
    setDetailFormServiceId(null);
    setDetailName('');
    setDetailPrice('');
    setSuccess(`Successfully added specific treatment "${newDetail.serviceName}"!`);
  };

  // Submit/Save Onboarding Step (AC 4, AC 5, AC 6, AC 7)
  const handleSaveStep = async (isDraft: boolean) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const activeServices = services.filter(s => s.enabled);

    // If saving and continuing (not draft), perform validations
    if (!isDraft) {
      if (activeServices.filter(s => !s.isDetail).length === 0) {
        setError("Please select/enable at least one dental service offered by your clinic before continuing.");
        setLoading(false);
        return;
      }

      // Validate every active service
      for (const s of activeServices) {
        if (!s.isDetail) {
          // Parent service validation
          if (!s.category) {
            setError(`Service Category is missing for "${s.serviceName}".`);
            setLoading(false);
            return;
          }
          if (!s.serviceName?.trim()) {
            setError("Service Name cannot be blank.");
            setLoading(false);
            return;
          }

          // Mandatory specific treatment check (khi đã tích vào các ô tích của các service, bắt buộc nhập specific treatment)
          const nestedDetailsForParent = services.filter(d => d.isDetail && d.parentServiceId === s.serviceId);
          if (nestedDetailsForParent.length === 0) {
            setError(`Please add at least 1 specific treatment for "${s.serviceName}".`);
            setLoading(false);
            return;
          }
        } else {
          // Nested specific treatment validation
          if (!s.serviceName?.trim()) {
            setError("Specific Treatment Name cannot be blank.");
            setLoading(false);
            return;
          }
          if (!s.treatmentUnit) {
            setError(`Treatment Unit is missing for Specific Treatment "${s.serviceName}".`);
            setLoading(false);
            return;
          }
          if (s.treatmentUnit === 'Custom Unit' && !s.customUnitName?.trim()) {
            setError(`Custom unit name is required for Specific Treatment "${s.serviceName}".`);
            setLoading(false);
            return;
          }
          if (s.customPrice === undefined || s.customPrice === null || isNaN(Number(s.customPrice)) || s.customPrice === '') {
            setError(`Price for Specific Treatment "${s.serviceName}" must be a valid number.`);
            setLoading(false);
            return;
          }
          if (Number(s.customPrice) < 0) {
            setError(`Price for Specific Treatment "${s.serviceName}" cannot be negative.`);
            setLoading(false);
            return;
          }
          if (!s.currency) {
            setError(`Currency must be selected for Specific Treatment "${s.serviceName}".`);
            setLoading(false);
            return;
          }
          if (!s.priceUnit?.trim()) {
            setError(`Price Unit is missing for Specific Treatment "${s.serviceName}".`);
            setLoading(false);
            return;
          }

          // Price Unit relation check
          const expectedUnit = (s.treatmentUnit === 'Custom Unit' ? s.customUnitName : s.treatmentUnit).toLowerCase().trim();
          const actualPriceUnit = s.priceUnit.toLowerCase().trim();
          if (!actualPriceUnit.includes(expectedUnit) && !expectedUnit.includes(actualPriceUnit)) {
            setError(`Price Unit ("${s.priceUnit}") must match or clearly relate to the Treatment Unit ("${s.treatmentUnit === 'Custom Unit' ? s.customUnitName : s.treatmentUnit}") for Specific Treatment "${s.serviceName}".`);
            setLoading(false);
            return;
          }
        }
      }
    }

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: 2, 
          data: {
            isDraft,
            services: services.map(s => ({
              ...s,
              customPrice: s.customPrice !== '' ? Number(s.customPrice) : 0
            }))
          }
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save services.");
      
      if (isDraft) {
        setSuccess("Dental services and pricing saved as draft! Onboarding status remains in progress.");
        onSave(result.onboarding);
      } else {
        onSave(result.onboarding);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans" id="step-services-setup-container">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Dental Services & Pricing</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Configure your treatments and costs</p>
        </div>
        <button
          type="button"
          onClick={fillServicesDemoData}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
          id="btn-fill-services-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Điền thông tin mẫu (Demo Fill)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 animate-fade-in" id="services-error-alert">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase text-red-800">Services Setup Warning</h4>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2 animate-fade-in" id="services-success-alert">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700">{success}</p>
        </div>
      )}

      {/* SERVICE LIST GROUPED BY CATEGORY */}
      <div className="space-y-8">
        {POPULAR_SPECIALTIES.concat(['Other Specialty']).map(category => {
          // Find standard services for this category
          const categoryStandardServices = services.filter(s => s.category === category && !s.isDetail && !s.parentServiceId);
          
          if (categoryStandardServices.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left" id={`category-block-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              {/* Category Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800 tracking-widest">{category === 'Other Specialty' ? 'Others' : category} Dental Services</span>
                <span className="text-[10px] text-gray-400 font-bold">{categoryStandardServices.length} {category === 'Other Specialty' ? 'Custom' : 'Standard'} Services</span>
              </div>

              <div className="divide-y divide-gray-100">
                {categoryStandardServices.map(s => {
                  const sIdx = services.findIndex(item => item.serviceId === s.serviceId);
                  
                  // Get all nested sub-services for this standard service
                  const nestedDetails = services.filter(detail => detail.parentServiceId === s.serviceId && detail.isDetail);

                  return (
                    <div key={s.serviceId} className="p-5 space-y-4" id={`block-service-${s.serviceId}`}>
                      {/* Main Service Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2" id={`main-service-row-${s.serviceId}`}>
                        {/* Offered Toggle & Title */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox"
                              checked={s.enabled}
                              onChange={() => toggleService(sIdx)}
                              className="w-5 h-5 border-gray-200 text-amber-500 focus:ring-amber-500 rounded-lg cursor-pointer"
                              id={`checkbox-service-${s.serviceId}`}
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            <p className={`text-sm font-black tracking-tight ${s.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                              {s.serviceName}
                            </p>
                            <div className="flex items-center gap-2">
                              {s.priceRange && (
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">UCSmile Average: {s.priceRange}</span>
                              )}
                              {s.enabled && (
                                nestedDetails.length > 0 ? (
                                  <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase px-1 rounded border border-emerald-100">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-block bg-amber-50 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-100">
                                    Requires at least 1 specific treatment
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls: Add specific sub-service */}
                        {s.enabled ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setDetailFormServiceId(detailFormServiceId === s.serviceId ? null : s.serviceId);
                                setDetailName('');
                                setDetailPrice('');
                              }}
                              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                              id={`btn-specific-treatment-${s.serviceId}`}
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-500" /> Specific Treatment
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Not Offered</span>
                          </div>
                        )}
                      </div>

                      {/* Render nested Sub-services / Detailed Treatments */}
                      {s.enabled && nestedDetails.length > 0 && (
                        <div className="ml-8 pl-4 border-l-2 border-amber-200 space-y-2 text-left bg-gray-50/50 p-3 rounded-2xl">
                          <p className="text-[9px] font-black uppercase tracking-wider text-amber-800 mb-1">Specific treatments offered under {s.serviceName}:</p>
                          <div className="space-y-2">
                            {nestedDetails.map(detail => {
                              const dIdx = services.findIndex(item => item.serviceId === detail.serviceId);
                              return (
                                <div key={detail.serviceId} className="flex items-center justify-between gap-4 p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all text-xs" id={`detail-item-${detail.serviceId}`}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <div>
                                      <p className="font-extrabold text-gray-800 leading-none">{detail.serviceName}</p>
                                      <p className="text-[9px] text-gray-400 mt-0.5">Category: {detail.category}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    {/* Inline price edit for detailed treatment */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-bold text-gray-400">{detail.currency === 'VND' ? '₫' : '$'}</span>
                                      <input 
                                        type="number"
                                        min={0}
                                        value={detail.customPrice}
                                        onChange={e => updateServiceField(dIdx, 'customPrice', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-20 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 text-[11px] font-black text-gray-800 focus:outline-none"
                                      />
                                      <span className="text-[9px] text-gray-400 font-bold">/ {detail.treatmentUnit === 'Custom Unit' ? detail.customUnitName : detail.treatmentUnit}</span>
                                    </div>

                                    {/* Delete Detail Service */}
                                    <button
                                      type="button"
                                      onClick={() => deleteService(dIdx)}
                                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                                      title="Delete detailed treatment"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Detail form nested directly under the service */}
                      {s.enabled && detailFormServiceId === s.serviceId && (
                        <div className="ml-8 p-3 bg-amber-50/10 border border-amber-100 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-3 animate-fade-in text-left">
                          {/* Name input */}
                          <div className="flex-1 min-w-[150px]">
                            <input 
                              type="text" 
                              placeholder="e.g., Deep Cleaning" 
                              value={detailName}
                              onChange={e => setDetailName(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          {/* Price input (always USD) */}
                          <div className="w-24 shrink-0 flex items-center bg-white border border-gray-200 rounded-xl px-2.5">
                            <span className="text-xs font-bold text-gray-400 mr-1">$</span>
                            <input 
                              type="number" 
                              placeholder="0"
                              value={detailPrice}
                              onChange={e => setDetailPrice(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full bg-transparent py-2 text-xs font-black text-gray-800 focus:outline-none"
                            />
                          </div>

                          {/* Treatment unit */}
                          <div className="w-28 shrink-0">
                            <select 
                              value={detailUnit}
                              onChange={e => setDetailUnit(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 focus:outline-none"
                            >
                              <option value="Tooth">Tooth</option>
                              <option value="Arch">Arch</option>
                              <option value="Jaw">Jaw</option>
                              <option value="Session">Session</option>
                              <option value="Case">Case</option>
                              <option value="Visit">Visit</option>
                              <option value="Custom Unit">Custom Unit</option>
                            </select>
                          </div>

                          {/* Custom unit name (if active) */}
                          {detailUnit === 'Custom Unit' && (
                            <div className="w-24 shrink-0">
                              <input 
                                type="text" 
                                placeholder="Unit name" 
                                value={detailCustomUnitName}
                                onChange={e => setDetailCustomUnitName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          )}

                          {/* Action Buttons: Check / Tick (Submit) and Cancel */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button 
                              type="button" 
                              onClick={() => handleAddDetailService(s.serviceId, s.category)}
                              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm shadow-emerald-500/10"
                              title="Add specific treatment"
                            >
                              <Check className="w-4 h-4 font-black" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setDetailFormServiceId(null)} 
                              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer transition-all"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* SAVE & ACTION BUTTONS */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          id="btn-prev-to-profile"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSaveStep(true)}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 cursor-pointer disabled:opacity-50"
            id="btn-save-services-draft"
          >
            {loading ? 'Processing...' : 'Save as Draft'}
          </button>

          <button
            type="button"
            onClick={() => handleSaveStep(false)}
            disabled={loading}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 cursor-pointer"
            id="btn-save-services-continue"
          >
            {loading ? 'Saving...' : 'Save & Continue to Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}



/* ==========================================
   SUB-COMPONENT: STEP 3 - WORKING HOURS
   ========================================== */
function StepHoursSetup({ clinicId, onboarding, onSave, onPrev }: { clinicId: string, onboarding: any, onSave: (onb: any) => void, onPrev: () => void }) {
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [hours, setHours] = useState<Record<string, { open: string, close: string, isClosed: boolean }>>(() => {
    if (onboarding?.workingHours && Object.keys(onboarding.workingHours).length > 0) {
      return onboarding.workingHours;
    }
    // Default standard operating hours
    const defaultHours: Record<string, { open: string, close: string, isClosed: boolean }> = {};
    DAYS_OF_WEEK.forEach(day => {
      const isWeekend = day === 'Saturday' || day === 'Sunday';
      defaultHours[day] = {
        open: '08:30',
        close: isWeekend && day === 'Saturday' ? '12:00' : '18:00',
        isClosed: day === 'Sunday' // Closed on Sunday by default
      };
    });
    return defaultHours;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHours = (day: string, field: 'open' | 'close', val: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: val }
    }));
  };

  const toggleClosed = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isClosed: !prev[day].isClosed }
    }));
  };

  const fillHoursDemoData = () => {
    const demoHours: Record<string, { open: string, close: string, isClosed: boolean }> = {};
    DAYS_OF_WEEK.forEach(day => {
      const isWeekend = day === 'Saturday' || day === 'Sunday';
      demoHours[day] = {
        open: '08:30',
        close: isWeekend && day === 'Saturday' ? '12:00' : '18:00',
        isClosed: day === 'Sunday'
      };
    });
    setHours(demoHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 3, data: hours })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save working hours.");
      onSave(result.onboarding);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Working Hours Setup</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Configure opening schedules</p>
        </div>
        <button
          type="button"
          onClick={fillHoursDemoData}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
          id="btn-fill-hours-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Điền thông tin mẫu (Demo Fill)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Weekday Scheduler Panel */}
      <div className="space-y-3">
        {DAYS_OF_WEEK.map(day => {
          const cfg = hours[day] || { open: '08:30', close: '18:00', isClosed: false };
          return (
            <div 
              key={day} 
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                cfg.isClosed 
                  ? 'bg-red-50/20 border-red-100/50' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
              id={`row-hour-${day}`}
            >
              {/* Day Label */}
              <div className="flex items-center gap-3 w-40">
                <Calendar className={`w-4 h-4 ${cfg.isClosed ? 'text-red-400' : 'text-amber-500'}`} />
                <span className={`text-xs font-black uppercase tracking-wider ${cfg.isClosed ? 'text-red-800' : 'text-gray-800'}`}>
                  {day}
                </span>
              </div>

              {/* Opening & Closing Selectors */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="time"
                    disabled={cfg.isClosed}
                    value={cfg.open}
                    onChange={e => updateHours(day, 'open', e.target.value)}
                    className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400 focus:bg-white transition-all ${
                      cfg.isClosed 
                        ? 'bg-gray-100 border-gray-100 text-gray-300 pointer-events-none' 
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                    id={`input-open-${day}`}
                  />
                </div>
                <span className={`text-xs font-bold ${cfg.isClosed ? 'text-gray-300' : 'text-gray-400'}`}>to</span>
                <div className="relative">
                  <input 
                    type="time"
                    disabled={cfg.isClosed}
                    value={cfg.close}
                    onChange={e => updateHours(day, 'close', e.target.value)}
                    className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400 focus:bg-white transition-all ${
                      cfg.isClosed 
                        ? 'bg-gray-100 border-gray-100 text-gray-300 pointer-events-none' 
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                    id={`input-close-${day}`}
                  />
                </div>
              </div>

              {/* Close day toggle */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={cfg.isClosed}
                  onChange={() => toggleClosed(day)}
                  className="w-4.5 h-4.5 text-red-500 border-gray-200 focus:ring-red-500 rounded cursor-pointer"
                  id={`checkbox-closed-${day}`}
                />
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" htmlFor={`checkbox-closed-${day}`}>
                  Closed on this day
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-1.5 cursor-pointer"
          id="btn-prev-to-services"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 cursor-pointer"
          id="btn-save-hours"
        >
          {loading ? 'Saving Hours...' : 'Save & Continue to Agreement'}
        </button>
      </div>

    </form>
  );
}



/* ==========================================
   SUB-COMPONENT: STEP 4 - ADDITIONAL CLINIC INFO
   ========================================== */
function StepAdditionalInfo({ 
  clinicId, 
  clinic, 
  onboarding, 
  onSave, 
  onPrev 
}: { 
  clinicId: string, 
  clinic: any, 
  onboarding: any, 
  onSave: (onb: any) => void, 
  onPrev: () => void 
}) {
  // Pre-set standard avatars
  const PRESET_AVATARS = [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
  ];

  // Primary branch info fallback from registration
  const primaryBranch = {
    branchName: clinic?.name || "Primary Branch",
    city: "Da Nang",
    address: clinic?.contactAddress || "Primary Address",
    contactPhone: clinic?.contactPhone || "",
    isPrimary: true
  };

  // 1. Core States
  const [branches, setBranches] = useState<any[]>(() => {
    if (onboarding?.additionalInfo?.branches && onboarding.additionalInfo.branches.length > 0) {
      return onboarding.additionalInfo.branches;
    }
    return [primaryBranch];
  });

  const [dentists, setDentists] = useState<any[]>(() => {
    return onboarding?.additionalInfo?.dentists || [];
  });

  const [documents, setDocuments] = useState<any[]>(() => {
    return onboarding?.additionalInfo?.documents || [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 2. Branch Form States
  const [bName, setBName] = useState('');
  const [bCity, setBCity] = useState('Da Nang');
  const [bAddress, setBAddress] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [showAddBranch, setShowAddBranch] = useState(false);

  // 3. Dentist Form States
  const [dName, setDName] = useState('');
  const [dPos, setDPos] = useState('Head Dentist');
  const [dSpec, setDSpec] = useState('Implants & Oral Surgery');
  const [dExp, setDExp] = useState('10 years');
  const [dLangs, setDLangs] = useState('Vietnamese, English');
  const [dPhoto, setDPhoto] = useState(PRESET_AVATARS[0]);
  const [dBio, setDBio] = useState('');
  const [showAddDentist, setShowAddDentist] = useState(false);

  // 4. Document Form States
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Clinic License');
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [dragOverDoc, setDragOverDoc] = useState(false);

  // Auto-fill Step 4 Demo Data (AC 5 / AC 7)
  const fillAdditionalDemoData = () => {
    setError(null);
    setSuccess(null);

    // Primary branch remains
    const demoBranches = [
      primaryBranch,
      {
        branchName: `${clinic?.name || "Elite Dental"} - Son Tra Beach Branch`,
        city: "Da Nang",
        address: "24 Vo Nguyen Giap, Son Tra District, Da Nang",
        contactPhone: "+84905888123",
        isPrimary: false
      }
    ];

    const demoDentists = [
      {
        id: `DENT-${Date.now()}-1`,
        name: "Dr. Minh Nguyen",
        position: "Head Specialist",
        specialization: "Implants & Oral Surgery",
        experience: "15 years",
        languages: "Vietnamese, English",
        photo: PRESET_AVATARS[0],
        bio: "Dr. Minh Nguyen is a board-certified implantologist with over 1,500 successful implant cases. He obtained his specialization in Switzerland and loves dental tourism."
      },
      {
        id: `DENT-${Date.now()}-2`,
        name: "Dr. Sophia Le",
        position: "Senior Aesthetic Dentist",
        specialization: "Cosmetic Dentistry & Orthodontics",
        experience: "8 years",
        languages: "Vietnamese, English, Korean",
        photo: PRESET_AVATARS[1],
        bio: "Dr. Sophia is passionate about creating natural-looking smiles. She is certified in Invisalign and advanced veneer bonding techniques."
      }
    ];

    const demoDocs = [
      {
        name: "Official Medical Clinic License - Da Nang Dept of Health.pdf",
        type: "Clinic License",
        url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200",
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        fileSize: "2.4 MB"
      },
      {
        name: "ISO-9001-Clinical-Sterilization-Accreditation.pdf",
        type: "Dentist Certificates",
        url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200",
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        fileSize: "1.8 MB"
      },
      {
        name: "International Patient Ward Gallery.jpg",
        type: "Clinic Images",
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300",
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        fileSize: "3.1 MB"
      }
    ];

    setBranches(demoBranches);
    setDentists(demoDentists);
    setDocuments(demoDocs);
    setSuccess("Successfully populated Step 4 with premium clinic branches, specialist dentists, and accreditation documents!");
  };

  // Branch operations
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim() || !bAddress.trim()) {
      setError("Branch Name and Address are required.");
      return;
    }
    const newB = {
      branchName: bName.trim(),
      city: bCity,
      address: bAddress.trim(),
      contactPhone: bPhone.trim() || undefined,
      isPrimary: false
    };
    setBranches(prev => [...prev, newB]);
    setBName('');
    setBAddress('');
    setBPhone('');
    setShowAddBranch(false);
    setSuccess(`Branch "${newB.branchName}" added successfully.`);
  };

  const removeBranch = (idx: number) => {
    if (branches[idx].isPrimary) {
      setError("Cannot remove the primary registration branch.");
      return;
    }
    const target = branches[idx].branchName;
    setBranches(prev => prev.filter((_, i) => i !== idx));
    setSuccess(`Branch "${target}" removed.`);
  };

  // Dentist operations
  const handleAddDentist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dName.trim()) {
      setError("Dentist Name is required.");
      return;
    }
    const newD = {
      id: `DENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: dName.trim(),
      position: dPos,
      specialization: dSpec.trim(),
      experience: dExp.trim() || undefined,
      languages: dLangs.trim() || "Vietnamese, English",
      photo: dPhoto,
      bio: dBio.trim() || undefined
    };
    setDentists(prev => [...prev, newD]);
    setDName('');
    setDBio('');
    setShowAddDentist(false);
    setSuccess(`Dentist profile for "${newD.name}" added successfully.`);
  };

  const removeDentist = (id: string, name: string) => {
    setDentists(prev => prev.filter(d => d.id !== id));
    setSuccess(`Dentist profile for "${name}" removed.`);
  };

  // File validator & readers (AC 4)
  const validateAndReadFile = (file: File): Promise<{ dataUrl: string, name: string, sizeStr: string }> => {
    return new Promise((resolve, reject) => {
      // Allowed types including PDF and DOCX for documents
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
        'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
        reject(new Error(`Invalid file type. Supported: PDF, DOCX, JPEG, PNG, WEBP.`));
        return;
      }

      // Max 5MB
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error(`File size exceeds 5MB limit.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            dataUrl: reader.result,
            name: file.name,
            sizeStr: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          });
        } else {
          reject(new Error('Failed to parse file data.'));
        }
      };
      reader.onerror = () => reject(new Error('File upload read failed.'));
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentUpload = async (file: File) => {
    setError(null);
    setSuccess(null);
    try {
      const parsed = await validateAndReadFile(file);
      const newDoc = {
        name: docName.trim() ? `${docName.trim()} (${parsed.name})` : parsed.name,
        type: docType,
        url: parsed.dataUrl,
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        fileSize: parsed.sizeStr
      };
      setDocuments(prev => [...prev, newDoc]);
      setDocName('');
      setShowAddDoc(false);
      setSuccess(`Accreditation document "${newDoc.name}" uploaded and validated successfully!`);
    } catch (err: any) {
      setError(err.message || "File upload failed validation.");
    }
  };

  const removeDocument = (index: number) => {
    const target = documents[index].name;
    setDocuments(prev => prev.filter((_, idx) => idx !== index));
    setSuccess(`Document "${target}" removed.`);
  };

  // Submit and save (AC 5 / AC 8)
  const handleSaveStep = async (isSkip: boolean) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const payload = isSkip ? {
      branches: [primaryBranch],
      dentists: [],
      documents: []
    } : {
      branches,
      dentists,
      documents
    };

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 4, data: payload })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save additional clinic details.");
      onSave(result.onboarding);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Additional Clinic Information</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Provide branches, clinicians, and licenses</p>
        </div>
        <button
          type="button"
          onClick={fillAdditionalDemoData}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
          id="btn-fill-additional-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Điền thông tin mẫu (Demo Fill)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700 font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-800 font-bold">{success}</p>
        </div>
      )}

      {/* ================= SECTION 1: BRANCHES ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-serif">Clinic Branches</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBranch(!showAddBranch)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            {showAddBranch ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} Add Branch
          </button>
        </div>

        {/* Branch list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                b.isPrimary 
                  ? 'border-amber-200 bg-amber-50/10' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              {b.isPrimary && (
                <span className="absolute top-3 right-3 text-[8px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Primary Branch
                </span>
              )}
              <div className="space-y-1 pr-16 text-xs">
                <p className="font-extrabold text-gray-900 leading-tight">{b.branchName}</p>
                <p className="text-gray-500 font-medium">{b.address}, {b.city}</p>
                {b.contactPhone && (
                  <p className="text-gray-400 text-[10px] font-bold">📞 {b.contactPhone}</p>
                )}
              </div>
              {!b.isPrimary && (
                <button
                  type="button"
                  onClick={() => removeBranch(idx)}
                  className="absolute bottom-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  title="Remove Branch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add branch form */}
        {showAddBranch && (
          <form onSubmit={handleAddBranch} className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Branch Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. SmileCare Son Tra Clinic"
                value={bName}
                onChange={e => setBName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">City *</label>
              <select 
                value={bCity}
                onChange={e => setBCity(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 font-bold text-gray-800 focus:outline-none"
              >
                <option value="Da Nang">Da Nang</option>
                <option value="Ho Chi Minh">Ho Chi Minh</option>
                <option value="Ha Noi">Ha Noi</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Branch Contact Phone (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. +84905123456"
                value={bPhone}
                onChange={e => setBPhone(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Physical Address *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 152 Vo Nguyen Giap, Son Tra, Da Nang"
                value={bAddress}
                onChange={e => setBAddress(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddBranch(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer shadow-md shadow-amber-500/10"
              >
                Add Branch
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= SECTION 2: DENTIST INFORMATION ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-serif">Dental Clinicians & Specialists</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddDentist(!showAddDentist)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            {showAddDentist ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} Add Dentist
          </button>
        </div>

        {/* Dentist list */}
        {dentists.length === 0 ? (
          <div className="p-6 border border-dashed border-gray-100 rounded-xl text-center text-xs text-gray-400">
            No dentist profiles added yet. Click "Add Dentist" or "Điền thông tin mẫu" to populate!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dentists.map((d, idx) => (
              <div key={d.id || idx} className="p-4 rounded-xl border border-gray-100 bg-white flex gap-4 relative">
                <img 
                  src={d.photo} 
                  alt={d.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-50 shadow-sm shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-gray-900 leading-tight">{d.name}</p>
                  <p className="text-amber-700 font-bold text-[10px] uppercase tracking-wide">{d.position}</p>
                  <p className="text-gray-500 font-medium">Specialty: {d.specialization}</p>
                  {d.experience && (
                    <p className="text-gray-400 font-medium text-[10px]">Experience: {d.experience}</p>
                  )}
                  <p className="text-gray-400 font-medium text-[10px]">Languages: {d.languages}</p>
                  {d.bio && (
                    <p className="text-gray-500 mt-2 italic text-[10px] leading-relaxed border-t border-gray-50 pt-1.5">{d.bio}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeDentist(d.id, d.name)}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  title="Remove Dentist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add dentist form */}
        {showAddDentist && (
          <form onSubmit={handleAddDentist} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-fade-in text-xs">
            <h4 className="font-bold text-gray-800 font-serif text-xs">Add New Dentist Profile</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Dentist Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Anh Tran"
                  value={dName}
                  onChange={e => setDName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Position / Title *</label>
                <select 
                  value={dPos}
                  onChange={e => setDPos(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 font-bold text-gray-800 focus:outline-none"
                >
                  <option value="Head Dentist">Head Dentist</option>
                  <option value="Senior Specialist">Senior Specialist</option>
                  <option value="Resident Doctor">Resident Doctor</option>
                  <option value="Associate Clinician">Associate Clinician</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Specialization *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Orthodontist / Invisalign"
                  value={dSpec}
                  onChange={e => setDSpec(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Years of Experience (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12 years"
                  value={dExp}
                  onChange={e => setDExp(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Languages Spoken *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vietnamese, English"
                  value={dLangs}
                  onChange={e => setDLangs(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Select Profile Photo Avatar</label>
                <div className="flex items-center gap-2 pt-1.5">
                  {PRESET_AVATARS.map((av, index) => (
                    <img 
                      key={index}
                      src={av}
                      alt="Preset avatar"
                      onClick={() => setDPhoto(av)}
                      className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-105 ${
                        dPhoto === av ? 'border-amber-500 scale-110 shadow' : 'border-transparent opacity-70'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Bio / Introduction (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Write a brief professional summary for the clinician..."
                  value={dBio}
                  onChange={e => setDBio(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddDentist(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer shadow-md shadow-amber-500/10"
              >
                Add Dentist
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= SECTION 3: ACCREDITATION DOCUMENTS ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-serif">Supporting Accreditation Documents</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddDoc(!showAddDoc)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            {showAddDoc ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} Upload Document
          </button>
        </div>

        {/* Document list */}
        {documents.length === 0 ? (
          <div className="p-6 border border-dashed border-gray-100 rounded-xl text-center text-xs text-gray-400">
            No files or certifications uploaded yet. Click "Upload Document" or "Điền thông tin mẫu" to populate files!
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs text-gray-700 divide-y divide-gray-100">
              <thead className="bg-gray-50 text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                <tr>
                  <th className="p-3">Document Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 hidden sm:table-cell">Uploaded Date</th>
                  <th className="p-3 text-right">Size / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-extrabold text-gray-900 truncate max-w-xs sm:max-w-md">
                      📄 {doc.name}
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-50 text-amber-800 border border-amber-100/50 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-gray-400">{doc.uploadedAt}</td>
                    <td className="p-3 text-right font-bold text-gray-400 flex items-center justify-end gap-3">
                      <span>{doc.fileSize}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add document form */}
        {showAddDoc && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">Document Label / Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Official Clinic License"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">Certification Type *</label>
                <select 
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 font-bold text-gray-800 focus:outline-none"
                >
                  <option value="Clinic License">Clinic License</option>
                  <option value="Dentist Certificates">Dentist Certificate</option>
                  <option value="Clinic Images">Clinic Display Image</option>
                  <option value="Treatment Result Images">Treatment Result Image</option>
                  <option value="Warranty Policy Document">Warranty Policy Document</option>
                  <option value="Other Documents">Other Related Documents</option>
                </select>
              </div>
            </div>

            {/* Drag and Drop Uploader */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOverDoc(true); }}
              onDragLeave={() => setDragOverDoc(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDoc(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleDocumentUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragOverDoc ? 'border-amber-500 bg-amber-50/20' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input 
                type="file" 
                id="doc-file-upload-input" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleDocumentUpload(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="doc-file-upload-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-gray-400 mx-auto animate-pulse" />
                <div className="text-gray-600 font-bold">
                  Drag and drop your file here, or <span className="text-amber-500 underline">browse</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Supports PDF, DOCX, JPG, PNG, WEBP files up to 5MB
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Action Buttons */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          id="btn-prev-to-hours"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schedule
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSaveStep(true)}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 cursor-pointer disabled:opacity-50"
            id="btn-skip-additional"
          >
            {loading ? 'Processing...' : 'Skip / Save as Draft'}
          </button>

          <button
            type="button"
            onClick={() => handleSaveStep(false)}
            disabled={loading}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 cursor-pointer"
            id="btn-save-additional"
          >
            {loading ? 'Saving...' : 'Save & Continue to Agreement'}
          </button>
        </div>
      </div>
    </div>
  );
}



/* ==========================================
   SUB-COMPONENT: STEP 5 - PARTNERSHIP AGREEMENT
   ========================================== */
function StepAgreementSetup({ clinicId, clinicName, adminName, onboarding, onSave, onPrev }: { clinicId: string, clinicName: string, adminName: string, onboarding: any, onSave: (onb: any) => void, onPrev: () => void }) {
  const [signature, setSignature] = useState(onboarding?.agreementDetails?.signedName || '');
  const [agreed, setAgreed] = useState(!!onboarding?.agreementCompleted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(!!onboarding?.agreementCompleted);

  const fillAgreementDemoData = () => {
    setAgreed(true);
    setSignature(adminName || "Nhung Phan");
    setHasScrolledToBottom(true);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const threshold = 15;
    const isBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;
    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    if (onboarding?.agreementCompleted) {
      setHasScrolledToBottom(true);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollHeight <= container.clientHeight) {
      setHasScrolledToBottom(true);
    }
  }, [onboarding?.agreementCompleted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!hasScrolledToBottom) {
      setError("Vui lòng cuộn xem hết toàn bộ văn bản hợp đồng trước khi thực hiện ký kết.");
      setLoading(false);
      return;
    }

    if (!agreed) {
      setError("Please check the box to declare you agree with the Partnership Terms of Service.");
      setLoading(false);
      return;
    }

    if (!signature.trim()) {
      setError("Please sign the agreement by typing your official full name.");
      setLoading(false);
      return;
    }

    const payload = {
      signedName: signature.trim(),
      signedAt: new Date().toISOString(),
      termsVersion: 'v1.4-partner-2026',
      agreementStatus: 'AGREEMENT_ACCEPTED',
      acceptedAt: new Date().toISOString(),
      ipAddress: '192.168.1.42', // Mock IP for client-side audit
      userAgent: navigator.userAgent
    };

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 5, data: payload })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to sign partnership agreement.");
      onSave(result.onboarding);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans text-left">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
            Step 5 of 6: Partnership Contract
          </span>
          <h2 className="font-serif text-xl font-bold text-gray-900 mt-2.5">Partnership Agreement</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Review and sign partnership terms</p>
        </div>
        <button
          type="button"
          onClick={fillAgreementDemoData}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
          id="btn-fill-agreement-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Điền thông tin mẫu (Demo Fill)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* FORMAL BILINGUAL PARTNERSHIP AGREEMENT (Scroll to Unlock) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-serif flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-500" /> Văn Bản Dự Thảo Thỏa Thuận Hợp Tác Khung (Bilingual)
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Vui lòng cuộn xuống cuối văn bản dưới đây để kích hoạt và mở khóa các ô chữ ký điện tử.</p>
          </div>
          <div>
            {hasScrolledToBottom ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-md text-[9px] border border-emerald-150 uppercase tracking-wider">
                <Check className="w-3 h-3" /> Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 font-extrabold rounded-md text-[9px] border border-amber-150 uppercase tracking-wider animate-pulse">
                Locked
              </span>
            )}
          </div>
        </div>

        {/* E-Document Formal Container with onScroll listener */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="bg-[#fdfdfd] border border-gray-200 rounded-3xl p-8 h-96 overflow-y-auto text-xs text-gray-700 leading-relaxed space-y-6 custom-scrollbar shadow-inner text-left font-sans relative border-t-8 border-t-amber-600/80"
        >
          {/* Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <h1 className="text-8xl font-black tracking-widest font-sans rotate-12">TRUST SHIELD</h1>
          </div>

          <div className="text-center space-y-1 border-b border-gray-100 pb-5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
            <p className="font-bold text-gray-700 text-[10px] tracking-wider">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-24 h-0.5 bg-amber-600/30 mx-auto mt-2"></div>
            
            <div className="pt-3">
              <h3 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">SOCIALIST REPUBLIC OF VIETNAM</h3>
              <p className="font-semibold text-gray-400 text-[9px] tracking-wider">Independence - Freedom - Happiness</p>
            </div>
          </div>

          <div className="text-center space-y-2 pt-2">
            <h4 className="font-serif font-black text-gray-900 text-sm uppercase">HỢP ĐỒNG HỢP TÁC KHUNG</h4>
            <p className="font-serif font-bold text-gray-400 text-[10px] uppercase -mt-1">FRAMEWORK BUSINESS COOPERATION AGREEMENT</p>
            <p className="italic text-[10px] text-gray-500 font-bold">(V/v: Cung cấp nền tảng kết nối và tư vấn du lịch nha khoa / Provision of Dental Tourism Platform & Consultation)</p>
            <p className="text-[9px] text-gray-400 font-mono font-medium">Ref No: ……../2026/BCC-UCT</p>
          </div>

          <div className="space-y-1 text-gray-500 italic text-[10px] border-l-2 border-amber-600/20 pl-4 py-1">
            <p>Căn cứ Bộ luật Dân sự số 91/2015/QH13 và Luật Thương mại số 36/2005/QH13 của Việt Nam;</p>
            <p>Pursuant to the Civil Code of Vietnam No. 91/2015/QH13 and Commercial Law No. 36/2005/QH13;</p>
            <p>Căn cứ nhu cầu và năng lực vận hành thực tế của cả hai bên / Based on the mutual demand and operational capabilities.</p>
          </div>

          <p className="font-medium text-gray-800">
            Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, thỏa thuận này được ký kết tại Đà Nẵng giữa:
          </p>

          {/* Party A Details */}
          <div className="bg-amber-50/20 border border-amber-100/40 rounded-2xl p-4 space-y-2">
            <h5 className="font-black text-amber-900 text-[11px] uppercase tracking-wider">BÊN A / PARTY A: CÔNG TY TNHH UCTALENT LABS</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-gray-600 text-[10px]">
              <p><strong className="text-gray-700">Mã số thuế / Tax Code:</strong> 0402238274</p>
              <p><strong className="text-gray-700">Văn phòng / Office:</strong> Software Park 2, Thuan Phuoc Ward, Da Nang City</p>
              <p className="sm:col-span-2"><strong className="text-gray-700">Người đại diện / Representative:</strong> Mr. Nguyen Ngoc Duong (Django) - Giám đốc / Managing Director</p>
              <p className="sm:col-span-2"><strong className="text-gray-700">Tài khoản thanh toán / Settlement Account:</strong> 888911 at Techcombank (CN Đà Nẵng).</p>
            </div>
          </div>

          {/* Party B Details */}
          <div className="bg-sky-50/20 border border-sky-100/40 rounded-2xl p-4 space-y-2">
            <h5 className="font-black text-sky-900 text-[11px] uppercase tracking-wider">BÊN B / PARTY B: {clinicName ? clinicName.toUpperCase() : "DUY TAM DENTAL CLINIC"}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-gray-600 text-[10px]">
              <p className="sm:col-span-2"><strong className="text-gray-700">Địa chỉ đăng ký / Registered Address:</strong> {onboarding?.profileDetails?.address || "140 Thong Nhat, Nha Trang, Khanh Hoa, Vietnam"}</p>
              <p><strong className="text-gray-700">Người đại diện / Representative:</strong> {adminName || "Đại diện lâm sàng"} - Giám Đốc</p>
              <p><strong className="text-gray-700">Mã số thuế / Tax Code:</strong> {onboarding?.profileDetails?.taxCode || "4201979449"}</p>
            </div>
          </div>

          <p className="font-bold text-gray-800">
            Hai bên thống nhất ký kết Hợp đồng khung với các điều khoản cụ thể dưới đây / Both parties hereby agree to the following terms and conditions:
          </p>

          {/* Terms Articles */}
          <div className="space-y-5 text-[11px]">
            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ MÔ HÌNH VẬN HÀNH / ARTICLE 1: SCOPE OF SERVICES</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Bên A cung cấp hạ tầng kết nối <strong>"Da Nang Trust Shield"</strong> để định tuyến du khách nha khoa quốc tế (Mỹ, Anh, Úc, Singapore) đến với dịch vụ của Bên B.</li>
                <li>Bên A vận hành hệ thống hỗ trợ <strong>AI Concierge</strong> (tư vấn 24/7) và Hồ sơ bệnh án số <strong>Digital Dental Passport</strong>.</li>
                <li>Bên B là đơn vị chuyên môn được cấp phép, chịu trách nhiệm hoàn toàn về chất lượng điều trị và chăm sóc y khoa.</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 2: CAM KẾT GIÁ VÀ BẢO VỆ KHÁCH HÀNG / ARTICLE 2: PRICE INTEGRITY</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Bên B cam kết giữ giá điều trị thực tế tại phòng khám khớp hoặc thấp hơn mức báo giá đã chốt trên nền tảng (ngoại trừ các phát sinh y khoa bắt buộc được xác nhận bằng văn bản).</li>
                <li>Nếu thu quá giá cam kết, Bên B có nghĩa vụ hoàn trả phần chênh lệch trực tiếp cho khách hàng hoặc đối soát giảm trừ vào kỳ thanh toán gần nhất với Bên A.</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 3: CHIẾT KHẤU DỊCH VỤ VÀ HOÀN CỌC / ARTICLE 3: PLATFORM COMMISSION</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Phí dịch vụ kết nối và giới thiệu tiêu chuẩn là <strong>25%</strong> tính trên tổng hóa đơn thanh toán cuối cùng của khách hàng.</li>
                <li>Tiền đặt cọc giữ chỗ (Trust Shield Deposit) từ 500.000 đến 3.000.000 VND khách hàng trả trước cho Bên A sẽ được khấu trừ thẳng vào hóa đơn thanh toán cuối của khách hàng tại phòng khám.</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 4: BẢO MẬT VÀ CHỐNG GIAO DỊCH NGOÀI / ARTICLE 4: ANTI-BYPASS</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Bên B có nghĩa vụ quét mã QR của khách hàng (Digital Trust Pass) ngay khi khách hàng đến check-in tại cơ sở điều trị để kích hoạt bảo hành quốc tế.</li>
                <li>Khách hàng tiếp cận thông qua nền tảng thuộc quyền sở hữu của Bên A, Bên B nghiêm cấm mọi hành vi giao dịch trực tiếp không qua hệ thống để tránh chi phí dịch vụ.</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 5: HỢP TÁC TRUYỀN THÔNG VÀ SẢN XUẤT MEDIA / ARTICLE 5: MEDIA PRODUCTION</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Trong 06 tháng đầu, Bên B cam kết phối hợp phân bổ ít nhất <strong>04 giờ mỗi tuần</strong> để đội ngũ truyền thông ghi hình thực tế và thực hiện phỏng vấn tiếng Anh với bác sĩ nhằm xây dựng "Trust Signals".</li>
                <li>Bên A nắm bản quyền sử dụng vĩnh viễn các tư liệu này trên các kênh truyền thông du lịch nha khoa quốc tế.</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs uppercase border-b border-gray-100 pb-1 mb-2">ĐIỀU 6: ĐIỀU KHOẢN CHUNG VÀ GIẢI QUYẾT TRANH CHẤP / ARTICLE 6: GENERAL PROVISIONS</h5>
              <ul className="list-decimal pl-4 space-y-1.5 text-gray-600">
                <li>Mọi sửa đổi, bổ sung hợp đồng khung này phải được thống nhất bằng văn bản chính thức dưới dạng phụ lục hợp đồng.</li>
                <li>Trường hợp phát sinh mâu thuẫn hoặc tranh chấp, hai bên ưu tiên thương lượng hòa giải trên tinh thần đồng kiến tạo hệ sinh thái du lịch nha khoa vững mạnh tại Đà Nẵng, Việt Nam.</li>
              </ul>
            </div>
          </div>

          <p className="text-center font-bold text-gray-800 border-t border-gray-100 pt-4 text-[10px]">
            Thỏa thuận được lập thành hai bản kỹ thuật số có giá trị pháp lý tương đương / Digitally executed in two copies of equal legal validity.
          </p>
        </div>

        {/* Scroll status hint under the document container */}
        <div className="flex justify-end pt-1">
          {hasScrolledToBottom ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[10px] border border-emerald-200 uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" /> Đã rà soát hết hợp đồng - Đã mở khóa ký điện tử
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 font-extrabold rounded-full text-[10px] border border-amber-200 uppercase tracking-wider animate-pulse">
              <HelpCircle className="w-3.5 h-3.5" /> Hãy cuộn xuống cuối bản hợp đồng trên để mở khóa ký kết
            </span>
          )}
        </div>
      </div>

      {/* Agreed checkbox */}
      <div className={`flex items-start gap-3 p-4 border rounded-2xl transition-all ${
        hasScrolledToBottom 
          ? 'bg-amber-500/5 border-amber-100/40 cursor-pointer' 
          : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed select-none'
      }`}>
        <input 
          type="checkbox"
          required
          disabled={!hasScrolledToBottom}
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
          className="w-5 h-5 text-amber-600 border-gray-200 focus:ring-amber-500 rounded mt-0.5 cursor-pointer accent-amber-600 disabled:cursor-not-allowed"
          id="checkbox-terms"
        />
        <label className={`text-xs font-bold leading-relaxed ${
          hasScrolledToBottom ? 'text-gray-600 cursor-pointer' : 'text-gray-400'
        }`} htmlFor="checkbox-terms">
          Chúng tôi đã rà soát kỹ các điều khoản nêu trên và đại diện cho phòng khám cam kết hoàn thành đầy đủ nghĩa vụ đối tác theo chuẩn vận hành Da Nang Trust Shield. * {!hasScrolledToBottom && "(Hãy cuộn xem hết hợp đồng để xác nhận)"}
        </label>
      </div>

      {/* BILATERAL DIGITAL SIGN-OFF PANEL (Dành cho ký kết song phương) */}
      <div className={`border border-gray-100 rounded-3xl p-6 bg-gray-50/50 space-y-6 transition-all ${
        hasScrolledToBottom ? '' : 'opacity-50 select-none pointer-events-none'
      }`}>
        <div>
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Khung Ký Kết Kỹ Thuật Số (Bilateral Digital Signatures)</h4>
          <p className="text-[11px] text-gray-400 font-medium">Bản ký điện tử chính thức được mã hóa trên hệ thống blockchain của Da Nang Trust Shield</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party A Pre-signed panel */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col justify-between h-48 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wide">
                  Đã Duyệt / Pre-Signed
                </span>
                <p className="text-[11px] text-gray-900 font-black uppercase mt-1">PARTY A: UCTALENT LABS</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Signature Graphic Mock */}
            <div className="py-2 text-center">
              <span className="font-serif italic text-emerald-700 text-xl font-black tracking-wide bg-emerald-50/20 px-4 py-2 border-b border-dashed border-emerald-200 inline-block font-medium select-none">
                Django Nguyen
              </span>
              <p className="text-[9px] text-gray-400 font-mono mt-1">ID: uctlabs-mgmt-99a3c8</p>
            </div>

            <div className="text-[10px] text-gray-400 border-t border-gray-50 pt-2 flex justify-between items-center">
              <span>Đại diện: Nguyễn Ngọc Dương</span>
              <span className="font-mono text-[9px] text-gray-300">Da Nang, VN</span>
            </div>
          </div>

          {/* Party B Clinic Signature Pad */}
          <div className={`bg-white border rounded-2xl p-5 flex flex-col justify-between h-48 shadow-sm transition-all ${
            signature.trim() ? 'border-sky-200 bg-sky-50/5' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                  signature.trim()
                    ? 'bg-sky-50 text-sky-700 border-sky-100'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {signature.trim() ? 'Đã ký / Co-Signed' : 'Chờ Ký / Pending'}
                </span>
                <p className="text-[11px] text-gray-900 font-black uppercase mt-1">PARTY B: {clinicName || "YOUR CLINIC"}</p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                signature.trim()
                  ? 'bg-sky-50 border-sky-100 text-sky-600'
                  : 'bg-amber-50 border-amber-100 text-amber-500'
              }`}>
                {signature.trim() ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
            </div>

            {/* Dynamic cursive handwritten signature */}
            <div className="py-2 text-center min-h-[48px] flex flex-col items-center justify-center">
              {signature.trim() ? (
                <div className="animate-fade-in text-center">
                  <span className="font-serif italic text-sky-600 text-xl font-black tracking-wide bg-sky-50/30 px-4 py-1.5 border-b border-dashed border-sky-300 inline-block font-medium">
                    {signature.trim()}
                  </span>
                  <p className="text-[8px] text-sky-400 font-mono mt-1">SECURE IP HASH: {clinicId?.substring(0, 8) || "onb-auth-cln"}</p>
                </div>
              ) : (
                <span className="text-[10px] text-gray-300 italic">
                  {hasScrolledToBottom ? "Vui lòng nhập tên người đại diện ký phía dưới" : "Cần cuộn xem hết hợp đồng để nhập chữ ký"}
                </span>
              )}
            </div>

            <div className="text-[10px] text-gray-400 border-t border-gray-50 pt-2 flex justify-between items-center">
              <span>Chức vụ: Người đại diện pháp luật</span>
              <span className="font-mono text-[9px] text-gray-300">IP Authorized</span>
            </div>
          </div>
        </div>

        {/* Input box to enter signature name */}
        <div className="p-5 bg-white border border-gray-150 rounded-2xl max-w-xl shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
              Họ Tên Người Đại Diện Ký (Type full legal name to sign) *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                disabled={!hasScrolledToBottom}
                placeholder="Ví dụ: Nguyễn Lương Duy"
                value={signature}
                onChange={e => setSignature(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-amber-500 rounded-xl py-3 pl-11 pr-4 text-xs font-extrabold text-gray-800 focus:outline-none transition-all placeholder-gray-400 disabled:cursor-not-allowed"
                id="input-signature"
              />
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">
              Đại diện pháp luật đã đăng ký: <strong className="text-gray-600">{adminName || "Đại diện phòng khám"}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-1.5 cursor-pointer bg-white"
          id="btn-prev-to-hours"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schedule
        </button>

        <button
          type="submit"
          disabled={loading || !hasScrolledToBottom || !agreed || !signature.trim()}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none cursor-pointer flex items-center gap-1.5 disabled:cursor-not-allowed"
          id="btn-save-agreement"
        >
          {loading ? 'Processing signature...' : 'Accept terms & digitally sign'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}

/* ==========================================
   SUB-COMPONENT: STEP 5 - SUBMISSION & REVIEW
   ========================================== */
function StepSubmissionReview({ clinicId, onboarding, clinic, admin, onSubmitted, onPrev }: { clinicId: string, onboarding: any, clinic: any, admin: any, onSubmitted: (onb: any, clinic: any) => void, onPrev: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = async () => {
    if (!onboarding.agreementCompleted) {
      setError("Please review and accept the UCSmile online partnership agreement before submitting your clinic onboarding information.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 6, data: {} })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to submit onboarding profile.");
      onSubmitted(result.onboarding, result.clinic);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitted = clinic?.status === 'PENDING_REVIEW' || clinic?.status === 'APPROVED';

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Onboarding Verification Review</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          {isSubmitted ? 'Onboarding profile submitted for review' : 'Submit your onboarding profile details for UCSmile review'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* STATE 1: PENDING REVIEW DISPLAY */}
      {clinic?.status === 'PENDING_REVIEW' && (
        <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-3xl text-center space-y-4 animate-fade-in" id="panel-pending-review">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto border border-blue-200 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="font-serif text-lg font-bold text-gray-900">Application Pending Review</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your clinic profile is fully completed and has been submitted to UCSmile Administration. Our vetting team is verifying clinical licenses, address credentials, and standard prices.
            </p>
            <p className="text-xs text-amber-600 font-extrabold bg-amber-50/50 border border-amber-100 rounded-xl p-3 inline-block mt-2">
              Note: You can verify approval status by reloading this page or checking with administrators at nhung.phan230206@vnuk.edu.vn.
            </p>
          </div>
        </div>
      )}

      {/* STATE 2: APPROVED DISPLAY */}
      {clinic?.status === 'APPROVED' && (
        <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-center space-y-4 animate-fade-in" id="panel-approved">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="font-serif text-lg font-bold text-gray-900">Congratulations! Clinic Approved</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>{clinic.name}</strong> is now an officially accredited and listed partner on UCSmile. Your clinical services are actively accessible to patients routing through our booking systems!
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/booking"
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Go to Booking Page
              </Link>
              <Link
                to="/"
                className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: READY TO SUBMIT */}
      {clinic?.status === 'ONBOARDING_IN_PROGRESS' && (
        <div className="space-y-6" id="panel-ready-submit">
          
          <div className="p-5 border border-amber-100 bg-amber-50/20 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black uppercase text-amber-800 tracking-wide">Ready for Final Submission</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                You have successfully completed all onboarding requirements! Please review your submission outline below before submitting to UCSmile administrators.
              </p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white text-xs">
            
            {/* Outline 1 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">1. Clinic Brand Info</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-1">
                <p>Clinic Name: {clinic.name}</p>
                <p>Contact Email: {clinic.contactEmail}</p>
                <p className="text-gray-400 font-medium text-[10px]">Profile Setup: {onboarding.profileSetupCompleted ? '✅ Complete' : '❌ Incomplete'}</p>
              </div>
            </div>

            {/* Outline 2 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">2. Services Listed</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-2 text-left">
                <p>Services Setup: {onboarding.servicesCompleted ? '✅ Complete' : '❌ Incomplete'}</p>
                {onboarding.services && onboarding.services.filter((s: any) => s.enabled).length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase">Enabled Treatments ({onboarding.services.filter((s: any) => s.enabled).length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {onboarding.services.filter((s: any) => s.enabled).map((s: any) => (
                        <div key={s.serviceId} className="p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col justify-between">
                          <p className="font-extrabold text-[11px] text-gray-900 leading-tight">{s.serviceName}</p>
                          <div className="flex items-center justify-between mt-1 text-[9px] text-amber-800">
                            <span className="font-bold bg-amber-50 px-1 rounded border border-amber-100/30">{s.category}</span>
                            <span className="font-black font-mono">{s.currency === 'VND' ? '₫' : '$'}{s.customPrice?.toLocaleString()} / {s.treatmentUnit === 'Custom Unit' ? s.customUnitName : s.treatmentUnit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 font-medium">No treatments active</p>
                )}
              </div>
            </div>

            {/* Outline 3 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">3. Operational Hours</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-1">
                <p>Hours Setup: {onboarding.workingHoursCompleted ? '✅ Complete' : '❌ Incomplete'}</p>
              </div>
            </div>

            {/* Outline 4 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">4. Additional Clinic Info</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-1.5">
                <p>Status: {onboarding.additionalInfoCompleted ? '✅ Complete (Optional)' : 'ℹ️ Skipped / Incomplete'}</p>
                {(onboarding.additionalInfo?.branches?.length || 0) > 0 && (
                  <p className="text-[10px] text-gray-400">Branches Added: {onboarding.additionalInfo.branches.length}</p>
                )}
                {(onboarding.additionalInfo?.dentists?.length || 0) > 0 && (
                  <p className="text-[10px] text-gray-400">Dentist Profiles: {onboarding.additionalInfo.dentists.length}</p>
                )}
                {(onboarding.additionalInfo?.documents?.length || 0) > 0 && (
                  <p className="text-[10px] text-gray-400">Supporting Docs: {onboarding.additionalInfo.documents.length}</p>
                )}
              </div>
            </div>

            {/* Outline 5 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">5. Partnership Contract</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-1">
                <p>Contract Sign: {onboarding.agreementCompleted ? '✅ Digitally Signed' : '❌ Unsigned'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Authorized Signer: {onboarding.agreementDetails?.signedName || 'None'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Version Accepted: {onboarding.agreementDetails?.termsVersion || 'v1.0.0-2026'}</p>
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-1.5 cursor-pointer bg-white"
              id="btn-prev-to-agreement"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Contract
            </button>

            <button
              onClick={handleSubmitReview}
              disabled={loading || !onboarding.profileSetupCompleted || !onboarding.servicesCompleted || !onboarding.workingHoursCompleted || !onboarding.agreementCompleted}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
              id="btn-submit-review"
            >
              {loading ? 'Submitting Application...' : 'Submit Profile for Admin Review'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
