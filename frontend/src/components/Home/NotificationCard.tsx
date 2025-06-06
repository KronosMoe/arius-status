export default function NotificationCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-background rounded-2xl border p-6 shadow-sm transition hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  )
}
