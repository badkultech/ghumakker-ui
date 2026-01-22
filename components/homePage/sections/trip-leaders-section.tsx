import Link from "next/link"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { ChevronRight } from "lucide-react"
import { ROUTES } from "@/lib/utils"

const tripLeaders = [
  { name: "Kyle May", image: "/tl-pfp.jpg" },
  { name: "Sarah Johnson", image: "/tl-pfp.jpg" },
  { name: "Mike Chen", image: "/tl-pfp.jpg" },
  { name: "Emma Wilson", image: "/tl-pfp.jpg" },
  { name: "James Brown", image: "/tl-pfp.jpg" },
  { name: "Olivia Davis", image: "/tl-pfp.jpg" },
  { name: "David Lee", image: "/tl-pfp.jpg" },
  { name: "Lisa Park", image: "/tl-pfp.jpg" },
]

export function TripLeadersSection() {
  // Split leaders into 2 rows
  const row1 = tripLeaders.slice(0, 4)
  const row2 = tripLeaders.slice(4, 8)

  return (
    <section className="py-12 md:py-20 bg-[#F5F5F5]">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold italic text-gray-900 text-center mb-16">Meet Trip Leaders</h2>

      {/* Mobile: Vertical Grid (First 4 only) */}
      <div className="md:hidden flex flex-col gap-4 px-4 w-full max-w-[400px] mx-auto">
        {row1.map((leader) => (
          <TripLeaderCard key={leader.name} name={leader.name} image={leader.image} variant="home-pill" className="w-full" />
        ))}
      </div>

      {/* Desktop: Horizontally scrollable/layout container */}
      <div className="hidden md:block overflow-x-auto pb-8 no-scrollbar w-full">
        <div className="w-max mx-auto md:mx-0 md:min-w-full flex flex-col gap-10 px-4 md:px-20">
          {/* Row 1 */}
          <div className="flex gap-8">
            {row1.map((leader) => (
              <TripLeaderCard key={leader.name} name={leader.name} image={leader.image} variant="home-pill" />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-8 pl-12 md:pl-16">
            {row2.map((leader) => (
              <TripLeaderCard key={leader.name} name={leader.name} image={leader.image} variant="home-pill" />
            ))}
          </div>
        </div>
      </div>

      {/* View All link */}
      <div className="text-center my-8 ">
        <Link
          href={ROUTES.COMMON.HOME_LEADERS}
          className="text-lg text-[#ff804c] flex items-center gap-2  justify-center font-semibold font-poppins  hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
