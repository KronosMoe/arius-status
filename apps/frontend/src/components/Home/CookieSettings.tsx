import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, BarChart3, Settings, Cookie } from 'lucide-react'
import {
  COOKIE_CONSENT_KEY,
  type CookiePreferences,
  DEFAULT_COOKIE_PREFERENCES,
  COOKIE_CATEGORIES,
} from '@/constants/localStorage'

interface CookieSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (preferences: CookiePreferences) => void
}

const categoryIcons = {
  necessary: Shield,
  analytics: BarChart3,
  preferences: Settings,
}

export default function CookieSettings({ open, onOpenChange, onSave }: CookieSettingsModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFERENCES)

  useEffect(() => {
    if (open) {
      // Load existing preferences when modal opens
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setPreferences({ ...DEFAULT_COOKIE_PREFERENCES, ...parsed })
        } catch {
          setPreferences(DEFAULT_COOKIE_PREFERENCES)
        }
      }
    }
  }, [open])

  const handleToggle = (category: keyof Omit<CookiePreferences, 'hasConsented'>) => {
    if (category === 'necessary') return

    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = () => {
    const finalPreferences: CookiePreferences = {
      ...preferences,
      necessary: true,
      hasConsented: true,
    }

    onSave(finalPreferences)
    onOpenChange(false)
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      preferences: true,
      hasConsented: true,
    }

    onSave(allAccepted)
    onOpenChange(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      preferences: false,
      hasConsented: true,
    }

    onSave(onlyNecessary)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons]
            const isEnabled = preferences[key as keyof CookiePreferences] as boolean
            const isRequired = category.required
            type CookieCategoryKey = Exclude<keyof CookiePreferences, 'hasConsented'>

            return (
              <Card key={key} className={`transition-colors ${isEnabled ? 'bg-primary/5 border-primary/20' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`h-4 w-4 ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {category.title}
                          {isRequired && (
                            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">Required</span>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(key as CookieCategoryKey)}
                      disabled={isRequired}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">{category.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 border-t pt-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleAcceptAll} className="flex-1">
              Accept All Cookies
            </Button>
            <Button onClick={handleRejectAll} variant="outline" className="flex-1">
              Reject Optional Cookies
            </Button>
          </div>
          <Button onClick={handleSave} variant="secondary" className="w-full">
            Save My Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
