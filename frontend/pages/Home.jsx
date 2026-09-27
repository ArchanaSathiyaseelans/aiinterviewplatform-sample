import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { GiArtificialHive } from 'react-icons/gi'
import { FaArrowRight } from 'react-icons/fa6'
import { FiLogOut } from 'react-icons/fi'
import LoginModel from '../components/LoginModel'
import HeroSection from '../components/home/HeroSection'
import StatsTicker from '../components/home/StatsTicker'
import FeatureShowcase from '../components/home/FeatureShowcase'
import api from '../utils/axios'

export default function Home({ user, setUser }) {
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout')
    } catch (e) {
      console.error(e)
    }
    if (setUser) setUser(null)
    localStorage.clear()
    sessionStorage.clear()
  }

  const handleStart = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className='bg-slate-950 text-slate-100 font-sans min-h-screen overflow-x-hidden relative selection:bg-purple-500 selection:text-white'>

      {/* Ambient Light Mesh Elements */}
      <div className='fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/20 to-pink-600/15 rounded-full blur-[150px] pointer-events-none' />
      <div className='fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none' />

      {/* Top Bar Contract Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center justify-between px-6 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80'>

        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]'>
            <GiArtificialHive size={22} color='white' />
          </div>
          <span className='font-black text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>
            HirePulse AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">AI Agents</a>
          <a href="#studio" className="hover:text-white transition-colors">Interview Studio</a>
          <a href="#stats" className="hover:text-white transition-colors">Performance</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Log Out"
              className='p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold px-4'>
              <FiLogOut size={15} />
              <span>Log Out</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl px-5 py-2.5 text-xs cursor-pointer transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)] flex items-center gap-2 border border-white/20'>
              <span>Log In</span> <FaArrowRight size={11} />
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* Hero Section Module */}
      <HeroSection onStartClick={handleStart} />

      {/* Proof Metrics Ticker Module */}
      <StatsTicker />

      {/* Feature Showcase Module */}
      <FeatureShowcase onStartClick={handleStart} />

      {/* Footer */}
      <footer className='border-t border-slate-800/80 py-10 text-center bg-slate-950'>
        <div className='flex items-center justify-center gap-2.5 mb-3'>
          <div className='w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md'>
            <GiArtificialHive size={16} color='white'/>
          </div>
          <span className='font-black text-base text-slate-200'>HirePulse AI</span>
        </div>
        <p className='text-slate-400 text-xs max-w-md mx-auto mb-4 font-medium'>
          Empowering job seekers worldwide with multi-agent AI mock interviews, live code execution, ATS resume scoring, and career roadmaps.
        </p>
        <div className='text-slate-500 text-xs font-mono'>
          © {new Date().getFullYear()} HirePulse AI · All rights reserved
        </div>
      </footer>

      {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />}
    </div>
  )
}
