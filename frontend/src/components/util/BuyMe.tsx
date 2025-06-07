import { Coffee, Heart, ExternalLink } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export default function BuyMe() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="relative">
              <Coffee className="h-8 w-8" />
              <Heart className="h-3 w-3 absolute -top-1 -right-1 fill-current text-red-500" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Enjoying this project?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Buy me a coffee to support development</p>
          </div>

          <Button
            asChild
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <a
              href="https://www.buymeacoffee.com/mirailisc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Coffee className="h-4 w-4 group-hover:animate-bounce" />
              Buy me a coffee
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
