import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { FiMic, FiFileText, FiStar, FiMap, FiArrowRight } from 'react-icons/fi'

export default function QuickActionHub() {
  const navigate = useNavigate()

  const QUICK_ACTIONS = [
    {
      title: "AI Interview Studio",
      desc: "Simulate Technical & HR rounds with live Monaco coding & instant speech evaluation.",
      path: "/interview",
      icon: <FiMic className="text-cyan-400" size={22} />,
      btnText: "Start Session",
      badge: "50 Coins",
      border: "border-cyan-500/30 hover:border-cyan-500/80",
      gradient: "from-cyan-500/10 via-indigo-500/5 to-transparent",
    },
    {
      title: "ATS Resume Builder",
      desc: "Draft executive, ATS-friendly resumes tailored to software engineering positions.",
      path: "/resume",
      icon: <FiFileText className="text-indigo-400" size={22} />,
      btnText: "Build Resume",
      badge: "10 Coins",
      border: "border-indigo-500/30 hover:border-indigo-500/80",
      gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    },
    {
      title: "ATS Resume Scorer",
      desc: "Scan your resume against job descriptions for match score & missing keywords.",
      path: "/scorer",
      icon: <FiStar className="text-amber-400" size={22} />,
      btnText: "Scan Resume",
      badge: "10 Coins",
      border: "border-amber-500/30 hover:border-amber-500/80",
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
    {
      title: "Career Roadmap",
      desc: "Generate custom step-by-step learning paths for target CTC package goals.",
      path: "/roadmap",
      icon: <FiMap className="text-emerald-400" size={22} />,
      btnText: "View Roadmap",
      badge: "20 Coins",
      border: "border-emerald-500/30 hover:border-emerald-500/80",
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className='text-indigo-400 text-xs font-extrabold uppercase tracking-widest'>Action Hub</span>
          <h3 className='text-white font-black text-lg md:text-xl mt-0.5'>AI Tools & Simulations</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((act, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate(act.path)}
            className={`relative overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-2xl border ${act.border} p-5 flex flex-col justify-between cursor-pointer shadow-xl group transition-all duration-300`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${act.gradient} pointer-events-none`} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  {act.icon}
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {act.badge}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {act.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
              <span>{act.btnText}</span>
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-indigo-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
