import { useEffect } from 'react'

type Props = {
  base64Icon: string
}

export default function Favicon({ base64Icon }: Props) {
  useEffect(() => {
    if (!base64Icon) return

    // Remove all existing <link rel="icon"> and <link rel="shortcut icon">
    const existingIcons = document.querySelectorAll("link[rel~='icon']")
    existingIcons.forEach((el) => el.parentNode?.removeChild(el))

    // Create new dynamic icon
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.href = base64Icon.startsWith('data:') ? base64Icon : `data:image/png;base64,${base64Icon}`
    document.head.appendChild(link)
  }, [base64Icon])

  return null
}
