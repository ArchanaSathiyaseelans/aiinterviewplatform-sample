import React from 'react'
import { motion } from "motion/react"
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiCheckCircle, FiFileText, FiUploadCloud } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCoins } from '../../apis/user.api'
import api from '../../utils/axios'
import { setResume } from '../../redux/resumeSlice'
import { startInterview } from '../../apis/interview.api'
import Navbar from '../Navbar'

function Step1setup({ user, setUser }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { resume } = useSelector((state) => state.resume)
    const [role, setRole] = useState("");
    const [type, setType] = useState("technical");
    const [useResume, setUseResume] = useState(!!resume)
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [starting, setStarting] = useState(false)

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a PDF file first");
            return;
        }
        try {
            setUploading(true)
            try {
                
            const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" })
            const newCoins = coinResponse?.interviewCoin ?? coinResponse?.coinsRemaining ?? coinResponse?.coins;
            setUser((prev) => ({
                ...prev,
                interviewCoin: newCoins,
                coins: newCoins,
            }))
            } catch (error) {
                setUploading(false)
                alert("Failed to deduct coins.")
                return;
            }

            const formData = new FormData()
            formData.append("resume", file)

            const response = await api.post("/api/resume/upload", formData)

            if (response?.data?.data) {
                dispatch(setResume(response.data.data))
                if (!role) {
                    setRole(response.data.data.suggestedRole || response.data.data.targetRole || "Software Engineer")
                }
            }
            setUploading(false)
            setFile(null)
            alert("Resume uploaded and analyzed successfully! 🎉")
        } catch (error) {
            console.error("Upload error:", error)
            alert(error?.response?.data?.message || "Upload failed")
            setUploading(false)
        }
    }

    const start = async () => {
        setStarting(true)
        try {
            const response = await startInterview({ role, type, useResume, resume })
            const interviewId = response?.interviewId || response?._id || `int_${Date.now()}`;

            try {
                const coinResponse = await useCoins({ coins: 50, action: "start-interview" })
                const newCoins = coinResponse?.interviewCoin ?? coinResponse?.coinsRemaining ?? coinResponse?.coins;
                if (setUser && newCoins !== undefined) {
                    setUser((prev) => ({
                        ...prev,
                        interviewCoin: newCoins,
                        coins: newCoins,
                    }))
                }
            } catch (coinErr) {
                console.warn("Coin deduction notice:", coinErr)
            }

            setStarting(false)
            navigate(`/interview/${interviewId}`)
        } catch (err) {
            console.error("Failed to start interview:", err)
            setStarting(false)
            alert("Failed to initialize interview. Starting session...")
            navigate(`/interview/int_${Date.now()}`)
        }
    }

    return (
        <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 pt-20 pb-12 relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
            <Navbar label="AI Panel Interview" user={user} setUser={setUser} />

            {/* Ambient Background Mesh */}
            <div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none' />
            <div className='absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[130px] pointer-events-none' />

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className='w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl overflow-hidden grid lg:grid-cols-[42%_58%] shadow-[0_16px_60px_rgba(0,0,0,0.6)] relative z-10'>

                {/* left */}
                <div className='p-6 sm:p-8 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between gap-6'>
                    <div>
                        <div onClick={() => navigate(-1)} className='inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 hover:bg-slate-800 px-3.5 py-1.5 cursor-pointer text-slate-300 hover:text-white transition-all mb-4 text-xs font-semibold'>
                            <FiArrowLeft size={14} />
                            <span>Back</span>
                        </div>
                        <h2 className='text-2xl sm:text-3xl font-black text-white leading-tight'>
                            Welcome back,<br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>
                        </h2>

                        <p className='mt-3 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium'>
                            Practice realistic AI interviews, receive instant feedback, and sharpen your skills before your next real interview.
                        </p>
                    </div>

                    <div className='space-y-3'>
                        {[
                            "Personalized AI Questions",
                            "Resume Based Tailoring",
                            "Detailed Performance Analytics",
                            "Monaco Code Editor Round",
                        ].map((item, index) => (
                            <motion.div key={index} whileHover={{ x: 4 }} className='flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3'>
                                <div className='w-7 h-7 shrink-0 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md'><FiCheck className='text-white' size={14} /></div>
                                <span className='text-xs sm:text-sm text-slate-200 font-bold'>{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* right */}
                <div className='p-5 sm:p-7 flex flex-col'>
                    <div>
                        <h2 className='text-lg sm:text-xl font-semibold text-white'>
                            Start Interview
                        </h2>
                        <p className='mt-1 text-xs text-zinc-500'>
                            Configure your interview preferences.
                        </p>
                    </div>

                    <div className='mt-5 flex-1 space-y-4 overflow-y-auto'>

                        {/* role */}
                        <div>
                            <label className='text-xs font-medium text-zinc-400'>Target Role</label>
                            <div className='mt-1.5 relative'>
                                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                <input type="text"
                                    onChange={(e) => setRole(e.target.value)}
                                    value={role}
                                    placeholder='Backend Developer'
                                    className='w-full h-11 rounded-xl bg-[#17181E] border border-white/10 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30 transition' />
                            </div>
                        </div>

                        {/* type */}

                        <div>
                            <label className='text-xs font-medium text-zinc-400'>Interview Type</label>
                            <div className='mt-1.5 flex rounded-xl bg-[#17181E] p-1 border border-white/10'>
                                {
                                    ["technical", "hr"].map((item) => (
                                        <button key={item}
                                            onClick={() => setType(item)}
                                            className={`flex-1 h-9 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${type === item ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                                                }`} >
                                            {item}
                                        </button>
                                    ))
                                }

                            </div>
                        </div>

                        {/* resume toggle */}

                        <div className='rounded-xl border border-white/10 bg-[#17181E] p-4'>
                            <div className='flex items-center justify-between '>
                                <div>
                                    <h2 className='text-sm font-medium text-white'>Use Resume</h2>
                                    <p className='mt-0.5 text-xs text-zinc-500'>
                                        AI will personalize questions using your resume.
                                    </p>
                                </div>
                                <button onClick={() => setUseResume(!useResume)} className={`relative shrink-0 w-12 h-7 rounded-full transition ${useResume ? "bg-white" : "bg-zinc-700"}`}>
                                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-black transition-all ${useResume ? "left-5.5" : "left-0.5"}`} />
                                </button>


                            </div>

                        </div>




                        {
                            useResume && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='rounded-xl border-2 border-dashed border-white/10 bg-[#17181E] p-4'>

                                    <label className='cursor-pointer flex flex-col items-center'>
                                        <div className='w-11 h-11 rounded-xl bg-white flex items-center justify-center'><FiUploadCloud size={20} className='text-black' /></div>
                                        <h3 className='mt-3 text-sm font-semibold text-white'>Upload Resume</h3>
                                        <p className='mt-1 text-xs text-zinc-500 text-center'>
                                            {resume
                                                ? "Resume detected. Upload a new resume anytime to update your interview questions."
                                                : "Upload your resume to generate personalized interview questions."
                                            }
                                        </p>
                                        <input type="file" className='hidden' accept='.pdf'
                                            onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]) }} />

                                    </label>

                                    {file && (
                                        <div className='mt-4'>
                                            <div className='rounded-lg bg-black/20 border border-white/10 p-2.5'>
                                                <p className='text-xs text-zinc-300 truncate'>{file.name}</p>
                                            </div>

                                            <button
                                                onClick={uploadResume}
                                                disabled={uploading}
                                                className='mt-3 w-full h-10 rounded-xl bg-white text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-60'>
                                                {uploading ? "Uploading..." : "Upload"}
                                            </button>



                                        </div>
                                    )}

                                </motion.div>
                            )
                        }
                    </div>

                    <motion.button
                    onClick={start}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!role || starting || (useResume && !resume)}
                        className='mt-5 h-12 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'>
                        {starting ? "Starting Interview..." : (
                            <>Start Interview <FiArrowRight size={15} /></>
                        )}

                    </motion.button>

                </div>


            </motion.div>


        </div>
    )
}

export default Step1setup
