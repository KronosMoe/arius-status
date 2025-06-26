import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CREATE_NOTIFICATION_MUTATION } from '@/gql/settings'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  refetch: () => void
}

export default function CreateNotificationForm({ refetch }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [createNotification, { error, loading }] = useMutation(CREATE_NOTIFICATION_MUTATION)

  const formSchema = z
    .object({
      title: z.string().min(1, { message: t('settings.notification.create-notification-form.validation.name.required') }),
      method: z.enum(['Email', 'Discord'], {
        required_error: t('settings.notification.create-notification-form.validation.method.required'),
      }),
      message: z.string().optional(),
      metadata: z.any(),
      webhookUrl: z.string().url(t('settings.notification.create-notification-form.validation.webhook.invalid')).optional(),
      content: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.method === 'Discord' && !data.webhookUrl) {
        ctx.addIssue({
          path: ['webhookUrl'],
          code: z.ZodIssueCode.custom,
          message: t('settings.notification.create-notification-form.validation.webhook.required'),
        })
      }

      if (data.method === 'Email' && !data.content) {
        ctx.addIssue({
          path: ['content'],
          code: z.ZodIssueCode.custom,
          message: t('settings.notification.create-notification-form.validation.email-content.required'),
        })
      }
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      method: 'Discord',
      message: 'Hello, from Arius Statuspage',
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
    toast.success(t('settings.notification.create-notification-form.webhook-test.toast'))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createNotification({
      variables: {
        createNotificationInput: {
          title: values.title,
          method: values.method,
          message: values.message,
          metadata: values.metadata,
          webhookUrl: values.webhookUrl,
          content: values.content,
        },
      },
    })
    toast.success(t('settings.notification.create-notification-form.toast'))
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
        <Button>
          <CirclePlus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('settings.notification.create-notification-form.title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.notification.create-notification-form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.notification.create-notification-form.name.label')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('settings.notification.create-notification-form.name.placeholder')} />
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
                  <FormLabel>{t('settings.notification.create-notification-form.method.label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={t('settings.notification.create-notification-form.method.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* <SelectItem value="Email">Email</SelectItem> */}
                      <SelectItem value="Discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {method === 'Discord' && (
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.notification.create-notification-form.webhook.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('settings.notification.create-notification-form.webhook.placeholder')} {...field} />
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
                    <FormLabel>{t('settings.notification.create-notification-form.email-content.label')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('settings.notification.create-notification-form.email-content.placeholder')} {...field} />
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
                  <FormLabel>{t('settings.notification.create-notification-form.message.label')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('settings.notification.create-notification-form.message.placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              {method === 'Discord' && webhookUrl && (
                <Button type="button" variant="secondary" onClick={() => testWebhook(webhookUrl)}>
                  {t('settings.notification.create-notification-form.webhook-test.button')}
                </Button>
              )}
              <Button type="button" variant='outline' onClick={() => setOpen(false)}>
                {t('settings.notification.create-notification-form.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {t('settings.notification.create-notification-form.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
