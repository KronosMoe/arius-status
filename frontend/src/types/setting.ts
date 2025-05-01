export interface ISetting {
  theme: 'light' | 'dark'
  timezone: string
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
