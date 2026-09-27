import { useState, useEffect } from 'react'
import { getCurrentUser } from '../apis/user.api'
import api from '../utils/axios'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser()
        setUser(data?.user || null)
      } catch (err) {
        console.error('Error fetching current user:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const logout = async () => {
    try {
      const response = await api.get('/api/auth/logout')
      if (response.data.success) {
        setUser(null)
        return true
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
    return false
  }

  return { user, setUser, loading, logout }
}
