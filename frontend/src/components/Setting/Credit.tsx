import Logo from '@/components/util/Logo'

export default function Credit() {
  return (
    <div className="my-4">
      <h2 className="my-4 text-xl font-bold">About</h2>
      <div className="flex flex-col items-center justify-center">
        <Logo size={128} />
        <h3 className="mt-4 text-2xl font-bold">Arius Statuspage</h3>
        <p className="text-sm text-zinc-500">Version: {import.meta.env.VITE_APP_VERSION || 'In Development'}</p>
        <a
          href="https://github.com/KronosMoe/arius-status"
          className="mt-2 text-xs text-zinc-500 underline dark:text-zinc-400"
        >
          Check Update On GitHub
        </a>
      </div>
    </div>
  )
}
