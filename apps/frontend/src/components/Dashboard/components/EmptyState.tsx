import type React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed", className)}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon && <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {action}
      </div>
    </div>
  )
}
