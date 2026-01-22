// RegionsSection.tsx

import Image from "next/image";
import React from "react";

type RegionItem = {
  id: string;
  title: string;
  icon: string; // path under /public or external URL
  href?: string;
};

const domestic: RegionItem[] = [
  { id: "north", title: "North India", icon: "/icons/india-north.svg" },
  { id: "south", title: "South India", icon: "/icons/india-south.svg" },
  { id: "west", title: "West India", icon: "/icons/india-west.svg" },
  { id: "central", title: "Central India", icon: "/icons/india-central.svg" },
  { id: "east", title: "East India", icon: "/icons/india-east.svg" },
  { id: "ne", title: "North-East India", icon: "/icons/india-ne.svg" },
];

const international: RegionItem[] = [
  { id: "southasia", title: "South Asia", icon: "/icons/south-asia.svg" },
  { id: "seasia", title: "South-East Asia", icon: "/icons/se-asia.svg" },
  { id: "eastasia", title: "East Asia", icon: "/icons/east-asia.svg" },
  { id: "me", title: "Middle East", icon: "/icons/middle-east.svg" },
  { id: "europe", title: "Europe", icon: "/icons/europe.svg" },
  { id: "africa", title: "Africa", icon: "/icons/africa.svg" },
  { id: "na", title: "North America", icon: "/icons/north-america.svg" },
  { id: "sa", title: "South America", icon: "/icons/south-america.svg" },
  { id: "oceania", title: "Oceania", icon: "/icons/oceania.svg" },
];

type SectionProps = {
  heading: string;
  items: RegionItem[];
};

function Section({ heading, items }: SectionProps): React.JSX.Element {
  return (
    <section>
      <h2 className="text-sm tracking-wide font-semibold text-gray-900 mb-6">
        {heading}
      </h2>

      <div className="mb-6 border-b border-gray-200" />

      <div className="grid gap-y-6 gap-x-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className="flex items-center gap-4 group text-left"
            aria-label={it.title}
            // onClick={() => {
            //   if (it.href) window.location.href = it.href;
            // }}
          >
            <div className="w-12 h-12 rounded-md flex items-center justify-center bg-orange-400 shadow-[0_0_18px_rgba(0,0,0,0.08)] overflow-hidden">
              <Image
                src={it.icon}
                alt={`${it.title} icon`}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>

            <span className="text-sm text-gray-800">{it.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function RegionsSection(): React.JSX.Element {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Section heading="DOMESTIC" items={domestic} />
      </div>

      <div className="mt-14">
        <Section heading="INTERNATIONAL" items={international} />
      </div>
    </div>
  );
}
