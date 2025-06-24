import { useState, useEffect } from 'react'
import { COOKIE_CONSENT_KEY, type CookiePreferences, DEFAULT_COOKIE_PREFERENCES } from '@/constants/localStorage'

export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences
        setPreferences(parsed)
      } catch {
        setPreferences(DEFAULT_COOKIE_PREFERENCES)
      }
    }
    setIsLoaded(true)
  }, [])

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updated = {
      ...preferences,
      ...newPreferences,
      necessary: true,
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated))
    setPreferences(updated)
  }

  return {
    preferences,
    isLoaded,
    updatePreferences,
    hasConsented: preferences.hasConsented,
    canUseAnalytics: preferences.analytics,
    canUsePreferences: preferences.preferences,
  }
}
