import React from 'react'
import { motion } from 'motion/react'
import { FaArrowRight } from 'react-icons/fa6'
import { FiZap, FiCheckCircle, FiCpu } from 'react-icons/fi'
import heroStudioImg from '../../assets/images/hero_interview_studio_1790439544901.jpg'

export default function HeroSection({ onStartClick }) {
  return (
    <section className='relative pt-32 pb-24 overflow-hidden'>
      <div className='max-w-5xl mx-auto px-6 text-center relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(99,102,241,0.25)]'>
          <FiZap className="text-amber-400 animate-pulse" size={14} /> Next-Gen Multi-Agent AI Interview Suite
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className='text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-white'>
          Ace Every Technical & HR<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Interview With Real-Time AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className='text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-medium'>
          HirePulse AI orchestrates specialized AI agents working in unison to simulate live coding rounds, behavioral HR interviews, ATS resume scoring, and personalized career roadmaps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="flex items-center justify-center gap-4 flex-wrap">

          <motion.button
            onClick={onStartClick}
            whileHover={{ scale: 1.05, boxShadow: "0 0 45px rgba(168,85,247,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className='relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold px-8 py-4 rounded-2xl text-sm cursor-pointer border border-white/30 shadow-[0_8px_32px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2.5'>
            <span>Get Started For Free</span> <FaArrowRight />
          </motion.button>
        </motion.div>

        {/* Unboxed Zero-Pill Metadata Discipline */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs font-semibold text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300"><FiCheckCircle className="text-emerald-400" /> 150 Free Coins Included</span>
          <span aria-hidden="true">·</span>
          <span>Monaco Live Code Editor</span>
          <span aria-hidden="true">·</span>
          <span>Instant Speech & Solution Analysis</span>
        </div>
      </div>

      {/* Hero Feature Preview Studio Card */}
      <motion.div
        id="studio"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className='mt-14 max-w-5xl mx-auto px-4 relative z-10'>
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900/90 shadow-[0_0_100px_rgba(99,102,241,0.25)] p-2">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-800">
            <img 
              src={heroStudioImg} 
              alt='HirePulse AI Studio Interface' 
              className='w-full h-full object-cover block shadow-2xl hover:scale-105 transition-transform duration-700' 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
                  <FiCpu className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-extrabold text-white">Multi-Agent AI Studio Active</p>
                  <p className="text-[11px] text-slate-400">Evaluating Technical Accuracy & Problem Solving</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Live Simulation</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
