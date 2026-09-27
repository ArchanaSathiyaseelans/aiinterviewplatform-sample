import React, { useState } from 'react'
import ResumeForm from '../components/resume/ResumeForm'
import initialData from '../components/resume/initialData'
import { motion } from "motion/react"
import { FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PreviewResume from '../components/resume/PreviewResume';
import Navbar from '../components/Navbar';
const STEPS = [
  { step: 1, title: "Personal Information", subtitle: "Your basic contact details" },
  { step: 2, title: "Professional Summary", subtitle: "A quick intro about yourself" },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  { step: 4, title: "Work Experience", subtitle: "Your past jobs & internships" },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

function ResumeBuilder({user , setUser}) {
    const [currentStep,setCurrentStep] = useState(1)
    const [data,setData]= useState(initialData)
    const [showPreview,setShowPreview] = useState(false)
    const navigate = useNavigate()
    const progressPct = ((currentStep)/(TOTAL_STEPS))* 100
    const activeStep = STEPS.find((s)=>s.step === currentStep);
    const goPrev = ()=>{
      if(currentStep > 1){
        setCurrentStep(currentStep -1)
      }
    }

     const goNext = ()=>{
      if(currentStep < TOTAL_STEPS){
        setCurrentStep(currentStep + 1)
      }
    }


    const isLastStep = currentStep === STEPS.length

    if(showPreview){
      return <PreviewResume data={data} user={user} setUser={setUser} onBack={()=>setShowPreview(false)}/>
    }
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
      <Navbar label="Resume Builder" user={user} />

      {/* Main container */}
      <div className='flex-1 px-3 py-4 sm:px-6 sm:py-8'>
        <div className='mx-auto w-full max-w-3xl'>
          
          {/* Top Header & Back to Dashboard */}
          <div className='flex items-center justify-between mb-4'>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm'>
              <FiArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </button>

            <span className='text-xs font-mono text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full'>
              Step {currentStep} of {TOTAL_STEPS} ({Math.round(progressPct)}%)
            </span>
          </div>

          {/* Step Progress Bar */}
          <div className='w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6'>
            <div className='h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-300' style={{width: `${progressPct}%`}} />
          </div>

          {/* Interactive Step Pills */}
          <div className='grid grid-cols-2 sm:grid-cols-6 gap-1.5 mb-6'>
            {STEPS.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-col items-center p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  s.step === currentStep
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : s.step < currentStep
                      ? 'bg-slate-900 text-purple-300 border-purple-500/30 hover:border-purple-500/60'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}>
                <span className='truncate w-full text-center'>{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Current Step Title */}
          <div className='mb-6 bg-slate-900/60 border border-white/10 p-4 rounded-2xl'>
            <h2 className='text-xl sm:text-2xl font-bold text-white'>{activeStep.title}</h2>
            <p className='mt-1 text-xs sm:text-sm text-slate-400'>{activeStep.subtitle}</p>
          </div>

          {/* Resume Form Inputs */}
          <ResumeForm step={currentStep} data={data} setData={setData}/>

          {/* Navigation controls */}
          <div className='flex items-center justify-between mt-8 pt-4 border-t border-slate-800 gap-3'>
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer
                ${currentStep === 1
                  ? "border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed"
                  : "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600"
                }`}>
              <FiArrowLeft size={16}/>
              <span>Previous</span>
            </button>

            <div className='flex items-center gap-2'>
              {STEPS.map((s)=>(
                <button 
                  key={s.step}
                  type="button"
                  onClick={()=>setCurrentStep(s.step)}
                  className={`rounded-full transition-all cursor-pointer ${s.step === currentStep
                    ? "w-6 h-2 bg-purple-500"
                    : s.step < currentStep
                      ? "w-2 h-2 bg-purple-400/60"
                      : "w-2 h-2 bg-slate-700"
                  }`}/>
              ))}
            </div>

            {isLastStep ? (
              <button 
                type="button"
                onClick={()=>setShowPreview(true)} 
                className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/30'>
                <FiEye size={16}/>
                <span>Preview Resume</span>
              </button>
            ):(
              <button 
                type="button"
                onClick={goNext} 
                className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/30'>
                <span>Next Step</span>
                <FiArrowRight size={16}/>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
