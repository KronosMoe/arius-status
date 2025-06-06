import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Copy } from 'lucide-react'

export default function CopyableAgentToken({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      onClick={handleCopy}
      className="relative group w-full cursor-pointer select-none"
    >
      <Badge
        variant="outline"
        className="w-full block truncate font-mono text-xs px-3 py-1 pr-9"
      >
        {token}
      </Badge>
      <Copy className="absolute top-1/2 right-2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition" />
      {copied && (
        <span className="absolute -bottom-5 left-0 text-xs text-green-600">
          Copied!
        </span>
      )}
    </div>
  )
}
