import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { GiArtificialHive, GiTwoCoins } from 'react-icons/gi'
import { FiFileText, FiLogOut, FiMap, FiPlus, FiSidebar, FiStar, FiGrid, FiMic, FiCreditCard } from 'react-icons/fi'
import { useNavigate } from "react-router-dom"
import { FaCirclePlus } from "react-icons/fa6"
import api from '../utils/axios'

const DASHBOARD_ITEM = {
    icon: <FiGrid size={16} className="text-purple-400 group-hover:text-purple-300" />,
    label: "Dashboard",
    path: "/dashboard",
    color: "hover:bg-purple-500/10 hover:border-purple-500/20",
};

const AGENT_ITEMS = [
    {
        icon: <FiMic size={16} className="text-pink-400 group-hover:text-pink-300" />,
        label: "AI Interview",
        path: "/interview",
        color: "hover:bg-pink-500/10 hover:border-pink-500/20",
    },
    {
        icon: <FiFileText size={16} className="text-indigo-400 group-hover:text-indigo-300" />,
        label: "Resume Builder",
        path: "/resume",
        color: "hover:bg-indigo-500/10 hover:border-indigo-500/20",
    },
    {
        icon: <FiStar size={16} className="text-amber-400 group-hover:text-amber-300" />,
        label: "Resume Scorer",
        path: "/scorer",
        color: "hover:bg-amber-500/10 hover:border-amber-500/20",
    },
    {
        icon: <FiMap size={16} className="text-cyan-400 group-hover:text-cyan-300" />,
        label: "Roadmap Builder",
        path: "/roadmap",
        color: "hover:bg-cyan-500/10 hover:border-cyan-500/20",
    },
];

function Sidebar({
    user,
    setUser,
    onNewInterview,
    onLogout,
    handleLogout,
    sidebarOpen,
    setSidebarOpen,
    moblieOpen,
    setMoblieOpen
}) {
    const navigate = useNavigate()
    const avatar = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U"

    const performLogout = async () => {
        try {
            await api.get("/api/auth/logout")
        } catch (e) {
            console.error("Logout API call error:", e)
        }
        if (typeof onLogout === 'function') {
            try { onLogout(); } catch (e) { }
        }
        if (typeof handleLogout === 'function') {
            try { handleLogout(); } catch (e) { }
        }
        if (setUser) {
            setUser(null)
        }
        localStorage.clear()
        sessionStorage.clear()
        navigate("/", { replace: true })
    }



    const inner = (
        <div className='flex flex-col h-full'>
            <div className={`px-3 h-[56px] border-b border-slate-800/80 shrink-0 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"
                }`}>
                {sidebarOpen && (
                    <div className='flex items-center gap-2.5'>
                        <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(99,102,241,0.4)]'>
                            <GiArtificialHive size={20} color='white' />
                        </div>
                        <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className='font-black text-base tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent whitespace-nowrap'>
                            HirePulse AI
                        </motion.span>
                    </div>
                )}
                <div className='flex items-center '>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='cursor-pointer hidden md:flex text-slate-400 hover:text-white transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-800'>
                        <FiSidebar size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMoblieOpen(!moblieOpen)}
                        className='cursor-pointer md:hidden text-slate-400 hover:text-white transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-800'>
                        <FiSidebar size={16} />
                    </motion.button>
                </div>
            </div>

            <div className='px-3 pt-4 pb-2 shrink-0'>
                <motion.button
                    onClick={onNewInterview}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl py-2.5 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.35)] cursor-pointer ${sidebarOpen ? "px-3.5" : "justify-center px-0"
                        }`}>
                    <FiPlus size={16} className='shrink-0' />
                    <AnimatePresence>
                        {sidebarOpen &&
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.13 }}
                                className='text-xs tracking-wide whitespace-nowrap'>
                                Create Interview
                            </motion.span>}
                    </AnimatePresence>
                </motion.button>
            </div>

            <div className='px-3 pt-2 pb-1 shrink-0'>
                <motion.button
                    onClick={() => {
                        navigate(DASHBOARD_ITEM.path);
                        setMoblieOpen(false);
                    }}
                    whileHover={{ x: sidebarOpen ? 4 : 0 }}
                    transition={{ duration: 0.13 }}
                    className={`group flex items-center gap-3 w-full rounded-xl py-2.5 border border-transparent transition-all text-xs font-semibold text-slate-300 hover:text-white ${DASHBOARD_ITEM.color} cursor-pointer ${sidebarOpen ? "px-3" : "justify-center px-0"
                        }`}>
                    <span className='shrink-0 p-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm'>{DASHBOARD_ITEM.icon}</span>
                    {sidebarOpen && <span className='whitespace-nowrap tracking-wide'>{DASHBOARD_ITEM.label}</span>}
                </motion.button>
            </div>

            <AnimatePresence>
                {sidebarOpen &&
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.13 }}
                        className='px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>
                        Agents & Tools
                    </motion.p>}
            </AnimatePresence>

            <nav className='flex flex-col gap-1 px-3 flex-1'>
                {AGENT_ITEMS.map((nav, i) => (
                    <motion.button key={i}
                        onClick={() => {
                            navigate(nav.path);
                            setMoblieOpen(false)
                        }}
                        whileHover={{ x: sidebarOpen ? 4 : 0 }}
                        transition={{ duration: 0.13 }}
                        className={`group flex items-center gap-3 rounded-xl py-2.5 border border-transparent transition-all text-xs font-semibold text-slate-300 hover:text-white ${nav.color} cursor-pointer ${sidebarOpen ? "px-3" : "justify-center px-0"
                            }`}>
                        <span className='shrink-0 p-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm'>{nav.icon}</span>

                        {sidebarOpen &&
                            <span className='whitespace-nowrap tracking-wide'>{nav.label}</span>}
                    </motion.button>
                ))}
            </nav>

            {/* coins */}
            <div className='border-t border-slate-800/80 p-3 shrink-0'>
                <AnimatePresence>
                    {sidebarOpen &&
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.13 }}
                            onClick={() => navigate("/billing")}
                            className='group flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent backdrop-blur-2xl px-3 py-2 mb-3 transition-all hover:border-amber-400/80 shadow-[0_4px_20px_rgba(245,158,11,0.2)]'>
                            <div className='flex items-center gap-2'>
                                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                                    <GiTwoCoins size={16} className='text-amber-400 shrink-0' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[9px] uppercase tracking-wider text-amber-300/80 font-bold'>Interview Coins</span>
                                    <span className='text-xs font-black text-amber-200'>{user?.interviewCoin ?? 150}</span>
                                </div>
                            </div>

                            <div className='flex items-center justify-center'>
                                <FaCirclePlus size={16} className='text-amber-300 transition-transform duration-200 group-hover:scale-125' />
                            </div>
                        </motion.div>}
                </AnimatePresence>

                <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
                    <div
                        onClick={() => !sidebarOpen && performLogout()}
                        title={sidebarOpen ? "" : "Click to Logout"}
                        className={`w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-inner ${!sidebarOpen ? "cursor-pointer hover:opacity-80" : ""}`}>
                        <span className='text-white font-black text-[11px]'>
                            {avatar}
                        </span>
                    </div>

                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0">
                                <p className="text-white text-xs font-bold truncate">
                                    {user?.name ?? "User"}
                                </p>
                                <p className="text-slate-400 text-[10px] truncate">
                                    {user?.email ?? "user@email.com"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.button
                                onClick={performLogout}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                whileHover={{ scale: 1.15 }}
                                title="Log Out"
                                className='text-slate-400 hover:text-pink-400 transition-colors ml-auto p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer'>
                                <FiLogOut size={15} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
    return (
        <>
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className='hidden md:flex fixed top-0 left-0 h-screen bg-slate-950/95 border-r border-slate-800/80 flex-col z-40 overflow-hidden shadow-2xl backdrop-blur-2xl'>
                {inner}
            </motion.aside>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMoblieOpen(false)}
                        className='fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md' />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className='fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-slate-950 border-r border-slate-800 flex flex-col z-50 md:hidden overflow-hidden shadow-2xl'>
                        {inner}
                    </motion.aside>
                )}
            </AnimatePresence>


        </>
    )
}

export default Sidebar
