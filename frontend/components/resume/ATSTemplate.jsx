import React from 'react'

function ATSTemplate({ data }) {
    const {
        name,
        email,
        phone,
        location,
        linkedin,
        github,
        summary,
        skills,
        experience,
        projects,
        education,
    } = data;

    const skillsList = skills ? skills.split(",")
        .map((s) => s.trim())
        .filter(Boolean) : []

    const halfList = Math.ceil(skillsList.length / 2)

    const skillsCol1 = skillsList.slice(0, halfList)
    const skillsCol2 = skillsList.slice(halfList)


    const renderDes = (text) => {
        if (!text) return null;

        const lines = text.split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
        return (
            <ul className='mt-1 ml-4 list-disc p-0'>
                {lines.map((line, i) => (
                    <li key={i} className='mb-[1px] text-[11px] leading-[1.6]' style={{ color: '#000000' }}>
                        {line.replace(/^[-•]\s*/, "")}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div 
            id="ats-resume-template"
            className='box-border w-[210mm] min-h-[297mm] px-[18mm] py-[15mm]'
            style={{
                fontFamily: "'Times New Roman', Times, serif",
                backgroundColor: '#ffffff',
                color: '#000000'
            }}>
            {/* header */}
            <div className='mb-[10px] pb-[10px] text-center' style={{ borderBottom: '2px solid #000000' }}>
                <h2 className='m-0 mb-[7px] text-[28px] font-bold uppercase tracking-[0.08em]' style={{ color: '#000000' }}>{name || "YOUR NAME"}</h2>

                <div className='flex flex-wrap justify-center text-[10.5px]' style={{ color: '#000000' }}>
                    {[
                        email,
                        phone,
                        location,
                        linkedin ? `linkedin.com/in/${linkedin}` : null,
                        github ? `github.com/${github}` : null,
                    ].filter(Boolean).map((v, i, arr) => (
                        <span key={i} className='whitespace-nowrap'>
                            {v}
                            {i < arr.length - 1 && (
                                <span className="mx-[7px]" style={{ color: '#000000' }}>|</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {summary &&
                <section className='mb-[13px]'>
                    <h2 className='mt-0 mb-[9px] pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]' style={{ color: '#000000', borderBottom: '1.5px solid #000000' }}>
                        Professional Summary
                    </h2>
                    <p className='m-0 text-[11px] leading-[1.65]' style={{ color: '#000000' }}>{summary}</p>
                </section>}

            {skillsList.length > 0 &&
                <section className='mb-[13px]'>
                    <h2 className='mt-0 mb-[9px] pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]' style={{ color: '#000000', borderBottom: '1.5px solid #000000' }}>
                        Technical Skills
                    </h2>

                    <div className='grid grid-cols-2 gap-y-[2px] gap-x-[20px]'>
                        <ul className='m-0 list-disc pl-4'>
                            {skillsCol1.map((skill, i) => (
                                <li key={i} className='text-[11px] leading-[1.7] capitalize' style={{ color: '#000000' }}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                        <ul className='m-0 list-disc pl-4'>
                            {skillsCol2.map((skill, i) => (
                                <li key={i} className='text-[11px] leading-[1.7] capitalize' style={{ color: '#000000' }}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>}

            {experience.length > 0 &&
                <section className='mb-[13px]'>
                    <h2 className='mt-0 mb-[9px] pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]' style={{ color: '#000000', borderBottom: '1.5px solid #000000' }}>
                        Work Experience
                    </h2>

                    {experience.map((exp, i) => (
                        <div key={i} className='mb-[11px] break-inside-avoid print:break-inside-avoid'>
                            <div className='flex items-baseline justify-between'>
                                <span className='text-[12px] font-bold' style={{ color: '#000000' }}>{exp.role}</span>
                                <span className='ml-2 whitespace-nowrap text-[10.5px]' style={{ color: '#000000' }}>{exp.duration}</span>
                            </div>

                            <div className='mb-[2px] text-[11px] italic' style={{ color: '#000000' }}>{exp.company}</div>

                            {renderDes(exp.description)}
                        </div>
                    ))}
                </section>}

            {projects.length > 0 &&
                <section className='mb-[13px]'>
                    <h2 className='mt-0 mb-[9px] pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]' style={{ color: '#000000', borderBottom: '1.5px solid #000000' }}>
                        Projects
                    </h2>

                    {projects.map((proj, i) => (
                        <div key={i} className='mb-[11px] break-inside-avoid print:break-inside-avoid'>
                            <div className='flex items-baseline justify-between'>
                                <span className='text-[12px] font-bold' style={{ color: '#000000' }}>{proj.name}</span>
                                {proj.github && <span className='ml-2 whitespace-nowrap text-[10.5px]' style={{ color: '#000000' }}>{proj.github}</span>}
                            </div>

                            {proj.techStack && <div className='mb-[2px] text-[11px] italic' style={{ color: '#000000' }}>
                                <span className="font-bold">Tech Stack: </span>
                                {proj.techStack}
                            </div>}

                            {renderDes(proj.description)}
                        </div>
                    ))}
                </section>}

            {education.length > 0 &&
                <section className='mb-[13px]'>
                    <h2 className='mt-0 mb-[9px] pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]' style={{ color: '#000000', borderBottom: '1.5px solid #000000' }}>
                        Education
                    </h2>

                    {education.map((edu, i) => (
                        <div key={i} className='mb-[11px] break-inside-avoid print:break-inside-avoid'>
                            <div className='flex items-baseline justify-between'>
                                <span className='text-[12px] font-bold' style={{ color: '#000000' }}>
                                    {edu.degree}{edu.branch ? ` in ${edu.branch}` : ""}
                                </span>
                                <span className='ml-2 whitespace-nowrap text-[10.5px]' style={{ color: '#000000' }}>{edu.year}</span>
                            </div>

                            <div className='mb-[2px] text-[11px] italic' style={{ color: '#000000' }}>
                                {edu.college}
                                {edu.cgpa && (
                                    <span className="ml-[6px]">
                                        | CGPA: <strong>{edu.cgpa}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </section>}
        </div>
    )
}

export default ATSTemplate
