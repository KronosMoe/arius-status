import { Button } from '@/components/ui/button'
import { DASHBOARD_PATH, SIGN_IN_PATH } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { Rocket, Activity, Globe, Gift } from 'lucide-react'
import { SiApache } from 'react-icons/si'
import { FiDatabase } from 'react-icons/fi'
import Footer from '@/components/Home/Footer'
import MonitorTypeCard from '@/components/Home/MonitorTypeCard'
import FeatureCard from '@/components/Home/FeatureCard'
import CookieConsent from '@/components/Home/CookieConsent'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen w-full flex-col px-4 xl:m-auto xl:w-[1280px]">
      <title>Arius Statuspage</title>
      <CookieConsent/>
      {/* Hero Section */}
      <main className="mt-24 flex-grow text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Arius <span className="text-green-400">Statuspage</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Monitor your infrastructure and apps with real-time insight and flexible alerting – from public endpoints to
          private networks.
        </p>

        {isAuthenticated ? (
          <Link to={DASHBOARD_PATH}>
            <Button size="lg" className="mt-8 px-8 py-6 text-lg">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to={SIGN_IN_PATH}>
            <Button size="lg" className="mt-8 px-8 py-6 text-lg">
              Sign In to Get Started
            </Button>
          </Link>
        )}
      </main>

      {/* Features Section */}
      <section className="mt-32">
        <h2 className="text-center text-3xl font-semibold">Why Arius?</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Private Uptime Agent"
            description="Install inside firewalled networks to track internal service availability."
            icon={<Rocket className="text-primary h-6 w-6" />}
          />
          <FeatureCard
            title="Real-Time Insights"
            description="Live feedback on your apps — no manual refreshes or guesswork."
            icon={<Activity className="text-primary h-6 w-6" />}
          />
          <FeatureCard
            title="Global Language Support"
            description="Multilingual UI for global teams working across regions."
            icon={<Globe className="text-primary h-6 w-6" />}
          />
          <FeatureCard
            title="Free Forever"
            description="Zero cost, full features. Built for transparency and value."
            icon={<Gift className="text-primary h-6 w-6" />}
          />
        </div>
      </section>

      {/* Supported Monitors Section */}
      <section className="mt-32">
        <h2 className="text-2xl font-semibold">Supported Monitor Types</h2>
        <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
          <MonitorTypeCard
            title="Ping"
            description="Check host availability using ICMP."
            icon={<Activity className="text-primary h-12 w-12" />}
          />
          <MonitorTypeCard
            title="HTTP/HTTPS"
            description="Track web service responses and codes."
            icon={<SiApache className="text-primary h-12 w-12" />}
          />
          <MonitorTypeCard
            title="TCP"
            description="Validate availability of socket-based services."
            icon={<FiDatabase className="text-primary h-12 w-12" />}
          />
        </div>
      </section>

      {/* Notification Channels Section */}
      {/* <section className="mt-32">
        <h2 className="text-2xl font-semibold">Notification Channels</h2>
        <p className="text-muted-foreground mt-2">Stay updated with flexible alerting methods:</p>
        <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
          <NotificationCard
            title="Email Alerts"
            description="Receive critical updates directly in your inbox."
            icon={<FaRegEnvelope className="text-primary h-12 w-12" />}
          />
          <NotificationCard
            title="Discord Webhooks"
            description="Integrate directly into your Discord channels."
            icon={<FaDiscord className="text-primary h-12 w-12" />}
          />
          <NotificationCard
            title="Telegram Bot Messages"
            description="Receive push notifications on Telegram."
            icon={<FaTelegram className="text-primary h-12 w-12" />}
          />
        </div>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  )
}
