import { AuthContext } from '@/context/auth-context'
import { LOGOUT_MUTATION, ME_QUERY } from '@/gql/auth'
import { AuthUser } from '@/types/auth'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../Loading'

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

  const logout = useCallback(async () => {
    await logoutMutation()
    setUser(null)
  }, [logoutMutation])

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
