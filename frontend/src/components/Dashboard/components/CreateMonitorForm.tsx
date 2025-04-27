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
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  monitors: IMonitor[]
  agents: IAgent[]
  setMonitors: React.Dispatch<React.SetStateAction<IMonitor[]>>
}

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.enum(['HTTP', 'TCP', 'PING'], { required_error: 'Type is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    agentId: z.string().min(1, { message: 'Agent is required' }),
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

export default function CreateMonitorForm({ monitors, agents, setMonitors }: Props) {
  const [open, setOpen] = useState(false)

  const [createMonitor, { loading, error }] = useMutation(CREATE_MONITOR_MUTATION)

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
    toast.success('Monitor created successfully')
    setMonitors([...monitors, data.createMonitor])
    form.reset()
    setOpen(false)
  }

  if (error) toast.error(error.message)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus/>
          <span className="hidden sm:inline">Add New Monitor</span>
        </Button>
      </DialogTrigger>
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
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select agent" />
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
