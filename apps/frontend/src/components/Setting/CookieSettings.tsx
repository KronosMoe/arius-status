import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, BarChart3, Settings } from 'lucide-react'
import { type CookiePreferences, COOKIE_CATEGORIES } from '@/constants/localStorage'
import { useCookiePreferences } from '@/hooks/useCookiePreferences'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const categoryIcons = {
  necessary: Shield,
  analytics: BarChart3,
  preferences: Settings,
}

export default function CookieSettings() {
  const { preferences, updatePreferences } = useCookiePreferences()
  const navigate = useNavigate()

  const handleToggle = (category: keyof Omit<CookiePreferences, 'hasConsented'>) => {
    if (category === 'necessary') return

    updatePreferences({
      ...preferences,
      [category]: !preferences[category],
    })
  }

  const handleSave = () => {
    const finalPreferences: CookiePreferences = {
      ...preferences,
      necessary: true,
      hasConsented: true,
    }

    updatePreferences(finalPreferences)
    toast.success('Cookies saved successfully!')
    navigate(0)
  }

  return (
    <div>
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
        <Button onClick={handleSave} variant="default" className="w-full">
          Save My Preferences
        </Button>
      </div>
    </div>
  )
}
