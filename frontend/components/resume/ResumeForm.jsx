import React from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

function Input({label, value, onChange, placeholder, type = "text"}){
    return(
        <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-semibold text-purple-300 uppercase tracking-wider'>
                {label}
            </label>
            <input 
                type={type}
                placeholder={placeholder}
                onChange={(e)=>onChange(e.target.value)}
                value={value || ""}
                className='bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-500 shadow-inner'
            />
        </div>
    )
}

function TextArea({label, value, onChange, placeholder, rows = 3}){
    return(
        <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-semibold text-purple-300 uppercase tracking-wider'>
                {label}
            </label>
            <textarea 
                placeholder={placeholder}
                onChange={(e)=>onChange(e.target.value)}
                value={value || ""}
                rows={rows}
                className='bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-500 resize-none shadow-inner'
            />
        </div>
    )
}

function EntryCard({ children, onRemove, title }){
    return(
        <div className='relative overflow-hidden bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 shadow-lg mb-3'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3'>
                <span className='text-xs font-bold text-purple-300 tracking-wide uppercase'>{title || "Entry Details"}</span>
                <button 
                    type="button"
                    onClick={onRemove}
                    className='text-slate-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10 cursor-pointer flex items-center gap-1 text-xs'>
                    <FiTrash2 size={14}/>
                    <span>Remove</span>
                </button>
            </div>
            <div className='flex flex-col gap-3'>{children}</div>
        </div>
    )
}

function ResumeForm({step , data , setData}) {
  if(step === 1){
    return(
        <div className='flex flex-col gap-4 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
            <Input label="Full Name" placeholder="Rahul Sharma" onChange={(v)=>setData({...data , name:v})} value={data.name}/>
            <Input label="Email" placeholder="rahul@email.com" onChange={(v) => setData({ ...data, email: v })} value={data.email}/>
            <Input label="Phone" placeholder="+91 9876543210" onChange={(v) => setData({ ...data, phone: v })} value={data.phone} />
            <Input label="Location" placeholder="New York, NY / Remote" onChange={(v) => setData({ ...data, location: v })} value={data.location} />
            <Input label="LinkedIn URL" placeholder="linkedin.com/in/rahul" onChange={(v) => setData({ ...data, linkedin: v })} value={data.linkedin} />
            <Input label="GitHub URL" placeholder="github.com/rahul" value={data.github} onChange={(v) => setData({ ...data, github: v })}/>
        </div>
    )
  }

  if(step === 2){
    return(
        <div className='flex flex-col gap-3 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
            <TextArea 
                label="Professional Summary"
                placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
                rows={5}
                onChange={(v)=>setData({...data,summary:v})}
                value={data.summary}
            />
            <p className='text-xs text-slate-400'>
                A concise summary highlighting your key achievements, tech stack, and goals.
            </p>
        </div>
    )
   }

   if(step === 3){
    return(
        <div className='flex flex-col gap-3 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
            <TextArea 
                label="Skills (comma separated)"
                placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git"
                rows={4}
                onChange={(v)=>setData({...data,skills:v})}
                value={data.skills}
            />
            <p className='text-xs text-slate-400'>
                Separate each skill with a comma (e.g. React, Node.js, Python, PostgreSQL).
            </p>
        </div>
    )
   }

   if(step === 4){
    const expList = Array.isArray(data.experience) ? data.experience : [];

    const addExp = ()=>{
        setData({
            ...data,
            experience: [...expList, { company: "", role: "", duration: "", description: "" }]
        })
    }

    const removeExp = (index)=>{
        setData({
            ...data,
            experience: expList.filter((_,i)=> i!== index)
        })
    }

    const updateExp = (index, field, value)=>{
        const updated = expList.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        setData({ ...data, experience: updated });
    }

    return(
        <div className='flex flex-col gap-4 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
           {expList.length === 0 && (
               <div className='text-center py-6 border border-dashed border-slate-700 rounded-xl bg-slate-900/30'>
                   <p className='text-xs text-slate-300 mb-3'>No work experience entries added yet.</p>
                   <button 
                       type="button"
                       onClick={addExp} 
                       className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md'>
                       <FiPlus size={15} /> Add Work Experience
                   </button>
               </div>
           )}

           {expList.map((exp, index)=>(
            <EntryCard key={index} title={`Experience #${index + 1}`} onRemove={()=>removeExp(index)}>
                <Input label="Company Name" placeholder="ABC Technologies / Google" onChange={(v)=>updateExp(index,"company",v)} value={exp.company} />
                <Input label="Job Title / Role" placeholder="Senior Backend Engineer" onChange={(v)=>updateExp(index,"role",v)} value={exp.role}/>
                <Input label="Duration / Dates" placeholder="Jan 2023 – Present" onChange={(v)=>updateExp(index,"duration",v)} value={exp.duration}/>
                <TextArea label="Key Responsibilities & Achievements" placeholder={"• Built microservices handling 10k req/sec\n• Reduced database latency by 35% using Redis caching"} onChange={(v)=>updateExp(index,"description",v)} value={exp.description} rows={4}/>
            </EntryCard>
           ))}

           {expList.length > 0 && (
               <button 
                   type="button"
                   onClick={addExp} 
                   className='flex items-center justify-center gap-2 w-full py-3 border border-dashed border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all cursor-pointer'>
                   <FiPlus size={15} /> Add More Work Experience
               </button>
           )}
        </div>
    )
   }

   if(step === 5){
    const proList = Array.isArray(data.projects) ? data.projects : [];

    const addPro = ()=>{
        setData({
            ...data,
            projects: [...proList, { name: "", techStack: "", github: "", description: "" }]
        })
    }

    const removePro = (index)=>{
        setData({
            ...data,
            projects: proList.filter((_,i)=> i!== index)
        })
    }

    const updatePro = (index, field, value)=>{
        const updated = proList.map((pro, i) =>
            i === index ? { ...pro, [field]: value } : pro
        );
        setData({ ...data, projects: updated });
    }

    return(
        <div className='flex flex-col gap-4 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
           {proList.length === 0 && (
               <div className='text-center py-6 border border-dashed border-slate-700 rounded-xl bg-slate-900/30'>
                   <p className='text-xs text-slate-300 mb-3'>No projects added yet.</p>
                   <button 
                       type="button"
                       onClick={addPro} 
                       className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md'>
                       <FiPlus size={15} /> Add Project
                   </button>
               </div>
           )}

           {proList.map((pro, index)=>(
            <EntryCard key={index} title={`Project #${index + 1}`} onRemove={()=>removePro(index)}>
                <Input label="Project Name" placeholder="InterviewIQ Platform" onChange={(v)=>updatePro(index,"name",v)} value={pro.name} />
                <Input label="Tech Stack" value={pro.techStack} onChange={(v) => updatePro(index, "techStack", v)} placeholder="React, Node.js, Express, PostgreSQL, Redis" />
                <Input label="GitHub / Live Demo Link" value={pro.github} onChange={(v) => updatePro(index, "github", v)} placeholder="github.com/rahul/interviewiq" />
                <TextArea label="Project Description & Features" value={pro.description} onChange={(v) => updatePro(index, "description", v)} placeholder="AI-powered interview simulator built with React, WebSocket real-time voice synthesis, and ATS evaluation engine." rows={4} />
            </EntryCard>
           ))}

           {proList.length > 0 && (
               <button 
                   type="button"
                   onClick={addPro} 
                   className='flex items-center justify-center gap-2 w-full py-3 border border-dashed border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all cursor-pointer'>
                   <FiPlus size={15} /> Add More Projects
               </button>
           )}
        </div>
    )
   }

   if(step === 6){
    const eduList = Array.isArray(data.education) ? data.education : [];

    const addEdu = ()=>{
        setData({
            ...data,
            education: [...eduList, { college: "", degree: "", branch: "", cgpa: "", year: "" }]
        })
    }

    const removeEdu = (index)=>{
        setData({
            ...data,
            education: eduList.filter((_,i)=> i!== index)
        })
    }

    const updateEdu = (index, field, value)=>{
        const updated = eduList.map((edu, i) =>
            i === index ? { ...edu, [field]: value } : edu
        );
        setData({ ...data, education: updated });
    }

    return(
        <div className='flex flex-col gap-4 bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/10'>
           {eduList.length === 0 && (
               <div className='text-center py-6 border border-dashed border-slate-700 rounded-xl bg-slate-900/30'>
                   <p className='text-xs text-slate-300 mb-3'>No education entries added yet.</p>
                   <button 
                       type="button"
                       onClick={addEdu} 
                       className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md'>
                       <FiPlus size={15} /> Add Education
                   </button>
               </div>
           )}

           {eduList.map((edu, index)=>(
            <EntryCard key={index} title={`Education #${index + 1}`} onRemove={()=>removeEdu(index)}>
                <Input label="College / University" value={edu.college} onChange={(v) => updateEdu(index, "college", v)} placeholder="Massachusetts Institute of Technology / SR Group" />
                <Input label="Degree" value={edu.degree} onChange={(v) => updateEdu(index, "degree", v)} placeholder="B.Tech / B.S." />
                <Input label="Branch / Major" value={edu.branch} onChange={(v) => updateEdu(index, "branch", v)} placeholder="Computer Science & Engineering" />
                <Input label="CGPA / Grade" value={edu.cgpa} onChange={(v) => updateEdu(index, "cgpa", v)} placeholder="3.8 / 4.0 or 8.5 CGPA" />
                <Input label="Graduation Year / Dates" value={edu.year} onChange={(v) => updateEdu(index, "year", v)} placeholder="2021 – 2025" />
            </EntryCard>
           ))}

           {eduList.length > 0 && (
               <button 
                   type="button"
                   onClick={addEdu} 
                   className='flex items-center justify-center gap-2 w-full py-3 border border-dashed border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all cursor-pointer'>
                   <FiPlus size={15} /> Add More Education
               </button>
           )}
        </div>
    )
   }
}

export default ResumeForm
