import Image from "next/image";
import { SearchTripsCard } from "../shared/SearchTripsCardDesktop";
import { SearchTripsCardMobile } from "../shared/SearchTripsCardMobile";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-visible lg:overflow-hidden">

      {/* Background layer */}
      <div className="absolute inset-0 min-h-full z-0">
        <Image
          src="/hero-bg.png"
          alt="Group travel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 py-8 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">

            {/* LEFT COLUMN */}
            <div className="max-w-xl w-full">
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-black drop-shadow-sm">
                Travel Together.
                <br />
                Build Real Connections.
              </h1>

              <p className="mt-4 text-sm text-gray-800 max-w-md drop-shadow-sm">
                Discover curated group trips and connect with travelers who
                share your mindset.
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full flex justify-center lg:justify-end">

              {/* Desktop card */}
              <div className="hidden lg:block lg:-mt-16 w-full max-w-[560px]">
                <SearchTripsCard />
              </div>

              {/* Mobile card */}
              <div className="block lg:hidden w-full max-w-md mt-4 mx-auto pb-8">
                <SearchTripsCardMobile />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
