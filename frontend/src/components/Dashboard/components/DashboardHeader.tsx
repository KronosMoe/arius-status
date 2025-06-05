import type React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  stats?: Array<{ label: string; value: number | string }>
  isLoading?: boolean
}

export function DashboardHeader({ title, description, action, stats, isLoading = false }: DashboardHeaderProps) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {isLoading ? (
            <>
              <Skeleton className="mb-2 h-8 w-40" />
              <Skeleton className="h-4 w-60" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground">{description}</p>}
            </>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
              <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
