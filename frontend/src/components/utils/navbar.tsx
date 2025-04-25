'use client'

import { LogIn } from 'lucide-react'
import { Button } from '../ui/button'
import ThemeToggle from './theme-toggle'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="sticky top-[10px] mx-[10px] rounded-md border border-black/20 bg-zinc-100/50 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-900/50">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div>Navbar</div>
        <div className="flex flex-row gap-4">
          <ThemeToggle />
          <Link href="/auth">
            <Button>
              <LogIn /> Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
