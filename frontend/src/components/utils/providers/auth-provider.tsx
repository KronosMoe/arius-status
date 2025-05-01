import { AuthContext } from '@/context/auth-context'
import { LOGOUT_MUTATION, ME_QUERY } from '@/gql/auth'
import { Auth } from '@/types/auth'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../Loading'
import { useNavigate } from 'react-router-dom'
import { BASE_PATH } from '@/constants/routes'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchMe] = useLazyQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (data?.me) setAuth(data.me)
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
    setAuth(null)
    navigate(BASE_PATH, { replace: true })
    navigate(0)
  }, [logoutMutation, navigate])

  useEffect(() => {
    if (logoutError) {
      toast.error(logoutError.message)
    }
  }, [logoutError])

  useEffect(() => {
    if (!auth) {
      setLoading(true)
      fetchMe()
    }
  }, [fetchMe, auth])

  if (loading && !auth) return <Loading />

  return (
    <AuthContext.Provider value={{ loading, auth, isAuthenticated: !!auth, logout }}>{children}</AuthContext.Provider>
  )
}
