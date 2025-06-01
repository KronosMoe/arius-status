import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BASE_PATH, DASHBOARD_PATH, SIGN_UP_PATH } from '@/constants/routes'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '@/gql/auth'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import SignInWithGithub from '@/components/utils/auth/SignInWithGithub'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export default function SignIn() {
  const [signIn, { error }] = useMutation(LOGIN_MUTATION)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await signIn({
      variables: {
        input: {
          username: data.username,
          password: data.password,
          platform: window.navigator.userAgent,
        },
      },
    })
    form.reset()
    navigate(DASHBOARD_PATH, { replace: true })
    navigate(0)
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (isAuthenticated) return <Navigate to={BASE_PATH} replace />

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <h1 className="text-3xl font-bold">Sign In</h1>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex w-full justify-center">
              <SignInWithGithub />
            </div>

            <div className="text-muted-foreground my-6 flex items-center space-x-4 text-sm">
              <Separator className="flex-1" />
              <span>Or Sign In With</span>
              <Separator className="flex-1" />
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="my-2 text-center text-zinc-400">
          Don&apos; have an account?{' '}
          <Link to={SIGN_UP_PATH} className="text-blue-500">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  )
}
