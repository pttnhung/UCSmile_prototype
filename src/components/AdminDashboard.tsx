import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Lock, 
  Search, 
  Filter, 
  ChevronDown, 
  Plus, 
  ShieldAlert, 
  LifeBuoy, 
  Check, 
  X, 
  Briefcase, 
  History, 
  FileText, 
  MapPin, 
  Edit3, 
  Save, 
  Phone, 
  Mail, 
  Building,
  UserCheck,
  UserMinus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Type definitions matching server.ts exactly
interface Booking {
  bookingId: string;
  fullName: string;
  whatsappPhone: string;
  email: string;
  nationality: string;
  preferredDate: string;
  destination: string;
  clinic: string;
  preferredSession: string;
  confirmedHour: string;
  treatment: string;
  selectedServices: string[];
  serviceQuantities?: Record<string, number>;
  additionalDetails?: string;
  status: 'BOOKING_REQUESTED' | 'CONFIRMED' | 'CHECKED-IN' | 'CANCELLED';
  created_by: 'Patient' | 'Staff' | 'Consultant';
  referralCode?: string;
  referrerName?: string;
  referralStatus?: string;
  internalNotes?: string;
  created_at: string;
  lastUpdated: string;
  commissionStatus: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
}

interface Referrer {
  fullName: string;
  email: string;
  phone: string;
  code: string;
  membershipLevel: 'Standard' | 'Consultant';
  status: 'Active' | 'Inactive';
  pendingUpgradeReview: boolean;
  createdAt: string;
}

interface SupportRequest {
  id: string;
  submittedBy: string;
  relatedBookingCode?: string;
  requestType: 'Cancellation' | 'Reschedule' | 'Referral Issue' | 'Other';
  message: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
  createdAt: string;
  internalNotes?: string;
}

interface AdminLog {
  id: string;
  action: string;
  updatedBy: string;
  updatedAt: string;
  previousValue: string;
  newValue: string;
}

interface Clinic {
  id: string;
  name: string;
  location: string;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('ucsmile_admin_token'));
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string } | null>(() => {
    const saved = localStorage.getItem('ucsmile_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Core Data State
  const [stats, setStats] = useState<any>(null);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [referrersList, setReferrersList] = useState<Referrer[]>([]);
  const [supportRequestsList, setSupportRequestsList] = useState<SupportRequest[]>([]);
  const [clinicsList, setClinicsList] = useState<Clinic[]>([]);
  const [logsList, setLogsList] = useState<AdminLog[]>([]);
  const [onboardingsList, setOnboardingsList] = useState<any[]>([]);

  // Page level messaging states (AC 12)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Active Main Tab
  // Options: 'overview' | 'bookings' | 'referrals' | 'referrers' | 'support' | 'clinics' | 'logs'
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'referrals' | 'referrers' | 'support' | 'clinics' | 'logs'>('overview');

  // Booking details & status update states (AC 4)
  const [selectedBookingForStatus, setSelectedBookingForStatus] = useState<Booking | null>(null);
  const [pendingStatusTarget, setPendingStatusTarget] = useState<Booking['status'] | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [bookingNotesEdit, setBookingNotesEdit] = useState<Record<string, string>>({});
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  // Search & Filter parameters (AC 9)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCreatedBy, setFilterCreatedBy] = useState<string>('All');
  const [filterClinic, setFilterClinic] = useState<string>('All');
  const [filterReferrerLevel, setFilterReferrerLevel] = useState<string>('All');
  const [filterCommissionStatus, setFilterCommissionStatus] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Support request handle state (AC 8)
  const [activeSupportNotes, setActiveSupportNotes] = useState<Record<string, string>>({});

  // Fetch admin dashboard package
  const fetchData = async (tokenString: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${tokenString}`
        }
      });
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw new Error("You do not have permission to perform this action.");
        }
        throw new Error("Unable to load admin dashboard data. Please try again.");
      }
      const data = await res.json();
      setStats(data.stats);
      setBookingsList(data.bookings || []);
      setReferrersList(data.referrers || []);
      setSupportRequestsList(data.supportRequests || []);
      setClinicsList(data.clinics || []);
      setLogsList(data.logs || []);

      // Fetch clinic onboarding applications as well
      const onbRes = await fetch('/api/admin/onboardings', {
        headers: {
          'Authorization': `Bearer ${tokenString}`
        }
      });
      if (onbRes.ok) {
        const onbData = await onbRes.json();
        setOnboardingsList(onbData.onboardings || []);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Unable to load admin dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchData(adminToken);
    } else {
      // Direct auto refill of admin credentials for supreme developer ease of use
      setLoginEmail('nhung.phan230206@vnuk.edu.vn');
      setLoginPassword('password123');
    }
  }, [adminToken]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid email or password.");
      }

      const data = await res.json();
      localStorage.setItem('ucsmile_admin_token', data.token);
      localStorage.setItem('ucsmile_admin_user', JSON.stringify(data.user));
      setAdminToken(data.token);
      setAdminUser(data.user);
      showToast("Access Granted. Welcome to UCSmile Central Control.");
    } catch (err: any) {
      setLoginError(err.message || "Could not complete login. Please verify connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem('ucsmile_admin_token');
    localStorage.removeItem('ucsmile_admin_user');
    setAdminToken(null);
    setAdminUser(null);
    setBookingsList([]);
    setStats(null);
  };

  // Helper for triggering temporary visual toast
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // AC 4 - Perform status change
  const initiateStatusChange = (booking: Booking, newStatus: 'BOOKING_REQUESTED' | 'CONFIRMED' | 'CHECKED-IN' | 'CANCELLED') => {
    // Check if transition permitted under AC 4
    const prev = booking.status;
    const isAllowed = 
      (prev === "BOOKING_REQUESTED" && (newStatus === "CONFIRMED" || newStatus === "CANCELLED")) ||
      (prev === "CONFIRMED" && (newStatus === "CHECKED-IN" || newStatus === "CANCELLED"));

    if (prev === newStatus) return; // Same status, no change

    if (!isAllowed) {
      showToast(`⚠️ Cannot change status from ${prev} to ${newStatus}. Transition path forbidden.`);
      return;
    }

    // Sensitive status changes (CONFIRMED, CHECKED-IN, CANCELLED) require a confirmation modal (AC 4)
    const isSensitive = ['CONFIRMED', 'CHECKED-IN', 'CANCELLED'].includes(newStatus);
    if (isSensitive) {
      setSelectedBookingForStatus(booking);
      setPendingStatusTarget(newStatus);
      setShowStatusModal(true);
    } else {
      executeStatusUpdate(booking.bookingId, newStatus);
    }
  };

  const executeStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    setShowStatusModal(false);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Booking ${bookingId} status updated successfully to ${status}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 10 - Save internal notes
  const saveBookingNotes = async (bookingId: string) => {
    setSavingNotesId(bookingId);
    const notesValue = bookingNotesEdit[bookingId] || '';
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          internalNotes: notesValue,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Notes updated for Booking ${bookingId}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    } finally {
      setSavingNotesId(null);
    }
  };

  // AC 5 - commission update
  const updateCommissionStatus = async (bookingId: string, commissionStatus: Booking['commissionStatus']) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/commission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          commissionStatus,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Commission updated to ${commissionStatus} for Booking ${bookingId}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 6 - Activator/Deactivator toggle referrer
  const toggleReferrerStatus = async (referrerCode: string, currentStatus: Referrer['status']) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/referrers/${referrerCode}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: nextStatus,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Referrer ${referrerCode} is now ${nextStatus}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 6 - Upgrade/Downgrade referrer level
  const modifyReferrerLevel = async (referrerCode: string, currentLevel: Referrer['membershipLevel']) => {
    const nextLevel = currentLevel === 'Standard' ? 'Consultant' : 'Standard';
    try {
      const res = await fetch(`/api/admin/referrers/${referrerCode}/level`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          level: nextLevel,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Referrer ${referrerCode} level adjusted to ${nextLevel}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 7 - Approve Upgrade Request
  const handleConsultantApproval = async (referrerCode: string, approve: boolean) => {
    const url = approve 
      ? `/api/admin/referrers/${referrerCode}/level`
      : `/api/admin/referrers/${referrerCode}/reject-upgrade`;

    const body = approve 
      ? { level: 'Consultant', actionType: 'approve_review', adminEmail: adminUser?.email }
      : { adminEmail: adminUser?.email };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(approve ? `Approved Consultant level upgrade for ${referrerCode}.` : `Rejected upgrade. Kept standard.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 8 - Resolve Support Request
  const handleSupportRequest = async (requestId: string, status: SupportRequest['status']) => {
    const internalNotes = activeSupportNotes[requestId] || '';
    try {
      const res = await fetch(`/api/admin/support/${requestId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          internalNotes,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Support Request ${requestId} status updated to ${status}.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // AC 10 - Toggle Clinic Activation
  const toggleClinicStatus = async (clinicId: string, currentStatus: string) => {
    const targetStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/clinics/${clinicId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: targetStatus,
          adminEmail: adminUser?.email || 'admin@ucsmile.com'
        })
      });

      if (!res.ok) {
        throw new Error("Unable to update this record. Please try again.");
      }

      showToast(`Clinic Status Updated.`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to update this record. Please try again.");
    }
  };

  // Review Clinic Onboarding (APPROVED / REJECTED)
  const reviewOnboardingClinic = async (clinicId: string, status: 'APPROVED' | 'REJECTED', rejectReason?: string) => {
    try {
      const res = await fetch(`/api/admin/clinics/${clinicId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          adminEmail: adminUser?.email || 'admin@ucsmile.com',
          rejectReason
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unable to complete clinic review. Please try again.");
      }

      showToast(`Clinic onboarding reviewed: ${status}`);
      if (adminToken) fetchData(adminToken);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to complete clinic review. Please try again.");
    }
  };

  // AC 9 - Booking filtering and search logic
  const filteredBookings = useMemo(() => {
    return bookingsList.filter(b => {
      // Search Box: code, patient name, phone, referral code, referrer name, clinic, status
      const matchesSearch = 
        b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.whatsappPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.referralCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.referrerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.status.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filter: Booking Status
      if (filterStatus !== 'All' && b.status !== filterStatus) return false;

      // Filter: Created By
      if (filterCreatedBy !== 'All' && b.created_by !== filterCreatedBy) return false;

      // Filter: Clinic
      if (filterClinic !== 'All' && b.clinic !== filterClinic) return false;

      // Filter: Commission Status
      if (filterCommissionStatus !== 'All' && b.commissionStatus !== filterCommissionStatus) return false;

      // Filter: Date Range
      if (startDate) {
        const bd = new Date(b.preferredDate);
        const sd = new Date(startDate);
        if (bd < sd) return false;
      }
      if (endDate) {
        const bd = new Date(b.preferredDate);
        const ed = new Date(endDate);
        if (bd > ed) return false;
      }

      return true;
    });
  }, [bookingsList, searchTerm, filterStatus, filterCreatedBy, filterClinic, filterCommissionStatus, startDate, endDate]);

  // Combined metrics or helper for calculating successful referrals for AC 6
  const referrerReferralStats = useMemo(() => {
    const mapping: Record<string, { total: number; successful: number }> = {};
    
    // Default zero mapping
    referrersList.forEach(r => {
      mapping[r.code.toUpperCase()] = { total: 0, successful: 0 };
    });

    // Count bookings matching the referrers
    bookingsList.forEach(b => {
      if (b.referralCode) {
        const rCode = b.referralCode.toUpperCase();
        if (!mapping[rCode]) {
          mapping[rCode] = { total: 0, successful: 0 };
        }
        mapping[rCode].total += 1;
        if (b.status === 'CHECKED-IN') {
          mapping[rCode].successful += 1;
        }
      }
    });

    return mapping;
  }, [bookingsList, referrersList]);

  // AC 6 - Filter and search Referrer accounts
  const filteredReferrers = useMemo(() => {
    return referrersList.filter(r => {
      const matchesSearch = 
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterReferrerLevel !== 'All' && r.membershipLevel !== filterReferrerLevel) return false;

      return true;
    });
  }, [referrersList, searchTerm, filterReferrerLevel]);

  // Formatted date or time helper
  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString('en-US', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  // --- RENDERING ---

  // RENDER LOGIN SCREEN (AC 1)
  if (!adminToken) {
    return (
      <div className="pt-32 pb-24 min-h-[90vh] bg-brand-bg flex items-center justify-center px-4 font-sans text-gray-900">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl -z-10" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mb-4 border border-amber-100">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900">UCSmile Central</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Admin Dashboard Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                Manager Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ucsmile.com"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500 transition-all font-sans font-medium text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                Manager Profile Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500 transition-all font-sans font-medium text-gray-900"
                />
              </div>
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 font-bold bg-red-50/50 border border-red-100 rounded-xl p-3"
              >
                ⚠️ {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Access'}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 font-medium">
              UCSmile platform access restricted. Credentials authorized on secure firewalls.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // MAIN ADMIN INTERFACE
  return (
    <div className="pt-24 min-h-screen bg-[#FDFBF7] font-sans text-gray-900 text-sm">
      {/* Visual Alert Banners (AC 12) */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 shadow-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-xs uppercase tracking-wide text-red-900">Operation Restrained</p>
                <p className="text-xs mt-1 text-red-700 font-medium">{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-50 w-full max-w-sm"
          >
            <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-semibold tracking-wide">{successToast}</p>
              </div>
              <button onClick={() => setSuccessToast(null)} className="text-gray-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN TITLE BLOCK BAR */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md px-6 py-4 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-widest rounded-md">Central Console</span>
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />}
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mt-1">Management Hub</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-gray-900">{adminUser?.fullName}</p>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">{adminUser?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER WITH SIDEBAR OR MAIN AREA */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* TAB SIDE RAIL */}
          <nav className="lg:col-span-3 flex flex-row flex-wrap lg:flex-col gap-1.5 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
            <button 
              onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              SYSTEM OVERVIEW
            </button>
            <button 
              onClick={() => { setActiveTab('bookings'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'bookings' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              BOOKINGS BOOK
            </button>
            <button 
              onClick={() => { setActiveTab('referrals'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'referrals' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-4 h-4 shrink-0" />
              COMMISSIONS LINK
            </button>
            <button 
              onClick={() => { setActiveTab('referrers'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'referrers' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              REFERRERS DIRECTORY
            </button>
            <button 
              onClick={() => { setActiveTab('support'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'support' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LifeBuoy className="w-4 h-4 shrink-0" />
              SUPPORT QUEUE
            </button>
            <button 
              onClick={() => { setActiveTab('clinics'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'clinics' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              CLINICS BOARD
            </button>
            <button 
              onClick={() => { setActiveTab('logs'); setSearchTerm(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'logs' ? 'bg-amber-50 text-amber-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              AUDIT LOGS
            </button>
          </nav>

          {/* MAIN GRID PANEL AREA */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* 1. OVERVIEW TAB (AC 2) */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Welcome Message banner */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.015)] flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Activity className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Operational Pulse Overview</h3>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-xl font-medium">
                      Monitor total patient conversion records, active clinical clinic statuses, support inquiries, and manage referrer level authorizations. Actions are saved instantly inside global audit histories.
                    </p>
                  </div>
                  <button 
                    onClick={() => { if (adminToken) fetchData(adminToken); }}
                    className="md:ml-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Data
                  </button>
                </div>

                {/* Grid of Bento Statistics (AC 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Total Bookings Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Total Bookings</p>
                      <h4 className="text-3xl font-black mt-2 text-gray-900">{stats.totalBookings}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Platform aggregate sessions</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Booking Requested Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Booking Requested</p>
                      <h4 className="text-3xl font-black mt-2 text-amber-600">{stats.requestedBookings}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Awaiting confirmation</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Confirmed Bookings Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Confirmed Bookings</p>
                      <h4 className="text-3xl font-black mt-2 text-emerald-600">{stats.confirmedBookings}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Ready for checks</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Checked-in Bookings Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Checked-in Bookings</p>
                      <h4 className="text-3xl font-black mt-2 text-purple-600">{stats.checkedInBookings}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Patients checked in</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Cancelled Bookings Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Cancelled Bookings</p>
                      <h4 className="text-3xl font-black mt-2 text-red-600">{stats.cancelledBookings}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Cancelled by patient/admin</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <XCircle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Total Referrals Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Total Referrals</p>
                      <h4 className="text-3xl font-black mt-2 text-gray-950">{stats.totalReferrals}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Bookings with code tag</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Active Referrers Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Active Referrers</p>
                      <h4 className="text-3xl font-black mt-2 text-indigo-600">{stats.activeReferrers}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Registered active code partners</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Consultant Referrers Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Consultant Level</p>
                      <h4 className="text-3xl font-black mt-2 text-teal-600">{stats.consultantReferrers}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Professional referral nodes</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Pending Support Requests */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Support Queue</p>
                      <h4 className="text-3xl font-black mt-2 text-pink-600">{stats.pendingSupportRequests}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Awaiting operational solution</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                      <LifeBuoy className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                </div>

                {/* Quick Shortcuts */}
                <div className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE4D5]">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-4">Central Actions Quick links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => { setActiveTab('bookings'); }} className="p-4 bg-white hover:bg-amber-50/50 border border-gray-200/60 rounded-2xl text-left cursor-pointer transition-all">
                      <h5 className="font-bold text-gray-900">Review Bookings</h5>
                      <p className="text-[11px] text-gray-400 mt-1">Confirm requested and assign clinics</p>
                    </button>
                    <button onClick={() => { setActiveTab('support'); }} className="p-4 bg-white hover:bg-amber-50/50 border border-gray-200/60 rounded-2xl text-left cursor-pointer transition-all">
                      <h5 className="font-bold text-gray-900">Resolve Incidents</h5>
                      <p className="text-[11px] text-gray-400 mt-1">Check patient reschedule or referral cases</p>
                    </button>
                    <button onClick={() => { setActiveTab('referrers'); }} className="p-4 bg-white hover:bg-amber-50/50 border border-gray-200/60 rounded-2xl text-left cursor-pointer transition-all font-sans font-medium text-gray-900">
                      <h5 className="font-bold text-gray-900">Upgrade Referrers</h5>
                      <p className="text-[11px] text-gray-400 mt-1">Review pending Standard to Consultant requests</p>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. BOOKINGS MANAGEMENT (AC 3, 4, 9, 10, 11) */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                
                {/* Search, Filter & Date options layout (AC 9) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Code, Patient Name, Phone, Code, Clinic, Referrer..."
                        className="w-full bg-gray-50/70 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500 transition-all font-sans font-medium text-gray-900"
                      />
                    </div>

                    {/* Status Dropdown */}
                    <div className="w-full md:w-44">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 font-sans font-medium text-gray-900"
                      >
                        <option value="All">All Statuses</option>
                        <option value="BOOKING_REQUESTED">BOOKING_REQUESTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CHECKED-IN">CHECKED-IN</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    {/* Created By Dropdown */}
                    <div className="w-full md:w-36">
                      <select 
                        value={filterCreatedBy}
                        onChange={(e) => setFilterCreatedBy(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15 font-sans font-medium text-gray-900"
                      >
                        <option value="All">Created By: All</option>
                        <option value="Patient">Patient</option>
                        <option value="Staff">Staff</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>

                  </div>

                  {/* Date Range and Clinic mapping Filters (AC 9) */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-50">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Clinic Vetted</label>
                      <select 
                        value={filterClinic}
                        onChange={(e) => setFilterClinic(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none font-sans font-medium text-gray-900"
                      >
                        <option value="All">All Clinics</option>
                        <option value="East Meets West Dental (Da Nang)">East Meets West</option>
                        <option value="Rose Dental Clinic (Da Nang)">Rose Dental</option>
                        <option value="Serenity International Dental (Da Nang)">Serenity International</option>
                        <option value="Elite Dental Group (Ho Chi Minh)">Elite Dental HCM</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Commission status</label>
                      <select 
                        value={filterCommissionStatus}
                        onChange={(e) => setFilterCommissionStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none font-sans font-medium text-gray-900"
                      >
                        <option value="All">All Commissions</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Paid">Paid</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">From Date</label>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none font-sans font-medium text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">To Date</label>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-50 border border-[#EAE6DF] rounded-xl px-3 py-2 text-xs focus:outline-none font-sans font-medium text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Bookings rows (AC 3, AC 11 - Secure human elements) */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.015)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">All Booking Records</h3>
                      <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">Showing {filteredBookings.length} records</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] tracking-widest border-b border-gray-100">
                          <th className="py-4 px-4 font-black">Code / Date</th>
                          <th className="py-4 px-4 font-black">Patient Identity</th>
                          <th className="py-4 px-4 font-black">Services / Price</th>
                          <th className="py-4 px-4 font-black">Status Control</th>
                          <th className="py-4 px-4 font-black">Clinic / Referrer</th>
                          <th className="py-4 px-4 font-black">Authorized Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-400 font-bold">
                              No matching bookings found in databases.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => {
                            // Assign beautiful status badge styles
                            const statusColor = 
                              b.status === 'CHECKED-IN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              b.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                              'bg-amber-50 text-amber-700 border-amber-100';

                            // Estimate mock base cost for visually beautiful summaries
                            const servicePrice = b.treatment.includes('Implants') ? '$1,000 - $2,500' :
                                                 b.treatment.includes('Invisalign') ? '$2,000 - $4,000' :
                                                 b.treatment.includes('Crowns') ? '$300 - $600' :
                                                 b.treatment.includes('Whitening') ? '$150 - $300' :
                                                 b.treatment.includes('Extraction') ? '$50 - $150' : 
                                                 '$150 - $400';

                            return (
                              <React.Fragment key={b.bookingId}>
                                <tr className="hover:bg-gray-50/40 transition-colors">
                                  {/* Code and Dates */}
                                  <td className="py-5 px-4">
                                    <span className="font-extrabold text-gray-900 block font-mono">{b.bookingId}</span>
                                    <span className="text-[10px] text-gray-400 font-semibold block mt-1">{b.preferredDate} ({b.preferredSession})</span>
                                  </td>

                                  {/* Patient Identity (AC 3, AC 11) */}
                                  <td className="py-5 px-4 space-y-1">
                                    <div className="font-black text-gray-900 flex items-center gap-1">
                                      {b.fullName}
                                      <span className="text-[8px] bg-gray-100 text-gray-600 px-1 rounded uppercase font-black">{b.created_by}</span>
                                    </div>
                                    <div className="text-gray-500 font-semibold text-[10px] flex flex-col gap-0.5">
                                      <span>📞 {b.whatsappPhone}</span>
                                      <span>✉️ {b.email || 'No email registered'}</span>
                                      <span>🌐 {b.nationality}</span>
                                    </div>
                                  </td>

                                  {/* Services and Estimated Price */}
                                  <td className="py-5 px-4">
                                    <span className="font-bold text-gray-800 line-clamp-1 max-w-[200px]" title={b.treatment}>{b.treatment}</span>
                                    <span className="text-[10px] text-amber-700 font-black block mt-1 leading-none">{servicePrice} USD</span>
                                  </td>

                                  {/* Status control dropdown limits under state (AC 4) */}
                                  <td className="py-5 px-4 font-sans">
                                    <div className="space-y-1.5">
                                      <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase ${statusColor}`}>
                                        {b.status}
                                      </span>
                                      
                                      {/* Allowed Transitions Trigger Buttons */}
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {b.status === 'BOOKING_REQUESTED' && (
                                          <>
                                            <button 
                                              onClick={() => initiateStatusChange(b, 'CONFIRMED')}
                                              className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded text-[9px] text-emerald-800 font-black border border-emerald-200 cursor-pointer"
                                            >
                                              Confirm
                                            </button>
                                            <button 
                                              onClick={() => initiateStatusChange(b, 'CANCELLED')}
                                              className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 rounded text-[9px] text-red-700 font-black border border-red-200 cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                        {b.status === 'CONFIRMED' && (
                                          <>
                                            <button 
                                              onClick={() => initiateStatusChange(b, 'CHECKED-IN')}
                                              className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 rounded text-[9px] text-purple-800 font-black border border-purple-200 cursor-pointer"
                                            >
                                              Check-In
                                            </button>
                                            <button 
                                              onClick={() => initiateStatusChange(b, 'CANCELLED')}
                                              className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 rounded text-[9px] text-red-700 font-black border border-red-200 cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                        {b.status === 'CHECKED-IN' && (
                                          <span className="text-[10px] text-gray-400 font-semibold italic">Successful patient checked-in</span>
                                        )}
                                        {b.status === 'CANCELLED' && (
                                          <span className="text-[10px] text-gray-400 font-semibold italic">Session cancelled</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Clinic and Referral link representation (AC 3) */}
                                  <td className="py-5 px-4 space-y-1">
                                    <div className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                                      <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      {b.clinic || 'Not assigned yet'}
                                    </div>
                                    {b.referralCode ? (
                                      <div className="text-[10px] font-medium text-amber-700">
                                        🎟️ Code: <span className="font-mono font-black">{b.referralCode}</span> ({b.referrerName || 'Adviser'})
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-gray-400 font-medium italic">Standard Direct Patient</div>
                                    )}
                                  </td>

                                  {/* Last Updated */}
                                  <td className="py-5 px-4 text-[10px] text-gray-400 font-semibold text-right">
                                    {formatTime(b.lastUpdated || b.created_at)}
                                  </td>
                                </tr>

                                {/* Child rows with Admin Notes input area (AC 10) */}
                                <tr className="bg-amber-50/10 border-b border-gray-100">
                                  <td colSpan={6} className="py-3 px-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                      <div className="flex items-center gap-2 flex-1 max-w-xl">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Admin Notes:</span>
                                        <input 
                                          type="text"
                                          placeholder="Add internal sensitive staff notes (only visible to admins)..."
                                          value={bookingNotesEdit[b.bookingId] !== undefined ? bookingNotesEdit[b.bookingId] : (b.internalNotes || '')}
                                          onChange={(e) => setBookingNotesEdit({ ...bookingNotesEdit, [b.bookingId]: e.target.value })}
                                          className="w-full bg-white/80 border border-[#EAE6DF] rounded-lg px-2.5 py-1.5 text-xs font-sans font-semibold focus:outline-none focus:border-amber-500 text-gray-800"
                                        />
                                        <button 
                                          onClick={() => saveBookingNotes(b.bookingId)}
                                          disabled={savingNotesId === b.bookingId}
                                          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0"
                                        >
                                          <Save className="w-3 h-3" />
                                          {savingNotesId === b.bookingId ? 'Saving...' : 'Save'}
                                        </button>
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                        <span>Created:</span> 
                                        <span className="font-mono text-gray-600">{formatTime(b.created_at)}</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 3. COMMISSION LAYOUT (AC 5) */}
            {activeTab === 'referrals' && (
              <div className="space-y-6">
                
                {/* Search Box */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search referral code or referrer name..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <select 
                        value={filterCommissionStatus}
                        onChange={(e) => setFilterCommissionStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Paid">Paid</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Referral Tracking Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.01)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">Referral and Commission Tracker</h3>
                    <p className="text-gray-400 text-[10px] font-medium mt-1 leading-relaxed">
                      Review Commission payouts tied to the booked patient progress. Commissions are only 
                      <span className="text-amber-700 font-bold px-1">Eligible</span> when the patient is 
                      <span className="font-extrabold text-[#7C3AED] px-1">CHECKED-IN</span>.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] tracking-widest border-b border-gray-100">
                          <th className="py-4 px-4">Referral Code</th>
                          <th className="py-4 px-4">Referrer Profile</th>
                          <th className="py-4 px-4">Patient Status</th>
                          <th className="py-4 px-4">Commission Rate / Status</th>
                          <th className="py-4 px-4">Action Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {bookingsList.filter(b => !!b.referralCode && (
                          searchTerm === '' || 
                          b.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.referrerName || '').toLowerCase().includes(searchTerm.toLowerCase())
                        ) && (
                          filterCommissionStatus === 'All' || b.commissionStatus === filterCommissionStatus
                        )).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-400 font-bold">
                              No referral records matching filters found.
                            </td>
                          </tr>
                        ) : (
                          bookingsList.filter(b => !!b.referralCode && (
                            searchTerm === '' || 
                            b.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (b.referrerName || '').toLowerCase().includes(searchTerm.toLowerCase())
                          ) && (
                            filterCommissionStatus === 'All' || b.commissionStatus === filterCommissionStatus
                          )).map((b) => {
                            // Determine Referrer level (default standard index match)
                            const refRecord = referrersList.find(ref => ref.code.toUpperCase() === b.referralCode?.toUpperCase());
                            const referrerLevel = refRecord ? refRecord.membershipLevel : 'Standard';
                            const commissionRate = referrerLevel === 'Consultant' ? '15%' : '10%';

                            // Commission Eligibility Logic (AC 5)
                            let eligibilityStatus: 'Eligible' | 'Not Eligible' | 'Pending' = 'Pending';
                            let eligibilityColor = 'text-amber-600 bg-amber-50 border-amber-100';

                            if (b.status === 'CHECKED-IN') {
                              eligibilityStatus = 'Eligible';
                              eligibilityColor = 'text-purple-700 bg-purple-50 border-purple-100';
                            } else if (b.status === 'CANCELLED') {
                              eligibilityStatus = 'Not Eligible';
                              eligibilityColor = 'text-gray-500 bg-gray-50 border-gray-100';
                            }

                            return (
                              <tr key={b.bookingId} className="hover:bg-gray-50/40">
                                {/* Referral Code */}
                                <td className="py-4 px-4">
                                  <span className="font-extrabold text-gray-900 block font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded w-fit text-[11px]">{b.referralCode}</span>
                                  <span className="text-[10px] text-gray-400 mt-1 block">Patient Ref {b.bookingId}</span>
                                </td>

                                {/* Referrer Name & Level */}
                                <td className="py-4 px-4">
                                  <p className="font-bold text-gray-900">{b.referrerName || 'Adviser Code'}</p>
                                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Level: {referrerLevel}</p>
                                </td>

                                {/* Booking details and status */}
                                <td className="py-4 px-4">
                                  <p className="font-bold text-gray-800">{b.fullName}</p>
                                  <div className="flex gap-1.5 mt-1">
                                    <span className="text-[10px] text-gray-500">Status: {b.status}</span>
                                  </div>
                                </td>

                                {/* Commission Eligibility, Payout Rate & Status (AC 5) */}
                                <td className="py-4 px-4 space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black border uppercase ${eligibilityColor}`}>
                                      {eligibilityStatus}
                                    </span>
                                    <span className="font-black text-gray-900 text-[11px]">{commissionRate} Rate</span>
                                  </div>
                                  <div>
                                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      b.commissionStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800' :
                                      b.commissionStatus === 'Approved' ? 'bg-blue-50 text-blue-800' :
                                      b.commissionStatus === 'Rejected' ? 'bg-red-50 text-red-800 font-semibold' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      Payout: {b.commissionStatus}
                                    </span>
                                  </div>
                                </td>

                                {/* Action controls */}
                                <td className="py-4 px-4">
                                  {eligibilityStatus === 'Eligible' ? (
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={() => updateCommissionStatus(b.bookingId, 'Approved')}
                                        className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded text-[9px] font-bold border border-blue-200 cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => updateCommissionStatus(b.bookingId, 'Paid')}
                                        className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded text-[9px] font-bold border border-emerald-200 cursor-pointer"
                                      >
                                        Paid
                                      </button>
                                      <button 
                                        onClick={() => updateCommissionStatus(b.bookingId, 'Rejected')}
                                        className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-900 rounded text-[9px] font-bold border border-red-200 cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 font-semibold italic">Awaiting successful session</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 4. REFERRER MANAGEMENT (AC 6, AC 7) */}
            {activeTab === 'referrers' && (
              <div className="space-y-6">
                
                {/* Upgrade Approval Priority Panel (AC 7) */}
                <div className="bg-amber-50/40 border border-amber-200 rounded-3xl p-6 space-y-4">
                  <h3 className="font-black text-amber-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Consultant Approval Requests Queue
                  </h3>
                  <p className="text-amber-800 text-xs leading-relaxed font-semibold">
                    Referrers can be manual/automatic nodes, standard referrers are proposed for Consultant validation when reaching platform milestone requirements and collaboration values. Approved users are upgraded to 15% commission standard levels.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {referrersList.filter(r => r.pendingUpgradeReview).length === 0 ? (
                      <div className="bg-white border border-dashed border-amber-200 p-6 rounded-2xl text-center text-xs text-amber-900 font-bold">
                        🎉 Splendid! No pending consultant level approval requests at present.
                      </div>
                    ) : (
                      referrersList.filter(r => r.pendingUpgradeReview).map(r => {
                        const total = referrerReferralStats[r.code.toUpperCase()]?.total || 0;
                        const successful = referrerReferralStats[r.code.toUpperCase()]?.successful || 0;

                        return (
                          <div key={r.code} className="bg-white p-5 rounded-2xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-gray-900 text-sm">{r.fullName}</span>
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-black font-mono">{r.code}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Email: {r.email} | Phone: {r.phone}</p>
                              <div className="text-[10px] text-gray-600 font-bold mt-2">
                                📊 Referral record: <span className="text-purple-700">{successful} successful visits</span> out of {total} total referrers
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleConsultantApproval(r.code, true)}
                                className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                Approve Upgrade
                              </button>
                              <button 
                                onClick={() => handleConsultantApproval(r.code, false)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Directory Search & Filters (AC 6) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search referrers list by name, email, phone, code..."
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                    />
                  </div>
                  <div className="w-48">
                    <select 
                      value={filterReferrerLevel}
                      onChange={(e) => setFilterReferrerLevel(e.target.value)}
                      className="w-full bg-gray-50 border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs focus:outline-none"
                    >
                      <option value="All">All Levels</option>
                      <option value="Standard">Standard</option>
                      <option value="Consultant">Consultant</option>
                    </select>
                  </div>
                </div>

                {/* Referrer listings table (AC 6) */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.015)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">Referrers List Directory</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-widest font-bold">Showing {filteredReferrers.length} active platform accounts</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] tracking-widest border-b border-gray-100">
                          <th className="py-4 px-4">Referrer Account</th>
                          <th className="py-4 px-4 font-black">Membership Level</th>
                          <th className="py-4 px-4 font-black">Code / Date Joined</th>
                          <th className="py-5 px-4 font-black">Performance Stats</th>
                          <th className="py-4 px-4 font-black">Account Status</th>
                          <th className="py-4 px-4 font-black">Central Commands</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {filteredReferrers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-400 font-bold">
                              No referrers records matching filters found.
                            </td>
                          </tr>
                        ) : (
                          filteredReferrers.map((r) => {
                            // Fetch aggregate totals
                            const codeUpper = r.code.toUpperCase();
                            const total = referrerReferralStats[codeUpper]?.total || 0;
                            const successful = referrerReferralStats[codeUpper]?.successful || 0;

                            return (
                              <tr key={r.code} className="hover:bg-gray-50/40">
                                {/* Name and Email */}
                                <td className="py-5 px-4 space-y-1">
                                  <p className="font-extrabold text-gray-900">{r.fullName}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">{r.email}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">📞 {r.phone}</p>
                                </td>

                                {/* Level */}
                                <td className="py-5 px-4">
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                    r.membershipLevel === 'Consultant' 
                                      ? 'bg-purple-100 text-purple-800' 
                                      : 'bg-indigo-50 text-indigo-800'
                                  }`}>
                                    {r.membershipLevel}
                                  </span>
                                </td>

                                {/* Referral Code & Created Date */}
                                <td className="py-5 px-4 font-sans">
                                  <span className="font-mono font-black text-gray-800 block text-[11px]">{r.code}</span>
                                  <span className="text-[9px] text-gray-400 block mt-1">Joined: {formatTime(r.createdAt || '2025-06-15')}</span>
                                </td>

                                {/* Performance Numbers (AC 6) */}
                                <td className="py-5 px-4 font-sans space-y-1">
                                  <div className="text-[11px] font-extrabold text-[#7C3AED]">
                                    ✔ {successful} Successful Referrals
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-semibold">
                                    Total Referred: {total} bookings
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="py-5 px-4">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                    r.status === 'Active' 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                      : 'bg-red-50 text-red-800 border-red-100'
                                  }`}>
                                    {r.status}
                                  </span>
                                </td>

                                {/* Central Upgrades/Downgrades & Status Control */}
                                <td className="py-5 px-4 space-y-2">
                                  <div className="flex flex-col sm:flex-row gap-1.5">
                                    <button 
                                      onClick={() => toggleReferrerStatus(r.code, r.status)}
                                      className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer border ${
                                        r.status === 'Active' 
                                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {r.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    
                                    <button 
                                      onClick={() => modifyReferrerLevel(r.code, r.membershipLevel)}
                                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-[9px] font-bold border border-gray-300 cursor-pointer"
                                    >
                                      {r.membershipLevel === 'Standard' ? 'Level UP' : 'Level DOWN'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 5. SUPPORT REQUEST QUEUE (AC 8) */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.01)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">UCSmile Support Ticket Queue</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold mt-0.5">Manage and resolve inquiries from Patients and Referrers</p>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 font-medium">
                    {supportRequestsList.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 font-bold">
                        No support tickets found in general queue database.
                      </div>
                    ) : (
                      supportRequestsList.map((ticket) => {
                        // Color styling based on ticket status
                        const badgeColor = 
                          ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 font-black border-emerald-100' :
                          ticket.status === 'In Review' ? 'bg-blue-50 text-blue-800 font-black border-blue-100' :
                          ticket.status === 'Rejected' ? 'bg-red-50 text-red-800 font-black border-red-100' :
                          'bg-amber-50 text-amber-800 font-black border-amber-100';

                        return (
                          <div key={ticket.id} className="p-6 hover:bg-gray-50/20 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                              
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-gray-900 text-xs bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                                <span className="text-[10px] font-black text-amber-800 bg-amber-50 rounded px-1.5 uppercase font-mono">{ticket.requestType}</span>
                                <span className={`inline-block px-2 py-0.5 border text-[9px] uppercase rounded-full ${badgeColor}`}>
                                  {ticket.status}
                                </span>
                              </div>

                              <span className="text-[10px] text-gray-400 font-semibold">{formatTime(ticket.createdAt)}</span>
                            </div>

                            <p className="text-xs font-bold text-gray-900 mt-2">
                              Submitted By: <span className="text-gray-700 font-semibold">{ticket.submittedBy}</span>
                            </p>
                            
                            {ticket.relatedBookingCode && (
                              <p className="text-[10px] text-[#7C3AED] font-extrabold mt-1">
                                Related Booking Code Link: {ticket.relatedBookingCode}
                              </p>
                            )}

                            {/* Ticket Message */}
                            <div className="bg-gray-50 rounded-2xl p-4 my-3 text-xs text-gray-700 font-medium leading-relaxed border border-gray-100">
                              "{ticket.message}"
                            </div>

                            {/* Ticket Resolver box */}
                            <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pt-2">
                              <div className="flex items-center gap-2 flex-1 max-w-xl w-full">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Admin Resolution Action Notes:</span>
                                <input 
                                  type="text"
                                  placeholder="Provide resolve notes or status instructions..."
                                  value={activeSupportNotes[ticket.id] !== undefined ? activeSupportNotes[ticket.id] : (ticket.internalNotes || '')}
                                  onChange={(e) => setActiveSupportNotes({ ...activeSupportNotes, [ticket.id]: e.target.value })}
                                  className="w-full bg-white border border-[#EAE6DF] rounded-xl px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                />
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button 
                                  onClick={() => handleSupportRequest(ticket.id, 'In Review')}
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                                >
                                  In Review
                                </button>
                                <button 
                                  onClick={() => handleSupportRequest(ticket.id, 'Resolved')}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                                >
                                  Mark Resolved
                                </button>
                                <button 
                                  onClick={() => handleSupportRequest(ticket.id, 'Rejected')}
                                  className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 6. VETTED CLINICS BOARD (AC 10) */}
            {activeTab === 'clinics' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* ONBOARDING CLINICS VETTING BOARD (AC 8, AC 10) */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.01)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-amber-50/20">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Dental Clinic Onboarding & Vetting
                    </h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-0.5">Review, audit pricing structures, and approve or reject partner clinic applications</p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {onboardingsList.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-wider">
                        No onboarding applications registered in database
                      </div>
                    ) : (
                      onboardingsList.map((app) => {
                        const hasCompletedAll = app.onboarding.profileSetupCompleted && app.onboarding.servicesCompleted && app.onboarding.workingHoursCompleted && app.onboarding.agreementCompleted;
                        return (
                          <div key={app.clinic.id} className="p-6 font-sans space-y-4 hover:bg-gray-50/40 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-sm text-gray-900">{app.clinic.name}</h4>
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                                    app.clinic.status === 'APPROVED'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : app.clinic.status === 'REJECTED'
                                      ? 'bg-red-50 text-red-800 border-red-200'
                                      : (app.clinic.status === 'PENDING_REVIEW' || app.clinic.status === 'UNDER_REVIEW')
                                      ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}>
                                    {app.clinic.status?.replace(/_/g, ' ')}
                                  </span>
                                  {app.clinic.flaggedForReview && (
                                    <span className="inline-block bg-red-100 text-red-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                                      FLAGGED: DUP CHECK
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                  City: {app.clinic.city} | Address: {app.clinic.address}
                                </p>
                              </div>

                              {(app.clinic.status === 'PENDING_REVIEW' || app.clinic.status === 'UNDER_REVIEW') && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => reviewOnboardingClinic(app.clinic.id, 'APPROVED')}
                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                                  >
                                    Approve Clinic
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt("Enter Rejection / Revision reason:");
                                      if (reason !== null) {
                                        reviewOnboardingClinic(app.clinic.id, 'REJECTED', reason || 'Needs revisions');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                                  >
                                    Reject / Request Revisions
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Details Drawer */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-xs">
                              {/* Left col: Contacts & Meta */}
                              <div className="space-y-1.5">
                                <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Contact details</p>
                                <p className="font-bold text-gray-700">Name: {app.clinic.contactPersonName}</p>
                                <p className="font-bold text-gray-700">Email: {app.clinic.contactEmail}</p>
                                <p className="font-bold text-gray-700">Phone: {app.clinic.contactPhoneNumber}</p>
                                {app.clinic.website && (
                                  <p className="font-bold text-amber-600 truncate">Website: {app.clinic.website}</p>
                                )}
                              </div>

                              {/* Col 2: Profile details */}
                              <div className="space-y-2">
                                <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Specialties & Languages</p>
                                {app.onboarding.profileSetupCompleted ? (
                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap gap-1">
                                      {app.onboarding.profileDetails?.specialties?.map((s: string) => (
                                        <span key={s} className="bg-amber-100/70 border border-amber-200/50 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-md">{s}</span>
                                      ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {app.onboarding.profileDetails?.languages?.map((l: string) => (
                                        <span key={l} className="bg-blue-50 border border-blue-100 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md">{l}</span>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-gray-400 italic">Profile details incomplete</p>
                                )}
                              </div>

                              {/* Col 3: Pricing Audit */}
                              <div className="space-y-1.5">
                                <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Services Pricing Audit</p>
                                {app.onboarding.servicesCompleted ? (
                                  <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
                                    {app.onboarding.services?.filter((s: any) => s.enabled).map((s: any) => (
                                      <div key={s.serviceId} className="flex items-center justify-between font-medium text-[10px]">
                                        <span className="text-gray-600 truncate mr-2">{s.serviceName}</span>
                                        <span className="font-black text-gray-900">${s.customPrice}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-400 italic">Services incomplete</p>
                                )}
                              </div>

                              {/* Col 4: Branches & Staff */}
                              <div className="space-y-1.5">
                                <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Branches & Dentist Staff</p>
                                {app.onboarding.additionalInfoCompleted ? (
                                  <div className="space-y-1">
                                    <p className="font-bold text-gray-700">Branches: {app.onboarding.additionalInfo?.branches?.length || 1}</p>
                                    <p className="font-bold text-gray-700">Dentists: {app.onboarding.additionalInfo?.dentists?.length || 0}</p>
                                    <p className="font-bold text-gray-700">Docs uploaded: {app.onboarding.additionalInfo?.documents?.length || 0}</p>
                                  </div>
                                ) : (
                                  <p className="text-gray-400 italic">Additional details incomplete</p>
                                )}
                              </div>

                              {/* Col 5: Partnership Contract (AC 9) */}
                              <div className="space-y-1.5">
                                <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Partnership Agreement</p>
                                {app.onboarding.agreementCompleted ? (
                                  <div className="space-y-1 text-gray-700 font-medium text-[10px]">
                                    <p className="font-bold text-emerald-600 flex items-center gap-1">✓ AGREEMENT_ACCEPTED</p>
                                    <p><span className="text-gray-400 font-bold">Signer:</span> {app.onboarding.agreementDetails?.signedName || 'Authorized'}</p>
                                    <p><span className="text-gray-400 font-bold">Version:</span> {app.onboarding.agreementDetails?.termsVersion || 'v1.4-partner-2026'}</p>
                                    <p className="text-[9px] text-gray-400"><span className="text-gray-400 font-bold">Signed:</span> {app.onboarding.agreementDetails?.signedAt ? new Date(app.onboarding.agreementDetails.signedAt).toLocaleString() : 'N/A'}</p>
                                    {app.onboarding.agreementDetails?.ipAddress && (
                                      <p className="text-[9px] text-gray-300 font-mono">IP: {app.onboarding.agreementDetails.ipAddress}</p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <p className="font-bold text-amber-600">⚠ AGREEMENT_PENDING</p>
                                    <p className="text-gray-400 italic text-[10px]">Unsigned</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.01)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Vetted Partner Dental Clinics</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-0.5">Activate or deactivate clinical listings for selection on the booking page</p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {clinicsList.map((clin) => {
                      return (
                        <div key={clin.id} className="p-6 flex items-center justify-between font-sans">
                          <div>
                            <p className="font-extrabold text-[13px] text-gray-900">{clin.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> ID: {clin.id} | Location: {clin.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                              clin.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-red-50 text-red-800 border-red-200 animate-pulse'
                            }`}>
                              {clin.status}
                            </span>
                            <button 
                              onClick={() => toggleClinicStatus(clin.id, clin.status)}
                              className={`px-3 py-1.5 border rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
                                clin.status === 'Active' 
                                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {clin.status === 'Active' ? 'Deactivate clinic' : 'Activate clinic'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* 7. AUDIT LOG PANEL (AC 10) */}
            {activeTab === 'logs' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.015)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Database System Audit Logs</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-0.5">A complete immutable list of important admin actions and overrides</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] tracking-widest border-b border-gray-100">
                          <th className="py-4 px-4">Log Hash ID</th>
                          <th className="py-4 px-4 font-black">Action / Parameter Changed</th>
                          <th className="py-4 px-4 font-black">Authorized By</th>
                          <th className="py-4 px-4 font-black">Datetime ISO</th>
                          <th className="py-4 px-4 font-black text-right">Overrides (Old → New)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium">
                        {logsList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-400 font-bold">
                              No logs recorded yet.
                            </td>
                          </tr>
                        ) : (
                          logsList.map((log) => {
                            return (
                              <tr key={log.id} className="hover:bg-gray-50/30">
                                <td className="py-4 px-4 font-mono font-bold text-gray-500">
                                  {log.id}
                                </td>
                                <td className="py-4 px-4 font-extrabold text-gray-900">
                                  {log.action}
                                </td>
                                <td className="py-4 px-4 font-semibold text-gray-700">
                                  {log.updatedBy}
                                </td>
                                <td className="py-4 px-4 text-gray-400 text-[10px]">
                                  {formatTime(log.updatedAt)}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <span className="text-[10px] bg-red-50 text-red-700 p-1 rounded font-mono break-all">{log.previousValue || 'none'}</span>
                                  <span className="px-1 text-gray-400 font-bold">→</span>
                                  <span className="text-[10px] bg-emerald-50 text-emerald-800 p-1 rounded font-mono break-all font-black">{log.newValue}</span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>
      </div>

      {/* SENSITIVE STATUS CHANGE CONFIRMATION MODAL (AC 4) */}
      <AnimatePresence>
        {showStatusModal && selectedBookingForStatus && pendingStatusTarget && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-100 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-4 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Sensitive Operation Confirmation</h4>
                  <p className="text-[10px] uppercase font-bold text-gray-400">UCSmile Platform Audit Rules Enforced</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 font-medium leading-relaxed leading-medium mb-4">
                You are executing a <span className="font-black text-amber-700 uppercase">sensitive status change</span> to <span className="font-extrabold text-gray-900 bg-gray-50 px-1 border rounded">{pendingStatusTarget}</span> for Booking <span className="font-extrabold font-mono text-[#7C3AED]">{selectedBookingForStatus.bookingId}</span> (Patient: {selectedBookingForStatus.fullName}).
              </p>

              <div className="bg-red-50/50 rounded-2xl p-4 border border-red-50 text-xs mb-6 text-red-800">
                <strong>Attention:</strong> These operational transitions impact global referrer commission calculations, clinic rosters, and patient alert notification dispatches immediately.
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => executeStatusUpdate(selectedBookingForStatus.bookingId, pendingStatusTarget)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Confirm action
                </button>
                <button
                  onClick={() => { setShowStatusModal(false); setSelectedBookingForStatus(null); setPendingStatusTarget(null); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
