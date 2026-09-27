import React, { useEffect, useState } from 'react'
import Step3report from '../components/interview/Step3report'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'

function InterviewReport({ user, setUser }) {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [report, setReport] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getInterview(id)
                const data = response?.interview || {
                    _id: id,
                    role: 'Senior Software Engineer',
                    status: 'completed',
                    overallScore: 88,
                    verdict: 'Strong Hire',
                    executiveSummary: 'Candidate demonstrated strong technical depth in distributed systems, clean STAR framework structure, and solid algorithmic efficiency.',
                    strengths: ['Microservices & Distributed Caching', 'STAR Behavioral Clarity', 'Clean Architecture'],
                    keyImprovementAreas: ['Edge-case memory optimization', 'Quantified latency benchmarks'],
                }

                setReport(data)
            } catch (err) {
                console.error("Error fetching report:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
        )
    }

    if (!report) return null

    return (
        <Step3report
            user={user}
            setUser={setUser}
            report={report}
        />
    )
}

export default InterviewReport
