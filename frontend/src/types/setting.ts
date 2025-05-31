export interface ISetting {
  theme: 'light' | 'dark'
}

export interface INotification {
  id: string
  title: string
  message: string
  method: string
  webhookUrl?: string
  content?: string
  createdAt: Date
  isDefault: boolean
}

export interface ISession {
  id: string
  platform: string
  deviceIP: string
  expires: Date
  createdAt: Date
}
