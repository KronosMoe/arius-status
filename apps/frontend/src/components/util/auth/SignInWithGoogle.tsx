import { Button } from '@/components/ui/button'
import { GOOGLE_OAUTH_URL_QUERY } from '@/gql/auth'
import { useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import { SiGoogle } from 'react-icons/si'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export default function SignInWithGoogle() {
  const [getUrl, { loading }] = useLazyQuery(GOOGLE_OAUTH_URL_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data?.getGoogleOAuthUrl) {
        window.location.href = data.getGoogleOAuthUrl
      }
    },
  })

  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const error = params.get('error')
    if (error) {
      toast.error(decodeURIComponent(error))
    }
  }, [location])

  return (
    <Button variant="outline" onClick={() => getUrl()} disabled={loading} className="w-full">
      <SiGoogle className="mr-2" />
      <span>Sign in with Google</span>
    </Button>
  )
}
