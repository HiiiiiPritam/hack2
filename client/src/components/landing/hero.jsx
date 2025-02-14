import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <span className="font-semibold text-primary">New feature</span>
              <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
              <a href="#" className="flex items-center gap-x-1">
                Live guard tracking
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Urban Security Management Simplified
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Streamline your security operations with real-time tracking, automated attendance,
            and instant incident reporting. All in one unified platform.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg">
              Get started
            </Button>
            <Button variant="outline" size="lg">
              Live demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          {/* Add a placeholder for your dashboard preview/image */}
          <div className="rounded-md bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-lg">
            <div className="aspect-[16/9] w-[36rem] rounded-md bg-gray-50 object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}