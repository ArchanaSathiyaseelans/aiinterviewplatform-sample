import React from 'react'
import { motion } from "motion/react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

function CustomTooltip({ active, payload }) {
    if (active && payload?.length) {
        return (
            <div className='bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white shadow-2xl'>
                <p className="text-slate-400 font-medium mb-0.5">{payload[0]?.payload?.skill}</p>
                <p className="font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent text-sm">{payload[0]?.value}%</p>
            </div>
        )
    }
}
function RadarCard({ title, data, color, fillColor, index, badgeColor }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className='relative overflow-hidden bg-slate-950/90 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-4 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-slate-700 transition-all'>
            <div className='absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />

            <div className='flex items-center justify-between mb-2'>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
                    {title}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Radar Analysis</span>
            </div>

            <div className='relative'>
                <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
                        <PolarGrid stroke="rgba(255,255,255,0.12)" gridType="circle" />
                        <PolarAngleAxis dataKey="skill"
                            tick={{ fill: "rgba(226, 232, 240, 0.7)", fontSize: 10, fontWeight: 600 }} />
                        <Radar
                            name={title}
                            dataKey="score"
                            stroke={color}
                            fill={fillColor || color}
                            fillOpacity={0.35}
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: color, strokeWidth: 0 }} />
                        <Tooltip content={<CustomTooltip/>}/>
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

function InterviewGraph({ technicalData, hrData, technicalCount, hrCount }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <RadarCard 
                title={`Technical Interviews (${technicalCount})`}
                data={technicalData} 
                color="#8B5CF6" 
                fillColor="#8B5CF6"
                badgeColor="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                index={0}
            />
            <RadarCard 
                title={`HR Interviews (${hrCount})`}
                data={hrData} 
                color="#06B6D4" 
                fillColor="#06B6D4"
                badgeColor="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                index={1}
            />
        </div>
    )
}

export default InterviewGraph
