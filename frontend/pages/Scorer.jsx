import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { useState } from 'react'
import { FiAlertCircle, FiTrendingUp, FiUploadCloud, FiUser, FiZap } from 'react-icons/fi'
import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { useCoins } from '../apis/user.api'
import Navbar from '../components/Navbar'
const ScoreRing = ({ score }) => {
    const color = score >= 75 ? "#7c3aed" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <div className='relative flex items-center justify-center'>
            <RadialBarChart
                width={110}
                height={110}
                cx={55}
                cy={55}
                innerRadius={40}
                outerRadius={53}
                startAngle={90}
                endAngle={-270}
                data={[{ value: score, fill: color }]}
                barSize={8}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "#e5e7eb" }} dataKey="value" cornerRadius={8} />

            </RadialBarChart>

            <div className='absolute flex  items-center'>
                <span className='text-lg font-bold text-white leading-none'>{score}</span>
                <span className='text-[9px] text-gray-200 mt-0.5'>/100</span>
            </div>

        </div>
    )
}

const Tag = ({ text, color }) => {
    const styles = {
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        red: "bg-red-50    text-red-700    border-red-200",
        green: "bg-green-50  text-green-700  border-green-200",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    return (
        <div className={`text-[10px] px-1.5 py-1 rounded-md border font-medium ${styles[color]}`}>
            {text}
        </div>
    )
}

function Scorer({ user, setUser }) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { resume } = useSelector((state) => state.resume)

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a PDF file first");
            return;
        }
        try {
            setLoading(true)

            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" })
                const newCoins = coinResponse?.interviewCoin ?? coinResponse?.coinsRemaining ?? coinResponse?.coins;
                setUser((prev) => ({
                    ...prev,
                    interviewCoin: newCoins,
                    coins: newCoins,
                }))
            } catch (error) {
                setLoading(false)
                alert("Failed to deduct coins.")
                return;
            }

            const formData = new FormData()
            formData.append("resume", file)

            const response = await api.post("/api/resume/upload", formData)

            if (response?.data?.data) {
                dispatch(setResume(response.data.data))
            }
            setLoading(false)
            setFile(null)
            alert("Resume uploaded and scored successfully! 🎉")
        } catch (error) {
            console.error("Scorer upload error:", error)
            alert(error?.response?.data?.message || "Upload failed")
            setLoading(false)
        }
    }
    // scorer section

    if (resume) return (
        <div className='min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
            {/* Ambient Background Light Mesh */}
            <div className='fixed top-0 left-1/3 w-[600px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-purple-600/15 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none' />
            <Navbar label="Resume Scorer" user={user} />

            <section className='max-w-6xl mx-auto px-3 pt-18 sm:pt-20 pb-8 space-y-3.5'>
                {/* header */}
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl'>
                    <div>
                        <p className='text-xs text-purple-400 font-semibold tracking-widest uppercase mb-1 flex items-center gap-1.5'>
                            <FiZap size={13} /> ATS Resume Analysis Report
                        </p>
                        <h2 className='text-xl sm:text-2xl font-bold text-white'>{resume?.name || "Candidate Profile"}</h2>
                        <p className='text-xs text-slate-400 mt-0.5'>Target Role: <span className='text-purple-300 font-medium'>{resume?.suggestedRole || "Software Engineer"}</span></p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button 
                            onClick={() => dispatch(setResume(null))}
                            className='flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all cursor-pointer border border-white/20 hover:scale-[1.02] active:scale-[0.98]'>
                            <FiUploadCloud size={16} />
                            <span>Upload New Resume</span>
                        </button>
                    </div>
                </div>

                {/* Score */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />

                    <div className='relative'>
                        <ScoreRing score={resume?.score} />

                    </div>
                    <div className='relative'>
                        <p className='text-white/50 text-xs mb-0.5'>Resume Score</p>
                        <p className='text-lg sm:text-xl font-bold mb-1.5 text-white'>
                            {resume.score >= 75 ? "Strong" : resume.score >= 50 ? "Average" : "Needs Work"}
                        </p>
                        <div className='flex items-center gap-1.5'>
                            <FiUser className='text-purple-400 text-xs' />
                            <span className='text-xs text-purple-300'>{resume?.suggestedRole}</span>
                        </div>

                    </div>

                </motion.div >

                {/* Weaknesses & Strengths */}
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>


                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4  sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                        <div className='relative flex items-center gap-1.5 mb-2.5'>
                            <FiAlertCircle className='text-green-400' size={14} />
                            <span className='text-xs font-semibold text-white'>Strengths</span>
                        </div>



                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.strengths?.map(s => <Tag key={s} text={s} color="green" />)}

                        </div>

                    </motion.div>


                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4  sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                        <div className='relative flex items-center gap-1.5 mb-2.5'>
                            <FiAlertCircle className='text-yellow-400' size={14} />
                            <span className='text-xs font-semibold text-white'>Weaknesses</span>
                        </div>

                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.weaknesses?.map(s => <Tag key={s} text={s} color="yellow" />)}

                        </div>

                    </motion.div>

                </div>

                {/* Missing Skills */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.09 }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4  sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                    <div className='relative flex items-center gap-1.5 mb-2.5'>
                        <FiZap className='text-red-400' size={14} />
                        <span className='text-xs font-semibold text-white'>Missing Skills</span>
                    </div>

                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.missingSkills?.map(s => <Tag key={s} text={s} color="red" />)}

                    </div>

                </motion.div>
                {/* Recommendations */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4  sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                    <div className='relative flex items-center gap-1.5 mb-2.5'>
                        <FiTrendingUp className='text-purple-400' size={14} />
                        <span className='text-xs font-semibold text-white'>Recommendations</span>
                    </div>

                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.recommendations?.map(s => <Tag key={s} text={s} color="purple" />)}

                    </div>

                </motion.div>



            </section>

        </div>
    )
    //upload section
    return (
        <div className='min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
            {/* Ambient Background Light Mesh */}
            <div className='fixed top-0 left-1/3 w-[600px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-purple-600/15 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none' />
            <Navbar label="Resume Scorer" user={user} />


            <section className='flex min-h-screen items-center justify-center px-3 pt-18 pb-6'>
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className='relative w-full max-w-md rounded-3xl overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-7'>
                    <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none' />

                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-[10px] text-purple-400 font-mono font-semibold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full'>
                            Step 1 of 2 · ATS AI Analysis
                        </span>
                        <span className='text-xs text-amber-400 font-medium flex items-center gap-1'>
                            <FiZap size={12} /> 10 Coins
                        </span>
                    </div>

                    <h2 className='relative text-xl font-bold mb-1 text-white'>
                        Upload Your Resume
                    </h2>
                    <p className='relative text-slate-400 text-xs mb-5'>
                        Upload your PDF resume to receive a comprehensive ATS score, skill gaps, and AI feedback.
                    </p>

                    <label className={`relative flex flex-col items-center justify-center w-full h-44 sm:h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-all p-4 text-center
                        ${file
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-white/20 bg-slate-950/60 hover:border-purple-500/40 hover:bg-slate-950/80"
                        }`}>
                        <div className='w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-3 text-purple-400'>
                            <FiUploadCloud size={24} />
                        </div>
                        
                        <p className="text-sm font-semibold text-white mb-1">
                            {file ? file.name : "Choose or Drag PDF File Here"}
                        </p>
                        <p className="text-[11px] text-slate-400 mb-3">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB PDF selected` : "Supports PDF documents up to 20MB"}
                        </p>

                        <span className='inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md'>
                            <FiUploadCloud size={14} />
                            <span>{file ? "Change File" : "Select PDF File"}</span>
                        </span>

                        <input type='file'
                            accept='.pdf'
                            className='hidden'
                            onChange={(e) => setFile(e.target.files[0] || null)}
                        />
                    </label>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={uploadResume}
                        disabled={!file || loading} 
                        className='relative mt-5 w-full h-11 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer'>
                        <FiUploadCloud size={16} />
                        <span>{loading ? "Analyzing Resume with AI..." : "Upload & Score Resume"}</span>
                    </motion.button>

                    <div className='relative mt-3 text-center'>
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(setResume({
                                    name: "Alex Chen",
                                    email: "alex.chen@exa-scale.com",
                                    suggestedRole: "Senior Full-Stack Engineer",
                                    score: 88,
                                    strengths: ["React & TypeScript", "Node.js Microservices", "PostgreSQL & Redis Caching", "System Architecture"],
                                    weaknesses: ["GraphQL Eviction Strategies", "Kubernetes Operator Patterns"],
                                    missingSkills: ["Kafka Event Streaming", "OpenTelemetry Tracing"],
                                    recommendations: ["Build a high-throughput API gateway with Redis rate limiting", "Add distributed tracing benchmark metrics"]
                                }))
                            }}
                            className='text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer font-medium'>
                            Or load sample demo resume to test
                        </button>
                    </div>
                </motion.div>
            </section>




        </div>
    )
}

export default Scorer
