import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CREATE_MONITOR_MUTATION } from '@/gql/monitors'
import { IAgent } from '@/types/agent'
import { IMonitor } from '@/types/monitor'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  monitors: IMonitor[]
  agents: IAgent[]
  setMonitors: React.Dispatch<React.SetStateAction<IMonitor[]>>
}

export default function CreateMonitorForm({ monitors, agents, setMonitors }: Props) {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const [createMonitor, { loading, error }] = useMutation(CREATE_MONITOR_MUTATION)

  const formSchema = z
    .object({
      name: z.string().min(1, { message: t('dashboard.create-monitor-form.validation.name.required') }),
      type: z.enum(['HTTP', 'TCP', 'PING'], {
        required_error: t('dashboard.create-monitor-form.validation.type.required'),
      }),
      address: z.string().min(1, { message: t('dashboard.create-monitor-form.validation.address.required') }),
      agentId: z.string().min(1, { message: t('dashboard.create-monitor-form.validation.agent.required') }),
      interval: z.coerce
        .number()
        .int()
        .min(60, { message: t('dashboard.create-monitor-form.validation.interval.min') })
        .max(86400, { message: t('dashboard.create-monitor-form.validation.interval.max') })
        .positive({ message: t('dashboard.create-monitor-form.validation.interval.positive') }),
    })
    .refine(
      (data) => {
        if (data.type === 'HTTP') {
          return data.address.startsWith('http://') || data.address.startsWith('https://')
        }
        if (data.type === 'TCP') {
          return data.address.includes(':')
        }
        return true
      },
      {
        message: t('dashboard.create-monitor-form.validation.refine.address'),
        path: ['address'],
      },
    )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'HTTP',
      address: '',
      agentId: '',
      interval: 60,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data } = await createMonitor({
      variables: {
        createMonitorInput: {
          name: values.name,
          type: values.type,
          address: values.address,
          interval: values.interval,
          agentId: values.agentId,
        },
      },
    })
    toast.success(t('dashboard.edit-monitor-form.toast'))
    setMonitors([...monitors, data.createMonitor])
    form.reset()
    setOpen(false)
  }

  if (error) toast.error(error.message)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.create-monitor-form.title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.create-monitor-form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.create-monitor-form.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('dashboard.create-monitor-form.name.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.create-monitor-form.type.label')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('dashboard.create-monitor-form.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="TCP">TCP</SelectItem>
                        <SelectItem value="PING">PING</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.create-monitor-form.address.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('dashboard.create-monitor-form.address.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.create-monitor-form.agent.label')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('dashboard.create-monitor-form.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.create-monitor-form.interval.label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('dashboard.create-monitor-form.interval.placeholder')}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {t('dashboard.create-monitor-form.submit')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
