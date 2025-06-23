import { format, isToday, Locale } from 'date-fns'
import { enUS, th } from 'date-fns/locale'

export const formatDate = (date: Date) => {
  if (isToday(date)) return format(date, 'hh:mm a')
  return format(date, 'MMM d')
}

export const dateFnsLocaleMap: Record<string, Locale> = {
  en: enUS,
  th: th,
}
