import { AuthContext } from '@/context/auth-context'
import { LOGOUT_MUTATION, ME_QUERY } from '@/gql/auth'
import { AuthUser } from '@/types/auth'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../Loading'
import { useNavigate } from 'react-router-dom'
import { BASE_PATH } from '@/constants/routes'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchMe] = useLazyQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (data?.me) setUser(data.me)
      setLoading(false)
    },
    onError: (error) => {
      toast.error(error.message)
      logout()
      setLoading(false)
    },
  })
  const [logoutMutation, { error: logoutError }] = useMutation(LOGOUT_MUTATION)

  const navigate = useNavigate()

  const logout = useCallback(async () => {
    await logoutMutation()
    setUser(null)
    navigate(BASE_PATH, { replace: true })
  }, [logoutMutation, navigate])

  useEffect(() => {
    if (logoutError) {
      toast.error(logoutError.message)
    }
  }, [logoutError])

  useEffect(() => {
    if (!user) {
      setLoading(true)
      fetchMe()
    }
  }, [fetchMe, user])

  if (loading && !user) return <Loading />

  return (
    <AuthContext.Provider value={{ loading, user, isAuthenticated: !!user, logout }}>{children}</AuthContext.Provider>
  )
}
