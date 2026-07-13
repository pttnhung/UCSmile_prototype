/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MessageCircle, 
  Headset, 
  Plus
} from 'lucide-react';
import Logo from './components/Logo';

import LandingPage from './components/LandingPage';
import BlogPage from './components/BlogPage';
import BookingPage from './components/BookingPage';
import VerifyPage from './components/VerifyPage';
import AdminDashboard from './components/AdminDashboard';
import { ClinicOnboardingPage } from './components/ClinicOnboarding';
import { 
  BecomeReferrerPage, 
  ReferrerLoginPage, 
  ReferrerDashboardPage, 
  ReferralRedirectHandler 
} from './components/ReferrerPortal';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, location.pathname]);

  const isVerifyPage = location.pathname === '/verify';

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      {!isVerifyPage && (
        <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          scrolled ? 'bg-brand-bg/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo size="md" variant="full" />
            </Link>
            <div className="hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-gray-900">
              <Link to="/#why-us" className="hover:text-gray-500 transition-colors">Why Us</Link>
              <Link to="/#price-comparison" className="hover:text-gray-500 transition-colors">Compare</Link>
              <Link to="/#clinics" className="hover:text-gray-500 transition-colors">Top Clinics</Link>
              <Link to="/#travel" className="hover:text-gray-500 transition-colors">Travel</Link>
              <Link to="/blogs" className={`hover:text-gray-500 transition-colors ${location.pathname === '/blogs' ? 'text-gray-900' : ''}`}>Blogs</Link>
              <Link 
                to="/" 
                state={{ scrollTo: 'booking' }}
                className="btn-luxury px-6 py-2.5 !text-[11px] !tracking-[0.2em]"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const element = document.getElementById('booking');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </nav>
      )}

      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking/internal" element={<BookingPage />} />
        <Route path="/booking/referral/:referrerCode" element={<BookingPage />} />
        <Route path="/booking/pass/:bookingCode" element={<BookingPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<BecomeReferrerPage />} />
        <Route path="/referrer" element={<ReferrerLoginPage />} />
        <Route path="/referrer/dashboard" element={<ReferrerDashboardPage />} />
        <Route path="/dashboard" element={<ReferrerDashboardPage />} />
        <Route path="/clinic/onboarding" element={<ClinicOnboardingPage />} />
        <Route path="/clinic/register" element={<ClinicOnboardingPage />} />
        <Route path="/referral/:referrerCode" element={<ReferralRedirectHandler />} />
      </Routes>

      {/* Footer Rail */}
      {!isVerifyPage && (
        <footer className="py-20 px-4 bg-brand-bg border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <Link to="/" className="flex items-center">
              <Logo size="sm" variant="full" />
            </Link>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 text-center">UCsmile PLATFORM PROTOTYPE.</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">
               <Link to="/clinic/onboarding" className="hover:text-amber-500 transition-colors text-amber-600 font-extrabold">Partner Clinics</Link>
               <Link to="/register" className="hover:text-amber-500 transition-colors text-amber-600 font-extrabold">Become a Referrer</Link>
               <Link to="/referrer" className="hover:text-amber-500 transition-colors text-amber-600 font-extrabold">Referrer Portal</Link>
               <Link to="/admin" className="hover:text-amber-500 transition-colors text-amber-600 font-extrabold">Admin Portal</Link>
               <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
               <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            </div>
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[8px] font-bold tracking-tighter">G</div>
          </div>
        </footer>
      )}

      {!isVerifyPage && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.a 
            href="https://wa.me/84905000000" 
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:bg-[#20ba5a] transition-colors"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </motion.a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
