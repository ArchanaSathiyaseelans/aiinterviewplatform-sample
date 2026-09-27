import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { FiZap } from 'react-icons/fi'

export default function DashboardHeader({ user }) {
  const navigate = useNavigate()

  return (
    <div className='relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
      <div className='absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none' />
      
      <div className='relative z-10'>
        <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3'>
          <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' /> HirePulse AI Suite Active
        </div>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight'>
          Welcome back, <span className='bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>{user?.name?.split(" ")[0]}</span> 👋
        </h2>
        <p className='text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed font-medium'>
          Your specialized AI interview panel is active. Practice technical live coding, HR behavioral scenarios, or score your ATS resume.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/interview")}
        className='relative z-10 shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_24px_rgba(99,102,241,0.5)] hover:shadow-[0_6px_32px_rgba(236,72,153,0.6)] transition-all cursor-pointer flex items-center gap-2 border border-white/20'>
        <FiZap size={16} />
        <span>Start Practice Round</span>
      </motion.button>
    </div>
  )
}
