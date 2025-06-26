import { useCookiePreferences } from '@/hooks/useCookiePreferences'
import type React from 'react'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { canUseAnalytics, isLoaded } = useCookiePreferences()
  const location = useLocation()

  const [isGAInitialized, setIsGAInitialized] = useState(false)

  useEffect(() => {
    if (isLoaded && canUseAnalytics && !isGAInitialized) {
      ReactGA.initialize(GA_MEASUREMENT_ID)
      setIsGAInitialized(true)
    }
  }, [canUseAnalytics, isLoaded, isGAInitialized])

  useEffect(() => {
    if (isGAInitialized) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location, isGAInitialized])

  return <>{children}</>
}
