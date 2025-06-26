export const LANGUAGE_KEY = 'language'
export const THEME_KEY = 'theme'
export const COOKIE_CONSENT_KEY = 'cookie_consent'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  preferences: boolean
  hasConsented: boolean
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  preferences: false,
  hasConsented: false,
}

export const COOKIE_CATEGORIES = {
  necessary: {
    title: 'Necessary Cookies',
    description: 'Essential for authentication, security, and basic website functionality. These cannot be disabled.',
    required: true,
  },
  analytics: {
    title: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
    required: false,
  },
  preferences: {
    title: 'Preference Cookies',
    description: 'Remember your settings like language, theme, and other customization preferences.',
    required: false,
  },
} as const
