import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_TIMEZONE_MUTATION } from '@/gql/settings'
import { toast } from 'sonner'
import { ISetting } from '@/types/setting'
import timezones from 'timezones-list'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimezoneSettingProps {
  timezone: string
  setSettings: React.Dispatch<React.SetStateAction<ISetting>>
}

export default function Timezone({ timezone, setSettings }: TimezoneSettingProps) {
  const [open, setOpen] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState<string>(timezone)

  const [updateTimezone] = useMutation(UPDATE_TIMEZONE_MUTATION, {
    onCompleted(data) {
      setSettings(data.updateTimezone)
      toast.success('Timezone updated successfully')
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  useEffect(() => {
    setSelectedTimezone(timezone)
  }, [timezone])

  const handleSelect = (value: string) => {
    setSelectedTimezone(value)
    updateTimezone({ variables: { timezone: value } })
    setOpen(false)
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[250px] justify-between">
            {selectedTimezone || 'Select timezone'}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search timezones..." />
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {timezones.map((tz) => (
                <CommandItem key={tz.tzCode} value={tz.tzCode} onSelect={handleSelect} className="cursor-pointer">
                  <Check className={cn('mr-2 h-4 w-4', selectedTimezone === tz.tzCode ? 'opacity-100' : 'opacity-0')} />
                  {tz.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
