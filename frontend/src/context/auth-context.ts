import { Auth } from '@/types/auth'
import { createContext } from 'react'

export interface AuthContextType {
  auth: Auth | null
  loading: boolean
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
  auth: {
    username: null,
    image: null,
    settings: {
      theme: 'light',
      timezone: 'Asia/Bangkok',
    },
  },
  loading: true,
  logout: () => {},
  isAuthenticated: false,
})
