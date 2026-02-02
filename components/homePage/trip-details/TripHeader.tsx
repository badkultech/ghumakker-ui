import {
  Bookmark,
  Heart,
  Share2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoodTag } from "@/components/search-results/mood-tag";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface TripHeaderProps {
  onOpenOrganizer: () => void;
  onOpenLeader: () => void;
  onOpenInviteFriends: () => void;
  moods?: string[];
  tripTitle?: string;
  isLoggedIn?: boolean;
  providerName?: string;
  providerImage?: string | null;
  organizerName?: string;
  organizerImage?: string | null;
  cities?: string[];
  isFavorite?: boolean;
  onToggleWishlist?: () => void;
}

function normalizeMood(mood: string) {
  switch (mood.toLowerCase()) {
    case "beach":
      return "Beach";
    case "wellness":
      return "Wellness";
    case "women-only":
      return "Women-Only";
    case "adventure":
      return "Adventure";
    case "camping":
      return "Camping";
    case "heritage":
      return "Heritage";
    case "weekends":
      return "Weekends";
    case "parties":
      return "Parties";
    case "learning":
      return "Learning";
    case "spiritual":
      return "Spiritual";
    case "mountain":
      return "Mountain";
    default:
      return mood.charAt(0).toUpperCase() + mood.slice(1);
  }
}

function formatCity(city: string) {
  return city
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TripHeader({
  onOpenOrganizer,
  onOpenInviteFriends,
  onOpenLeader,
  moods = [],
  tripTitle = TRIP_DETAILS.HEADER.TRIP_TITLE_DEFAULT,
  isLoggedIn,
  providerName = TRIP_DETAILS.HEADER.PROVIDER_DEFAULT,
  providerImage,
  organizerName = TRIP_DETAILS.HEADER.ORGANIZER_DEFAULT,
  organizerImage,
  cities = [],
  isFavorite = false,
  onToggleWishlist,
}: TripHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-white p-4 border">

      <div className="flex-1">

        {/* moods */}
        <div className="flex flex-wrap gap-2 mb-3">
          {moods.map((mood) => {
            const normalized = normalizeMood(mood);
            return (
              <MoodTag
                key={normalized}
                name={normalized}
                icon={normalized}
                isActive
              />
            );
          })}
        </div>
        {/* 👇 mobile icons here */}
        <div className="flex gap-3 mb-3 md:hidden">
          {[Bookmark, Heart, Share2].map((Icon, i) => {
            const isShare = Icon === Share2;
            const isHeart = Icon === Heart;

            return (
              <button
                key={i}
                onClick={isShare ? onOpenInviteFriends : isHeart ? onToggleWishlist : undefined}
                className="p-2 rounded-full border cursor-pointer"
              >
                <Icon
                  className={`w-5 h-5 ${isHeart && isFavorite ? 'fill-[#FF5F5E] text-[#FF5F5E]' : ''}`}
                />
              </button>
            );
          })}
        </div>


        {/* title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {tripTitle}
        </h1>

        {/* provider + organizer */}
        <div className="flex items-center justify-between gap-6 mb-4 pb-4 border-b">

          {/* PROVIDER */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              {providerImage && (
                <AvatarImage src={providerImage} alt={providerName} />
              )}
              <AvatarFallback className="bg-green-500 text-white">
                {providerName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{providerName}</p>
              <button
                onClick={onOpenOrganizer}
                className="text-xs text-orange-500 cursor-pointer "
              >
                {TRIP_DETAILS.HEADER.MORE_DETAILS}{" "}
                <ArrowRight className="inline w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ORGANIZER / LEADER */}
          <div className="flex items-center gap-3 mr-4">
            <Avatar className="w-12 h-12">
              {organizerImage && (
                <AvatarImage src={organizerImage} alt={organizerName} />
              )}
              <AvatarFallback className="bg-blue-500 text-white">
                {organizerName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{organizerName}</p>
              <button
                onClick={onOpenLeader}
                className="text-xs text-orange-500 cursor-pointer"
              >
                {TRIP_DETAILS.HEADER.VIEW_PROFILE}{" "}
                <ArrowRight className="inline w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* cities */}
        <div className="flex flex-wrap gap-3 text-sm text-orange-500">
          {cities.map((city) => (
            <span
              key={city}
              className="flex bg-[#FFF7F4] rounded-full items-center gap-1 px-3 py-1.5"
            >
              <MapPin className="w-4 h-4" />
              {formatCity(city)}
            </span>
          ))}
        </div>
      </div>

      {/* action icons */}
      <div className="hidden md:flex md:mt-12 md:mr-4 gap-2">
        {isLoggedIn && (
          <>
            
            <button
              onClick={onToggleWishlist}
              className="p-2 rounded-full border hover:text-gray-600"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#FF5F5E] text-[#FF5F5E]' : ''}`} />
            </button>
          </>
        )}

        <button
          onClick={onOpenInviteFriends}
          className="p-2 rounded-full border hover:text-gray-600"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>


    </div>
  );
}
