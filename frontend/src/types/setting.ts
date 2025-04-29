export interface ISetting {
  theme: 'light' | 'dark'
}

export interface INotification {
  id: string
  title: string
  message: string
  method: string
  metadata: any
  createdAt: Date
}
