import React from 'react'
import { motion } from "motion/react"
import { FiTrendingUp, FiTarget, FiCheckCircle, FiAward } from 'react-icons/fi'

const COLOR_THEMES = [
  {
    bgGradient: "from-indigo-600/15 via-purple-600/10 to-transparent",
    border: "border-indigo-500/30 hover:border-indigo-500/60",
    textGradient: "from-indigo-400 to-purple-300",
    icon: <FiTrendingUp className="text-indigo-400" size={18} />,
    glow: "bg-indigo-500/20",
    badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  },
  {
    bgGradient: "from-cyan-600/15 via-teal-600/10 to-transparent",
    border: "border-cyan-500/30 hover:border-cyan-500/60",
    textGradient: "from-cyan-400 to-teal-300",
    icon: <FiTarget className="text-cyan-400" size={18} />,
    glow: "bg-cyan-500/20",
    badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  },
  {
    bgGradient: "from-emerald-600/15 via-green-600/10 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    textGradient: "from-emerald-400 to-teal-300",
    icon: <FiCheckCircle className="text-emerald-400" size={18} />,
    glow: "bg-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  {
    bgGradient: "from-amber-600/15 via-orange-600/10 to-transparent",
    border: "border-amber-500/30 hover:border-amber-500/60",
    textGradient: "from-amber-400 to-orange-300",
    icon: <FiAward className="text-amber-400" size={18} />,
    glow: "bg-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
]

function Statbox({ label, value, sub, subHighlight, index = 0 }) {
  const theme = COLOR_THEMES[index % COLOR_THEMES.length]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden bg-slate-950/90 backdrop-blur-2xl border ${theme.border} rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 group`}
    >
      <div className={`absolute -right-8 -bottom-8 w-28 h-28 ${theme.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} pointer-events-none`} />

      <div className="relative flex items-center justify-between mb-2">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
          {theme.icon}
        </div>
      </div>

      <div className="relative my-1">
        <p className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent tracking-tight font-mono tabular-nums`}>
          {value}
        </p>
      </div>

      {sub && (
        <div className="relative flex items-center gap-1.5 mt-2 flex-wrap">
          {subHighlight && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.badge}`}>
              {subHighlight}
            </span>
          )}
          <span className="text-slate-400 text-xs font-medium">{sub}</span>
        </div>
      )}
    </motion.div>
  )
}

export default Statbox
