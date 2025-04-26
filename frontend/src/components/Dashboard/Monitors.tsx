import { Separator } from '../ui/separator'
import { IMonitor } from '@/types/monitor'
import CreateMonitorForm from './components/CreateMonitorForm'
import { IAgent } from '@/types/agent'
import MonitorCard from './components/MonitorCard'

type Props = {
  monitors: IMonitor[]
  agents: IAgent[]
  setMonitors: React.Dispatch<React.SetStateAction<IMonitor[]>>
}

export default function Monitors({ monitors, agents, setMonitors }: Props) {
  const MonitorsList = () => {
    return monitors.map((monitor) => <MonitorCard key={monitor.id} monitor={monitor} />)
  }

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitors</h1>
        <CreateMonitorForm monitors={monitors} agents={agents} setMonitors={setMonitors} />
      </div>
      <Separator />
      <div className="mt-4 flex flex-col gap-4">{monitors.length > 0 ? <MonitorsList /> : <div>No data</div>}</div>
    </div>
  )
}
