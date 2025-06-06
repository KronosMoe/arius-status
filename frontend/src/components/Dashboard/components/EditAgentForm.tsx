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
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .transform((val) => val.toLowerCase().replace(/\s+/g, '-'))
    .refine((val) => /^[a-z0-9-]+$/.test(val), {
      message: 'Only lowercase letters, numbers, and hyphens are allowed',
    }),
})

type Props = {
  agent: IAgent
  refetch: () => void
}

export default function EditAgentForm({ agent, refetch }: Props) {
  const [open, setOpen] = useState(false)

  const [renameAgent, { loading }] = useMutation(RENAME_AGENT_MUTATION, {
    onCompleted: () => {
      toast.success('Agent renamed successfully')
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
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing Agent {agent.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. home-lab" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be lowercase and use hyphens instead of spaces (e.g. <code>home-lab</code>).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" disabled={loading} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
