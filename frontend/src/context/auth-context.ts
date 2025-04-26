import { AuthUser } from '@/types/auth'
import { createContext } from 'react'

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  isAuthenticated: false,
})
