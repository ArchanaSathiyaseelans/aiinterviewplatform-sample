import { useState, useEffect } from 'react'
import { getAllInterviews, getInterview, startInterview, submitAnswer } from '../apis/interview.api'

export function useInterviewStats() {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  })
  const [technicalData, setTechnicalData] = useState([])
  const [hrData, setHrData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getAllInterviews()
        if (response?.stats) {
          setStats(response.stats)
          setTechnicalData(response.technicalData || [])
          setHrData(response.hrData || [])
        }
      } catch (err) {
        console.error('Error fetching interview stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return { stats, technicalData, hrData, loading }
}

export function useInterviewSession(interviewId) {
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!interviewId) return
    async function fetchSession() {
      try {
        const response = await getInterview(interviewId)
        if (response?.interview) {
          setInterview(response.interview)
        }
      } catch (err) {
        console.error('Error fetching interview session:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [interviewId])

  const sendAnswer = async (answer, code) => {
    if (!interviewId) return null
    setSubmitting(true)
    try {
      const response = await submitAnswer({ interviewId, answer, code })
      return response
    } catch (err) {
      console.error('Error submitting answer:', err)
      return null
    } finally {
      setSubmitting(false)
    }
  }

  return { interview, loading, submitting, sendAnswer }
}
