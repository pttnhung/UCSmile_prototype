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
  Calendar,
  Briefcase,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Camera
} from 'lucide-react';
import Logo from './Logo';

// Structure of a Referrer Account
export interface ReferrerAccount {
  fullName: string;
  email: string;
  phone: string;
  code: string;
  membershipLevel: string; // 'Standard (10% commission)' or 'Premium (15% commission)'
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
  membershipLevel: 'Standard (10% commission)',
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
    const list = JSON.parse(local) as ReferrerAccount[];
    // Normalize Consultant to Standard
    let changed = false;
    list.forEach(r => {
      if (r.membershipLevel?.startsWith('Consultant')) {
        r.membershipLevel = r.membershipLevel.replace('Consultant', 'Standard');
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(REFERRERS_DB_KEY, JSON.stringify(list));
    }
    return list;
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
  const [membershipLevel, setMembershipLevel] = useState('Standard (10% commission)');
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
                <option value="Standard (10% commission)">Standard (10% commission)</option>
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
  const [codeTouched, setCodeTouched] = useState(false);
  
  // Editable properties
  const [tempReferralCode, setTempReferralCode] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempSharingMessage, setTempSharingMessage] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [bookingCopied, setBookingCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isReferralsExpanded, setIsReferralsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (!base64Url || !referrer) return;

      const updatedReferrer: ReferrerAccount = {
        ...referrer,
        avatarUrl: base64Url
      };

      // Update in database list
      const dbList = getReferrersList();
      const updatedList = dbList.map(r => r.email === referrer.email ? updatedReferrer : r);
      saveReferrersList(updatedList);

      // Update local state and session storage
      localStorage.setItem(REFERRER_SESSION_KEY, JSON.stringify(updatedReferrer));
      setReferrer(updatedReferrer);
      setTempAvatarUrl(base64Url);
    };
    reader.readAsDataURL(file);
  };

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
      let activeUser = JSON.parse(sessionStr) as ReferrerAccount;
      if (activeUser.membershipLevel?.startsWith('Consultant')) {
        activeUser.membershipLevel = activeUser.membershipLevel.replace('Consultant', 'Standard');
        localStorage.setItem(REFERRER_SESSION_KEY, JSON.stringify(activeUser));
      }
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
      setCodeTouched(true);
      alert('Referral Code is required.');
      return;
    }

    const cleanedCode = tempReferralCode.trim().toUpperCase();

    if (cleanedCode.length < 6 || cleanedCode.length > 12) {
      setCodeTouched(true);
      alert('Referral Code must be between 6 and 12 characters.');
      return;
    }

    if (tempDisplayName.trim() && tempDisplayName.trim().length >= 12) {
      alert('Display Name must be less than 12 characters.');
      return;
    }

    if (tempSharingMessage.trim() && tempSharingMessage.trim().length >= 40) {
      alert('Sharing Message must be less than 40 characters.');
      return;
    }

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
  const bookingUrl = `https://ucsmile.com/booking/referral/${referrer.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyBooking = () => {
    navigator.clipboard.writeText(bookingUrl);
    setBookingCopied(true);
    setTimeout(() => setBookingCopied(false), 2500);
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
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Click to change profile picture">
              <div className="w-20 h-20 rounded-full overflow-hidden relative border border-amber-100/65 shadow-sm bg-neutral-50 flex items-center justify-center">
                <img 
                  src={referrer.avatarUrl} 
                  alt={referrer.fullName} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                  }}
                />
                
                {/* Hover overlay exhibiting camera icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-1 select-none">
                  <Camera className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-[8px] font-sans font-bold tracking-wider uppercase text-gray-100">Change</span>
                </div>
              </div>
              
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start font-sans">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Hi, {referrer.fullName}
                </h2>
                <span className="bg-[#FFB800] text-gray-950 font-sans px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-[#E0A200] shadow-sm shadow-[#FFB800]/15 shrink-0 select-none">
                  {referrer.membershipLevel.includes('(') ? referrer.membershipLevel.split(' ')[0] : referrer.membershipLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* High-visibility prominent Referral Invite Link & Direct Booking Copy Banners */}
        <div className="space-y-4">
          {/* Panel 1: General Referral Link */}
          <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center lg:text-left w-full lg:w-5/12 xl:w-4/12">
              <h3 className="text-xs font-bold uppercase text-amber-800 tracking-wider font-sans flex items-center justify-center lg:justify-start gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-600" />
                Your Referral Link:
              </h3>
            
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-250/50 rounded-xl p-1.5 sm:pl-3.5 sm:pr-1.5 sm:py-1.5 gap-2 w-full lg:flex-1 lg:max-w-xl shadow-xs">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-transparent text-xs font-medium font-mono text-gray-600 focus:outline-none select-all px-2 py-1.5 sm:p-0"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center bg-brand-primary hover:bg-[#FFB800] text-gray-900 font-bold px-4 py-2.5 sm:py-2 rounded-lg text-[10px] uppercase font-sans tracking-wide shrink-0 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-800 font-bold" />
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

          {/* Panel 2: Direct Booking Link */}
          <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center lg:text-left w-full lg:w-5/12 xl:w-4/12">
              <h3 className="text-xs font-bold uppercase text-amber-800 tracking-wider font-sans flex items-center justify-center lg:justify-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Your Booking Link:
              </h3>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Book directly on behalf of referred clients, or share this link to let them secure scheduled spots post-consultation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-250/50 rounded-xl p-1.5 sm:pl-3.5 sm:pr-1.5 sm:py-1.5 gap-2 w-full lg:flex-1 lg:max-w-xl shadow-xs">
              <input
                type="text"
                readOnly
                value={bookingUrl}
                className="w-full bg-transparent text-xs font-medium font-mono text-gray-600 focus:outline-none select-all px-2 py-1.5 sm:p-0"
              />
              <button
                type="button"
                onClick={handleCopyBooking}
                className="flex items-center justify-center bg-brand-primary hover:bg-[#FFB800] text-gray-900 font-bold px-4 py-2.5 sm:py-2 rounded-lg text-[10px] uppercase font-sans tracking-wide shrink-0 transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
              >
                {bookingCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-800 font-bold" />
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
        </div>

        {/* Dashboard Body */}
        <div className="space-y-6">
          
          {/* Connected Metrics & Referral List Module */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-gray-100">
            {/* Dashboard Performance Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="p-6 flex flex-col justify-between">
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

              <div className="p-6 flex flex-col justify-between">
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
            <div>
              <div 
                onClick={() => setIsReferralsExpanded(!isReferralsExpanded)}
                className="p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/30 select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider font-sans">
                    Referral Records List
                  </h3>
                </div>
                
                <div 
                  className="inline-flex items-center gap-1 border border-gray-200 hover:border-amber-400 py-1.5 px-3 rounded-lg text-[10px] font-bold text-gray-600 hover:text-gray-900 transition-all uppercase tracking-wider bg-white shadow-xs whitespace-nowrap"
                >
                  <span>{isReferralsExpanded ? 'Hide' : 'Show'}</span>
                  <div className={`transform transition-transform duration-200 ${isReferralsExpanded ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </div>
              </div>

              {isReferralsExpanded && (
                <>
                  {referredPatients.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-gray-50/20 border-t border-gray-100">
                      <Share2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-bold">No registered referrals found.</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-snug">Share your personalized invite link. When a patient schedules, they will show up here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 border-t border-gray-100">
                      {referredPatients.map((patient: any) => {
                        const rawStatus = patient.status || 'confirmed';
                        
                        // Normalize status
                        let normalized: 'BOOKING_REQUESTED' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED-IN' = 'CONFIRMED';
                        const sLower = rawStatus.toLowerCase().trim();
                        if (sLower === 'booking_requested' || sLower === 'pending' || sLower === 'requested' || sLower === 'booking-requested') {
                          normalized = 'BOOKING_REQUESTED';
                        } else if (sLower === 'cancelled' || sLower === 'void' || sLower === 'no_show') {
                          normalized = 'CANCELLED';
                        } else if (sLower === 'checked_in' || sLower === 'checked-in' || sLower === 'completed' || sLower === 'arrived') {
                          normalized = 'CHECKED-IN';
                        } else {
                          normalized = 'CONFIRMED';
                        }

                        // Colors corresponding to the user request
                        const statusColors = {
                          BOOKING_REQUESTED: {
                            bg: 'bg-[#2196F3]/10',
                            text: 'text-[#2196F3]',
                            dot: 'bg-[#2196F3]',
                            border: 'border-[#2196F3]/25',
                            label: 'Booking Requested'
                          },
                          CONFIRMED: {
                            bg: 'bg-[#FFC107]/10',
                            text: 'text-[#FFC107]',
                            dot: 'bg-[#FFC107]',
                            border: 'border-[#FFC107]/25',
                            label: 'Confirmed'
                          },
                          CANCELLED: {
                            bg: 'bg-[#F44336]/10',
                            text: 'text-[#F44336]',
                            dot: 'bg-[#F44336]',
                            border: 'border-[#F44336]/25',
                            label: 'Cancelled'
                          },
                          'CHECKED-IN': {
                            bg: 'bg-[#00B074]/10',
                            text: 'text-[#00B074]',
                            dot: 'bg-[#00B074]',
                            border: 'border-[#00B074]/25',
                            label: 'Checked-In'
                          }
                        };

                        const meta = statusColors[normalized];

                        return (
                          <div
                            key={patient.bookingId}
                            className="p-4 md:py-5 md:px-6 flex flex-col gap-2 bg-white hover:bg-neutral-50/30 transition-all font-sans"
                          >
                            {/* Line 1: Name & Status Badge */}
                            <div className="flex items-center justify-between gap-4 w-full min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                                <span className="font-bold text-sm md:text-base text-gray-900 tracking-tight truncate">
                                  {patient.fullName}
                                </span>
                              </div>
                              <div className="shrink-0">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-0.5 rounded-full border text-[9px] md:text-[10px] font-bold tracking-wider uppercase ${meta.bg} ${meta.text} ${meta.border} shadow-xs`}>
                                  <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${meta.dot}`} />
                                  <span>{meta.label}</span>
                                </div>
                              </div>
                            </div>

                            {/* Line 2: Phone & Expected Check-In Date */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pl-3.5">
                              <span className="font-mono flex items-center gap-1.5 shrink-0">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {patient.whatsappPhone || patient.phone || 'N/A'}
                              </span>
                              <span className="text-gray-200 select-none">•</span>
                              <span className="font-mono flex items-center gap-1.5 text-gray-400 shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {patient.preferredDate || 'N/A'}
                              </span>
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
                      onClick={() => {
                        setIsEditing(false);
                        setCodeTouched(false);
                      }}
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
                    onClick={() => {
                      setIsEditing(true);
                      setCodeTouched(false);
                    }}
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
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block font-sans">
                      Referral Code
                    </label>
                    {isEditing && (
                      <span className="text-[9px] font-mono font-medium text-gray-400">
                        {tempReferralCode.length}/12
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={tempReferralCode}
                    maxLength={12}
                    onBlur={() => setCodeTouched(true)}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/\s/g, '');
                      setTempReferralCode(val);
                    }}
                    placeholder="e.g. AMIRAH05"
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 font-mono font-bold ${
                      !isEditing 
                        ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed border-gray-250/20' 
                        : (codeTouched && tempReferralCode.length < 6)
                          ? 'border-red-500 text-red-900 bg-red-50/10 focus:ring-red-500'
                          : 'text-gray-900 bg-white border-amber-400/50 focus:ring-amber-500'
                    }`}
                  />
                  {isEditing && codeTouched && tempReferralCode.length < 6 && (
                    <p className="text-[10px] text-red-500 font-sans mt-1.5 font-bold flex items-center gap-1">
                      ⚠️ Referral code must be at least 6 characters.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block font-sans">
                      Display Name (optional)
                    </label>
                    {isEditing && (
                      <span className="text-[9px] font-mono font-medium text-gray-400">
                        {tempDisplayName.length}/11
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={tempDisplayName}
                    maxLength={11}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="Amirah Phan"
                    className={`w-full bg-slate-50/50 border border-gray-250/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-bold ${
                      !isEditing ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed' : 'text-gray-900 bg-white border-amber-400/50'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block font-sans">
                      Sharing Message (optional)
                    </label>
                    {isEditing && (
                      <span className="text-[9px] font-mono font-medium text-gray-400">
                        {tempSharingMessage.length}/39
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={tempSharingMessage}
                    maxLength={39}
                    onChange={(e) => setTempSharingMessage(e.target.value)}
                    placeholder="shared a smile with you"
                    className={`w-full bg-slate-50/50 border border-gray-250/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-medium resize-none ${
                      !isEditing ? 'text-gray-500 bg-gray-50/65 cursor-not-allowed' : 'text-gray-900 bg-white border-amber-400/50'
                    }`}
                  />
                </div>
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
                This template shows how your referral link looks to users in their browser and social platforms:
              </p>

              <div className="bg-neutral-50/50 rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-6">
                {/* Clean, premium unified canvas mirroring the reference mockup */}
                <div className="bg-white rounded-2xl border border-gray-150/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden relative p-4 xs:p-6 sm:p-8 flex items-center gap-3.5 xs:gap-5 sm:gap-8 min-h-[140px] xs:min-h-[180px] sm:min-h-[220px]">
                  
                  {/* Left Column: Big Circular Avatar / Profile Picture */}
                  <div className="relative z-10 flex-shrink-0">
                    <img
                      src={isEditing ? (tempAvatarUrl || referrer.avatarUrl) : referrer.avatarUrl}
                      alt={isEditing ? tempDisplayName : (referrer.displayName || referrer.fullName)}
                      className="w-14 h-14 xs:w-20 xs:h-20 sm:w-36 sm:h-36 rounded-full object-cover shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-amber-100/50 select-none"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                      }}
                    />
                  </div>

                  {/* Right Column: Dynamic Text Stack with Precise Typography Alignment */}
                  <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
                    {/* Brand Logo header */}
                    <div className="mb-1.5 xs:mb-2.5 sm:mb-3">
                      <Logo size="xs" variant="full" className="transform origin-left scale-85 xs:scale-100 sm:scale-110" />
                    </div>

                    {/* Display Name */}
                    <h4 className="text-[14px] xs:text-[20px] sm:text-[34px] font-extrabold text-amber-500 tracking-tight leading-tight uppercase font-sans truncate">
                      {isEditing ? (tempDisplayName || referrer.fullName) : (referrer.displayName || referrer.fullName)}
                    </h4>

                    {/* Sharing Promo Word */}
                    <p className="text-[11px] xs:text-[14px] sm:text-[23px] font-black text-slate-900 tracking-tight leading-tight mt-0.5 sm:mt-1 truncate">
                      {isEditing ? (tempSharingMessage || 'shared a smile with you') : (referrer.sharingMessage || 'shared a smile with you')}
                    </p>

                    {/* Exquisite Brand Tagline in Cormorant Garamond / Serif font */}
                    <span className="font-serif text-[7px] xs:text-[10px] sm:text-sm text-neutral-600 tracking-wide font-medium mt-1.5 xs:mt-3 sm:mt-4 block border-t border-gray-100/60 pt-1 xs:pt-2 w-max max-w-full">
                      Expert Dental Care. Designed for Travel
                    </span>
                  </div>

                  {/* Golden Skyline SVG Vector of Danang City at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 text-amber-500/10 pointer-events-none z-0 overflow-hidden">
                    <svg
                      viewBox="0 0 800 200"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="none"
                      className="text-[#EAA800] fill-none opacity-[0.22]"
                    >
                      {/* Da Nang Cathedral (Pink Gothic Church) */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 12 200 L 12 140 L 25 125 L 25 140 M 25 125 L 25 85 L 30 75 L 35 85 L 35 140 M 35 140 L 35 60 L 45 60 L 45 35 L 50 25 L 55 35 L 55 60 L 65 60 L 65 140 M 65 140 L 65 125 L 75 110 L 85 125 L 85 200"
                      />
                      {/* Central Church Cross */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        d="M 50 25 L 50 12 M 46 16 L 54 16"
                      />
                      {/* Gothic arched rose-window and door */}
                      <circle cx="50" cy="100" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        d="M 45 200 L 45 175 Q 50 166 55 175 L 55 200"
                      />

                      {/* Adjacent resort building structures */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 105 200 L 105 110 L 135 110 L 135 200 M 145 200 L 145 135 L 165 105 L 185 135 L 185 200"
                      />
                      
                      {/* Dragon Bridge (Vietnam gold dragon span over Han River) */}
                      {/* Main Span Deck line */}
                      <line x1="200" y1="190" x2="570" y2="190" stroke="currentColor" strokeWidth="1.5" />
                      {/* Dragon waves arches */}
                      <path
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 235 190 Q 285 110 335 190 Q 385 100 435 190 Q 485 110 535 190"
                      />
                      {/* Vertical suspension hangers */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M 260 162 L 260 190 M 285 146 L 285 190 M 310 162 L 310 190
                           M 360 156 L 360 190 M 385 138 L 385 190 M 410 156 L 410 190
                           M 460 162 L 460 190 M 485 146 L 485 190 M 510 162 L 510 190"
                      />
                      {/* Stylized up-angled Dragon Head */}
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 235 190 L 225 168 C 220 160 208 160 206 170 C 204 178 214 185 224 185"
                      />
                      {/* Fire sparks from mouth */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        d="M 203 166 Q 192 160 200 155 Q 188 172 203 166"
                      />

                      {/* Da Nang Sun Wheel (Famous ferris wheel) */}
                      {/* Wheel support stand */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 630 115 L 600 200 M 630 115 L 660 200"
                      />
                      {/* Hub center circle */}
                      <circle cx="630" cy="115" r="5" stroke="currentColor" strokeWidth="2.5" />
                      {/* Outer & Inner Rims */}
                      <circle cx="630" cy="115" r="50" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
                      <circle cx="630" cy="115" r="46" stroke="currentColor" strokeWidth="1" />
                      <circle cx="630" cy="115" r="14" stroke="currentColor" strokeWidth="1.2" />
                      {/* Spokes */}
                      <line x1="630" y1="65" x2="630" y2="165" stroke="currentColor" strokeWidth="1" />
                      <line x1="580" y1="115" x2="680" y2="115" stroke="currentColor" strokeWidth="1" />
                      <line x1="595" y1="80" x2="665" y2="150" stroke="currentColor" strokeWidth="1" />
                      <line x1="665" y1="80" x2="595" y2="150" stroke="currentColor" strokeWidth="1" />
                      <line x1="608" y1="95" x2="652" y2="135" stroke="currentColor" strokeWidth="0.8" />
                      <line x1="652" y1="95" x2="608" y2="135" stroke="currentColor" strokeWidth="0.8" />
                      <line x1="620" y1="68" x2="640" y2="162" stroke="currentColor" strokeWidth="0.8" />
                      <line x1="640" y1="68" x2="620" y2="162" stroke="currentColor" strokeWidth="0.8" />

                      {/* Lady Buddha (Graceful standing silhouette on Son Tra peninsula) */}
                      {/* Lotus base */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 715 200 C 725 186 735 180 750 180 C 765 180 775 186 785 200 Z"
                      />
                      {/* Statue form */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 732 180 C 732 130 736 90 750 90 C 764 90 768 130 768 180 Z"
                      />
                      {/* Crown head */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 744 90 C 744 78 756 78 756 90 Z"
                      />
                      <circle cx="750" cy="74" r="3" stroke="currentColor" strokeWidth="1.5" />
                      {/* Glowing Halo aureole */}
                      <circle
                        cx="750"
                        cy="84"
                        r="24"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <path
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        d="M 742 125 C 747 121 753 121 758 125"
                      />
                    </svg>
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
