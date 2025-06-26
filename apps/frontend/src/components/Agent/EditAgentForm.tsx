import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RENAME_AGENT_MUTATION } from '@/gql/agents'
import { IAgent } from '@/types/agent'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  agent: IAgent
  refetch: () => void
}

export default function EditAgentForm({ agent, refetch }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: t('agent.edit-agent-form.validation.name.required') })
      .transform((val) => val.toLowerCase().replace(/\s+/g, '-'))
      .refine((val) => /^[a-z0-9-]+$/.test(val), {
        message: t('agent.edit-agent-form.validation.name.refine'),
      }),
  })

  const [renameAgent, { loading }] = useMutation(RENAME_AGENT_MUTATION, {
    onCompleted: () => {
      toast.success(t('agent.edit-agent-form.toast'))
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agent.name,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await renameAgent({ variables: { id: agent.id, name: values.name } })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          {t('agent.edit-agent-form.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('agent.edit-agent-form.title')} <Badge variant="outline">{agent.name}</Badge>
          </DialogTitle>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('agent.edit-agent-form.cancel')}
              </Button>
              <Button variant="default" disabled={loading} type="submit">
                {t('agent.edit-agent-form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
