import { Info } from "lucide-react"
import Logo from "@/components/util/Logo"
import BuyMe from "../util/BuyMe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function Credit() {
  const { t } = useTranslation()
  const version = import.meta.env.VITE_APP_VERSION || "In Development"

  return (
    <div className="my-6 space-y-6">
      <div className="flex items-center gap-3">
        <Info className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">{t('settings.about.title')}</h2>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div>
              <Logo size={96} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Arius Statuspage
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm font-medium">
              Version: {version}
            </Badge>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/KronosMoe/arius-status"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Check Updates on GitHub
              </a>
            </Button>
          </div>

          <div className="border-t pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">Support the Project</h3>
              <p className="text-sm text-muted-foreground">Help keep this project alive and maintained</p>
            </div>
            <BuyMe />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
