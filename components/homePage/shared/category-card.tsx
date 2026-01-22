import Image from "next/image";
import { cn } from "@/lib/utils";
import { Snowflake, Tag, Telescope } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  className?: string;
  icon: string;
}

export function CategoryCard({
  title,
  image,
  className,
  icon,
}: CategoryCardProps) {
  return (
    <button
      className="group w-full md:max-w-sm bg-white rounded-[18px] shadow-[0_0_10px_rgba(0,0,0,0.15)] p-4 text-left hover:shadow-2xl transition-shadow duration-300 ease-in-out"
      aria-label={title}
    >
      <div className="relative rounded-xl overflow-hidden bg-gray-200">
        {/* Image */}
        <Image
          alt={title}
          width={400}
          height={300}
          src={image}
          className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating circular icon centered horizontally, slightly above vertical center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
          <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center">
            {/* Snowflake icon - accessible SVG */}
            {icon === "Snowflake" && (
              <Snowflake
                className="w-6 h-6 text-gray-800"
                aria-label="Snowflake Icon"
              />
            )}
            {icon === "Tag" && (
              <Tag className="w-6 h-6 text-gray-800" aria-label="Tag Icon" />
            )}
            {icon === "Telescope" && (
              <Telescope
                className="w-6 h-6 text-gray-800"
                aria-label="Telescope Icon"
              />
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 text-center">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
    </button>
  );
}
