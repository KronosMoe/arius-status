import { PRIVACY_POLICY_PATH } from '@/constants/routes'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className="mt-32 flex flex-row justify-between border-t py-8">
      <div className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Arius Statuspage. All rights reserved.
      </div>
      <Link className="text-muted-foreground text-sm" to={PRIVACY_POLICY_PATH}>
        Privacy Policy
      </Link>
    </div>
  )
}
