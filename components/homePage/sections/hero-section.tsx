import { SearchTripsCard } from "@/components/homePage/shared/search-trips-card";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[700px] bg-white overflow-visible max-w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.2] md:leading-[1.1] tracking-tight">
              Join Group Trips. Meet Like Minded Travelers. Around the World!
            </h1>
            <p className="hidden md:block text-muted-foreground text-base max-w-md leading-relaxed">
              An all-in-one platform to discover the most incredible group
              trips, connect with like-minded travelers and be part of a
              thriving community that shares your passion for exploration and
              connection.
            </p>

            <div className="pt-4 hidden lg:block">
              <Image
                alt=""
                width={240}
                height={120}
                src={"./hero-images-dummy.png"}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end w-full overflow-visible">
            <SearchTripsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
