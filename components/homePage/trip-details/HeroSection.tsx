import { LazyImage } from "@/components/ui/lazyImage";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { AvatarImage } from "@radix-ui/react-avatar";

interface HeroSectionProps {
  title?: string;
  location?: string;
  imageUrl?: string;
  onImageClick?: () => void;
}

export default function HeroSection({
  title = TRIP_DETAILS.HERO.DEFAULT_TITLE,
  location = "",
  imageUrl,
  onImageClick,
}: HeroSectionProps) {

  const fallbackImage = "/kerala-backwaters.png";

  return (
    <div className="relative">

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="h-96 rounded-2xl overflow-hidden relative">
          {imageUrl ? (
            <div onClick={onImageClick} className="cursor-pointer">
              <LazyImage
                src={imageUrl}
                alt={title}
                width={1200}
                height={400}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}

        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="col-span-2 h-64 rounded-2xl overflow-hidden">
          {imageUrl ? (
            <LazyImage
              src={imageUrl}
              alt={title}
              width={1200}
              height={400}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
