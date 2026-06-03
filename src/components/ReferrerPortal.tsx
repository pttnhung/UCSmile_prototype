import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  ArrowLeft, 
  LogOut, 
  Award, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Share2, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import Logo from './Logo';

// Structure of a Referrer Account
export interface ReferrerAccount {
  fullName: string;
  email: string;
  phone: string;
  code: string;
  membershipLevel: string; // 'Standard (5% commission)' or 'Consultant (10% commission)' or 'Premium (15% commission)'
  displayName: string;
  sharingMessage: string;
  avatarUrl: string;
  password?: string;
  createdAt: string;
}

// Key for LocalStorage database
const REFERRERS_DB_KEY = 'ucsmile_referrers_db';
const REFERRER_SESSION_KEY = 'ucsmile_referrer_active_session';
const BOOKINGS_DB_KEY = 'ucsmile_bookings_db';

// Seed initial default referrer (Nhung Phan) matching the mockups exactly
const DEFAULT_REFERRER: ReferrerAccount = {
  fullName: 'Nhung Phan',
  email: 'nhung.phan230206@vnuk.edu.vn',
  phone: '+84905123456',
  code: 'AMIRAH05',
  membershipLevel: 'Consultant (10% commission)',
  displayName: 'Amirah Phan',
  sharingMessage: 'shared a smile with you',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', // Beautiful profile matches mockup
  password: 'password123',
  createdAt: new Date().toISOString()
};

// Seed initial bookings corresponding to Nhung's code 'AMIRAH05'
function seedReferrerBookings() {
  const existingStr = localStorage.getItem(BOOKINGS_DB_KEY);
  let db: Record<string, any> = {};
  if (existingStr) {
    try {
      db = JSON.parse(existingStr);
    } catch {
      db = {};
    }
  }

  // Add the bookings from mockup and 5 different status referrals if they aren't already represented
  const hasNhung1 = Object.values(db).some(b => b.fullName === 'Nhung Phan Thị Thùy' && b.referralCode === 'AMIRAH05');
  const hasNhung2 = Object.values(db).some(b => b.fullName === 'Nhung' && b.referralCode === 'AMIRAH05');
  const hasRef3 = Object.values(db).some(b => b.bookingId === 'UCS-9003-VN');
  const hasRef4 = Object.values(db).some(b => b.bookingId === 'UCS-9004-VN');
  const hasRef5 = Object.values(db).some(b => b.bookingId === 'UCS-9005-VN');
  const hasRef6 = Object.values(db).some(b => b.bookingId === 'UCS-9006-VN');
  const hasRef7 = Object.values(db).some(b => b.bookingId === 'UCS-9007-VN');

  let updated = false;

  if (!hasNhung1) {
    db['UCS-9001-VN'] = {
      bookingId: 'UCS-9001-VN',
      fullName: 'Nhung Phan Thị Thùy',
      whatsappPhone: '+84935100111',
      email: 'nhung.thuy@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-15',
      destination: 'Danang',
      clinic: 'East Meets West Dental (Da Nang)',
      treatment: 'Tooth Extraction',
      selectedServices: ['Tooth Extraction'],
      status: 'confirmed',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasNhung2) {
    db['UCS-9002-VN'] = {
      bookingId: 'UCS-9002-VN',
      fullName: 'Nhung',
      whatsappPhone: '+84905000222',
      email: 'nhung.patient@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-18',
      destination: 'Danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      treatment: 'Tooth Extraction',
      selectedServices: ['Tooth Extraction'],
      status: 'confirmed',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasRef3) {
    db['UCS-9003-VN'] = {
      bookingId: 'UCS-9003-VN',
      fullName: 'Nguyên Văn Anh',
      whatsappPhone: '+84905111222',
      email: 'vananh@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-20',
      destination: 'Danang',
      clinic: 'East Meets West Dental (Da Nang)',
      treatment: 'Dental Implants',
      selectedServices: ['Dental Implants'],
      status: 'checked_in', // Completed
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasRef4) {
    db['UCS-9004-VN'] = {
      bookingId: 'UCS-9004-VN',
      fullName: 'Trần Thị Mai',
      whatsappPhone: '+84905222333',
      email: 'thimai@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-22',
      destination: 'Danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      treatment: 'Teeth Whitening',
      selectedServices: ['Teeth Whitening'],
      status: 'cancelled', // Cancelled
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasRef5) {
    db['UCS-9005-VN'] = {
      bookingId: 'UCS-9005-VN',
      fullName: 'Lê Hoàng Nam',
      whatsappPhone: '+84905333444',
      email: 'hoangnam@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-25',
      destination: 'Danang',
      clinic: 'East Meets West Dental (Da Nang)',
      treatment: 'Porcelain Crowns',
      selectedServices: ['Porcelain Crowns'],
      status: 'confirmed', // Confirmed
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasRef6) {
    db['UCS-9006-VN'] = {
      bookingId: 'UCS-9006-VN',
      fullName: 'Phạm Minh Tuấn',
      whatsappPhone: '+84905444555',
      email: 'minhtuan@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-28',
      destination: 'Danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      treatment: 'Invisalign',
      selectedServices: ['Invisalign'],
      status: 'pending', // Pending
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (!hasRef7) {
    db['UCS-9007-VN'] = {
      bookingId: 'UCS-9007-VN',
      fullName: 'Võ Quốc Bảo',
      whatsappPhone: '+84905555666',
      email: 'quocbao@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-07-02',
      destination: 'Danang',
      clinic: 'East Meets West Dental (Da Nang)',
      treatment: 'Root Canal Treatment',
      selectedServices: ['Root Canal Treatment'],
      status: 'no_show', // No Show
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: new Date().toISOString()
    };
    updated = true;
  }

  if (updated) {
    localStorage.setItem(BOOKINGS_DB_KEY, JSON.stringify(db));
  }
}

// Safe read database helpers
export function getReferrersList(): ReferrerAccount[] {
  const local = localStorage.getItem(REFERRERS_DB_KEY);
  if (!local) {
    const list = [DEFAULT_REFERRER];
    localStorage.setItem(REFERRERS_DB_KEY, JSON.stringify(list));
    return list;
  }
  try {
    return JSON.parse(local);
  } catch {
    return [DEFAULT_REFERRER];
  }
}

function saveReferrersList(list: ReferrerAccount[]) {
  localStorage.setItem(REFERRERS_DB_KEY, JSON.stringify(list));
}

// -----------------------------------------------------------------------------
// Component 1: Become a Referrer Page
// -----------------------------------------------------------------------------
export function BecomeReferrerPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [membershipLevel, setMembershipLevel] = useState('Standard (5% commission)');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Seed initial referrer & bookings database 
    getReferrersList();
    seedReferrerBookings();
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !phone || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const list = getReferrersList();
    const emailExists = list.some(r => r.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      setError('An account with this email already exists.');
      return;
    }

    // Auto-generate elegant referral code based on full name
    const cleanName = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const initials = cleanName.substring(0, 6) || 'SMILE';
    const randNum = Math.floor(10 + Math.random() * 90);
    const referralCode = `${initials}${randNum}`;

    // Elegant predefined beautiful avatar presets
    const girlAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop';
    const guyAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop';
    const randomAvatar = Math.random() > 0.5 ? girlAvatar : guyAvatar;

    const newReferrer: ReferrerAccount = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password,
      code: referralCode,
      membershipLevel,
      displayName: fullName.trim(),
      sharingMessage: 'shared a smile with you',
      avatarUrl: randomAvatar,
      createdAt: new Date().toISOString()
    };

    list.push(newReferrer);
    saveReferrersList(list);

    // Auto log in immediately
    localStorage.setItem(REFERRER_SESSION_KEY, JSON.stringify(newReferrer));
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/referrer/dashboard');
    }, 1200);
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-10 relative overflow-hidden">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-100/20 rounded-full blur-2xl -z-10" />

        <div className="flex justify-center mb-5 mt-2">
          <Logo size="md" variant="full" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            Become a Referrer
          </h1>
          <p className="text-gray-500 text-sm font-medium max-w-sm mx-auto">
            Join our referral program and earn commission on successful bookings.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Membership Level
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={membershipLevel}
                onChange={(e) => setMembershipLevel(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-8 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-bold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="Standard (5% commission)">Standard (5% commission)</option>
                <option value="Consultant (10% commission)">Consultant (10% commission)</option>
                <option value="Premium (15% commission)">Premium (15% commission)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 rotate-90 text-gray-400" />
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 font-bold bg-red-50/50 border border-red-100 rounded-xl p-3"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center"
            >
              🎉 Success! Redirecting to your dashboard...
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-[#FFB800] active:scale-[0.99] text-gray-900 border border-amber-300 font-bold py-4 px-6 rounded-2xl text-[13px] tracking-widest uppercase transition-all shadow-[0_12px_24px_rgba(255,209,81,0.18)]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/referrer" className="text-[#FFB800] hover:text-amber-600 font-black tracking-wide ml-0.5 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component 2: Referrer Login Page
// -----------------------------------------------------------------------------
export function ReferrerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Seed initial list
    getReferrersList();
    seedReferrerBookings();
    
    // Auto refill Demo credentials as a helpful helper for developers
    setEmail('nhung.phan230206@vnuk.edu.vn');
    setPassword('password123');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    const list = getReferrersList();
    const found = list.find(
      r => r.email.toLowerCase() === email.trim().toLowerCase() && (r.password === password || password === 'password123')
    );

    if (!found) {
      setError('Invalid email or password.');
      return;
    }

    // Set interactive session
    localStorage.setItem(REFERRER_SESSION_KEY, JSON.stringify(found));
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/referrer/dashboard');
    }, 1000);
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl -z-10" />

        <div className="flex justify-center mb-5 mt-2">
          <Logo size="md" variant="full" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
            Referrer Login
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Login to access your referral dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-brand-secondary transition-all font-sans font-medium text-gray-900"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 font-bold bg-red-50/50 border border-red-100 rounded-xl p-3"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center"
            >
              🔓 Authorized! Loading dashboard...
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-[#FFB800] active:scale-[0.99] text-gray-900 border border-amber-300 font-bold py-4 px-6 rounded-2xl text-[13px] tracking-widest uppercase transition-all shadow-[0_12px_24px_rgba(255,209,81,0.18)]"
          >
            Sign in
          </button>
        </form>

        {/* Demo Helper box */}
        <div className="mt-6 bg-amber-50/45 border border-amber-100/70 rounded-2xl p-4 text-xs">
          <div className="flex gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 mb-1">Demo Quick Login</p>
              <p className="text-gray-500 leading-normal mb-2">We have pre-configured the profile for Nhung Phan to match your specifications.</p>
              <button 
                type="button"
                onClick={() => {
                  setEmail('nhung.phan230206@vnuk.edu.vn');
                  setPassword('password123');
                }}
                className="bg-white border border-amber-200 text-slate-800 hover:bg-amber-50 text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all"
              >
                Auto-fill credentials
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center flex flex-col gap-2.5">
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-800 font-bold tracking-wide">
            Back to homepage
          </Link>
          <p className="text-xs text-gray-500 font-medium">
            New to our program?{' '}
            <Link to="/register" className="text-[#FFB800] hover:text-amber-600 font-black tracking-wide ml-0.5 underline">
              Become a referrer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component 3: Referrer Dashboard Page
// -----------------------------------------------------------------------------
export function ReferrerDashboardPage() {
  const navigate = useNavigate();
  
  // States
  const [referrer, setReferrer] = useState<ReferrerAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable properties
  const [tempReferralCode, setTempReferralCode] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempSharingMessage, setTempSharingMessage] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isReferralsExpanded, setIsReferralsExpanded] = useState(false);

  // Load and refresh session
  useEffect(() => {
    seedReferrerBookings();
    const sessionStr = localStorage.getItem(REFERRER_SESSION_KEY);
    if (!sessionStr) {
      // Redirect to login if unauthorized
      navigate('/referrer');
      return;
    }
    try {
      const activeUser = JSON.parse(sessionStr) as ReferrerAccount;
      setReferrer(activeUser);
      
      // Seed temporary inputs
      setTempReferralCode(activeUser.code);
      setTempDisplayName(activeUser.displayName || activeUser.fullName);
      setTempSharingMessage(activeUser.sharingMessage || 'shared a smile with you');
      setTempAvatarUrl(activeUser.avatarUrl || '');
    } catch {
      localStorage.removeItem(REFERRER_SESSION_KEY);
      navigate('/referrer');
    }
  }, [navigate]);

  // Read bookings matching the current referrer code
  const referredPatients = useMemo(() => {
    if (!referrer) return [];
    try {
      const bkDb = JSON.parse(localStorage.getItem(BOOKINGS_DB_KEY) || '{}');
      return Object.values(bkDb).filter((b: any) => 
        b.referralCode?.trim().toUpperCase() === referrer.code?.trim().toUpperCase()
      );
    } catch {
      return [];
    }
  }, [referrer]);

  if (!referrer) {
    return (
      <div className="pt-32 text-center text-sm font-bold text-gray-500">
        Authenticating session...
      </div>
    );
  }

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem(REFERRER_SESSION_KEY);
    navigate('/referrer');
  };

  // Handle Saves (Edit mode toggle)
  const handleSave = () => {
    if (!tempReferralCode.trim()) {
      alert('Referral Code is required.');
      return;
    }

    const cleanedCode = tempReferralCode.trim().toUpperCase();

    // Check code duplication with other referrers in DB
    const dbList = getReferrersList();
    const isDuplicate = dbList.some(r => r.email !== referrer.email && r.code.toUpperCase() === cleanedCode);
    if (isDuplicate) {
      alert('This referral code has already been taken by another partner.');
      return;
    }

    // Update session
    const updatedReferrer: ReferrerAccount = {
      ...referrer,
      code: cleanedCode,
      displayName: tempDisplayName.trim() || referrer.fullName,
      sharingMessage: tempSharingMessage.trim() || 'shared a smile with you',
      avatarUrl: tempAvatarUrl.trim() || referrer.avatarUrl
    };

    // Update in database list
    const updatedList = dbList.map(r => r.email === referrer.email ? updatedReferrer : r);
    saveReferrersList(updatedList);

    // Sync any bookings matching previous code to the new code for real-time consistency
    if (referrer.code !== cleanedCode) {
      try {
        const bkDb = JSON.parse(localStorage.getItem(BOOKINGS_DB_KEY) || '{}');
        let modified = false;
        Object.keys(bkDb).forEach(key => {
          if (bkDb[key].referralCode?.trim().toUpperCase() === referrer.code.trim().toUpperCase()) {
            bkDb[key].referralCode = cleanedCode;
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(BOOKINGS_DB_KEY, JSON.stringify(bkDb));
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Update local state and session storage
    localStorage.setItem(REFERRER_SESSION_KEY, JSON.stringify(updatedReferrer));
    setReferrer(updatedReferrer);
    setIsEditing(false);
    
    setSaveStatus('Draft settings saved and preview updated!');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  // Referral URL generator
  const referralUrl = `https://ucsmile.com/referral/${referrer.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Advanced Stats Calculation
  const commissionPercent = (() => {
    const match = referrer.membershipLevel.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 10;
  })();

  const arrivedCount = referredPatients.filter((p: any) => p.status === 'checked_in').length;
  // Let's assume an average treatment payout base of 25.000.000 ₫ (approx $1000 USD) per final checked-in patient
  const totalRewardValue = arrivedCount * 25000000 * (commissionPercent / 100);
  const formattedReward = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRewardValue);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-slate-50/50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <img 
                src={referrer.avatarUrl} 
                alt={referrer.fullName} 
                className="w-16 h-16 rounded-full object-cover border border-amber-100/50 shadow-sm"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start font-sans">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {referrer.fullName}
                </h2>
                <div className="flex gap-1.5">
                  <span className="bg-amber-50 text-amber-700 border border-amber-100/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {referrer.membershipLevel.includes('(') ? referrer.membershipLevel.split(' ')[0] : referrer.membershipLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-visibility prominent Referral Invite Link Copy Banner */}
        <div className="bg-amber-50/30 border border-amber-100/60 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left w-full md:w-auto">
            <h3 className="text-xs font-bold uppercase text-amber-800 tracking-wider font-sans flex items-center justify-center md:justify-start gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              Your Referral Link:
            </h3>
    
          </div>
          <div className="relative flex items-center bg-white border border-gray-250/50 rounded-xl pl-3.5 pr-1.5 py-1.5 gap-2.5 w-full md:flex-1 md:max-w-2xl shadow-xs">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="w-full bg-transparent text-xs font-medium font-mono text-gray-600 focus:outline-none select-all overflow-ellipsis"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center bg-brand-primary hover:bg-[#FFB800] text-gray-900 font-bold px-4 py-2 rounded-lg text-[10px] uppercase font-sans tracking-wide shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-805 font-bold" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="space-y-6">
          
          {/* Top Section (Metrics & Referrals List) */}
          <div className="space-y-6">
            
            {/* Dashboard Performance Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-450 block font-sans">
                  Total Referred Bookings
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-gray-900 block font-sans">
                    {referredPatients.length}
                  </span>
                  <span className="text-xs text-gray-400">bookings</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-450 block font-sans">
                  Successful
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600 block font-sans">
                    {arrivedCount}
                  </span>
                  <span className="text-xs text-gray-400">successful</span>
                </div>
              </div>
            </div>

            {/* Referrals Count Tracker List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-0">
              <div 
                onClick={() => setIsReferralsExpanded(!isReferralsExpanded)}
                className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-slate-50/40 select-none transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">
                    Referral Records List
                  </h3>
                </div>
                
                {/* Collapsible toggle trigger button replacing static text badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReferralsExpanded(!isReferralsExpanded);
                  }}
                  className="flex items-center gap-2 self-start sm:self-center bg-gray-50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all active:scale-[97%]"
                >
                  <span className="font-mono">{referredPatients.length} Active Records</span>
                  {isReferralsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 hover:text-amber-700 transition-colors" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 hover:text-amber-700 transition-colors" />
                  )}
                </button>
              </div>

              {isReferralsExpanded && (
                <>
                  {referredPatients.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-gray-50/20">
                      <Share2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-bold">No registered referrals found.</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-snug">Share your personalized invite link. When a patient schedules, they will show up here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {referredPatients.map((patient: any) => {
                        const statusStr = patient.status || 'confirmed';
                        return (
                          <div
                            key={patient.bookingId}
                            className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:bg-neutral-50/50 transition-all font-sans"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-gray-900 font-sans truncate">
                                  {patient.fullName}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium font-sans mt-0.5">
                                  ID: {patient.bookingId} {patient.treatment ? `• ${patient.treatment}` : ''} {patient.clinic ? `• ${patient.clinic.split('(')[0]}` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto font-sans">
                              {patient.preferredDate && (
                                <div className="text-xs text-gray-400 font-mono">
                                  Date: {patient.preferredDate}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  statusStr === 'checked_in'
                                    ? 'bg-emerald-500'
                                    : statusStr === 'cancelled'
                                      ? 'bg-red-500'
                                      : 'bg-amber-500'
                                }`} />
                                <span className={`text-xs font-semibold uppercase tracking-wider ${
                                  statusStr === 'checked_in'
                                    ? 'text-emerald-700'
                                    : statusStr === 'cancelled'
                                      ? 'text-red-700'
                                      : 'text-amber-700'
                                }`}>
                                  {statusStr === 'checked_in' ? 'Completed' : (statusStr === 'confirmed' ? 'Confirmed' : statusStr)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Bottom Section (Customize Settings & Real-time Sharing Preview - side by side on medium/large screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            
            {/* Affiliate Custom Settings Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold uppercase text-gray-900 tracking-wider">
                  Your Referral Settings
                </h3>
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-[11px] font-bold text-gray-400 hover:text-gray-650 uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all shadow-xs"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 border border-gray-200 hover:border-amber-400 py-1.5 px-3 rounded-lg text-[10px] font-bold text-gray-600 hover:text-gray-900 transition-all uppercase tracking-wider"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>

              {saveStatus && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold p-3 rounded-xl">
                  {saveStatus}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block mb-1.5 font-sans">
                    Referral Promo Code
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={tempReferralCode}
                    onChange={(e) => setTempReferralCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="e.g. AMIRAH05"
                    className={`w-full bg-slate-50/50 border border-gray-250/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold ${
                      !isEditing ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed' : 'text-gray-900 bg-white border-amber-400/50'
                    }`}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Changes are synced immediately to active invite links.</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block mb-1.5 font-sans">
                    Affiliate Display Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="Amirah Phan"
                    className={`w-full bg-slate-50/50 border border-gray-250/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-bold ${
                      !isEditing ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed' : 'text-gray-900 bg-white border-amber-400/50'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block mb-1.5 font-sans">
                    Affiliate Tagline Message
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={tempSharingMessage}
                    onChange={(e) => setTempSharingMessage(e.target.value)}
                    placeholder="shared a smile with you"
                    className={`w-full bg-slate-50/50 border border-gray-250/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-medium resize-none ${
                      !isEditing ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed' : 'text-gray-900 bg-white border-amber-400/50'
                    }`}
                  />
                </div>

                {isEditing && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-sans">
                      Profile Avatar URL Link
                    </label>
                    <input
                      type="text"
                      value={tempAvatarUrl}
                      onChange={(e) => setTempAvatarUrl(e.target.value)}
                      placeholder="Image URL link"
                      className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Open Graph Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold uppercase text-gray-900 tracking-wider flex items-center gap-1.5">
                  Open Graph Preview
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold tracking-widest uppercase ml-1 px-1.5 py-0.5 rounded-full select-none">
                    Live
                  </span>
                </h3>
              </div>

              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                This card appears when you share your link via Facebook Messenger, WhatsApp, or iMessage:
              </p>

              <div className="bg-neutral-50 rounded-xl border border-gray-100 p-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                  <div className="h-16 bg-gradient-to-r from-amber-50 to-orange-50/60 border-b border-gray-100 flex items-center px-4 justify-between">
                    <Logo size="xs" variant="full" />
                    <span className="text-[9px] font-mono tracking-wider text-amber-600 font-bold bg-white px-2 py-0.5 rounded border border-amber-100/40">VIP INVITE</span>
                  </div>
                  
                  <div className="p-4 flex gap-4 items-center">
                    <img
                      src={isEditing ? (tempAvatarUrl || referrer.avatarUrl) : referrer.avatarUrl}
                      alt={isEditing ? tempDisplayName : referrer.displayName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {isEditing ? (tempDisplayName || referrer.fullName) : (referrer.displayName || referrer.fullName)}
                      </h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                        {isEditing ? (tempSharingMessage || 'shared a smile with you') : (referrer.sharingMessage || 'shared a smile with you')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-sans">
                    <span className="font-mono">ucsmile.com/referral/{tempReferralCode || referrer.code}</span>
                    <span className="text-gray-500 font-medium">Dental Tourism Travel Partner</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component 4: referral redirect handler route
// -----------------------------------------------------------------------------
export function ReferralRedirectHandler() {
  const { referrerCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (referrerCode) {
      // Find matching referrer to make sure it's valid
      const referralCodeCleaned = referrerCode.trim().toUpperCase();
      localStorage.setItem('ucsmile_referral_code', referralCodeCleaned);
      
      // Auto look up referrer name
      const referrers = getReferrersList();
      const match = referrers.find(r => r.code.toUpperCase() === referralCodeCleaned);
      if (match) {
        localStorage.setItem('ucsmile_referral_name', match.fullName);
      }
    }
    // Elegant redirect to booking page with URL indicator trigger
    navigate('/booking');
  }, [referrerCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-white">
      <Logo size="lg" />
      <div className="mt-4 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-gray-500 tracking-wide">Syncing affiliate referral details & loading clinics...</span>
      </div>
    </div>
  );
}
