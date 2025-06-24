import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/components/util/Logo'
import { BASE_PATH, DASHBOARD_PATH } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate(isAuthenticated ? DASHBOARD_PATH : BASE_PATH, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
          <Logo size={128}/>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
            <p className="max-w-sm text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 justify-center sm:flex-row">
            <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
