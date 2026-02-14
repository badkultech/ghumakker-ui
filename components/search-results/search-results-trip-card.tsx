"use client"

import Image from "next/image"
import { Heart, MapPin, Calendar, Clock, Users, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { moodMap } from "@/components/search-results/mood-tag"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/slices/store"
import { addToCompare, removeFromCompare } from "@/lib/slices/compareSlice"
import { useAddTripToWishlistMutation, useRemoveTripFromWishlistMutation } from "@/lib/services/wishlist"
import { useRouter } from "next/navigation"
import ScreenLoader from "@/components/common/ScreenLoader"

interface SearchResultsTripCardProps {
  id: string
  title: string
  provider: string
  location: string
  subLocation?: string
  rating: number | null
  days: string
  dates: string
  price: number | null
  badges: string[]
  image: string
  isFavorite?: boolean
  organizationId?: string
  userId?: string
  route?: string
  isWishlistPage?: boolean
  onRemoveFromWishlist?: () => void
}

export function SearchResultsTripCard({
  title,
  provider,
  location,
  subLocation,
  rating,
  days,
  dates,
  price,
  badges,
  image,
  isWishlistPage,
  route,
  id,
  isFavorite = false,
  organizationId,
  userId,
  onRemoveFromWishlist,
}: SearchResultsTripCardProps) {

  const [favorite, setFavorite] = useState(isFavorite)
  const [addToWishlist] = useAddTripToWishlistMutation()
  const [removeFromWishlist] = useRemoveTripFromWishlistMutation()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setFavorite(isFavorite)
  }, [isFavorite])
  const [showAllLocations, setShowAllLocations] = useState(false);
  const locationList = location
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const MAX_VISIBLE = 3;

  const visibleLocations = showAllLocations
    ? locationList
    : locationList.slice(0, MAX_VISIBLE);

  const remainingCount = locationList.length - MAX_VISIBLE;
  const dispatch = useDispatch()
  const router = useRouter()

  const compareTripIds = useSelector(
    (state: RootState) => state.compare.items
  )

  const isCompared = compareTripIds.some(item => item.id === id);
  const isCompareDisabled = !isCompared && compareTripIds.length >= 3



  const handleCompare = (e: React.MouseEvent, tripId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCompared) {
      dispatch(removeFromCompare(tripId))
    } else {
      dispatch(
        addToCompare({
          id,
          image,
        })
      );

    }
  }

  const handleCardClick = () => {
    setIsNavigating(true);
  }

  return (
    <>
      {isNavigating && <ScreenLoader />}
      <Link
        href={`/home/search-result-with-filter/trip-details/${id}`}
        onClick={handleCardClick}
      >
        <div className="bg-white rounded-[20px] overflow-hidden border border-[#eaeaea] hover:shadow-xl transition-all duration-300 cursor-pointer group  flex flex-col">

          {/* Image Section */}
          <div className="relative h-40 md:h-52 w-full shrink-0">
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />

            {/* Overlay Gradient for consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />

            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {badges.map((badge, index) => {
                const normalizedKey = Object.keys(moodMap).find(
                  (key) => key.toLowerCase() === badge.toLowerCase()
                );
                const mood = normalizedKey ? moodMap[normalizedKey] : {};
                const Icon = (mood as any).icon;
                const colors = (mood as any).colors || {
                  bg: "white",
                  border: "#FFA77C",
                  text: "#FFA77C",
                };

                // Override colors to match screenshot: White bg, Orange text/icon
                const displayLabel = normalizedKey || badge;
                return (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 border leading-none"
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    {Icon && (
                      <Icon
                        className="w-[11px] h-[11px]"
                        color={colors.text}
                        fill={colors.text}
                        stroke={colors.text}
                      />
                    )}
                    <span className="capitalize">{displayLabel}</span>
                  </span>
                );
              })}
            </div>

            {/* Favorite Button */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!organizationId || !userId) {
                  router.push("/login");
                  return;
                }

                try {
                  if (!favorite) {
                    // Add to wishlist
                    await addToWishlist({
                      organizationId,
                      userId,
                      tripId: id,
                    }).unwrap();
                    setFavorite(true);
                  } else {
                    // Remove from wishlist
                    await removeFromWishlist({
                      organizationId,
                      userId,
                      tripId: id,
                    }).unwrap();
                    setFavorite(false);

                    // If on wishlist page, trigger removal callback
                    if (isWishlistPage) {
                      onRemoveFromWishlist?.();
                    }
                  }
                } catch (err) {
                  console.error("Wishlist toggle failed", err);
                  // Revert optimistic update on error
                  setFavorite(!favorite);
                }
              }}
              className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm z-10"
            >



              <Heart
                className={`w-5 h-5 transition-colors ${favorite ? "fill-[#FF5F5E] text-[#FF5F5E]" : "text-black"
                  }`}
              />
            </button>

          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">

            {/* Title & Rating */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 basis-[80%]">
                {title}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 bg-[#F3F4F6] px-2 py-1 rounded-[6px] shrink-0">
                  <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                  <span className="text-sm font-bold text-gray-800">{rating}</span>
                </div>
              )}
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-2 mb-4">
              {/* Placeholder Avatar */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative border border-gray-100 shrink-0 flex items-center justify-center">
                <Image
                  src="/adventure-traveler-in-nature.jpg"
                  alt={provider}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const fallback = document.createElement('span');
                      fallback.className = 'fallback-text text-[8px] text-gray-500 font-medium';
                      fallback.textContent = 'No Image';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 font-medium truncate">{provider}</span>
            </div>

            <div className="border-t border-dashed border-gray-200 my-1"></div>

            {/* Details List */}
            <div className="flex flex-col gap-2.5 mt-3 mb-3">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#FF804C]" strokeWidth={1.5} />
                </div>
                <div className="text-[13px] text-gray-700 font-medium leading-snug">
                  {visibleLocations.join(", ")}
                  {!showAllLocations && remainingCount > 0 && (
                    <span
                      onClick={(e) => {
                        e.preventDefault();   // 🔑 THIS STOPS LINK NAVIGATION
                        e.stopPropagation();
                        setShowAllLocations(true);
                      }}
                      className="ml-1 text-[#e07a5f] cursor-pointer whitespace-nowrap"
                    >
                      +{remainingCount} more
                    </span>
                  )}

                  {showAllLocations && locationList.length > MAX_VISIBLE && (
                    <span
                      onClick={(e) => {
                        e.preventDefault();   // 🔑 THIS STOPS LINK NAVIGATION
                        e.stopPropagation();
                        setShowAllLocations(false);
                      }}
                      className="ml-1 text-[#e07a5f] cursor-pointer whitespace-nowrap"
                    >
                      show less
                    </span>
                  )}
                  {subLocation && (
                    <span className="text-[#FF804C]">, {subLocation}</span>
                  )}
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.69922 12.7H10.8242C11.5204 12.7 12.1881 12.4234 12.6804 11.9311C13.1727 11.4388 13.4492 10.7711 13.4492 10.075C13.4492 9.37876 13.1727 8.71108 12.6804 8.2188C12.1881 7.72651 11.5204 7.44995 10.8242 7.44995H4.82422C4.12803 7.44995 3.46035 7.17339 2.96806 6.68111C2.47578 6.18882 2.19922 5.52114 2.19922 4.82495C2.19922 4.12876 2.47578 3.46108 2.96806 2.9688C3.46035 2.47651 4.12803 2.19995 4.82422 2.19995H8.19922M0.699219 12.7C0.699219 13.0978 0.857254 13.4793 1.13856 13.7606C1.41986 14.0419 1.80139 14.2 2.19922 14.2C2.59704 14.2 2.97857 14.0419 3.25988 13.7606C3.54118 13.4793 3.69922 13.0978 3.69922 12.7C3.69922 12.3021 3.54118 11.9206 3.25988 11.6393C2.97857 11.358 2.59704 11.2 2.19922 11.2C1.80139 11.2 1.41986 11.358 1.13856 11.6393C0.857254 11.9206 0.699219 12.3021 0.699219 12.7ZM12.6992 3.69995C13.097 3.69995 13.4786 3.54192 13.7599 3.26061C14.0412 2.97931 14.1992 2.59778 14.1992 2.19995C14.1992 1.80213 14.0412 1.4206 13.7599 1.13929C13.4786 0.857986 13.097 0.699951 12.6992 0.699951C12.3014 0.699951 11.9199 0.857986 11.6386 1.13929C11.3573 1.4206 11.1992 1.80213 11.1992 2.19995C11.1992 2.59778 11.3573 2.97931 11.6386 3.26061C11.9199 3.54192 12.3014 3.69995 12.6992 3.69995Z"
                      stroke="#FF804C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                </div>

                <span className="text-[13px] text-gray-700 font-medium">
                  {route || "__ → __"}
                </span>
              </div>


              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Clock className="w-4 h-4 text-[#FF804C]" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] text-gray-700 font-medium">{days}</span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Calendar className="w-4 h-4 text-[#FF804C]" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] text-gray-700 font-medium">{dates}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-auto mb-3"></div>

            {/* Footer: Price & Action */}
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-medium mb-[-2px]">Starting from</span>
                {price ? (
                  <h4 className="text-xl font-bold text-gray-900">₹{Math.round(price).toLocaleString()}</h4>
                ) : (
                  <span className="text-lg font-bold text-gray-900">Coming Soon</span>
                )}
              </div>

              <button
                onClick={(e) => handleCompare(e, id)}
                disabled={isCompareDisabled}
                className={`
                 group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border
                 ${isCompared
                    ? "bg-[#FF804C] border-[#FF804C] text-white shadow-md shadow-orange-100"
                    : "bg-white border-[#FF804C] text-[#FF804C] hover:bg-[#FFF5F0]"
                  }
                 ${isCompareDisabled ? "opacity-50 cursor-not-allowed" : ""}
               `}
              >
                {/* Custom Compare Icon from SVG */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-colors duration-200 ${isCompared ? "stroke-white" : "stroke-[#FF804C] group-hover:stroke-[#FF6b3d]"}`}
                >
                  <path
                    d="M8.5 2.66667H2.66667C2.22464 2.66667 1.80072 2.84226 1.48816 3.15482C1.17559 3.46738 1 3.89131 1 4.33333V14.3333C1 14.7754 1.17559 15.1993 1.48816 15.5118C1.80072 15.8244 2.22464 16 2.66667 16H8.5M11.8333 2.66667H12.6667C13.1087 2.66667 13.5326 2.84226 13.8452 3.15482C14.1577 3.46738 14.3333 3.89131 14.3333 4.33333V5.16667M14.3333 13.5V14.3333C14.3333 14.7754 14.1577 15.1993 13.8452 15.5118C13.5326 15.8244 13.1087 16 12.6667 16H11.8333M14.3333 8.5V10.1667M7.66667 1V17.6667"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isCompared ? "Added" : "Compare"}
              </button>
            </div>

          </div>
        </div>
      </Link>
    </>
  )
}
