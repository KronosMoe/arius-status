import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cookie, X, Settings } from 'lucide-react'
import { COOKIE_CONSENT_KEY, type CookiePreferences } from '@/constants/localStorage'
import CookieSettings from './CookieSettings'
import { Link } from 'react-router-dom'
import { PRIVACY_POLICY_PATH } from '@/constants/routes'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      try {
        const preferences = JSON.parse(stored) as CookiePreferences
        if (!preferences.hasConsented) {
          setShowBanner(true)
          setTimeout(() => setIsVisible(true), 100)
        }
      } catch {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 100)
      }
    } else {
      setShowBanner(true)
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      preferences: true,
      hasConsented: true,
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted))
    hideBanner()
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      preferences: false,
      hasConsented: true,
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(onlyNecessary))
    hideBanner()
  }

  const handleSavePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences))
    hideBanner()
  }

  const hideBanner = () => {
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleClose = () => {
    hideBanner()
  }

  if (!showBanner) return null

  return (
    <>
      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-all duration-300 ease-in-out md:inset-x-auto md:right-4 md:max-w-md ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <Card className="border-border/50 bg-background/95 shadow-lg backdrop-blur-sm">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Cookie className="text-primary h-5 w-5" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">Cookie Preferences</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We use cookies to enhance your experience. Choose which cookies you&apos;d like to accept, or{' '}
                    <Link
                      to={PRIVACY_POLICY_PATH}
                      className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                    >
                      learn more in our Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                      size="sm"
                    >
                      Accept All
                    </Button>
                    <Button onClick={handleRejectAll} variant="outline" className="flex-1" size="sm">
                      Reject Optional
                    </Button>
                  </div>

                  <Button onClick={() => setShowSettings(true)} variant="ghost" className="w-full text-sm" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Preferences
                  </Button>
                </div>

                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
                >
                  Remind me later
                </button>
              </div>

              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0 rounded-full p-1 transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CookieSettings open={showSettings} onOpenChange={setShowSettings} onSave={handleSavePreferences} />
    </>
  )
}
