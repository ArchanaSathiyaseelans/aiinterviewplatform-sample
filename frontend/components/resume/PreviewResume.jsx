import React, { useEffect, useRef, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import DownloadBtn from './DownloadBtn'
import ATSTemplate from './ATSTemplate'

function PreviewResume({ data, onBack, user, setUser }) {
    const resumeRef = useRef(null)
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const updateScale = () => {
            if (window.innerWidth < 640) {
                setScale(0.42);
            } else if (window.innerWidth < 768) {
                setScale(0.58);
            } else if (window.innerWidth < 1024) {
                setScale(0.72);
            } else {
                setScale(0.9);
            }
        };

        updateScale();

        window.addEventListener("resize", updateScale);

        return () =>
            window.removeEventListener("resize", updateScale);

    }, [])

    return (
        <div className='min-h-screen bg-slate-900 text-slate-100'>
            {/* header */}
            <div className='sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl no-print'>
                <div className='mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
                    <div>
                        <h2 className='text-base font-bold sm:text-lg text-white'>Resume Preview</h2>
                        <p className='mt-0.5 text-xs text-slate-400'>
                            ATS Template Standard · A4 Printable Format
                        </p>
                    </div>

                    <div className='flex items-center justify-between lg:justify-end gap-2.5'>
                        <button onClick={onBack} className='flex h-9 items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white cursor-pointer'>
                            <FiArrowLeft size={15} />
                            <span className='hidden sm:block'>Back to Edit</span>
                        </button>
                        <DownloadBtn docRef={resumeRef} user={user} setUser={setUser} fileName={data?.name || "Resume"} />
                    </div>
                </div>
            </div>

            {/* Template */}
            <div className='overflow-auto bg-slate-950 px-3 py-4 sm:px-6 sm:py-8'>
                <div className='mx-auto flex justify-center'>
                    <div 
                        className='preview-scale-wrapper'
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top center"
                        }}
                    >
                        <div ref={resumeRef} className='rounded-md bg-white shadow-[0_0_50px_rgba(0,0,0,.6)]'>
                            <ATSTemplate data={data}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewResume
