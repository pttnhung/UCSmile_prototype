/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function Layout() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
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

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-brand-bg/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-brand-text font-black text-2xl tracking-tighter uppercase">UC<span className="text-brand-primary">SMILE</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-gray-900">
            <Link to="/#why-us" className="hover:text-gray-500 transition-colors">Why Us</Link>
            <Link to="/#price-comparison" className="hover:text-gray-500 transition-colors">Compare</Link>
            <Link to="/#clinics" className="hover:text-gray-500 transition-colors">Top Clinics</Link>
            <Link to="/#travel" className="hover:text-gray-500 transition-colors">Travel</Link>
            <Link to="/blogs" className={`hover:text-gray-500 transition-colors ${location.pathname === '/blogs' ? 'text-gray-900' : ''}`}>Blogs</Link>
            <Link to="/#book-now" className="btn-luxury px-6 py-2.5 !text-[11px] !tracking-[0.2em]">
              BOOK NOW
            </Link>
          </div>
        </div>
      </nav>

      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blogs" element={<BlogPage />} />
      </Routes>

      {/* Footer Rail */}
      <footer className="py-20 px-4 bg-brand-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-brand-text font-black text-xl tracking-tighter uppercase">UC<span className="text-brand-primary">SMILE</span></span>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400 text-center">UCsmile PLATFORM PROTOTYPE.</p>
          <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">
             <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[8px] font-bold tracking-tighter">G</div>
        </div>
      </footer>

      {/* AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isAIChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-[min(92vw,24rem)] h-[32rem] overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_25px_80px_rgba(14,90,99,0.3)] mb-2 flex flex-col"
            >
              <div className="bg-brand-text p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-brand-text">
                    <Headset className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest">UCsmile AI</h3>
                    <p className="text-[10px] text-brand-secondary font-black">ONLINE NOW</p>
                  </div>
                </div>
                <button onClick={() => setIsAIChatOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
              <div className="flex-grow p-6 space-y-4 overflow-y-auto bg-brand-bg/50">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
                    <Headset className="w-3 h-3" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-left">
                    Hi! I'm your AI assistant. I can help you understand dental treatments and costs in Da Nang.
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-brand-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm text-left">
                    What are the costs for dental implants?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
                    <Headset className="w-3 h-3" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-left">
                    Dental implants in Da Nang typically start around $780 USD including the abutment and crown. This is roughly 70-80% cheaper than in Australia or the US.
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask me anything..." 
                    className="w-full rounded-2xl border border-gray-200 pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-3">
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
          <motion.button 
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isAIChatOpen ? 'bg-brand-text text-brand-secondary ring-2 ring-brand-secondary/50' : 'bg-white border border-gray-100 text-brand-text hover:bg-brand-section'}`}
          >
            <Headset className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
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
