import React from 'react'
import { motion } from 'motion/react'
import { FiMic, FiFileText, FiBarChart2, FiMap, FiShield, FiTarget } from 'react-icons/fi'
import aiPanelImg from '../../assets/images/ai_agent_panel_1790439556893.jpg'

export default function FeatureShowcase({ onStartClick }) {
  const AGENTS = [
    {
      icon: <FiFileText className="text-indigo-400" size={24} />,
      title: "ATS Resume Builder",
      desc: "Build ATS-friendly resumes with real-time scoring and tailored keyword suggestions.",
      border: "border-indigo-500/30 hover:border-indigo-500/80",
      bg: "from-indigo-500/15 via-purple-500/5 to-transparent",
    },
    {
      icon: <FiMic className="text-cyan-400" size={24} />,
      title: "AI Interview Studio",
      desc: "Practice Technical, Behavioral, and Coding rounds with integrated Monaco code editor.",
      border: "border-cyan-500/30 hover:border-cyan-500/80",
      bg: "from-cyan-500/15 via-teal-500/5 to-transparent",
    },
    {
      icon: <FiBarChart2 className="text-emerald-400" size={24} />,
      title: "ATS Scorer & Analytics",
      desc: "Get detailed question-by-question scoring, strength takeaways, and answer revisions.",
      border: "border-emerald-500/30 hover:border-emerald-500/80",
      bg: "from-emerald-500/15 via-green-500/5 to-transparent",
    },
    {
      icon: <FiMap className="text-amber-400" size={24} />,
      title: "Career Roadmap AI",
      desc: "Generate custom step-by-step skill roadmaps tailored to your target CTC and role.",
      border: "border-amber-500/30 hover:border-amber-500/80",
      bg: "from-amber-500/15 via-orange-500/5 to-transparent",
    },
  ]

  return (
    <section id="features" className='py-24 relative bg-slate-950/90 border-t border-slate-800/80'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold mb-4'>
            <FiShield className="text-purple-400" /> Specialized AI Panel
          </div>

          <h2 className='text-3xl md:text-5xl font-black tracking-tight text-white'>
            Four Dedicated AI Agents For
            <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mt-1">
              Complete Career Mastery
            </span>
          </h2>

          <p className='text-slate-400 text-sm max-w-2xl mx-auto mt-4 leading-relaxed font-medium'>
            Each agent handles a key milestone in your job hunt — from refining your ATS resume to guiding live technical coding under real interview pressure.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {AGENTS.map((agent, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${agent.bg} border ${agent.border} p-6 shadow-xl backdrop-blur-xl transition-all duration-300 group`}>
              <div className='relative z-10'>
                <div className='w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform'>
                  {agent.icon}
                </div>

                <h3 className='text-lg font-bold mb-2 text-white'>{agent.title}</h3>
                <p className='text-slate-400 text-xs leading-relaxed font-medium'>{agent.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-slate-900 p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
              <FiTarget size={14} /> Multi-Agent Collaboration
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Real-time AI Interrogation & Evaluation
            </h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed font-medium">
              During your mock session, our AI agents evaluate code efficiency, edge cases, articulation, and problem breakdown simultaneously — mirroring elite tech company interviews.
            </p>
            <button 
              onClick={onStartClick}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all cursor-pointer">
              Try AI Panel Interview
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[16/9]">
            <img 
              src={aiPanelImg} 
              alt="AI Panel Evaluation" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
