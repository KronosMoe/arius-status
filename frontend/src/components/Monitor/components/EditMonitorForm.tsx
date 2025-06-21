import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UPDATE_MONITOR_MUTATION } from '@/gql/monitors'
import { IMonitor, MonitorType } from '@/types/monitor'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  monitor: IMonitor
  openEdit: boolean
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>
  refetch: () => void
}

export default function UpdateMonitorForm({ monitor, openEdit, setOpenEdit, refetch }: Props) {
  const { t } = useTranslation()

  const [updateMonitor, { loading, error }] = useMutation(UPDATE_MONITOR_MUTATION, {
    onCompleted: () => {
      toast.success(t('monitor.edit-monitor-form.toast'))
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const formSchema = z
    .object({
      name: z.string().min(1, { message: t('dashboard.create-monitor-form.validation.name.required') }),
      type: z.enum(['HTTP', 'TCP', 'PING'], {
        required_error: t('dashboard.create-monitor-form.validation.type.required'),
      }),
      address: z.string().min(1, { message: t('dashboard.create-monitor-form.validation.address.required') }),
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
      name: monitor.name || '',
      type: (monitor.type as MonitorType) || 'HTTP',
      address: monitor.address || '',
      interval: monitor.interval || 60,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateMonitor({
      variables: {
        updateMonitorByIdId: monitor.id,
        updateMonitorInput: {
          address: values.address,
          interval: values.interval,
          name: values.name,
          type: values.type,
        },
      },
    })
    form.reset()
    setOpenEdit(false)
  }

  if (error) toast.error(error.message)

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('monitor.edit-monitor-form.title')}{' '}
            <Badge variant="outline" className="text-xs">
              {monitor.id}
            </Badge>
          </DialogTitle>
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
                        <SelectValue placeholder={t('dashboard.create-monitor-form.type.placeholder')} />
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
              {t('monitor.edit-monitor-form.submit')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
