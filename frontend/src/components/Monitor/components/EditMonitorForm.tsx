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
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  monitor: IMonitor
  openEdit: boolean
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>
  refetchMonitor: () => void
}

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.enum(['HTTP', 'TCP', 'PING'], { required_error: 'Type is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    interval: z.coerce
      .number()
      .int()
      .min(60, { message: 'Interval must be at least 60 seconds' })
      .max(86400, { message: 'Interval must be at most 86400 seconds' })
      .positive({ message: 'Interval must be a positive number' }),
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
      message: 'Invalid address format based on monitor type',
      path: ['address'],
    },
  )

export default function UpdateMonitorForm({ monitor, openEdit, setOpenEdit, refetchMonitor }: Props) {
  const [updateMonitor, { loading, error }] = useMutation(UPDATE_MONITOR_MUTATION)

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
    toast.success('Monitor created successfully')
    form.reset()
    refetchMonitor()
    setOpenEdit(false)
  }

  if (error) toast.error(error.message)

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Monitor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your monitor name" {...field} />
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
                  <FormLabel>Monitor Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address (e.g., https://example.com or example.com:443)" {...field} />
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
                  <FormLabel>Interval (in seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter interval in seconds (e.g., 60)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              Create Monitor
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
