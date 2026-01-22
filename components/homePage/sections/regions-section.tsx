import { SectionHeader } from "@/components/homePage/shared/section-header";
import { RegionItem } from "@/components/homePage/shared/region-item";
import { Mountain, Sun, Palmtree, Building2, Plane, Ship } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const domesticRegions = [
  { name: "North India", id: "north_india", icon: <Image src="/north-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "South India", id: "south_india", icon: <Image src="/south-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "West India", id: "west_india", icon: <Image src="/west-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "Central India", id: "central_india", icon: <Image src="/central-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "East India", id: "east_india", icon: <Image src="/east-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "North-East India", id: "north-east_india", icon: <Image src="/north-east-india-region.png" alt="North India" width={80} height={80} /> },
];

const internationalRegions = [
  { name: "South Asia", id: "south_asia", icon: <Image src="/south-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "South-East Asia", id: "south_east_asia", icon: <Image src="/south-east-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "East Asia", id: "east_asia", icon: <Image src="/east-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "Middle East", id: "middle_east", icon: <Image src="/middle-east-region.png" alt="North India" width={80} height={80} /> },
  { name: "Europe", id: "europe", icon: <Image src="/europe-region.png" alt="North India" width={80} height={80} /> },
  { name: "Africa", id: "africa", icon: <Image src="/africa-region.png" alt="North India" width={80} height={80} /> },
  { name: "North America", id: "north_america", icon: <Image src="/north-america-region.png" alt="North India" width={80} height={80} /> },
  { name: "South America", id: "south_america", icon: <Image src="/south-america-region.png" alt="North India" width={80} height={80} /> },
  { name: "Oceania", id: "oceania", icon: <Image src="/oceania-region.png" alt="North India" width={80} height={80} /> },
];

export function RegionsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-20">
        <SectionHeader
          title="Explore Regions"
          className="mb-10"
        />

        {/* Domestic */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Domestic
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {domesticRegions.map((region) => (
              <Link href={`/home/search-result-with-filter?destinationTags=${region.id}`}>
                <RegionItem
                  key={region.name}
                  name={region.name}
                  icon={region.icon}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* International */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            International
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {internationalRegions.map((region) => (
              <Link href={`/home/search-result-with-filter?destinationTags=${region.id}`}>
                <RegionItem
                  key={region.name}
                  name={region.name}
                  icon={region.icon}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
