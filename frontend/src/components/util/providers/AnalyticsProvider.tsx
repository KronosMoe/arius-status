import { useCookiePreferences } from '@/hooks/useCookiePreferences'
import type React from 'react'
import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { canUseAnalytics, isLoaded } = useCookiePreferences()
  const location = useLocation()

  useEffect(() => {
    if (isLoaded && canUseAnalytics) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [canUseAnalytics, isLoaded, location])

  useEffect(() => {
    if (isLoaded && canUseAnalytics) {
      ReactGA.initialize(GA_MEASUREMENT_ID)
    }
  }, [canUseAnalytics, isLoaded])

  return <>{children}</>
}
