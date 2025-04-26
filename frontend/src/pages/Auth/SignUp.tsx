import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BASE_PATH, SIGN_IN_PATH } from '@/constants/routes'
import { useMutation } from '@apollo/client'
import { REGISTER_MUTATION } from '@/gql/auth'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email' }).min(1, { message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function SignUp() {
  const [register, { error }] = useMutation(REGISTER_MUTATION)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await register({
      variables: {
        input: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      },
    })
    navigate(SIGN_IN_PATH, { replace: true })
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
          <h1 className="text-3xl font-bold">Sign Up</h1>
        </CardHeader>
        <CardContent>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="my-2 text-center text-zinc-400">
          Already have an account?{' '}
          <Link to={SIGN_IN_PATH} className="text-blue-500">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}
