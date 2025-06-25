import type React from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Shield } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

interface DashboardTabsProps {
  children: React.ReactNode
  activeTab: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function DashboardTabs({ children, activeTab, onChange, isLoading = false }: DashboardTabsProps) {
  const { t } = useTranslation()

  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      {isLoading ? (
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      ) : (
        <TabsList className="mb-6">
          <TabsTrigger value="monitors" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>{t('dashboard.tabs.monitors')}</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>{t('dashboard.tabs.agents')}</span>
          </TabsTrigger>
        </TabsList>
      )}
      {children}
    </Tabs>
  )
}
