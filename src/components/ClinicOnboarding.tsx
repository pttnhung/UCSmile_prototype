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
  ChevronDown,
  ChevronUp,
  ListFilter,
  Upload,
  Download,
  X,
  Image as ImageIcon,
  Loader2,
  Edit2,
  FileSpreadsheet
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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

  // Sync active view based on current route path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith('/login')) {
      setActiveView('login');
    } else if (path.endsWith('/register')) {
      setActiveView('register');
    } else if (path.endsWith('/onboarding')) {
      setActiveView('onboarding');
    } else if (path === '/clinic' || path === '/clinic/') {
      const savedAdmin = localStorage.getItem('ucsmile_clinic_admin');
      if (savedAdmin) {
        navigate('/clinic/onboarding', { replace: true });
      } else {
        navigate('/clinic/login', { replace: true });
      }
    }
  }, [location.pathname]);

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

    const submissionForm = {
      ...regForm,
      primaryBranchName: regForm.clinicName.trim()
    };

    // Required fields as per AC 4
    const required = [
      'clinicName', 'contactPersonName', 'contactPhoneNumber', 'contactEmail',
      'primaryBranchName', 'city', 'clinicAddress', 'adminFullName', 'adminEmail', 'password'
    ];

    const missing = required.filter(field => !submissionForm[field as keyof typeof submissionForm]?.trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields marked with *.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/clinic/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionForm)
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

      navigate('/clinic/onboarding');
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
    navigate('/clinic/login');
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-gray-900 font-bold">
            UCSmile Clinic Partner Portal
          </h1>
          <p className="text-gray-500 text-xs mt-1.5 max-w-md mx-auto">
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
                  onClick={() => navigate('/clinic/login')}
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
                        onClick={() => { setError(null); navigate('/clinic/login'); }}
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
                          onChange={e => {
                            const newEmail = e.target.value;
                            setRegForm(prev => {
                              const shouldUpdateAdmin = !prev.adminEmail || prev.adminEmail === prev.contactEmail;
                              return {
                                ...prev,
                                contactEmail: newEmail,
                                adminEmail: shouldUpdateAdmin ? newEmail : prev.adminEmail
                              };
                            });
                          }}
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
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Admin Name *</label>
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
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password *</label>
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
                    onClick={() => navigate('/clinic/register')}
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
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 md:p-12 text-center max-w-xl mx-auto"
              id="view-success-container"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl text-gray-900 font-bold mb-4">Registration Created Successfully!</h2>
              
              <div className="text-gray-600 text-sm font-semibold mb-8">
                Dental Clinic: <span className="font-bold text-gray-900">{clinic?.name}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    navigate('/clinic/onboarding');
                    showToast("Loading your custom onboarding workspace!");
                  }}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  id="btn-continue-onboarding"
                >
                  Continue <ChevronRight className="w-4 h-4" />
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
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8 overflow-x-auto custom-scrollbar">
                <div className="min-w-[700px] relative px-2">
                  
                  {/* Track connection line - mathematically centered between circle 1 (8.33%) and circle 6 (91.67%) */}
                  <div className="absolute top-5 left-[8.33%] right-[8.33%] -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500 rounded-full" 
                      style={{ width: `${((onboarding?.currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-6 relative z-10">
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
                          className="flex flex-col items-center cursor-pointer group text-center px-1"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                              : isActive 
                              ? 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-500/20 shadow-sm' 
                              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                          }`}>
                            {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.id}
                          </div>
                          <div className="h-8 flex items-center justify-center mt-2.5">
                            <p className={`text-[10px] uppercase tracking-wider text-center leading-tight transition-colors ${
                              isActive ? 'text-amber-600 font-extrabold' : isCompleted ? 'text-emerald-700 font-bold' : 'text-gray-400 font-semibold'
                            }`}>{step.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

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
                    clinic={clinic}
                    onSave={(updatedOnb, updatedClinic) => {
                      setOnboarding(updatedOnb);
                      if (updatedClinic) setClinic(updatedClinic);
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

  // Legal & Tax variables
  const [taxCode, setTaxCode] = useState(onboarding?.profileDetails?.taxCode || '');
  const [operatingLicenceNumber, setOperatingLicenceNumber] = useState(onboarding?.profileDetails?.operatingLicenceNumber || '');
  const [address, setAddress] = useState(onboarding?.profileDetails?.address || clinic?.address || '');

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
    setLogoUrl("https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop");
    setClinicImages([
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=600&fit=crop"
    ]);
    setTaxCode("4201979449");
    setOperatingLicenceNumber("0452/ĐNa-GPHĐ");
    setAddress("140 Thong Nhat, Nha Trang, Khanh Hoa, Vietnam");
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
      if (!taxCode.trim()) {
        setError("Mã số thuế (Tax Code) is a required field.");
        setLoading(false);
        return;
      }
      if (!operatingLicenceNumber.trim()) {
        setError("Giấy phép hoạt động (Operating Licence Number) is a required field.");
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
      if (!logoUrl || logoUrl === 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop') {
        setError("Clinic Logo is a required field. Please upload your clinic logo.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      isDraft,
      clinicDisplayName: displayName.trim(),
      taxCode: taxCode.trim(),
      operatingLicenceNumber: operatingLicenceNumber.trim(),
      address: address.trim(),
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

        {/* LEGAL REGISTRATION DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tax Code */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mã số thuế / Tax Code *</label>
            <input 
              type="text"
              required
              placeholder="Ví dụ: 4201979449"
              value={taxCode}
              onChange={e => setTaxCode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
              id="input-taxcode"
            />
          </div>

          {/* Operating Licence */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giấy phép hoạt động / Operating Licence *</label>
            <input 
              type="text"
              required
              placeholder="Ví dụ: 0452/ĐNa-GPHĐ"
              value={operatingLicenceNumber}
              onChange={e => setOperatingLicenceNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
              id="input-licence"
            />
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
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic Logo *</label>
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

      {/* Action Buttons (Step Continuation - AC 7) */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
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
          enabled: savedItem ? (savedItem.enabled !== undefined ? savedItem.enabled : false) : false,
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
      enabled: false,
      isDetail: false
    }));
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // AI-Assisted Price Import state
  const [aiImporting, setAiImporting] = useState(false);
  const [aiImportError, setAiImportError] = useState<string | null>(null);
  const [aiImportSuccess, setAiImportSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [aiDraftResults, setAiDraftResults] = useState<{ matches: any[]; details: any[] } | null>(null);

  // Manual entry dropdown & missing treatment highlight state
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [missingTreatmentServiceIds, setMissingTreatmentServiceIds] = useState<string[]>([]);

  const handlePriceListUpload = async (file: File) => {
    setAiImportError(null);
    setAiImportSuccess(null);
    setAiDraftResults(null);
    setUploadedFile({ name: file.name, size: file.size, type: file.type });

    // AC 2.5: File size validation (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setAiImportError("The uploaded file is too large (maximum size is 10MB). Please select a smaller file.");
      return;
    }

    // AC 2.5: File type validation
    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    const ext = file.name ? file.name.split('.').pop()?.toLowerCase() : "";
    const supportedExts = ["pdf", "csv", "xlsx", "xls", "png", "jpeg", "jpg", "txt"];
    const isSupported = supportedTypes.includes(file.type) || (ext && supportedExts.includes(ext));
    if (!isSupported) {
      setAiImportError("Unsupported file format. Please upload a PDF, Excel (.xlsx/.xls), CSV, PNG, or JPEG file.");
      return;
    }

    setAiImporting(true);

    try {
      // Read file to Base64
      const base64Data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const pureBase64 = reader.result.split(',')[1];
            resolve(pureBase64);
          } else {
            reject(new Error("Failed to parse file content."));
          }
        };
        reader.onerror = () => reject(new Error("File read failed."));
        reader.readAsDataURL(file);
      });

      // Call our API endpoint
      const response = await fetch("/api/clinic/onboarding/import-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64Data
          },
          standardServices: STANDARD_SERVICES
        })
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Failed to analyze the uploaded file. Please make sure the file is clear and readable.");
      }

      const extracted = resJson.data;
      if (!extracted || (!extracted.matches && !extracted.details)) {
        throw new Error("No dental treatments or pricing information could be identified in the uploaded document. Please check the readability and try again.");
      }

      const normalizeServiceId = (id: string): string => {
        if (!id) return "std-others";
        const clean = id.toLowerCase().trim().replace(/['"_\-]/g, "");
        
        // Exact short matches
        if (["gen1", "cleaning", "clean"].includes(clean)) return "gen-1";
        if (["gen2", "teethwhitening", "whitening", "bleaching"].includes(clean)) return "gen-2";
        if (["gen3", "ort1", "braces", "orthodontic", "orthodontics"].includes(clean)) return "ort-1";
        if (["gen4", "imp1", "implant", "dentalimplant"].includes(clean)) return "imp-1";
        if (["gen5", "sur2", "wisdomtooth", "wisdom"].includes(clean)) return "sur-2";
        if (["gen6", "res1", "filling", "composite", "compositefilling"].includes(clean)) return "res-1";
        if (["gen7", "sur1", "extraction", "toothextraction"].includes(clean)) return "sur-1";
        
        if (clean === "res2" || clean.includes("rootcanal")) return "res-2";
        if (clean === "res3" || clean.includes("pulp")) return "res-3";
        if (clean === "res4" || clean.includes("inlay") || clean.includes("onlay") || clean.includes("overlay")) return "res-4";
        
        if (clean === "pro1" || clean.includes("crown") || clean.includes("maosu") || clean.includes("răngsứ")) return "pro-1";
        if (clean === "pro2" || clean.includes("veneer") || clean.includes("veneers")) return "pro-2";
        if (clean === "pro3" || clean.includes("bridge") || clean.includes("cầurăng")) return "pro-3";
        
        if (clean === "sur3" || clean.includes("preprosthetic") || clean.includes("xươngổ")) return "sur-3";
        if (clean === "sur4" || clean.includes("apicoectomy") || clean.includes("cắtchóp")) return "sur-4";
        if (clean === "sur5" || clean.includes("gum") || clean.includes("nướu") || clean.includes("gingivo")) return "sur-5";
        
        if (clean === "imp2" || clean.includes("bonegraft") || clean.includes("ghépxương")) return "imp-2";
        if (clean === "imp3" || clean.includes("fullarch") || clean.includes("allon")) return "imp-3";
        
        if (clean === "ort2" || clean.includes("invisalign")) return "ort-2";
        if (clean === "ort3" || clean.includes("growth") || clean.includes("children")) return "ort-3";
        
        if (clean === "ped1" || clean.includes("pediatricextraction") || clean.includes("răngsữanhổ")) return "ped-1";
        if (clean === "ped2" || clean.includes("pediatricroot") || clean.includes("răngsữatủy")) return "ped-2";
        if (clean === "ped3" || clean.includes("pediatriccrown") || clean.includes("răngsữamão")) return "ped-3";
        if (clean === "ped4" || clean.includes("pediatricfilling") || clean.includes("răngsữatrám")) return "ped-4";
        
        if (clean.includes("other") || clean.includes("others") || clean === "stdothers") return "std-others";
        
        const stdIds = ["gen-1", "gen-2", "gen-3", "gen-4", "gen-5", "gen-6", "gen-7", "res-1", "res-2", "res-3", "res-4", "pro-1", "pro-2", "pro-3", "sur-1", "sur-2", "sur-3", "sur-4", "sur-5", "imp-1", "imp-2", "imp-3", "ort-1", "ort-2", "ort-3", "ped-1", "ped-2", "ped-3", "ped-4", "std-others"];
        const found = stdIds.find(stdId => stdId.replace("-", "") === clean || stdId === id);
        if (found) return found;
        
        return "std-others";
      };

      // Convert matches and details to active draft states
      const processedMatches = (extracted.matches || []).map((m: any) => {
        const serviceId = normalizeServiceId(m.serviceId);
        return {
          ...m,
          serviceId,
          enabled: m.enabled !== undefined ? m.enabled : true,
          // Match with full service name from standard services for UI display
          serviceName: STANDARD_SERVICES.find(s => s.id === serviceId)?.name || m.serviceId
        };
      });

      const processedDetails = (extracted.details || []).map((d: any) => {
        const parentServiceId = normalizeServiceId(d.parentServiceId);
        return {
          ...d,
          parentServiceId,
          enabled: d.enabled !== undefined ? d.enabled : true,
          parentServiceName: STANDARD_SERVICES.find(s => s.id === parentServiceId)?.name || parentServiceId
        };
      });

      setAiDraftResults({
        matches: processedMatches,
        details: processedDetails
      });
      if (resJson.isFallback) {
        setAiImportSuccess("Hệ thống tự động chuyển sang chế độ Trích Xuất Dự Phòng Cục Bộ (Local Extraction Engine) để đảm bảo trải nghiệm thông suốt. Vui lòng kiểm tra, điều chỉnh giá và đơn vị bên dưới!");
      } else {
        setAiImportSuccess("Gemini AI đã trích xuất bảng giá điều trị thành công! Vui lòng kiểm tra, sửa đổi và xác nhận bên dưới.");
      }
    } catch (err: any) {
      console.error(err);
      setAiImportError(err.message || "Failed to process the uploaded price list. Please make sure the file is clear and readable.");
    } finally {
      setAiImporting(false);
    }
  };

  const confirmAiDraft = () => {
    if (!aiDraftResults) return;

    setServices(prev => {
      let updatedServices = [...prev];

      // Update matched standard services
      aiDraftResults.matches.forEach(match => {
        const idx = updatedServices.findIndex(s => s.serviceId === match.serviceId && !s.isDetail);
        if (idx !== -1) {
          updatedServices[idx] = {
            ...updatedServices[idx],
            enabled: match.enabled,
            customPrice: match.customPrice !== undefined && match.customPrice !== '' ? Number(match.customPrice) : updatedServices[idx].customPrice,
            treatmentUnit: match.treatmentUnit || updatedServices[idx].treatmentUnit,
            priceUnit: match.priceUnit || updatedServices[idx].priceUnit,
            currency: match.currency || updatedServices[idx].currency,
          };
        }
      });

      // Prepare details list to process
      const detailsToImport = [...aiDraftResults.details];

      // Enforce the Vietnamese requirement: "đã được đánh dấu THÌ PHẢI CÓ SPECIFIC TREATMENT đuọc trích từ BẢNG GIÁ, DÙ CHỈ CÓ 1 CÁI"
      // Check every enabled/marked standard service and guarantee it has at least one child detail
      aiDraftResults.matches.forEach(match => {
        if (match.enabled) {
          const matchDetails = detailsToImport.filter(d => d.parentServiceId === match.serviceId);
          if (matchDetails.length > 0) {
            const hasAnyEnabledDetail = matchDetails.some(d => d.enabled);
            if (!hasAnyEnabledDetail) {
              // Automatically enable the first detail under this parent so there is at least one active specific treatment
              const firstDetailIdx = detailsToImport.findIndex(d => d.parentServiceId === match.serviceId);
              if (firstDetailIdx !== -1) {
                detailsToImport[firstDetailIdx].enabled = true;
              }
            }
          } else {
            // Synthesize a specific treatment using the parent standard service name so it is not empty
            const stdService = STANDARD_SERVICES.find(s => s.id === match.serviceId);
            detailsToImport.push({
              parentServiceId: match.serviceId,
              serviceName: match.serviceName || stdService?.name || "Standard Treatment",
              customPrice: match.customPrice !== undefined && match.customPrice !== '' ? Number(match.customPrice) : (stdService?.defaultPrice || 50),
              treatmentUnit: match.treatmentUnit || stdService?.treatmentUnit || 'Tooth',
              priceUnit: match.priceUnit || `per ${match.treatmentUnit || stdService?.treatmentUnit || 'Tooth'}`,
              currency: match.currency || stdService?.currency || 'USD',
              enabled: true,
              isDetail: true
            });
          }
        }
      });

      // Add checked custom sub-services/detailed treatments
      const checkedDetails = detailsToImport
        .filter(d => d.enabled && d.serviceName?.trim())
        .map(d => ({
          serviceId: `S-DETAIL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          parentServiceId: d.parentServiceId,
          category: d.category || STANDARD_SERVICES.find(s => s.id === d.parentServiceId)?.category || 'Other Specialty',
          serviceName: d.serviceName.trim(),
          customPrice: d.customPrice !== '' && d.customPrice !== undefined ? Number(d.customPrice) : 0,
          treatmentUnit: d.treatmentUnit || 'Tooth',
          customUnitName: '',
          priceUnit: d.priceUnit || `per ${d.treatmentUnit || 'Tooth'}`,
          currency: d.currency || 'USD',
          enabled: true,
          isDetail: true
        }));

      // Filter out any older duplicate details to prevent visual clutter
      const updatedWithoutDupes = updatedServices.filter(s => {
        if (!s.isDetail) return true;
        // If it's a detail, check if we are importing a new checked detail with the exact same name
        const hasIncomingNew = checkedDetails.some(cd => cd.parentServiceId === s.parentServiceId && cd.serviceName.toLowerCase() === s.serviceName.toLowerCase());
        return !hasIncomingNew;
      });

      return [...updatedWithoutDupes, ...checkedDetails];
    });

    setAiDraftResults(null);
    setUploadedFile(null);
    setAiImportSuccess("Successfully matched, reviewed, and imported prices! Please review the updated treatments in the list below.");
  };

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
    const enabledDemoServiceIds = ['gen-1', 'gen-2', 'gen-4', 'pro-1', 'ort-2'];

    const demoServices = STANDARD_SERVICES.map(std => {
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
        enabled: enabledDemoServiceIds.includes(std.id),
        isDetail: false
      };
    });

    const demoDetails = [
      // gen-1 (Cleaning) Specific Treatments (4 items)
      {
        serviceId: `S-DETAIL-${Date.now()}-1`,
        parentServiceId: 'gen-1',
        category: 'General',
        serviceName: 'Ultrasonic Scale & Polish (Regular)',
        customPrice: 45,
        treatmentUnit: 'Visit',
        customUnitName: '',
        priceUnit: 'per Visit',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-2`,
        parentServiceId: 'gen-1',
        category: 'General',
        serviceName: 'Deep Scale & Root Planing (per Quadrant)',
        customPrice: 120,
        treatmentUnit: 'Visit',
        customUnitName: '',
        priceUnit: 'per Visit',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-3`,
        parentServiceId: 'gen-1',
        category: 'General',
        serviceName: 'Air-Powder Stain Blast & Airflow Polish',
        customPrice: 65,
        treatmentUnit: 'Visit',
        customUnitName: '',
        priceUnit: 'per Visit',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-4`,
        parentServiceId: 'gen-1',
        category: 'General',
        serviceName: 'Topical Fluoride Therapy & Polish',
        customPrice: 35,
        treatmentUnit: 'Visit',
        customUnitName: '',
        priceUnit: 'per Visit',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },

      // gen-2 (Teeth Whitening) Specific Treatments (3 items)
      {
        serviceId: `S-DETAIL-${Date.now()}-5`,
        parentServiceId: 'gen-2',
        category: 'General',
        serviceName: 'In-Office Zoom! Laser Whitening Session',
        customPrice: 180,
        treatmentUnit: 'Session',
        customUnitName: '',
        priceUnit: 'per Session',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-6`,
        parentServiceId: 'gen-2',
        category: 'General',
        serviceName: 'Home Whitening Kit with Custom Laboratory Trays',
        customPrice: 110,
        treatmentUnit: 'Session',
        customUnitName: '',
        priceUnit: 'per Session',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-7`,
        parentServiceId: 'gen-2',
        category: 'General',
        serviceName: 'Dual Action Laser & Take-home Premium Kit',
        customPrice: 260,
        treatmentUnit: 'Session',
        customUnitName: '',
        priceUnit: 'per Session',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },

      // gen-4 (Dental Implant) Specific Treatments (4 items)
      {
        serviceId: `S-DETAIL-${Date.now()}-8`,
        parentServiceId: 'gen-4',
        category: 'General',
        serviceName: 'Premium Straumann SLA Active Implant (Fixture)',
        customPrice: 1450,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-9`,
        parentServiceId: 'gen-4',
        category: 'General',
        serviceName: 'Standard Neo Biotech SLA Implant System',
        customPrice: 750,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-10`,
        parentServiceId: 'gen-4',
        category: 'General',
        serviceName: 'Osstem TSIII Premium SLA Active Implant',
        customPrice: 950,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-11`,
        parentServiceId: 'gen-4',
        category: 'General',
        serviceName: 'Custom Titanium Implant Abutment',
        customPrice: 280,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },

      // pro-1 (Dental Crown) Specific Treatments (3 items)
      {
        serviceId: `S-DETAIL-${Date.now()}-12`,
        parentServiceId: 'pro-1',
        category: 'Prosthodontics',
        serviceName: 'LAVA Esthetic High-Translucency Zirconia Crown',
        customPrice: 380,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-13`,
        parentServiceId: 'pro-1',
        category: 'Prosthodontics',
        serviceName: 'IPS e.max Premium CAD/CAM Porcelain Crown',
        customPrice: 480,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-14`,
        parentServiceId: 'pro-1',
        category: 'Prosthodontics',
        serviceName: 'Standard Porcelain-Fused-to-Metal (PFM) Crown',
        customPrice: 220,
        treatmentUnit: 'Tooth',
        customUnitName: '',
        priceUnit: 'per Tooth',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },

      // ort-2 (Invisalign) Specific Treatments (3 items)
      {
        serviceId: `S-DETAIL-${Date.now()}-15`,
        parentServiceId: 'ort-2',
        category: 'Orthodontics',
        serviceName: 'Invisalign Full/Comprehensive Unlimited Treatment',
        customPrice: 3800,
        treatmentUnit: 'Case',
        customUnitName: '',
        priceUnit: 'per Case',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-16`,
        parentServiceId: 'ort-2',
        category: 'Orthodontics',
        serviceName: 'Invisalign Lite (Dual Arch - Up to 14 Aligners)',
        customPrice: 2200,
        treatmentUnit: 'Case',
        customUnitName: '',
        priceUnit: 'per Case',
        currency: 'USD',
        enabled: true,
        isDetail: true
      },
      {
        serviceId: `S-DETAIL-${Date.now()}-17`,
        parentServiceId: 'ort-2',
        category: 'Orthodontics',
        serviceName: 'Invisalign Express/iGo (Single Arch Minor Fix)',
        customPrice: 1400,
        treatmentUnit: 'Case',
        customUnitName: '',
        priceUnit: 'per Case',
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
      return prev.map((s, i) => {
        if (i === idx) {
          return { ...s, enabled: willBeEnabled };
        }
        if (s.isDetail && s.parentServiceId === service.serviceId && !willBeEnabled) {
          return { ...s, enabled: false };
        }
        return s;
      });
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
    if (missingTreatmentServiceIds.includes(parentId)) {
      setMissingTreatmentServiceIds(prev => prev.filter(id => id !== parentId));
    }
    
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

    const activeServices = services.filter(s => {
      if (!s.enabled) return false;
      if (s.isDetail) {
        const parent = services.find(p => p.serviceId === s.parentServiceId && !p.isDetail);
        return parent ? parent.enabled : false;
      }
      return true;
    });

    // If saving and continuing (not draft), perform validations
    if (!isDraft) {
      if (activeServices.filter(s => !s.isDetail).length === 0) {
        setError("Please select/enable at least one dental service offered by your clinic before continuing.");
        setLoading(false);
        return;
      }

      // Check for enabled services without any specific treatment
      const missingIds: string[] = [];
      for (const s of activeServices) {
        if (!s.isDetail) {
          const nestedDetailsForParent = services.filter(d => d.isDetail && d.parentServiceId === s.serviceId && d.enabled);
          if (nestedDetailsForParent.length === 0) {
            missingIds.push(s.serviceId);
          }
        }
      }

      if (missingIds.length > 0) {
        setMissingTreatmentServiceIds(missingIds);
        setShowManualEntry(true);
        const firstMissing = services.find(s => s.serviceId === missingIds[0]);
        setError(`Requires at least 1 specific treatment for "${firstMissing?.serviceName || 'the highlighted service'}". Please add specific treatments before continuing.`);
        setLoading(false);

        // Smooth scroll up to the missing service element
        setTimeout(() => {
          const targetElem = document.getElementById(`block-service-${missingIds[0]}`);
          if (targetElem) {
            targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        return;
      }

      // Validate every active service field
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

      {/* AI-Assisted Price List Import Panel (AC 2.1 - AC 2.5) */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3 text-left" id="ai-price-import-section">
        <div className="space-y-1">
          <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Price List Import
          </h3>
          <p className="text-xs text-gray-500">
            Tải lên file bảng giá phòng khám để AI trích xuất tự động.
          </p>
        </div>

        {/* Upload Zone */}
        {!aiDraftResults && (
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handlePriceListUpload(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              dragActive 
                ? "border-amber-500 bg-amber-50/40" 
                : "border-gray-200 hover:border-amber-400 bg-gray-50/50 hover:bg-amber-50/10"
            }`}
          >
            <input
              type="file"
              id="ai-price-file-input"
              className="hidden"
              accept=".pdf,.csv,.xlsx,.xls,.png,.jpeg,.jpg,.txt"
              onChange={(e) => { if (e.target.files?.[0]) handlePriceListUpload(e.target.files[0]); }}
              disabled={aiImporting}
            />
            <label htmlFor="ai-price-file-input" className="cursor-pointer space-y-2 block">
              {aiImporting ? (
                <div className="space-y-2 py-2">
                  <Loader2 className="w-6 h-6 text-amber-500 mx-auto animate-spin" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800 animate-pulse">Đang phân tích bảng giá bằng AI...</p>
                    <p className="text-[10px] text-gray-400">Vui lòng chờ trong giây lát...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 py-1">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-800">
                    Kéo & thả file vào đây, hoặc <span className="text-amber-600 underline">chọn file</span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    PDF, Excel, CSV, PNG, JPG (Tối đa 10MB)
                  </p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* AI Processing Errors or Success Messages */}
        {aiImportError && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 animate-fade-in text-xs text-red-800" id="ai-import-error-box">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Lỗi xử lý file (File Processing Error)</p>
              <p className="text-[11px] text-red-700 mt-0.5">{aiImportError}</p>
            </div>
          </div>
        )}

        {aiImportSuccess && !aiDraftResults && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2 animate-fade-in text-xs text-emerald-800" id="ai-import-success-box">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-700">{aiImportSuccess}</p>
          </div>
        )}

        {/* Draft Review Panel (AC 2.3 & AC 2.4) */}
        {aiDraftResults && (
          <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 animate-fade-in" id="ai-draft-review-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
              <div>
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-500" />
                  Kiểm Tra & Xác Nhận Bảng Giá Đã Trích Xuất (Draft Extracted)
                </h4>
                <p className="text-[10px] text-gray-400">Xem lại, điều chỉnh giá, chọn đơn vị điều trị hoặc tích chọn dịch vụ trước khi áp dụng vào hệ thống.</p>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => { setAiDraftResults(null); setUploadedFile(null); setAiImportSuccess(null); }}
                  className="px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmAiDraft}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm font-extrabold"
                  id="btn-confirm-ai-draft"
                >
                  <Check className="w-3.5 h-3.5" /> Xác Nhận & Áp Dụng (Apply)
                </button>
              </div>
            </div>

            {/* Uploaded File Details Header */}
            {uploadedFile && (
              <div className="bg-gray-50 rounded-xl p-2.5 px-4 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span className="truncate font-mono">Tên file: {uploadedFile.name}</span>
                <span className="shrink-0 font-mono">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {(() => {
                // Pre-calculate grouped services
                const groupedDrafts = STANDARD_SERVICES.map(std => {
                  const mIdx = aiDraftResults.matches.findIndex(m => m.serviceId === std.id);
                  const match = mIdx !== -1 ? aiDraftResults.matches[mIdx] : null;

                  const sDetails = aiDraftResults.details
                    .map((d, dOriginalIdx) => ({ ...d, dOriginalIdx }))
                    .filter(d => d.parentServiceId === std.id);

                  if (!match && sDetails.length === 0) return null;

                  return {
                    std,
                    match,
                    mIdx,
                    details: sDetails
                  };
                }).filter(Boolean);

                if (groupedDrafts.length === 0) {
                  return (
                    <p className="text-xs text-gray-400 text-center py-4">Không tìm thấy kết quả trích xuất phù hợp.</p>
                  );
                }

                return groupedDrafts.map((group: any) => {
                  const std = group.std;
                  const match = group.match;
                  const mIdx = group.mIdx;
                  const groupDetails = group.details;

                  return (
                    <div key={`draft-group-${std.id}`} className="border border-gray-150 rounded-2xl overflow-hidden bg-gray-50/25 p-3.5 space-y-3">
                      {/* Group Header / Category Tag & Standard Service Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {std.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 font-bold">
                          ID: {std.id}
                        </span>
                      </div>

                      {/* Main Service Row (Standard Match) */}
                      {match ? (
                        <div className={`p-2.5 rounded-xl flex items-center justify-between gap-4 transition-colors ${match.enabled ? 'bg-white border border-gray-100' : 'bg-gray-150/50 opacity-60'}`}>
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={match.enabled}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const updatedMatches = [...aiDraftResults.matches];
                                updatedMatches[mIdx].enabled = isChecked;

                                let updatedDetails = [...aiDraftResults.details];
                                if (isChecked) {
                                  // Enable the first detail under this standard service if none are enabled
                                  const detailsForParent = updatedDetails.filter(d => d.parentServiceId === std.id);
                                  if (detailsForParent.length > 0) {
                                    const hasEnabled = detailsForParent.some(d => d.enabled);
                                    if (!hasEnabled) {
                                      const firstDetail = updatedDetails.find(d => d.parentServiceId === std.id);
                                      if (firstDetail) {
                                        firstDetail.enabled = true;
                                      }
                                    }
                                  } else {
                                    // Synthesize a detail if none exist
                                    updatedDetails.push({
                                      parentServiceId: std.id,
                                      serviceName: match.serviceName || std.name,
                                      customPrice: match.customPrice !== undefined && match.customPrice !== '' ? Number(match.customPrice) : (std.defaultPrice || 50),
                                      treatmentUnit: match.treatmentUnit || std.treatmentUnit || 'Tooth',
                                      priceUnit: match.priceUnit || `per ${match.treatmentUnit || std.treatmentUnit || 'Tooth'}`,
                                      currency: match.currency || 'USD',
                                      isDetail: true,
                                      enabled: true,
                                      parentServiceName: std.name
                                    });
                                  }
                                } else {
                                  // Disable all details under this standard service if it is disabled
                                  updatedDetails = updatedDetails.map(d => {
                                    if (d.parentServiceId === std.id) {
                                      return { ...d, enabled: false };
                                    }
                                    return d;
                                  });
                                }

                                setAiDraftResults({
                                  matches: updatedMatches,
                                  details: updatedDetails
                                });
                              }}
                              className="w-4 h-4 text-amber-500 border-gray-200 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-black text-gray-800">{match.serviceName}</p>
                              <p className="text-[9px] text-gray-400 font-medium">Dịch vụ chuẩn (Base Service)</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50 px-2 py-1">
                              <span className="text-[10px] font-bold text-gray-400 mr-1">{match.currency || 'USD'}</span>
                              <input
                                type="number"
                                value={match.customPrice === undefined ? '' : match.customPrice}
                                onChange={(e) => {
                                  const updated = [...aiDraftResults.matches];
                                  updated[mIdx].customPrice = e.target.value === '' ? '' : Number(e.target.value);
                                  setAiDraftResults({ ...aiDraftResults, matches: updated });
                                }}
                                className="w-20 bg-transparent border-none p-0 text-xs font-black text-gray-800 text-right focus:outline-none"
                                placeholder="Review"
                              />
                            </div>
                            
                            <select
                              value={match.treatmentUnit || 'Tooth'}
                              onChange={(e) => {
                                const updated = [...aiDraftResults.matches];
                                updated[mIdx].treatmentUnit = e.target.value;
                                updated[mIdx].priceUnit = `per ${e.target.value}`;
                                setAiDraftResults({ ...aiDraftResults, matches: updated });
                              }}
                              className="text-[10px] border border-gray-100 rounded-lg p-1 px-1.5 font-bold text-gray-600 bg-white focus:outline-none"
                            >
                              <option value="Tooth">Tooth (Răng)</option>
                              <option value="Visit">Visit (Lần khám)</option>
                              <option value="Case">Case (Ca)</option>
                              <option value="Session">Session (Liệu trình)</option>
                              <option value="Arch">Arch (Hàm)</option>
                            </select>

                            {match.customPrice === undefined && (
                              <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-100">
                                Cần xem lại
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-left px-2 py-1">
                          <p className="text-xs font-black text-gray-700">{std.name}</p>
                          <p className="text-[9px] text-gray-400">Không có giá dịch vụ chuẩn, trích xuất được dịch vụ chi tiết dưới đây:</p>
                        </div>
                      )}

                      {/* Grouped Nested Sub-treatments / Specific details */}
                      {groupDetails.length > 0 && (
                        <div className="ml-4 pl-3 border-l-2 border-dashed border-amber-200/60 space-y-2 text-left">
                          {groupDetails.map((detail: any) => {
                            const dIdx = detail.dOriginalIdx;
                            return (
                              <div key={`detail-${dIdx}`} className={`p-2.5 rounded-xl border border-gray-100/60 flex items-center justify-between gap-4 transition-colors ${detail.enabled ? 'bg-white' : 'bg-gray-150/30 opacity-60'}`}>
                                <div className="flex items-center gap-2 max-w-[50%] min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={detail.enabled}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      const updatedDetails = [...aiDraftResults.details];
                                      updatedDetails[dIdx].enabled = isChecked;

                                      const updatedMatches = [...aiDraftResults.matches];
                                      const parentId = detail.parentServiceId;
                                      const matchIdx = updatedMatches.findIndex(m => m.serviceId === parentId);

                                      if (isChecked && matchIdx !== -1) {
                                        // Auto-enable parent standard service if a child detail is checked
                                        updatedMatches[matchIdx].enabled = true;
                                      } else if (!isChecked && matchIdx !== -1) {
                                        // If this was the last enabled detail, disable the parent service
                                        const otherEnabledDetails = updatedDetails.filter((d, idx) => d.parentServiceId === parentId && d.enabled && idx !== dIdx);
                                        if (otherEnabledDetails.length === 0 && updatedMatches[matchIdx].enabled) {
                                          updatedMatches[matchIdx].enabled = false;
                                        }
                                      }

                                      setAiDraftResults({
                                        matches: updatedMatches,
                                        details: updatedDetails
                                      });
                                    }}
                                    className="w-3.5 h-3.5 text-amber-500 border-gray-200 rounded cursor-pointer"
                                  />
                                  <div className="min-w-0 w-full">
                                    <input
                                      type="text"
                                      value={detail.serviceName}
                                      onChange={(e) => {
                                        const updated = [...aiDraftResults.details];
                                        updated[dIdx].serviceName = e.target.value;
                                        setAiDraftResults({ ...aiDraftResults, details: updated });
                                      }}
                                      className="text-xs font-bold text-gray-800 border-b border-dashed border-gray-200 focus:border-amber-400 focus:outline-none bg-transparent w-full truncate"
                                    />
                                    <p className="text-[9px] text-gray-400 font-medium">Chi tiết chuyên sâu (Sub-treatment)</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50 px-2 py-1">
                                    <span className="text-[10px] font-bold text-gray-400 mr-1">{detail.currency || 'USD'}</span>
                                    <input
                                      type="number"
                                      value={detail.customPrice === undefined ? '' : detail.customPrice}
                                      onChange={(e) => {
                                        const updated = [...aiDraftResults.details];
                                        updated[dIdx].customPrice = e.target.value === '' ? '' : Number(e.target.value);
                                        setAiDraftResults({ ...aiDraftResults, details: updated });
                                      }}
                                      className="w-16 bg-transparent border-none p-0 text-xs font-black text-gray-800 text-right focus:outline-none"
                                      placeholder="Review"
                                    />
                                  </div>

                                  <select
                                    value={detail.treatmentUnit || 'Tooth'}
                                    onChange={(e) => {
                                      const updated = [...aiDraftResults.details];
                                      updated[dIdx].treatmentUnit = e.target.value;
                                      updated[dIdx].priceUnit = `per ${e.target.value}`;
                                      setAiDraftResults({ ...aiDraftResults, details: updated });
                                    }}
                                    className="text-[10px] border border-gray-100 rounded-lg p-1 px-1.5 font-bold text-gray-600 bg-white focus:outline-none"
                                  >
                                    <option value="Tooth">Tooth (Răng)</option>
                                    <option value="Visit">Visit (Lần khám)</option>
                                    <option value="Case">Case (Ca)</option>
                                    <option value="Session">Session (Liệu trình)</option>
                                    <option value="Arch">Arch (Hàm)</option>
                                    <option value="Site">Site (Vùng)</option>
                                    <option value="Segment">Segment (Phân vùng)</option>
                                  </select>

                                  {detail.customPrice === undefined && (
                                    <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-100">
                                      Cần xem lại
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      {/* SERVICE LIST GROUPED BY CATEGORY (MANUAL ENTRY ACCORDION DROPDOWN) */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden text-left" id="manual-services-dropdown-container">
        {/* Accordion Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setShowManualEntry(!showManualEntry)}
          className={`w-full p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-all text-left ${showManualEntry ? 'border-b border-gray-200 bg-gray-50/50' : ''}`}
          id="btn-toggle-manual-entry"
        >
          <div className="flex items-center gap-3">
            <ListFilter className="w-4 h-4 text-gray-500" />
            <h3 className="font-serif text-sm font-bold text-gray-900">
              Manual Service Entry & Selection
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            {showManualEntry ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Dropdown Accordion Content */}
        {showManualEntry && (
          <div className="p-6 space-y-8 bg-gray-50/30 animate-fade-in">
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
                      const isMissingTreatment = missingTreatmentServiceIds.includes(s.serviceId);

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
                                  {s.enabled && (
                                    nestedDetails.length > 0 ? (
                                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase px-1 rounded border border-emerald-100">
                                        Active
                                      </span>
                                    ) : isMissingTreatment ? (
                                      <span className="inline-block bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                                        Requires at least 1 specific treatment
                                      </span>
                                    ) : null
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
                            <div className="ml-8 pl-4 space-y-2 text-left bg-gray-50/50 p-3 rounded-2xl">
                              <div className="space-y-2">
                                {nestedDetails.map(detail => {
                                  const dIdx = services.findIndex(item => item.serviceId === detail.serviceId);
                                  return (
                                    <div key={detail.serviceId} className="flex items-center justify-between gap-4 p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all text-xs" id={`detail-item-${detail.serviceId}`}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <div>
                                          <p className="font-extrabold text-gray-800 leading-none">{detail.serviceName}</p>
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
                            <div className="ml-8 space-y-1.5 animate-fade-in text-left">
                              <div className="p-3 bg-amber-50/10 border border-amber-100 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-3">
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
                                    <option value="Session">Session</option>
                                    <option value="Case">Case</option>
                                    <option value="Visit">Visit</option>
                                  </select>
                                </div>

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

                              {/* Soft grey instruction line */}
                              <p className="text-[10px] text-gray-400 font-normal italic px-1">
                                Enter treatment name, price ($), select unit, then click <span className="font-bold text-emerald-600">✓</span> to confirm.
                              </p>
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
        )}
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
          <p className="text-xs text-gray-500 font-medium">
            Configure weekly clinic operating hours
          </p>
        </div>
        <button
          type="button"
          onClick={fillHoursDemoData}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs shrink-0"
          id="btn-fill-hours-demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-gray-500" /> Điền thông tin mẫu (Demo Fill)
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
            <React.Fragment key={day}>
              <div 
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  cfg.isClosed 
                    ? 'bg-red-50/20 border-red-100/50' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                id={`row-hour-${day}`}
              >
                {/* Day Label */}
                <div className="flex items-center gap-3 w-36">
                  <Calendar className={`w-4 h-4 ${cfg.isClosed ? 'text-red-400' : 'text-amber-500'}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${cfg.isClosed ? 'text-red-800' : 'text-gray-700'}`}>
                    {day}
                  </span>
                </div>

                {/* Opening & Closing Selectors */}
                <div className="flex items-center gap-2">
                  {/* Open Time Input */}
                  <div className={`relative inline-flex items-center rounded-lg border transition-all ${
                    cfg.isClosed 
                      ? 'bg-gray-100 border-gray-200 text-gray-300 pointer-events-none' 
                      : 'bg-gray-50/80 border-gray-200 hover:border-gray-300 hover:bg-white focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20'
                  }`}>
                    <input 
                      type="time"
                      disabled={cfg.isClosed}
                      value={cfg.open}
                      onChange={e => updateHours(day, 'open', e.target.value)}
                      className={`pl-2.5 pr-6 py-1 text-xs font-bold tracking-tight bg-transparent outline-none cursor-pointer transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                        cfg.isClosed ? 'text-gray-300' : 'text-gray-800'
                      }`}
                      id={`input-open-${day}`}
                      title="Click to change opening time"
                    />
                    {!cfg.isClosed && (
                      <Edit2 className="w-3 h-3 text-gray-400 absolute right-1.5 pointer-events-none" />
                    )}
                  </div>

                  <span className={`text-xs font-medium px-0.5 ${cfg.isClosed ? 'text-gray-300' : 'text-gray-400'}`}>to</span>

                  {/* Close Time Input */}
                  <div className={`relative inline-flex items-center rounded-lg border transition-all ${
                    cfg.isClosed 
                      ? 'bg-gray-100 border-gray-200 text-gray-300 pointer-events-none' 
                      : 'bg-gray-50/80 border-gray-200 hover:border-gray-300 hover:bg-white focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20'
                  }`}>
                    <input 
                      type="time"
                      disabled={cfg.isClosed}
                      value={cfg.close}
                      onChange={e => updateHours(day, 'close', e.target.value)}
                      className={`pl-2.5 pr-6 py-1 text-xs font-bold tracking-tight bg-transparent outline-none cursor-pointer transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                        cfg.isClosed ? 'text-gray-300' : 'text-gray-800'
                      }`}
                      id={`input-close-${day}`}
                      title="Click to change closing time"
                    />
                    {!cfg.isClosed && (
                      <Edit2 className="w-3 h-3 text-gray-400 absolute right-1.5 pointer-events-none" />
                    )}
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
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer" htmlFor={`checkbox-closed-${day}`}>
                    Closed on this day
                  </label>
                </div>
              </div>
              {day === 'Monday' && (
                <p className="text-[11px] text-gray-400 font-normal italic text-left pl-3 -mt-1 mb-1">
                  * Click on any time field to adjust working hours
                </p>
              )}
            </React.Fragment>
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
          {loading ? 'Saving Hours...' : 'Save & Continue'}
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
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop", // Stethoscope / neutral placeholder
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=200&h=200&fit=crop"
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
  const [dSpec, setDSpec] = useState('Implants & Oral Surgery');
  const [dExp, setDExp] = useState('');
  const [dLangs, setDLangs] = useState('Vietnamese, English');
  const [dPhoto, setDPhoto] = useState(PRESET_AVATARS[0]);
  const [showAddDentist, setShowAddDentist] = useState(false);

  // 4. Document Form States
  const [docName, setDocName] = useState('');
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
        specialization: "Implants & Oral Surgery",
        experience: "15 years",
        languages: "Vietnamese, English",
        photo: PRESET_AVATARS[0]
      },
      {
        id: `DENT-${Date.now()}-2`,
        name: "Dr. Sophia Le",
        specialization: "Cosmetic Dentistry & Orthodontics",
        experience: "8 years",
        languages: "Vietnamese, English, Korean",
        photo: PRESET_AVATARS[1]
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
    if (!dExp.trim()) {
      setError("Years of Experience is required.");
      return;
    }
    const newD = {
      id: `DENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: dName.trim(),
      specialization: dSpec.trim(),
      experience: dExp.trim(),
      languages: dLangs.trim() || "Vietnamese, English",
      photo: dPhoto
    };
    setDentists(prev => [...prev, newD]);
    setDName('');
    setDExp('');
    setDPhoto(PRESET_AVATARS[0]);
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
        type: "Document",
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
                  <p className="text-gray-500 font-medium">Specialty: {d.specialization}</p>
                  {d.experience && (
                    <p className="text-gray-400 font-medium text-[10px]">Experience: {d.experience}</p>
                  )}
                  <p className="text-gray-400 font-medium text-[10px]">Languages: {d.languages}</p>
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
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Years of Experience *</label>
                <input 
                  type="text" 
                  required
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
 
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-1">Profile Photo (Optional)</label>
                <div className="flex items-center gap-3 pt-1">
                  <img 
                    src={dPhoto || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'} 
                    alt="Dentist Photo Preview" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col gap-1 text-left">
                    <button
                      type="button"
                      onClick={() => document.getElementById('dentist-photo-file-input')?.click()}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm text-gray-700 flex items-center justify-center gap-1"
                    >
                      Choose Photo File
                    </button>
                    <p className="text-[9px] text-gray-400">Supported: JPEG, PNG, WEBP. Max 5MB.</p>
                    <input 
                      type="file"
                      id="dentist-photo-file-input"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            const parsed = await validateAndReadFile(e.target.files[0]);
                            setDPhoto(parsed.dataUrl);
                            setSuccess("Dentist profile photo uploaded successfully!");
                          } catch (err: any) {
                            setError(err.message || "Failed to upload photo.");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
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
            <div className="grid grid-cols-1 gap-4">
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
            {loading ? 'Processing...' : 'Skip'}
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
function StepAgreementSetup({ 
  clinicId, 
  clinicName, 
  adminName, 
  onboarding, 
  clinic,
  onSave, 
  onPrev 
}: { 
  clinicId: string, 
  clinicName: string, 
  adminName: string, 
  onboarding: any, 
  clinic: any,
  onSave: (onb: any, clinic?: any) => void, 
  onPrev: () => void 
}) {
  const [repName, setRepName] = useState(onboarding?.agreementDetails?.signedName || adminName || clinic?.contactPerson || '');
  const [repPosition, setRepPosition] = useState(onboarding?.agreementDetails?.representativePosition || 'Managing Director');
  const [checkboxes, setCheckboxes] = useState<boolean[]>([
    !!onboarding?.agreementCompleted,
    !!onboarding?.agreementCompleted,
    !!onboarding?.agreementCompleted,
    !!onboarding?.agreementCompleted,
    !!onboarding?.agreementCompleted,
    !!onboarding?.agreementCompleted
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(!!onboarding?.agreementCompleted);

  const legalClinicName = clinic?.name || clinicName || "YOUR CLINIC CO., LTD";
  const tradingName = onboarding?.profileDetails?.clinicDisplayName || clinic?.name || clinicName || "YOUR CLINIC TRADING NAME";
  const taxCode = onboarding?.profileDetails?.taxCode || "4201979449";
  const clinicAddress = onboarding?.profileDetails?.address || clinic?.address || "140 Thong Nhat, Nha Trang, Khanh Hoa, Vietnam";
  const clinicEmail = clinic?.contactEmail || "contact171@elitedentaldanang.com";
  const clinicPhone = clinic?.contactPhone || "+84905333555";
  const operatingLicenceNumber = onboarding?.profileDetails?.operatingLicenceNumber || "0452/ĐNa-GPHĐ";
  const applicationID = clinicId || "APP-CLN-2026-X";
  const agreementNumber = onboarding?.agreementDetails?.agreementNumber || `AGR-${applicationID.replace("C-REG-", "").substring(0, 8).toUpperCase()}/2026/HĐHT-UCT`;
  const agreementVersion = "v1.5-partner-2026";
  const currentDate = "13/7/2026";

  const enabledServices = onboarding?.services?.filter((s: any) => s.enabled) || [];

  const articles = [
    { id: 1, title: "ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ MÔ HÌNH VẬN HÀNH" },
    { id: 2, title: "ĐIỀU 2: CAM KẾT GIÁ VÀ BẢO CHỨNG (TRUST SHIELD)" },
    { id: 3, title: "ĐIỀU 3: CHIẾT KHẤU VÀ QUY TRÌNH DÒNG TIỀN" },
    { id: 4, title: "ĐIỀU 4: CƠ CHẾ CHỐNG BYPASS VÀ QUẢN LÝ KHÁCH HÀNG" },
    { id: 5, title: "ĐIỀU 5: TRÁCH NHIỆM PHỐI HỢP MEDIA (TRUST SIGNALS)" },
    { id: 6, title: "ĐIỀU 6: TRÁCH NHIỆM CHUYÊN MÔN VÀ BẢO HÀNH" },
    { id: 7, title: "ĐIỀU 7: HỢP TÁC QUẢNG CÁO & KHUYẾN MÃI (PROMOTION)" },
    { id: 8, title: "ĐIỀU 8: ĐIỀU KHOẢN CHUNG" }
  ];

  const fillAgreementDemoData = () => {
    setRepName(adminName || clinic?.contactPerson || "Nguyen Van Binh");
    setRepPosition("Director");
    setCheckboxes([true, true, true, true, true, true]);
    setHasScrolledToBottom(true);
    // Auto-scroll to bottom of contract container for simulated review
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const threshold = 30;
    const isBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;
    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updated = [...checkboxes];
    updated[index] = !updated[index];
    setCheckboxes(updated);
  };

  // Check if all steps completed
  const allRequiredStepsCompleted = !!(onboarding?.profileSetupCompleted && onboarding?.servicesCompleted && onboarding?.workingHoursCompleted);

  // Generate plain-text or HTML content for snapshot & download
  const getFullAgreementText = () => {
    return `
HỢP ĐỒNG HỢP TÁC KINH DOANH
(V/v: Cung cấp nền tảng kết nối và dịch vụ tư vấn du lịch nha khoa)
Số: ${agreementNumber}

- Căn cứ Bộ luật Dân sự số 91/2015/QH13;
- Căn cứ Luật Thương mại số 36/2005/QH13;
- Căn cứ nhu cầu và khả năng của hai bên.

Hôm nay, ngày ${currentDate}, tại Đà Nẵng, chúng tôi gồm có:

BÊN A: CÔNG TY TNHH UCTALENT LABS
- Mã số thuế: 0402238274
- Địa chỉ: 50 Hoàng Hiệp, Phường Hòa Xuân, TP Đà Nẵng, Việt Nam
- Văn phòng: Software Park 2, Đà Nẵng
- Đại diện: Ông Nguyễn Ngọc Dương (Django) - Chức vụ: Giám đốc
- Số tài khoản: 888911 tại Ngân hàng Techcombank (CN Đà Nẵng)

BÊN B: ${legalClinicName.toUpperCase()}
- Tên thương mại: ${tradingName}
- Mã số thuế: ${taxCode}
- Địa chỉ đăng ký: ${clinicAddress}
- Đại diện: ${repName || "........................"} - Chức vụ: ${repPosition || "........................"}
- Email: ${clinicEmail} | Điện thoại: ${clinicPhone}
- Giấy phép hoạt động: ${operatingLicenceNumber}

Hai bên thống nhất ký kết Hợp đồng khung với các điều khoản sau:

ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ MÔ HÌNH VẬN HÀNH
1.1. Bên A cung cấp nền tảng "Da Nang Trust Shield" để kết nối khách hàng quốc tế (trọng tâm là Mỹ, Anh, Úc và Singapore) với Bên B.
1.2. Bên A triển khai hệ sinh thái công nghệ hỗ trợ gồm: AI Concierge (tư vấn 24/7), Digital Trust Pass (định danh khách hàng qua QR Code) và Digital Dental Passport (lưu trữ bệnh án số).
1.3. Bên B là đối tác chuyên môn, chịu trách nhiệm cung cấp dịch vụ nha khoa chất lượng cao theo đúng phác đồ và tiêu chuẩn đã công bố trên nền tảng.

ĐIỀU 2: CAM KẾT GIÁ VÀ BẢO CHỨNG (TRUST SHIELD)
2.1. Giá cố định (Fixed-Price): Bên B cam kết cung cấp bảng giá minh bạch cho Bên A. Giá điều trị thực tế tại phòng khám không được vượt quá báo giá đã chốt với khách hàng trên nền tảng (trừ trường hợp phát sinh y tế bắt buộc được khách hàng và Bên A xác nhận).
2.2. Chế tài vi phạm: Nếu thu vượt giá cam kết, Bên B phải hoàn trả chênh lệch cho khách. Nếu không, Bên A sẽ cộng khoản này vào phí dịch vụ ở kỳ đối soát gần nhất.

ĐIỀU 3: CHIẾT KHẤU VÀ QUY TRÌNH DÒNG TIỀN
3.1. Phí dịch vụ (Hoa hồng):
- Mức tiêu chuẩn: 25% tổng giá trị hóa đơn.
- Mức ưu đãi chiến lược (Early Bird): 20% trên tổng giá trị hóa đơn (Áp dụng trong 24 tháng cho những đối tác đầu tiên).
3.2. Tiền cọc "Trust Shield" (Booking Deposit): Khách hàng thanh toán trước cho Bên A từ 500.000 - 3.000.000 VND để giữ chỗ. Khoản này được khấu trừ trực tiếp vào hóa đơn của khách tại Bên B.
3.3. Phí Premium Concierge: Khách thanh toán cho Bên A từ 3.000.000 - 5.900.000 VND cho các dịch vụ hỗ trợ VIP. Khoản này thuộc về Bên A, không khấu trừ vào hóa đơn của Bên B.
3.4. Quyết toán: Chậm nhất ngày 04 hàng tháng, hai bên đối soát doanh thu tháng trước. Bên B thanh toán phí dịch vụ cho Bên A (sau khi đã trừ đi các khoản cọc khách đã trả trước cho Bên A) trong vòng 03 ngày làm việc.

ĐIỀU 4: CƠ CHẾ CHỐNG BYPASS VÀ QUẢN LÝ KHÁCH HÀNG
4.1. Quét mã QR: Bên B có trách nhiệm quét mã QR của khách hàng qua hệ thống của Bên A ngay khi khách đến check-in để kích hoạt bảo hành và ghi nhận nguồn khách.
4.2. Quyền sở hữu khách hàng: Khách hàng tiếp cận qua nền tảng là khách hàng của Bên A. Bên B không được giao dịch trực tiếp ngoài hệ thống hoặc chào mời các dịch vụ riêng nhằm tránh phí dịch vụ của nền tảng.

ĐIỀU 5: TRÁCH NHIỆM PHỐI HỢP MEDIA (TRUST SIGNALS)
5.1 Trong ít nhất 06 tháng đầu tiên, Bên B cam kết phối hợp và dành thời gian ít nhất 04 giờ/tuần hỗ trợ đội ngũ Media của Bên A thực hiện ghi hình, chụp ảnh quy trình làm việc và phỏng vấn bác sĩ chuyên môn bằng tiếng Anh.
5.2. Các tư liệu này nhằm mục đích xây dựng "Trust Signals" để quảng bá thương hiệu cho cả hai bên trên thị trường quốc tế.
5.3. Bản quyền hình ảnh: Bên A được toàn quyền sử dụng các tư liệu này để xây dựng "Trust Signals" (Tín hiệu tin cậy) trên các kênh marketing quốc tế.

ĐIỀU 6: TRÁCH NHIỆM CHUYÊN MÔN VÀ BẢO HÀNH
6.1. Bên B chịu hoàn toàn trách nhiệm về kết quả điều trị và các vấn đề an toàn y khoa.
6.2. Bên B cam kết thực hiện chính sách bảo hành quốc tế và phối hợp cùng nhân viên và AI Agent của Bên A để theo dõi sức khỏe khách hàng sau khi họ về nước (Post-Op Support) định kỳ (3 ngày, 1 tuần, 1 tháng, 6 tháng) và hỗ trợ tư vấn video call nếu khách hàng gặp sự cố sau khi về nước.

ĐIỀU 7: HỢP TÁC QUẢNG CÁO & KHUYẾN MÃI (PROMOTION)
7.1. Trong 06 tháng đầu tiên, hai bên phối hợp triển khai các chương trình ưu đãi (Promotion) và chạy quảng cáo chung để thu hút khách hàng.
7.2. Bên B cam kết cung cấp các gói dịch vụ ưu đãi đặc quyền cho khách hàng từ nền tảng của Bên A. Chi tiết về nội dung và ngân sách triển khai sẽ được hai bên thống nhất cụ thể theo từng chiến dịch.

ĐIỀU 8: ĐIỀU KHOẢN CHUNG
8.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi bổ sung sẽ được lập thành Phụ lục hợp đồng.
8.2. Trường hợp phát sinh tranh chấp, hai bên ưu tiên thương lượng trên tinh thần cùng phát triển hệ sinh thái Dental Tourism tại Đà Nẵng.
Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau.

ĐẠI DIỆN BÊN A                              ĐẠI DIỆN BÊN B
Nguyễn Ngọc Dương                           ${repName || "........................"}
`;
  };

  const downloadAgreementHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hợp đồng Hợp tác Kinh doanh - ${agreementNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; max-width: 820px; margin: auto; background-color: #f9fafb; }
          .container { background-color: #ffffff; padding: 50px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,0.03); position: relative; }
          h1, h2, h3, h4 { color: #111827; }
          .header { text-align: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 25px; margin-bottom: 30px; }
          .party-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 18px 20px; border-radius: 8px; margin-bottom: 18px; font-size: 13px; }
          .footer-sig { display: flex; justify-content: space-between; margin-top: 50px; }
          .sig-box { width: 48%; border: 1px solid #e5e7eb; padding: 25px 20px; border-radius: 12px; text-align: center; background: #f9fafb; font-size: 13px; box-sizing: border-box; }
          .content-block { font-size: 13px; text-align: justify; line-height: 1.7; }
          .article-title { font-weight: bold; font-size: 14px; margin-top: 22px; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h3 style="margin: 0; font-size: 13px; letter-spacing: 1px; font-family: sans-serif; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
            <p style="margin: 3px 0 15px 0; font-size: 11px; font-weight: bold; font-family: sans-serif;">Độc lập - Tự do - Hạnh phúc</p>
            <h2 style="margin: 10px 0 3px 0; font-size: 20px; text-transform: uppercase;">HỢP ĐỒNG HỢP TÁC KINH DOANH</h2>
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #4b5563;">(V/v: Cung cấp nền tảng kết nối và dịch vụ tư vấn du lịch nha khoa)</p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Số: <strong>${agreementNumber}</strong> | Ngày lập: <strong>${currentDate}</strong></p>
          </div>

          <div class="content-block">
            <p style="margin-bottom: 12px;">
              • Căn cứ Bộ luật Dân sự số 91/2015/QH13;<br>
              • Căn cứ Luật Thương mại số 36/2005/QH13;<br>
              • Căn cứ nhu cầu và khả năng của hai bên.
            </p>

            <p style="margin-bottom: 20px;">Hôm nay, ngày ${currentDate}, tại Đà Nẵng, chúng tôi gồm có:</p>
            
            <div class="party-box">
              <strong style="color: #0f172a;">BÊN A: CÔNG TY TNHH UCTALENT LABS</strong><br>
              • Mã số thuế: 0402238274<br>
              • Địa chỉ: 50 Hoàng Hiệp, Phường Hòa Xuân, TP Đà Nẵng, Việt Nam<br>
              • Văn phòng: Software Park 2, Đà Nẵng<br>
              • Đại diện: Ông Nguyễn Ngọc Dương (Django) - Chức vụ: Giám đốc<br>
              • Số tài khoản: 888911 tại Ngân hàng Techcombank (CN Đà Nẵng)
            </div>

            <div class="party-box">
              <strong style="color: #0f172a;">BÊN B: ${legalClinicName.toUpperCase()}</strong><br>
              • Tên thương mại: ${tradingName}<br>
              • Mã số thuế: ${taxCode}<br>
              • Địa chỉ đăng ký: ${clinicAddress}<br>
              • Đại diện: ${repName || "........................"} - Chức vụ: ${repPosition || "........................"}<br>
              • Email: ${clinicEmail} | Điện thoại: ${clinicPhone}<br>
              • Giấy phép hoạt động số: ${operatingLicenceNumber}
            </div>

            <p style="margin-top: 15px; margin-bottom: 20px;">Hai bên thống nhất ký kết Hợp đồng khung với các điều khoản sau:</p>

            <div class="article-title">ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ MÔ HÌNH VẬN HÀNH</div>
            <p>1.1. Bên A cung cấp nền tảng "Da Nang Trust Shield" để kết nối khách hàng quốc tế (trọng tâm là Mỹ, Anh, Úc và Singapore) với Bên B.</p>
            <p>1.2. Bên A triển khai hệ sinh thái công nghệ hỗ trợ gồm: AI Concierge (tư vấn 24/7), Digital Trust Pass (định danh khách hàng qua QR Code) và Digital Dental Passport (lưu trữ bệnh án số).</p>
            <p>1.3. Bên B là đối tác chuyên môn, chịu trách nhiệm cung cấp dịch vụ nha khoa chất lượng cao theo đúng phác đồ và tiêu chuẩn đã công bố trên nền tảng.</p>

            <div class="article-title">ĐIỀU 2: CAM KẾT GIÁ VÀ BẢO CHỨNG (TRUST SHIELD)</div>
            <p>2.1. Giá cố định (Fixed-Price): Bên B cam kết cung cấp bảng giá minh bạch cho Bên A. Giá điều trị thực tế tại phòng khám không được vượt quá báo giá đã chốt với khách hàng trên nền tảng (trừ trường hợp phát sinh y tế bắt buộc được khách hàng và Bên A xác nhận).</p>
            <p>2.2. Chế tài vi phạm: Nếu thu vượt giá cam kết, Bên B phải hoàn trả chênh lệch cho khách. Nếu không, Bên A sẽ cộng khoản này vào phí dịch vụ ở kỳ đối soát gần nhất.</p>

            <div class="article-title">ĐIỀU 3: CHIẾT KHẤU VÀ QUY TRÌNH DÒNG TIỀN</div>
            <p>3.1. Phí dịch vụ (Hoa hồng):<br>
            - Mức tiêu chuẩn: 25% tổng giá trị hóa đơn.<br>
            - Mức ưu đãi chiến lược (Early Bird): 20% trên tổng giá trị hóa đơn (Áp dụng trong 24 tháng cho những đối tác đầu tiên).</p>
            <p>3.2. Tiền cọc "Trust Shield" (Booking Deposit): Khách hàng thanh toán trước cho Bên A từ 500.000 - 3.000.000 VND để giữ chỗ. Khoản này được khấu trừ trực tiếp vào hóa đơn của khách tại Bên B.</p>
            <p>3.3. Phí Premium Concierge: Khách thanh toán cho Bên A từ 3.000.000 - 5.900.000 VND cho các dịch vụ hỗ trợ VIP. Khoản này thuộc về Bên A, không khấu trừ vào hóa đơn của Bên B.</p>
            <p>3.4. Quyết toán: Chậm nhất ngày 04 hàng tháng, hai bên đối soát doanh thu tháng trước. Bên B thanh toán phí dịch vụ cho Bên A (sau khi đã trừ đi các khoản cọc khách đã trả trước cho Bên A) trong vòng 03 ngày làm việc.</p>

            <div class="article-title">ĐIỀU 4: CƠ CHẾ CHỐNG BYPASS VÀ QUẢN LÝ KHÁCH HÀNG</div>
            <p>4.1. Quét mã QR: Bên B có trách nhiệm quét mã QR của khách hàng qua hệ thống của Bên A ngay khi khách đến check-in để kích hoạt bảo hành và ghi nhận nguồn khách.</p>
            <p>4.2. Quyền sở hữu khách hàng: Khách hàng tiếp cận qua nền tảng là khách hàng của Bên A. Bên B không được giao dịch trực tiếp ngoài hệ thống hoặc chào mời các dịch vụ riêng nhằm tránh phí dịch vụ của nền tảng.</p>

            <div class="article-title">ĐIỀU 5: TRÁCH NHIỆM PHỐI HỢP MEDIA (TRUST SIGNALS)</div>
            <p>5.1. Trong ít nhất 06 tháng đầu tiên, Bên B cam kết phối hợp và dành thời gian ít nhất 04 giờ/tuần hỗ trợ đội ngũ Media của Bên A thực hiện ghi hình, chụp ảnh quy trình làm việc và phỏng vấn bác sĩ chuyên môn bằng tiếng Anh.</p>
            <p>5.2. Các tư liệu này nhằm mục đích xây dựng "Trust Signals" để quảng bá thương hiệu cho cả hai bên trên thị trường quốc tế.</p>
            <p>5.3. Bản quyền hình ảnh: Bên A được toàn quyền sử dụng các tư liệu này để xây dựng "Trust Signals" (Tín hiệu tin cậy) trên các kênh marketing quốc tế.</p>

            <div class="article-title">ĐIỀU 6: TRÁCH NHIỆM CHUYÊN MÔN VÀ BẢO HÀNH</div>
            <p>6.1. Bên B chịu hoàn toàn trách nhiệm về kết quả điều trị và các vấn đề an toàn y khoa.</p>
            <p>6.2. Bên B cam kết thực hiện chính sách bảo hành quốc tế và phối hợp cùng nhân viên và AI Agent của Bên A để theo dõi sức khỏe khách hàng sau khi họ về nước (Post-Op Support) định kỳ (3 ngày, 1 tuần, 1 tháng, 6 tháng) và hỗ trợ tư vấn video call nếu khách hàng gặp sự cố sau khi về nước.</p>

            <div class="article-title">ĐIỀU 7: HỢP TÁC QUẢNG CÁO & KHUYẾN MÃI (PROMOTION)</div>
            <p>7.1. Trong 06 tháng đầu tiên, hai bên phối hợp triển khai các chương trình ưu đãi (Promotion) và chạy quảng cáo chung để thu hút khách hàng.</p>
            <p>7.2. Bên B cam kết cung cấp các gói dịch vụ ưu đãi đặc quyền cho khách hàng từ nền tảng của Bên A. Chi tiết về nội dung và ngân sách triển khai sẽ được hai bên thống nhất cụ thể theo từng chiến dịch.</p>

            <div class="article-title">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</div>
            <p>8.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi bổ sung sẽ được lập thành Phụ lục hợp đồng.</p>
            <p>8.2. Trường hợp phát sinh tranh chấp, hai bên ưu tiên thương lượng trên tinh thần cùng phát triển hệ sinh thái Dental Tourism tại Đà Nẵng.</p>
            <p>Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau.</p>
          </div>

          <div class="footer-sig">
            <div class="sig-box">
              <strong>ĐẠI DIỆN BÊN A</strong><br>
              CÔNG TY TNHH UCTALENT LABS<br>
              <div style="height: 100px;"></div>
              <p style="margin: 10px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 10px;"><strong>Nguyễn Ngọc Dương</strong></p>
            </div>
            <div class="sig-box">
              <strong>ĐẠI DIỆN BÊN B</strong><br>
              ${legalClinicName.toUpperCase()}<br>
              <div style="height: 100px;"></div>
              <p style="margin: 10px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 10px;"><strong>${repName || "................................................"}</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hop_Dong_Hop_Tac_${agreementNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!hasScrolledToBottom) {
      setError("Please scroll to the very bottom of the agreement document to unlock the electronic acceptance checkboxes and signing fields.");
      setLoading(false);
      return;
    }

    if (checkboxes.some(c => !c)) {
      setError("All 6 agreement checkboxes must be explicitly selected to verify compliance.");
      setLoading(false);
      return;
    }

    if (!repName.trim()) {
      setError("Representative Signatory Full Name is required.");
      setLoading(false);
      return;
    }

    if (!repPosition.trim()) {
      setError("Representative Signatory Position is required.");
      setLoading(false);
      return;
    }

    if (!allRequiredStepsCompleted) {
      setError("You cannot sign the agreement yet because you have incomplete previous onboarding steps. Please verify steps 1, 2, and 3 are marked complete.");
      setLoading(false);
      return;
    }

    const payload = {
      representativeName: repName.trim(),
      representativePosition: repPosition.trim(),
      agreementText: getFullAgreementText(),
      checkboxes,
      termsVersion: agreementVersion,
      agreementNumber,
      ipAddress: '192.168.1.42', // Simulated Secure Node Client Hashing
      userAgent: navigator.userAgent,
      clinicEmail: clinicEmail
    };

    try {
      const res = await fetch(`/api/clinic/onboarding/${clinicId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 5, data: payload })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to accept and submit partnership agreement.");
      
      onSave(result.onboarding, result.clinic);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Step 5: Partnership Agreement</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Review, verify auto-filled credentials and digitally sign partnership terms</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillAgreementDemoData}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold rounded-xl text-xs cursor-pointer transition-colors shadow-sm shrink-0"
            id="btn-fill-agreement-demo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Điền thông tin mẫu (Demo Fill)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Clickable Table of Contents Sidebar */}
        <div className="lg:col-span-1 space-y-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-h-[500px] overflow-y-auto custom-scrollbar">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 border-b border-gray-100 pb-2">Mục lục Hợp đồng</h4>
          <div className="space-y-1">
            {articles.map((art) => (
              <button
                key={art.id}
                type="button"
                onClick={() => scrollToSection(`art-head-${art.id}`)}
                className="w-full text-left p-2 rounded-lg text-[11px] font-medium text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer block truncate"
              >
                {art.title}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Agreement E-Doc */}
        <div className="lg:col-span-3 space-y-3 relative">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-gray-500">MÃ HỢP ĐỒNG: <strong className="font-mono text-gray-900">{agreementNumber}</strong></span>
            <span className="text-[11px] font-bold text-gray-500">PHIÊN BẢN: <strong className="font-mono text-gray-900">{agreementVersion}</strong></span>
          </div>

          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="bg-white border border-gray-300 rounded-xl p-6 sm:p-10 h-[500px] overflow-y-auto text-xs text-gray-800 leading-relaxed space-y-6 custom-scrollbar shadow-sm text-left font-sans relative"
          >
            {/* Watermark background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
              <h1 className="text-7xl font-black tracking-widest font-sans rotate-12 text-gray-900">UCSMILE PARTNER</h1>
            </div>

            <div className="text-center space-y-1 border-b border-gray-200 pb-5">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
              <p className="font-bold text-gray-800 text-[11px] tracking-wider">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-24 h-0.5 bg-gray-800 mx-auto mt-2"></div>
            </div>

            <div className="text-center space-y-1 pt-2">
              <h4 className="font-serif font-black text-gray-900 text-lg uppercase tracking-wide">HỢP ĐỒNG HỢP TÁC KINH DOANH</h4>
              <p className="italic text-xs text-gray-700 font-medium">(V/v: Cung cấp nền tảng kết nối và dịch vụ tư vấn du lịch nha khoa)</p>
              <p className="text-[11px] text-gray-600 font-mono font-semibold">Số: {agreementNumber}</p>
            </div>

            {/* LEGAL BASES & PREAMBLE */}
            <div className="text-[11px] text-gray-800 space-y-1.5 pt-3 border-t border-gray-200">
              <p className="italic text-gray-700 font-normal pl-2">- Căn cứ Bộ luật Dân sự số 91/2015/QH13;</p>
              <p className="italic text-gray-700 font-normal pl-2">- Căn cứ Luật Thương mại số 36/2005/QH13;</p>
              <p className="italic text-gray-700 font-normal pl-2">- Căn cứ nhu cầu và khả năng của hai bên.</p>
              <p className="pt-2 font-medium text-gray-900">
                Hôm nay, ngày <span className="font-semibold">{currentDate}</span>, tại Đà Nẵng, chúng tôi gồm có:
              </p>
            </div>

            {/* PARTIES DETAILS */}
            <div className="space-y-4 pt-3 border-t border-gray-200">
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 space-y-3">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">BÊN A: CÔNG TY TNHH UCTALENT LABS</h5>
                <div className="space-y-2 text-gray-800 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Mã số thuế:</span><span>0402238274</span></div>
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Văn phòng:</span><span>Software Park 2, Đà Nẵng</span></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Đại diện:</span><span>Ông Nguyễn Ngọc Dương (Django)</span></div>
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Chức vụ:</span><span>Giám đốc</span></div>
                  </div>
                  <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Địa chỉ:</span><span>50 Hoàng Hiệp, Phường Hòa Xuân, TP Đà Nẵng, Việt Nam</span></div>
                  <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Số tài khoản:</span><span>888911 tại Ngân hàng Techcombank (CN Đà Nẵng)</span></div>
                </div>
              </div>

              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 space-y-3">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">BÊN B: {legalClinicName.toUpperCase()}</h5>
                <div className="space-y-2 text-gray-800 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Tên thương mại:</span><span>{tradingName}</span></div>
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Mã số thuế:</span><span>{taxCode}</span></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Đại diện:</span><span>{repName || "........................"}</span></div>
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Chức vụ:</span><span>{repPosition || "........................"}</span></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Email:</span><span>{clinicEmail}</span></div>
                    <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Số điện thoại:</span><span>{clinicPhone}</span></div>
                  </div>
                  <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• Địa chỉ:</span><span>{clinicAddress}</span></div>
                  <div className="flex items-baseline"><span className="w-28 shrink-0 font-semibold text-gray-900">• GP hoạt động:</span><span>{operatingLicenceNumber}</span></div>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-gray-900 pt-2">
              Hai bên thống nhất ký kết Hợp đồng hợp tác kinh doanh với các điều khoản sau:
            </p>

            {/* THE 8 ARTICLES CONTENT */}
            <div className="space-y-6 pt-4 border-t border-gray-100 text-[11px] text-gray-700 text-justify leading-relaxed">
              
              <div id="art-head-1" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ MÔ HÌNH VẬN HÀNH</h5>
                <p className="mb-1">1.1. Bên A cung cấp nền tảng "Da Nang Trust Shield" để kết nối khách hàng quốc tế (trọng tâm là Mỹ, Anh, Úc và Singapore) với Bên B.</p>
                <p className="mb-1">1.2. Bên A triển khai hệ sinh thái công nghệ hỗ trợ gồm: AI Concierge (tư vấn 24/7), Digital Trust Pass (định danh khách hàng qua QR Code) và Digital Dental Passport (lưu trữ bệnh án số).</p>
                <p>1.3. Bên B là đối tác chuyên môn, chịu trách nhiệm cung cấp dịch vụ nha khoa chất lượng cao theo đúng phác đồ và tiêu chuẩn đã công bố trên nền tảng.</p>
              </div>

              <div id="art-head-2" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 2: CAM KẾT GIÁ VÀ BẢO CHỨNG (TRUST SHIELD)</h5>
                <p className="mb-1">2.1. Giá cố định (Fixed-Price): Bên B cam kết cung cấp bảng giá minh bạch cho Bên A. Giá điều trị thực tế tại phòng khám không được vượt quá báo giá đã chốt với khách hàng trên nền tảng (trừ trường hợp phát sinh y tế bắt buộc được khách hàng và Bên A xác nhận).</p>
                <p>2.2. Chế tài vi phạm: Nếu thu vượt giá cam kết, Bên B phải hoàn trả chênh lệch cho khách. Nếu không, Bên A sẽ cộng khoản này vào phí dịch vụ ở kỳ đối soát gần nhất.</p>
              </div>

              <div id="art-head-3" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 3: CHIẾT KHẤU VÀ QUY TRÌNH DÒNG TIỀN</h5>
                <p className="mb-1">3.1. Phí dịch vụ (Hoa hồng):<br />
                - Mức tiêu chuẩn: 25% tổng giá trị hóa đơn.<br />
                - Mức ưu đãi chiến lược (Early Bird): 20% trên tổng giá trị hóa đơn (Áp dụng trong 24 tháng cho những đối tác đầu tiên).</p>
                <p className="mb-1">3.2. Tiền cọc "Trust Shield" (Booking Deposit): Khách hàng thanh toán trước cho Bên A từ 500.000 - 3.000.000 VND để giữ chỗ. Khoản này được khấu trừ trực tiếp vào hóa đơn của khách tại Bên B.</p>
                <p className="mb-1">3.3. Phí Premium Concierge: Khách thanh toán cho Bên A từ 3.000.000 - 5.900.000 VND cho các dịch vụ hỗ trợ VIP. Khoản này thuộc về Bên A, không khấu trừ vào hóa đơn của Bên B.</p>
                <p>3.4. Quyết toán: Chậm nhất ngày 04 hàng tháng, hai bên đối soát doanh thu tháng trước. Bên B thanh toán phí dịch vụ cho Bên A (sau khi đã trừ đi các khoản cọc khách đã trả trước cho Bên A) trong vòng 03 ngày làm việc.</p>
              </div>

              <div id="art-head-4" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 4: CƠ CHẾ CHỐNG BYPASS VÀ QUẢN LÝ KHÁCH HÀNG</h5>
                <p className="mb-1">4.1. Quét mã QR: Bên B có trách nhiệm quét mã QR của khách hàng qua hệ thống của Bên A ngay khi khách đến check-in để kích hoạt bảo hành và ghi nhận nguồn khách.</p>
                <p>4.2. Quyền sở hữu khách hàng: Khách hàng tiếp cận qua nền tảng là khách hàng của Bên A. Bên B không được giao dịch trực tiếp ngoài hệ thống hoặc chào mời các dịch vụ riêng nhằm tránh phí dịch vụ của nền tảng.</p>
              </div>

              <div id="art-head-5" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 5: TRÁCH NHIỆM PHỐI HỢP MEDIA (TRUST SIGNALS)</h5>
                <p className="mb-1">5.1. Trong ít nhất 06 tháng đầu tiên, Bên B cam kết phối hợp và dành thời gian ít nhất 04 giờ/tuần hỗ trợ đội ngũ Media của Bên A thực hiện ghi hình, chụp ảnh quy trình làm việc và phỏng vấn bác sĩ chuyên môn bằng tiếng Anh.</p>
                <p className="mb-1">5.2. Các tư liệu này nhằm mục đích xây dựng "Trust Signals" để quảng bá thương hiệu cho cả hai bên trên thị trường quốc tế.</p>
                <p>5.3. Bản quyền hình ảnh: Bên A được toàn quyền sử dụng các tư liệu này để xây dựng "Trust Signals" (Tín hiệu tin cậy) trên các kênh marketing quốc tế.</p>
              </div>

              <div id="art-head-6" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 6: TRÁCH NHIỆM CHUYÊN MÔN VÀ BẢO HÀNH</h5>
                <p className="mb-1">6.1. Bên B chịu hoàn toàn trách nhiệm về kết quả điều trị và các vấn đề an toàn y khoa.</p>
                <p>6.2. Bên B cam kết thực hiện chính sách bảo hành quốc tế và phối hợp cùng nhân viên và AI Agent của Bên A để theo dõi sức khỏe khách hàng sau khi họ về nước (Post-Op Support) định kỳ (3 ngày, 1 tuần, 1 tháng, 6 tháng) và hỗ trợ tư vấn video call nếu khách hàng gặp sự cố sau khi về nước.</p>
              </div>

              <div id="art-head-7" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 7: HỢP TÁC QUẢNG CÁO & KHUYẾN MÃI (PROMOTION)</h5>
                <p className="mb-1">7.1. Trong 06 tháng đầu tiên, hai bên phối hợp triển khai các chương trình ưu đãi (Promotion) và chạy quảng cáo chung để thu hút khách hàng.</p>
                <p>7.2. Bên B cam kết cung cấp các gói dịch vụ ưu đãi đặc quyền cho khách hàng từ nền tảng của Bên A. Chi tiết về nội dung và ngân sách triển khai sẽ được hai bên thống nhất cụ thể theo từng chiến dịch.</p>
              </div>

              <div id="art-head-8" className="scroll-mt-4">
                <h5 className="font-black text-gray-900 text-xs border-b border-gray-100 pb-1 mb-2 uppercase">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</h5>
                <p className="mb-1">8.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi bổ sung sẽ được lập thành Phụ lục hợp đồng.</p>
                <p>8.2. Trường hợp phát sinh tranh chấp, hai bên ưu tiên thương lượng trên tinh thần cùng phát triển hệ sinh thái Dental Tourism tại Đà Nẵng.</p>
              </div>

            </div>

            {/* Visual Physical Signature and Seal Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-6 pb-2 text-[10px] text-gray-600">
              {/* Party A Signature Box */}
              <div className="space-y-4 text-center border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                <p className="font-extrabold uppercase text-gray-800 tracking-wider">ĐẠI DIỆN BÊN A</p>
                
                <div className="h-28 flex items-center justify-center">
                  <span className="text-gray-300 italic text-xs">Nguyễn Ngọc Dương</span>
                </div>

                <div className="text-[10px] text-gray-500 font-semibold space-y-0.5 border-t border-gray-50 pt-3">
                  <p className="font-bold text-gray-800 text-[11px]">Nguyễn Ngọc Dương</p>
                </div>
              </div>

              {/* Party B Signature Box */}
              <div className="space-y-4 text-center border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                <p className="font-extrabold uppercase text-gray-800 tracking-wider">ĐẠI DIỆN BÊN B</p>
                
                <div className="h-28 flex items-center justify-center">
                  <span className="text-gray-300 italic text-xs">{repName || "Chữ ký đại diện"}</span>
                </div>

                <div className="text-[10px] text-gray-500 font-semibold space-y-0.5 border-t border-gray-50 pt-3">
                  <p className="font-bold text-gray-800 text-[11px]">{repName || "................................................"}</p>
                </div>
              </div>
            </div>

            {/* Ending details */}
            <p className="text-center font-bold text-gray-800 border-t border-gray-100 pt-4 text-[10px]">
              Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau.
            </p>
          </div>

          {/* Floating indicator */}
          <div className="flex justify-between items-center pt-1 px-1">
            <button
              type="button"
              onClick={downloadAgreementHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors shadow-sm"
              title="Download draft document as HTML/Print format"
            >
              <Download className="w-3.5 h-3.5" /> Tải về Bản dự thảo / Download Draft (HTML)
            </button>
            
            {hasScrolledToBottom ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[10px] border border-emerald-150 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" /> Đã đọc hết - Đã mở khóa / Document Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold rounded-full text-[10px] border border-amber-150 uppercase tracking-wider animate-pulse">
                Locked - Cuộn xem hết hợp đồng để mở khóa
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Checkboxes compliance area */}
      <div className={`space-y-4 p-6 border rounded-2xl shadow-sm transition-all ${
        hasScrolledToBottom 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-50 border-gray-200 opacity-60 select-none pointer-events-none'
      }`}>
        <div>
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Xác nhận tuân thủ & Chấp thuận các điều khoản / Compliance & Acceptance
          </h4>
          <p className="text-[11px] text-gray-500 mt-1">Vui lòng rà soát và tích chọn đầy đủ 6 cam kết bắt buộc sau đây / Please review and check all 6 declarations:</p>
        </div>

        <div className="space-y-3">
          {[
            "I confirm that I am the legal representative of the clinic or have been validly authorized to represent the clinic. (Tôi xác nhận mình là người đại diện hợp pháp hoặc được ủy quyền hợp lệ để ký kết cho phòng khám)",
            "I confirm that the clinic holds valid licences and approvals required to provide dental services. (Tôi xác nhận phòng khám sở hữu đầy đủ giấy phép hoạt động chuyên môn nha khoa hợp lệ)",
            "I confirm that all information, pricing and documents submitted during onboarding are complete, accurate and current. (Tôi xác nhận mọi thông tin, bảng giá và hồ sơ tài liệu đã cung cấp là hoàn toàn chính xác và trung thực)",
            "I have read and agree to the Partnership Agreement, including the service fee, deposit, reconciliation and referred customer provisions. (Tôi đã đọc và đồng ý với các điều khoản về phí dịch vụ 25%, tiền cọc, đối soát và bảo vệ khách hàng giới thiệu)",
            "I agree that my representative information, acceptance time, Agreement version, IP address and acceptance records may be stored as evidence of electronic acceptance. (Tôi đồng ý thông tin ký điện tử, IP, thời gian ký sẽ được lưu trữ làm bằng chứng giao dịch hợp pháp)",
            "I understand that submitting this Agreement does not immediately activate the clinic account. The partnership only becomes active after Admin Review and approval. (Tôi hiểu rằng việc nộp hồ sơ này chưa kích hoạt tài khoản ngay. Hợp tác chỉ chính thức kích hoạt sau khi Admin duyệt hồ sơ)"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all cursor-pointer">
              <input 
                type="checkbox"
                required
                disabled={!hasScrolledToBottom}
                checked={checkboxes[idx]}
                onChange={() => handleCheckboxChange(idx)}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 rounded mt-0.5 cursor-pointer accent-emerald-600 disabled:cursor-not-allowed shrink-0"
                id={`checkbox-compliance-${idx}`}
              />
              <label 
                className="text-[11px] text-gray-700 font-medium leading-relaxed cursor-pointer select-none"
                htmlFor={`checkbox-compliance-${idx}`}
              >
                {text}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Representative Information & Signatory Details */}
      <div className={`space-y-6 transition-all ${
        hasScrolledToBottom ? '' : 'opacity-40 select-none pointer-events-none'
      }`}>
        <div>
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-gray-400" /> Thông tin người đại diện ký (Representative Information)
          </h4>
          <p className="text-[11px] text-gray-400 font-medium">Vui lòng cung cấp chính xác thông tin người đại diện theo pháp luật hoặc người được ủy quyền để ký kết Hợp đồng này.</p>
        </div>

        {/* Dynamic input textareas for Signatory Name and Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-150 rounded-2xl shadow-sm space-y-1.5">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
              Representative Full Name (Họ tên người ký đại diện) *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                disabled={!hasScrolledToBottom}
                placeholder="Nguyen Van A"
                value={repName}
                onChange={e => setRepName(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-gray-800 focus:outline-none transition-all placeholder-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-150 rounded-2xl shadow-sm space-y-1.5">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
              Representative Position (Chức danh đại diện ký) *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                disabled={!hasScrolledToBottom}
                placeholder="Managing Director"
                value={repPosition}
                onChange={e => setRepPosition(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-gray-800 focus:outline-none transition-all placeholder-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>



      </div>

      {/* Required Onboarding steps validation banner */}
      {!allRequiredStepsCompleted && (
        <div className="p-4 bg-red-50 border border-red-150 rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-red-800 uppercase tracking-wider">Incomplete Onboarding Requirements</h4>
            <p className="text-[11px] text-red-700 leading-relaxed mt-1">
              You must complete all required preceding onboarding steps before submitting this agreement:
            </p>
            <ul className="list-disc pl-4 mt-1 text-[11px] text-red-600 space-y-0.5">
              {!onboarding?.profileSetupCompleted && <li>Step 1: Clinic Profile Setup is not marked complete</li>}
              {!onboarding?.servicesCompleted && <li>Step 2: Dental Services & Pricing is not marked complete</li>}
              {!onboarding?.workingHoursCompleted && <li>Step 3: Operational Working Hours is not marked complete</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Explanation of post-agreement workflow */}
      {hasScrolledToBottom && checkboxes.every(c => c) && repName.trim() && repPosition.trim() && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 leading-relaxed flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Hệ thống sẽ tự động gửi email xác nhận kèm bản sao hợp đồng điện tử chờ duyệt đến hòm thư <strong className="underline">{clinicEmail}</strong> ngay khi bạn gửi hồ sơ thành công.
          </span>
        </div>
      )}

      {/* Bottom Action Navigation */}
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
          disabled={
            loading || 
            !hasScrolledToBottom || 
            checkboxes.some(c => !c) || 
            !repName.trim() || 
            !repPosition.trim() || 
            !allRequiredStepsCompleted
          }
          className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none cursor-pointer flex items-center gap-1.5 disabled:cursor-not-allowed"
          id="btn-save-agreement"
        >
          {loading ? 'Submitting Application...' : 'Accept and Submit for Review'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}

/* ==========================================
   SUB-COMPONENT: STEP 5 - SUBMISSION & REVIEW
   ========================================== */
function StepSubmissionReview({ 
  clinicId, 
  onboarding, 
  clinic, 
  admin, 
  onSubmitted, 
  onPrev 
}: { 
  clinicId: string, 
  onboarding: any, 
  clinic: any, 
  admin: any, 
  onSubmitted: (onb: any, clinic: any) => void, 
  onPrev: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agreement' | 'hash' | 'emails'>('agreement');
  const [emails, setEmails] = useState<any[]>([]);

  // Fetch simulated emails sent for this clinic on mount
  useEffect(() => {
    fetch(`/api/clinic/onboarding/${clinicId}/emails`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.emails) {
          setEmails(data.emails);
        }
      })
      .catch(err => console.error("Error fetching emails:", err));
  }, [clinicId]);

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

  const isSubmitted = clinic?.status === 'UNDER_REVIEW' || clinic?.status === 'PENDING_REVIEW' || clinic?.status === 'APPROVED';

  // Helper to trigger HTML Agreement download
  const getFullAgreementText = () => {
    const agreementDetails = onboarding?.agreementDetails;
    const agreementNumber = agreementDetails?.agreementNumber || `AGR-${clinicId.substring(0, 8).toUpperCase()}-2026`;
    const legalNameStr = clinic?.legalName || onboarding?.generalInfo?.legalName || clinic?.name || 'PHÒNG KHÁM ĐỐI TÁC';
    const tradingNameStr = clinic?.name || onboarding?.generalInfo?.tradingName || 'Phòng Khám';
    const taxCodeStr = onboarding?.generalInfo?.taxCode || '0400000000';
    const licenceStr = onboarding?.generalInfo?.operatingLicenceNumber || 'N/A';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>HỢP ĐỒNG HỢP TÁC KINH DOANH - ${legalNameStr}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { text-align: center; margin-bottom: 8px; }
    .header-box { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; pb-4; }
    .party-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .footer-stamp { border-top: 2px solid #e2e8f0; margin-top: 40px; pt-16px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header-box">
    <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
    <h4>Độc lập - Tự do - Hạnh phúc</h4>
    <h1>HỢP ĐỒNG HỢP TÁC KINH DOANH</h1>
    <p><em>(V/v: Cung cấp nền tảng kết nối và dịch vụ tư vấn du lịch nha khoa)</em></p>
    <p><strong>Số:</strong> ${agreementNumber}</p>
  </div>
  <div class="party-box">
    <strong>BÊN A: CÔNG TY TNHH UCTALENT LABS</strong><br/>
    MST: 0402238274 | Đại diện: Ông Nguyễn Ngọc Dương (Giám đốc)
  </div>
  <div class="party-box">
    <strong>BÊN B: ${legalNameStr.toUpperCase()}</strong><br/>
    Tên thương mại: ${tradingNameStr} | MST: ${taxCodeStr} | GP: ${licenceStr}
  </div>
  <div class="footer-stamp">
    <p>Hợp đồng được ký kết điện tử thành công qua Nền Tảng UCSmile / Da Nang Trust Shield.</p>
    <p>Mã Bảo Mật: ${agreementDetails?.signatureHash || 'SECURE-HASH-VERIFIED'}</p>
  </div>
</body>
</html>`;
  };

  const downloadAgreementSnapshot = () => {
    const agreementDetails = onboarding?.agreementDetails;
    const agreementNumber = agreementDetails?.agreementNumber || `AGR-${clinicId.substring(0, 8).toUpperCase()}-2026`;
    const htmlContent = getFullAgreementText();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hop_Dong_Hop_Tac_${agreementNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. STATE 1: REVIEWS (UNDER_REVIEW / PENDING_REVIEW) SUCCESS DASHBOARD */}
      {(clinic?.status === 'UNDER_REVIEW' || clinic?.status === 'PENDING_REVIEW') && (
        <div className="space-y-8 animate-fade-in" id="panel-under-review">
          
          {/* Main Success Banner */}
          <div className="p-8 bg-emerald-500/5 border border-emerald-150 rounded-3xl flex flex-col md:flex-row items-center gap-6 text-left">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Submission Completed
              </span>
              <h2 className="font-serif text-xl font-bold text-gray-900">Application Submitted Successfully</h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                “Your Partnership Agreement has been accepted and submitted for Admin Review. Your clinic will become an active UCSmile partner only after approval.”
              </p>
            </div>
          </div>

          {/* Key Application Metadata Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clinic Identity</p>
              <p className="font-extrabold text-base text-gray-900">{clinic?.name || "Elite Dental Care Da Nang"}</p>
              <p className="text-xs text-gray-500">App ID: <span className="font-mono font-medium">{clinicId}</span></p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contract Info</p>
              <p className="font-extrabold text-base text-gray-900">{onboarding?.agreementDetails?.agreementNumber || `AGR-${clinicId.substring(0,8).toUpperCase()}-2026`}</p>
              <p className="text-xs text-gray-500">Version: <span className="font-mono font-medium">{onboarding?.agreementDetails?.termsVersion || "v1.5-partner-2026"}</span></p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification Status</p>
              <p className="font-extrabold text-base text-blue-600">Under Review</p>
              <p className="text-xs text-gray-500">
                Submitted: {onboarding?.agreementDetails?.signedAt ? new Date(onboarding.agreementDetails.signedAt).toLocaleDateString('vi-VN') : "14/7/2026"}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 2. STATE 2: APPROVED DISPLAY */}
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

      {/* 3. STATE 3: READY TO SUBMIT (IF SOMEHOW ACCESSING WITHOUT AGREEMENT COMPLETED) */}
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
              <div className="col-span-2 text-gray-800 font-bold space-y-1 text-left">
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
              <div className="col-span-2 text-gray-800 font-bold space-y-1 text-left">
                <p>Hours Setup: {onboarding.workingHoursCompleted ? '✅ Complete' : '❌ Incomplete'}</p>
              </div>
            </div>

            {/* Outline 4 */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <span className="text-gray-400 font-extrabold uppercase text-[10px]">4. Additional Clinic Info</span>
              <div className="col-span-2 text-gray-800 font-bold space-y-1.5 text-left">
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
              <div className="col-span-2 text-gray-800 font-bold space-y-1 text-left">
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
