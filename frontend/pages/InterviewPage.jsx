import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'
import Step2interview from '../components/interview/Step2interview'

function InterviewPage({ user, setUser }) {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [interview, setInterview] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await getInterview(id)
                const data = response?.interview || {
                    _id: id,
                    role: 'Senior Software Engineer',
                    type: 'technical',
                    status: 'active',
                    currentQuestionIndex: 0,
                    currentQuestion: 0,
                    questions: [
                        {
                            _id: 'q1',
                            question: 'Can you walk us through how you would architect a high-throughput rate-limiting service in Node.js and Redis?',
                            codeSnippet: '// Write your rate limiter function here\nfunction isAllowed(userId) {\n  // TODO: implement sliding window rate limiter\n}',
                            timer: 120
                        },
                        {
                            _id: 'q2',
                            question: 'How do you handle cache invalidation and race conditions in a distributed system with multiple microservices?',
                            timer: 120
                        }
                    ]
                }

                if (data?.status === "completed") {
                    navigate(`/interview/${id}/report`, { replace: true })
                    return
                }

                setInterview(data)
            } catch (err) {
                console.error("Error fetching interview:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchInterview()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
        )
    }

    if (!interview) return null

    const questionsList = Array.isArray(interview.questions) && interview.questions.length > 0
        ? interview.questions
        : [
            {
                _id: 'q1',
                question: 'Can you introduce yourself and walk us through your software engineering background?',
                timer: 120
            }
        ]

    const currIdx = typeof interview.currentQuestionIndex === 'number'
        ? interview.currentQuestionIndex
        : typeof interview.currentQuestion === 'number'
            ? interview.currentQuestion
            : 0

    const currentQ = questionsList[currIdx] || questionsList[0] || {
        _id: 'q1',
        question: 'Can you introduce yourself and walk us through your software engineering background?',
        timer: 120
    }

    return (
        <Step2interview
            interviewData={{
                interviewId: interview._id || id,
                currentQuestion: currIdx,
                totalQuestions: questionsList.length,
                question: currentQ,
            }}
            user={user}
            setUser={setUser}
        />
    )
}

export default InterviewPage
