import { IMonitor } from "./monitor"

export interface IStatusPage {
  id: string
  name: string
  logo: string
  slug: string
  isFullWidth: boolean
  showOverallStatus: boolean
  footerText: string
  createdAt: Date
  selectedMonitors: IStatusPageMonitor[]
}

export interface IStatusPageExtended extends IStatusPage {
  statusCards: IMonitor[]
  statusLines: IMonitor[]
}

export interface IStatusPageMonitor {
  id: string
  monitorId: string
  type: string
  createdAt: Date
}
