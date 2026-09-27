import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { FiArrowLeft, FiCheck, FiChevronDown, FiClock, FiFileText, FiSend, FiX, FiZap } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BsRocketTakeoff } from "react-icons/bs";
import { useCoins } from '../apis/user.api'
import api from '../utils/axios'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import RoadmapResult from '../components/roadmap/RoadmapResult'
import Navbar from '../components/Navbar'
const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA"];
function Roadmap({ user, setUser }) {
    const navigate = useNavigate()
    const [historyOpen, setHistoryOpen] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [role, setRole] = useState("");
    const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[2]); // default "20 LPA"
    const [packageOpen, setPackageOpen] = useState(false);
    const [useResume, setUseResume] = useState(false);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const { resume } = useSelector((state) => state.resume)


    useEffect(() => {

        getAllRoadmaps()
    }, [])

    const getAllRoadmaps = async () => {
            setHistoryLoading(true)
            try {
                const response = await api.get("/api/roadmap/all")
                console.log(response.data)
                setHistory(response.data.data)
                setHistoryLoading(false)
            } catch (error) {
                console.log(error)
                setHistoryLoading(false)
            }
        }


    const getRoadmapById = async (id) => {
        try {
            const response = await api.get(`/api/roadmap/${id}`)
            console.log(response.data)
            setRoadmap(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    const handleGenerateWithRole = async (selectedRole) => {
        const roleToUse = (selectedRole || role).trim();
        if (!roleToUse || loading) return;
        setRole(roleToUse);
        setLoading(true);
        setError("");

        try {
            try {
                const coinResponse = await useCoins({ coins: 20, action: "roadmap-builder" });
                if (setUser && coinResponse) {
                    const newCoins = coinResponse?.interviewCoin ?? coinResponse?.coinsRemaining ?? coinResponse?.coins;
                    setUser((prev) => ({
                        ...prev,
                        interviewCoin: newCoins,
                        coins: newCoins,
                    }));
                }
            } catch (coinError) {
                console.warn("Coin check notice for roadmap:", coinError);
            }

            const response = await api.post("/api/roadmap/generate", {
                role: roleToUse,
                targetPackage,
                useResume,
                resume
            });

            if (response.data && response.data.data) {
                setRoadmap(response.data.data);
                getAllRoadmaps();
            } else {
                setError("Could not structure roadmap. Please try again.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to generate roadmap:", error);
            setError("Something went wrong while generating your roadmap. Please try again.");
            setLoading(false);
        }
    };

    const handleGenerate = () => handleGenerateWithRole(role);


    return (
        <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
            {/* Ambient Background Mesh */}
            <div className='fixed top-0 left-1/3 w-[600px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none' />

            <Navbar label="Roadmap Builder" user={user} />

            <main className='flex-1 overflow-y-auto pb-28 sm:pb-32 pt-16 sm:pt-20'>
                <div className='max-w-3xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4'>
                    {/* Header Action Bar */}
                    <div className='flex items-center justify-between mb-4'>
                        <button 
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm'>
                            <FiArrowLeft size={14} />
                            <span>Back to Dashboard</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setHistoryOpen(true)}
                            className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 transition-all cursor-pointer shadow-sm'>
                            <FiClock size={14} />
                            <span>Saved Roadmaps ({history.length})</span>
                        </button>
                    </div>

                    <AnimatePresence mode='wait'>
                        {!roadmap ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.4 }}
                                className='flex flex-col items-center justify-center min-h-[55vh] text-center px-2 sm:px-4'>
                                <div className='text-4xl sm:text-5xl mb-4 sm:mb-5'>
                                    <BsRocketTakeoff className='text-cyan-400 animate-pulse' />
                                </div>

                                <h3 className='text-2xl sm:text-4xl font-black text-white tracking-tight mb-2'>
                                    AI Roadmap Generator
                                </h3>

                                <p className='text-slate-300 text-sm sm:text-base max-w-xs sm:max-w-md mb-1 font-medium'>
                                    Generate a personalized learning path for your target job role.
                                </p>

                                <p className='text-slate-400 text-xs sm:text-sm max-w-xs sm:max-w-md'>
                                    Select a quick role below or type your dream role in the prompt box.
                                </p>

                                {error && <p className="mt-4 text-xs text-red-400 max-w-xs sm:max-w-md bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{error}</p>}

                                <div className='mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm'>
                                    {
                                        ["Frontend Dev", "Backend Eng", "ML Engineer"].map((r) => (
                                            <motion.button
                                                key={r}
                                                onClick={() => handleGenerateWithRole(r)}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                className='relative overflow-hidden text-xs py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white shadow-md transition-all cursor-pointer'>
                                                <span>{r}</span>
                                            </motion.button>
                                        ))
                                    }
                                </div>

                            </motion.div>
                        ) : (
                            <RoadmapResult
                                roadmap={roadmap}
                                onClear={()=>setRoadmap(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <div className='fixed bottom-0 left-0 right-0 z-30 pb-3 sm:pb-4 pt-3 px-3 sm:px-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-auto'>
                <div className='max-w-3xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='relative overflow-visible flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700 shadow-2xl'>

                        <input
                            type='text'
                            placeholder='e.g., Senior Fullstack Engineer'
                            onChange={(e) => setRole(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleGenerate();
                            }}
                            value={role}
                            className='relative flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none px-2 py-1.5' />

                        <div className='relative'>
                            <motion.button
                                type='button'
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setPackageOpen(!packageOpen)}
                                className='relative flex items-center gap-1 text-xs px-2.5 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-all whitespace-nowrap bg-white/5'>
                                {targetPackage}
                                <FiChevronDown size={11} className={`transition-transform ${packageOpen ? "rotate-180" : ""}`} />


                            </motion.button>

                            <AnimatePresence>
                                {packageOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className='absolute bottom-full mb-4 right-0 w-28 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.35)] z-10 '>
                                        {
                                            PACKAGE_OPTIONS.map((pkg) => (
                                                <button key={pkg}
                                                    onClick={() => {
                                                        setTargetPackage(pkg);
                                                        setPackageOpen(false)
                                                    }}
                                                    className={`w-full text-left text-xs px-3 py-2 transition-colors ${pkg === targetPackage
                                                        ? "bg-white/10 text-white"
                                                        : "text-white/55 hover:bg-white/5 hover:text-white/90"
                                                        }`}>
                                                    {pkg}

                                                </button>
                                            ))
                                        }

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type='button'
                            onClick={() => setUseResume(!useResume)}
                            className={`flex items-center text-xs gap-1 px-2 py-2 rounded-xl ${useResume
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-white/5 text-white/60"
                                }`}>
                            {useResume ? (
                                <>
                                    <FiCheck size={12} />
                                    Added
                                </>
                            ) : (
                                <>
                                    <FiFileText size={12} />
                                    Resume
                                </>
                            )}

                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={loading || !role.trim()}
                            onClick={handleGenerate}
                            className='relative flex items-center gap-1.5 text-xs px-3 sm:px-4 py-2 rounded-xl font-semibold text-[#0A0A0A] bg-white hover:bg-white/90 shadow-[0_2px_10px_rgba(255,255,255,0.12)] transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap'>
                            {loading ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="inline-block"
                                    >
                                        <FiZap size={12} />
                                    </motion.span>
                                    <span className="hidden sm:inline">Generating…</span>
                                </>
                            ) : (
                                <>
                                    <FiSend size={12} />
                                    <span className="hidden sm:inline">Generate</span>
                                </>
                            )}

                        </motion.button>


                    </motion.div>

                </div>
            </div>

            <AnimatePresence>
                {
                    historyOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setHistoryOpen(false)}
                                className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm' />

                            <motion.aside
                                initial={{ x: 320 }}
                                animate={{ x: 0 }}
                                exit={{ x: 320 }}
                                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                                className='fixed right-0 top-0 bottom-0 z-50 w-[280px] sm:w-[300px] max-w-[85vw] bg-white border-l border-black/8 flex flex-col overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.1)]'>
                                <div className='flex items-center justify-between px-4 py-3 sm:py-4 border-b border-black/8 sticky top-0 bg-white/90 backdrop-blur-xl'>
                                    <span className='text-sm font-semibold text-[#0A0A0A]'>Previous Roadmaps</span>
                                    <button onClick={() => setHistoryOpen(false)} className='text-black/35 hover:text-[#0A0A0A] transition-colors'><FiX size={16} /></button>
                                </div>

                                <div className='flex flex-col gap-2 p-3'>
                                    {historyLoading ? (
                                        <p className="text-xs text-black/35 text-center py-6">Loading…</p>
                                    )
                                        : history.length === 0 ?
                                            (
                                                <p className="text-xs text-black/35 text-center py-6">No roadmaps yet.</p>
                                            ) :
                                            (
                                                history.map((h, i) => (
                                                    <button key={i} onClick={()=>{
                                                        getRoadmapById(h._id);
                                                        setHistoryOpen(false)
                                                    }} className='relative overflow-hidden text-left p-4 rounded-xl bg-[#000]/90 border border-white/10'>
                                                        <h3 className='text-white font-semibold'>{h.title}</h3>
                                                        <div className='flex justify-between items-center my-1'>
                                                            <span className='text-violet-400 text-xs'>{h.targetPackage}</span>
                                                            <p className='text-xs text-white/40'>{h.duration}</p>
                                                        </div>

                                                        <p className='text-xs text-white/30 mt-1'>
                                                        {new Date(h.createdAt).toLocaleDateString()}</p>

                                                    </button>
                                                ))
                                            )}
                                </div>


                            </motion.aside>

                        </>
                    )
                }
            </AnimatePresence>




        </div>
    )
}

export default Roadmap
