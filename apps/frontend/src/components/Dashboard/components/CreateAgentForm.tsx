import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CREATE_AGENT_MUTATION } from '@/gql/agents'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  refetch: () => void
}

export default function CreateAgentForm({ refetch }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const [createAgent, { loading }] = useMutation(CREATE_AGENT_MUTATION, {
    onCompleted: () => {
      toast.success(t('dashboard.create-agent-form.toast'))
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: t('agent.edit-agent-form.validation.name.required') })
      .transform((val) => val.toLowerCase().replace(/\s+/g, '-'))
      .refine((val) => /^[a-z0-9-]+$/.test(val), {
        message: t('agent.edit-agent-form.validation.name.refine'),
      }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createAgent({
      variables: {
        createAgentInput: {
          name: values.name,
        },
      },
    })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.create-agent-form.title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.create-agent-form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agent.edit-agent-form.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('agent.edit-agent-form.name.placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('agent.edit-agent-form.name.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="default" disabled={loading} type="submit">
                {t('dashboard.create-agent-form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
