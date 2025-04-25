'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apollo'

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </ThemeProvider>
  )
}
