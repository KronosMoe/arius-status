import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UPDATE_NOTIFICATION_MUTATION } from '@/gql/settings'
import { INotification } from '@/types/setting'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z
  .object({
    title: z.string().min(1, { message: 'Title is required' }),
    method: z.enum(['Email', 'Discord'], {
      required_error: 'Method is required',
    }),
    message: z.string().min(1, { message: 'Message is required' }),
    metadata: z.any(),
    webhookUrl: z.string().url('Invalid URL').optional(),
    content: z.string().optional(),
    isDefault: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if ((data.method === 'Discord') && !data.webhookUrl) {
      ctx.addIssue({
        path: ['webhookUrl'],
        code: z.ZodIssueCode.custom,
        message: 'Webhook URL is required for Discord',
      })
    }

    if (data.method === 'Email' && !data.content) {
      ctx.addIssue({
        path: ['content'],
        code: z.ZodIssueCode.custom,
        message: 'Content is required for Email',
      })
    }
  })

type Props = {
  notification: INotification
  refetch: () => void
}

export default function UpdateNotificationForm({ refetch, notification }: Props) {
  const [open, setOpen] = useState(false)

  const [updateNotification, { error, loading }] = useMutation(UPDATE_NOTIFICATION_MUTATION)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notification.title,
      method: notification.method as 'Email' | 'Discord',
      message: notification.message || '',
      content: notification.content || '',
      webhookUrl: notification.webhookUrl || '',
      isDefault: notification.isDefault,
    },
  })
  const method = form.watch('method')
  const webhookUrl = form.watch('webhookUrl')
  const message = form.watch('message')

  const testWebhook = async (url: string) => {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    })
    toast.success('Webhook sent successfully')
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateNotification({
      variables: {
        updateNotificationSettingId: notification.id,
        updateNotificationInput: {
          title: values.title,
          method: values.method,
          message: values.message,
          metadata: values.metadata,
          webhookUrl: values.webhookUrl,
          content: values.content,
          isDefault: values.isDefault,
        },
      },
    })
    toast.success('Notification updated successfully')
    form.reset()
    setOpen(false)
    refetch()
  }

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Notification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(method === 'Discord') && (
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/webhook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {method === 'Email' && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Set as default</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              {(method === 'Discord') && webhookUrl && message && (
                <Button type="button" variant="secondary" onClick={() => testWebhook(webhookUrl)}>
                  Test
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
