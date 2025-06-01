import { Button } from '@/components/ui/button'
import { GITHUB_OAUTH_URL_QUERY } from '@/gql/auth'
import { useLazyQuery } from '@apollo/client'
import { Github } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export default function SignInWithGithub() {
  const [getUrl, { loading }] = useLazyQuery(GITHUB_OAUTH_URL_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data?.getGithubOAuthUrl) {
        window.location.href = data.getGithubOAuthUrl
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
      <Github className="mr-2" />
      <span>Sign in with GitHub</span>
    </Button>
  )
}
