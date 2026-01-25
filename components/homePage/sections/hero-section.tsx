import Image from "next/image";
import { SearchTripsCard } from "../shared/search-trips-card";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Group travel"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Depth overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r 
                     from-black/30 via-black/10 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT TEXT */}
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-black drop-shadow-sm">
                Travel Together.
                <br />
                Build Real Connections.
              </h1>

              <p className="mt-4 text-sm text-gray-800 max-w-md drop-shadow-sm">
                Discover curated group trips and connect with travelers who
                share your mindset.
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="flex justify-center lg:justify-end lg:-mt-16">
              <SearchTripsCard />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
