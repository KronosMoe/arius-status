import { AuthContext } from '@/context/auth-context'
import { LOGOUT_MUTATION, ME_QUERY } from '@/gql/auth'
import { Auth } from '@/types/auth'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../Loading'
import { useNavigate } from 'react-router-dom'
import { BASE_PATH } from '@/constants/routes'
import { ApolloError } from '@apollo/client'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasFetchedMe, setHasFetchedMe] = useState(false)

  const [fetchMe] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me) {
        setAuth(data.me)
      } else {
        setAuth(null)
      }
      setLoading(false)
    },
    onError: (err: ApolloError) => {
      toast.error(`Session error: ${err.message}`)
      setAuth(null)
      setLoading(false)
    },
  })

  const [logoutMutation] = useMutation(LOGOUT_MUTATION)
  const navigate = useNavigate()

  const logout = useCallback(async () => {
    try {
      await logoutMutation()
    } catch (err) {
      if (err instanceof ApolloError) {
        toast.error(err.message || 'Logout failed')
      } else {
        toast.error('Unexpected logout error')
      }
    } finally {
      setAuth(null)
      setHasFetchedMe(false)
      navigate(BASE_PATH, { replace: true })
    }
  }, [logoutMutation, navigate])

  useEffect(() => {
    if (!auth && !hasFetchedMe) {
      setLoading(true)
      setHasFetchedMe(true)
      fetchMe()
    }
  }, [auth, fetchMe, hasFetchedMe])

  if (loading) return <Loading />

  return (
    <AuthContext.Provider value={{ loading, auth, isAuthenticated: !!auth, logout }}>{children}</AuthContext.Provider>
  )
}
