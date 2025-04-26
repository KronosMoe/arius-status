import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CREATE_AGENT_MUTATION } from '@/gql/agents'
import { IAgent } from '@/types/agent'
import { useMutation } from '@apollo/client'
import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  agents: IAgent[]
  setAgents: React.Dispatch<React.SetStateAction<IAgent[]>>
}

export default function CreateAgentForm({ agents, setAgents }: Props) {
  const [name, setName] = useState<string>('')
  const [open, setOpen] = useState(false)

  const [createAgent, { loading, error }] = useMutation(CREATE_AGENT_MUTATION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data } = await createAgent({
      variables: {
        createAgentInput: {
          name,
        },
      },
    })
    toast.success('Agent created successfully')
    setAgents([...agents, data.createAgent])
    setName('')
    setOpen(false)
  }

  if (error) toast.error(error.message)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add New Agent</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Create Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
