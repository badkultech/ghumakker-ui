"use client"

import { useEffect } from "react"
import { Heart } from "lucide-react"
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card"
import { useGetMyWishlistQuery, useRemoveTripFromWishlistMutation } from "@/lib/services/wishlist"
import { WishlistTrip } from "@/lib/services/wishlist/types"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useUserId } from "@/hooks/useUserId"
import { useAuthActions } from "@/hooks/useAuthActions"
import { FloatingCompareBadge } from "@/components/homePage/shared/FloatingCompareBadge";
import { useHomeLayout } from "../HomeLayoutContext"
import { Footer } from "@/components/search-results/footer"

export default function WishlistPage() {
    const organizationId = useOrganizationId();
    const userId = useUserId();
    const { isLoggedIn } = useAuthActions();
    const { openLoginModal } = useHomeLayout();

    // All hooks must be at top level
    const { data, isLoading, error } = useGetMyWishlistQuery(
        { organizationId, publicId: userId },
        { skip: !organizationId || !userId }
    );
    const [removeTrip] = useRemoveTripFromWishlistMutation();

    // Open login modal if not logged in
    useEffect(() => {
        if (!isLoggedIn) openLoginModal();
    }, [isLoggedIn]);

    const handleRemoveFromWishlist = async (tripId: string) => {
        if (!organizationId || !userId) return;
        try {
            await removeTrip({ organizationId, userId, tripId }).unwrap();
        } catch (err) {
            console.error("Failed to remove trip from wishlist:", err);
        }
    };

    // Loading skeleton
    if (!organizationId || !userId || isLoading) {
        return (
            <div className="bg-background">
                <main className="max-w-6xl mx-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-[#eaeaea] animate-pulse">
                                <div className="h-52 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background">
                <main className="max-w-6xl mx-auto p-4 md:p-6">
                    <p className="text-red-500 text-center">Failed to load wishlist</p>
                </main>
            </div>
        );
    }

    const wishlistTrips = data?.content || [];

    return (
        <div className="bg-background">
            <main className="max-w-6xl mx-auto p-4 md:p-6">
                {wishlistTrips.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500">Start adding trips to your wishlist to see them here!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {wishlistTrips.map((trip: WishlistTrip) => {
                            const calculateDuration = (startDate: string, endDate: string) => {
                                if (!startDate || !endDate) return "-D/-N";
                                const start = new Date(startDate);
                                const end = new Date(endDate);
                                if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-D/-N";
                                const nights = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                return `${nights + 1}D/${nights}N`;
                            };

                            return (
                                <SearchResultsTripCard
                                    key={trip.tripId}
                                    id={trip.publicId}
                                    title={trip.name}
                                    provider={trip.organizerName || "—"}
                                    location={trip.cityTags?.join(", ") || "—"}
                                    rating={null}
                                    days={calculateDuration(trip.startDate, trip.endDate)}
                                    dates={`${trip.startDate} — ${trip.endDate}`}
                                    price={trip.startingFrom || null}
                                    badges={trip.moodTags || []}
                                    image={trip.document?.url || "/hampi-ruins-temples.png"}
                                    route={trip.startPoint && trip.endPoint ? `${trip.startPoint} → ${trip.endPoint}` : undefined}
                                    isFavorite={true}
                                    organizationId={organizationId}
                                    userId={userId}
                                    isWishlistPage={true}
                                    onRemoveFromWishlist={() => handleRemoveFromWishlist(trip.publicId)}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
            <FloatingCompareBadge />
            <Footer />
        </div>
    )
}
