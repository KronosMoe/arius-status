import { Separator } from '../ui/separator'
import { IMonitor } from '@/types/monitor'
import CreateMonitorForm from './components/CreateMonitorForm'
import { IAgent } from '@/types/agent'
import MonitorCard from './components/MonitorCard'
import { Link } from 'react-router-dom'
import { MONITOR_INFO_PATH } from '@/constants/routes'

type Props = {
  monitors: IMonitor[]
  agents: IAgent[]
  setMonitors: React.Dispatch<React.SetStateAction<IMonitor[]>>
}

export default function Monitors({ monitors, agents, setMonitors }: Props) {
  const MonitorsList = () => {
    return monitors.map((monitor) => (
      <Link key={monitor.id} to={MONITOR_INFO_PATH.replace(':monitorId', monitor.id)}>
        <MonitorCard monitor={monitor} />
      </Link>
    ))
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
