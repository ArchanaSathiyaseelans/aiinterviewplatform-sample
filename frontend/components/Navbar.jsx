import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { FiArrowLeft, FiArrowRight, FiFileText, FiStar, FiMap, FiMic, FiCreditCard, FiGrid, FiLogOut } from 'react-icons/fi';
import { GiArtificialHive, GiTwoCoins } from 'react-icons/gi';
import api from '../utils/axios';

export default function Navbar({ label, user, setUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavbarLogout = async () => {
    try {
      await api.get('/api/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    if (typeof onLogout === 'function') {
      try { onLogout(); } catch (e) {}
    }
    if (typeof setUser === 'function') {
      setUser(null);
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoForward = () => {
    if (window.history.length > 2) {
      navigate(1);
    } else {
      navigate('/dashboard');
    }
  };

  const NAV_LINKS = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid size={13} /> },
    { label: 'Resume', path: '/resume', icon: <FiFileText size={13} /> },
    { label: 'Scorer', path: '/scorer', icon: <FiStar size={13} /> },
    { label: 'Roadmap', path: '/roadmap', icon: <FiMap size={13} /> },
    { label: 'Interview', path: '/interview', icon: <FiMic size={13} /> },
    { label: 'Billing', path: '/billing', icon: <FiCreditCard size={13} /> },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl shadow-xl flex items-center justify-between px-3 sm:px-6"
    >
      {/* Left Section: Back / Next Navigation Controls + Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Navigation History Controls: Back & Next */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleGoBack}
            title="Go Back"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <FiArrowLeft size={15} className="text-indigo-400" />
            <span className="hidden md:inline">Back</span>
          </motion.button>

          <div className="w-px h-4 bg-slate-800" />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleGoForward}
            title="Go Forward / Next"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span className="hidden md:inline">Next</span>
            <FiArrowRight size={15} className="text-pink-400" />
          </motion.button>
        </div>

        {/* Brand Logo & Current Section Tag */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex cursor-pointer items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <GiArtificialHive size={18} color="white" />
          </div>
          <span className="font-black text-base tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent hidden sm:inline">
            HirePulse AI
          </span>
          {label && (
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-300 shadow-sm">
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Middle Section: Quick Page Switcher Links */}
      <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800/80 p-1 rounded-2xl shadow-inner max-w-[50vw] sm:max-w-none overflow-x-auto scrollbar-none">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Section: User Coin Balance & Quick Actions */}
      <div className="flex items-center gap-2.5">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/billing')}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent backdrop-blur-md px-3 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-400/80 transition-all"
        >
          <GiTwoCoins size={16} className="text-amber-400 shrink-0" />

          <span className="text-xs font-black text-amber-200">
            {user?.interviewCoin ?? user?.coins ?? 150}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-extrabold hidden sm:inline">
            Coins
          </span>
        </motion.div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/30 flex items-center justify-center text-white font-black text-xs shadow-inner">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNavbarLogout}
              title="Log Out"
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FiLogOut size={15} />
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>

  );
}
