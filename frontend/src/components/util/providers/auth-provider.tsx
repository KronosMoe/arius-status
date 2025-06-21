import { useLazyQuery, useMutation, ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { AuthContext } from '@/context/auth-context'
import { LOGOUT_MUTATION, ME_QUERY } from '@/gql/auth'
import { SupportedLanguages, TSupportedLanguages } from '@/lib/i18n.ts'
import { Auth } from '@/types/auth'
import Loading from '../Loading'
import { BASE_PATH } from '@/constants/routes'

const LANGUAGE_KEY = 'language'
const THEME_KEY = 'theme'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasFetchedMe, setHasFetchedMe] = useState(false)
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const isValidTheme = (theme: string): theme is 'light' | 'dark' => theme === 'light' || theme === 'dark'

  const applyTheme = (theme: string) => {
    const safeTheme: 'light' | 'dark' = isValidTheme(theme) ? theme : 'light'
    document.documentElement.classList.toggle('dark', safeTheme === 'dark')
    localStorage.setItem(THEME_KEY, safeTheme)
  }

  const applyLanguage = (lang: string) => {
    const fallbackLang: TSupportedLanguages = SupportedLanguages.includes(lang as TSupportedLanguages)
      ? (lang as TSupportedLanguages)
      : 'en'
    i18n.changeLanguage(fallbackLang)
    localStorage.setItem(LANGUAGE_KEY, fallbackLang)
  }

  const setFallbackLanguageAndTheme = () => {
    const storedLang = localStorage.getItem(LANGUAGE_KEY)
    applyLanguage(storedLang ?? 'en')

    const storedTheme = localStorage.getItem(THEME_KEY)
    applyTheme(storedTheme ?? 'light')
  }

  const [fetchMe] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me) {
        setAuth(data.me)

        const userLang = data.me.settings?.language
        const userTheme = data.me.settings?.theme

        applyLanguage(userLang)
        applyTheme(userTheme)
      } else {
        setAuth(null)
        setFallbackLanguageAndTheme()
      }

      setLoading(false)
    },
    onError: (err: ApolloError) => {
      toast.error(`Session error: ${err.message}`)
      setAuth(null)
      setFallbackLanguageAndTheme()
      setLoading(false)
    },
  })

  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

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
      setFallbackLanguageAndTheme()
      navigate(BASE_PATH, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutMutation, navigate])

  useEffect(() => {
    if (!auth && !hasFetchedMe) {
      setLoading(true)
      setHasFetchedMe(true)
      fetchMe()
    }
  }, [auth, hasFetchedMe, fetchMe])

  if (loading) return <Loading />

  return (
    <AuthContext.Provider value={{ loading, auth, isAuthenticated: !!auth, logout }}>{children}</AuthContext.Provider>
  )
}
