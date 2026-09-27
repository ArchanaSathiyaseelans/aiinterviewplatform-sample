import React from 'react'

export default function StatsTicker() {
  const STATS = [
    { label: "AI Interview Rounds", val: "10,000+", highlight: "Conduct Answered" },
    { label: "Resume ATS Scores", val: "98.4%", highlight: "Match Precision" },
    { label: "Career Roadmaps", val: "100%", highlight: "Personalized" },
    { label: "User Rating", val: "4.9 / 5.0", highlight: "Candidate Rated" },
  ]

  return (
    <section id="stats" className="py-10 border-y border-slate-800/80 bg-slate-950/90 relative z-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent font-mono tabular-nums">
              {stat.val}
            </p>
            <p className="text-xs font-bold text-white mt-1">{stat.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{stat.highlight}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
