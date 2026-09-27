import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Statbox from '../components/Statbox'
import InterviewGraph from '../components/InterviewGraph'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import QuickActionHub from '../components/dashboard/QuickActionHub'
import { useInterviewStats } from '../hooks/useInterview'
import api from '../utils/axios'
import meshBg from "../assets/images/dashboard_ai_mesh_1790439568275.jpg"

export default function Dashboard({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [moblieOpen, setMoblieOpen] = useState(false)
  const navigate = useNavigate()

  const { stats, technicalData, hrData } = useInterviewStats()

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout")
    } catch (err) {
      console.error(err)
    }
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
    navigate("/", { replace: true })
  }


  return (
    <div className='bg-slate-950 min-h-screen text-slate-100 font-sans flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
      {/* Background Ambient Mesh Overlay */}
      <div className='fixed top-0 left-0 right-0 h-[400px] opacity-25 pointer-events-none overflow-hidden'>
        <img src={meshBg} alt="background mesh" className="w-full h-full object-cover blur-3xl" referrerPolicy="no-referrer" />
      </div>

      <Sidebar
        user={user}
        setUser={setUser}
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        moblieOpen={moblieOpen}
        setMoblieOpen={setMoblieOpen}
      />


      <motion.main className={`flex-1 min-h-screen px-4 sm:px-6 md:px-8 py-6 transition-all duration-300 relative z-10 ${sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"}`}>

        {/* Modular Dashboard Header Banner */}
        <DashboardHeader user={user} />

        {/* Modular Quick Action Hub Launcher */}
        <QuickActionHub />

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
          <Statbox
            title="Total Interviews"
            value={stats.totalInterviews}
            type="total"
            subtext={`${stats.completed} sessions completed`}
          />
          <Statbox
            title="Questions Answered"
            value={stats.totalQuestions}
            type="questions"
            subtext="Real-time multi-agent feedback"
          />
          <Statbox
            title="Completed Sessions"
            value={stats.completed}
            type="completed"
            subtext="Fully evaluated by AI"
          />
          <Statbox
            title="Average Score"
            value={`${stats.averageScore}%`}
            type="score"
            subtext="Across Technical & HR rounds"
          />
        </div>

        {/* Performance Radar Section */}
        <motion.div  
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4">
            <span className='text-indigo-400 text-xs font-extrabold uppercase tracking-widest'>Performance Radar</span>
            <h3 className='text-white font-black text-lg md:text-xl mt-0.5'>Technical & Behavioral Radar Breakdown</h3>
        </motion.div>

        <InterviewGraph
          technicalData={technicalData}
          hrData={hrData}
        />
      </motion.main>
    </div>
  )
}
