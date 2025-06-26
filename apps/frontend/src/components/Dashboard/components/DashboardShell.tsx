import type React from 'react'
import { cn } from '@/lib/utils'

type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn('w-full px-4 py-6 md:py-8 lg:py-10 xl:m-auto xl:max-w-7xl', className)} {...props}>
      {children}
    </div>
  )
}
