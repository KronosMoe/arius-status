export function formatAgo(seconds: number) {
  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
}
