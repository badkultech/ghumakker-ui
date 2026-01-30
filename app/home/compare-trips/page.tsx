"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useTripDetailsQuery } from "@/lib/services/trip-search";
import { Star, X, Scale, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { clearCompare, removeFromCompare } from "@/lib/slices/compareSlice";
import { useRouter } from "next/navigation";
import { MainHeader } from "@/components/search-results/MainHeader";
import { useAuthActions } from "@/hooks/useAuthActions";
import { notificationsData, userMenuItems } from "../constants";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { AuthModals } from "@/components/auth/auth/AuthModals";
import { selectAuthState } from "@/lib/slices/auth";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { SearchTripsCardMobile } from "@/components/homePage/shared/SearchTripsCardMobile";
import { FloatingRoleActions } from "@/components/common/FloatingRoleActions";

interface TripData {
    id: string;
    name: string;
    organiser: string;
    organiserAvatar: string;
    region: string;
    route: string;
    duration: string;
    travelDates: string;
    moods: string[];
    rating: number;
    avgGroupSize: string;
    startingPrice: number;
    image: string;
}

const attributes = [
    { key: "image", label: "" },
    { key: "name", label: "Name" },
    { key: "organiser", label: "Organiser" },
    { key: "region", label: "Region" },
    { key: "route", label: "Route" },
    { key: "duration", label: "Duration" },
    { key: "travelDates", label: "Travel Dates" },
    { key: "moods", label: "Moods" },
    { key: "rating", label: "Rating" },
    { key: "avgGroupSize", label: "Avg. Group Size" },
    { key: "startingPrice", label: "Starting Price" },
    { key: "bookNow", label: "Book Now" },
];


export default function CompareTripsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoggedIn, handleLogout } = useAuthActions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notificationsList, setNotificationsList] = useState(notificationsData);
    const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const onLogout = () => {
        handleLogout(() => setIsMenuOpen(false));
    };
    const { userData } = useSelector(selectAuthState);
    const userType = userData?.userType;
    const user = isLoggedIn
        ? {
            name: userData?.firstName
                ? `${userData.firstName} ${userData.lastName ?? ""}`
                : "",
            email: userData?.email as string,
            profileImage: userData?.profileImageUrl,
        }
        : undefined;

    /** ✅ get compare items (objects) */
    const compareItems = useSelector(
        (state: RootState) => state.compare.items
    );

    /** ✅ max 3 queries (RTK rule safe) */
    const q1 = useTripDetailsQuery(compareItems[0]?.id!, {
        skip: !compareItems[0],
    });

    const q2 = useTripDetailsQuery(compareItems[1]?.id!, {
        skip: !compareItems[1],
    });

    const q3 = useTripDetailsQuery(compareItems[2]?.id!, {
        skip: !compareItems[2],
    });

    const isLoading = q1.isLoading || q2.isLoading || q3.isLoading;

    const tripsFromApi = [q1.data, q2.data, q3.data].filter(Boolean);

    const getStartingPrice = (pricing: any): number => {
        // ✅ SIMPLE PRICING (as it is)
        if (pricing?.simplePricingRequest?.basePrice) {
            return pricing.simplePricingRequest.basePrice;
        }

        // ✅ DYNAMIC PRICING → sum of minimum of each category
        if (pricing?.dynamicPricingRequest?.pricingCategoryDtos) {
            return pricing.dynamicPricingRequest.pricingCategoryDtos.reduce(
                (total: number, category: any) => {
                    const optionPrices =
                        category.pricingCategoryOptionDTOs?.map((opt: any) => opt.price) || [];

                    if (optionPrices.length === 0) return total;

                    const minPriceOfCategory = Math.min(...optionPrices);
                    return total + minPriceOfCategory;
                },
                0
            );
        }

        return 0;
    };



    const tripsToCompare: TripData[] = tripsFromApi.map((payload: any) => {
        const trip = payload.tripResponse;
        const itinerary = payload.tripItineraryResponse;
        const organizer = payload.organizerProfileResponse;

        return {
            id: trip.publicId,
            name: trip.name,
            organiser: organizer?.organizerName || "-",
            organiserAvatar: organizer?.displayPicture?.url || "",
            region: trip.cityTags?.[0] || "-",
            route: `${itinerary?.startPoint} → ${itinerary?.endPoint}`,
            duration: `${itinerary?.totalDays}D/${itinerary?.totalDays - 1}N`,
            travelDates: `${trip.startDate} - ${trip.endDate}`,
            moods: trip.moodTags || [],
            rating: trip.rating || 4.5,
            avgGroupSize: `${trip.minGroupSize}-${trip.maxGroupSize}`,
            startingPrice: getStartingPrice(payload.tripPricingDTO),
            image: payload.images?.[0]?.url || "/placeholder.svg",
        };
    });

    return (
        <div className="min-h-screen bg-background">
            <MainHeader
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setAuthStep("PHONE")}
                onMenuOpen={() => setIsMenuOpen(true)}
                notifications={notificationsList}
                onUpdateNotifications={setNotificationsList}
                variant="center"
            />

            <main className="max-w-6xl mx-auto p-4 md:p-6 overflow-x-auto">
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : tripsToCompare.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Scale className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips to compare</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Add trips to your comparison list to see how they stack up against each other.
                        </p>
                        <button
                            onClick={() => router.push("/home/search-result-with-filter")}
                            className="flex items-center gap-2 px-6 py-3 bg-[#FF804C] text-white rounded-full hover:bg-[#e67344] transition-colors font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Trips to Compare
                        </button>
                    </div>
                ) : (
                    <div className="min-w-[600px]">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th className="text-left py-4 px-4 bg-[#F7F7F7] rounded-tl-xl font-medium text-black text-sm w-[160px]">
                                        Attribute
                                    </th>

                                    {tripsToCompare.map((trip) => (
                                        <th
                                            key={trip.id}
                                            className="py-4 px-4 bg-muted/30 last:rounded-tr-xl"
                                        >
                                            <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                                                <Image
                                                    src={trip.image}
                                                    alt={trip.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => dispatch(removeFromCompare(trip.id))}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                                                    aria-label="Remove from comparison"
                                                >
                                                    <X className="w-5 h-5 text-gray-700" />
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {attributes.map((attr, rowIndex) => (
                                    <tr key={attr.key}>
                                        <td
                                            className={`py-4 px-4 font-medium text-black text-sm w-[160px] bg-[#F7F7F7]
                      ${rowIndex !== attributes.length - 1
                                                    ? "border-b border-gray-300"
                                                    : ""
                                                }`}
                                        >
                                            {attr.label}
                                        </td>

                                        {tripsToCompare.map((trip) => (
                                            <td
                                                key={trip.id}
                                                className={`py-4 px-4 text-sm
                        ${rowIndex !== attributes.length - 1
                                                        ? "border-b border-gray-200"
                                                        : ""
                                                    }`}
                                            >
                                                {attr.key === "name" && trip.name}

                                                {attr.key === "organiser" && (
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage src={trip.organiserAvatar} />
                                                            <AvatarFallback>OR</AvatarFallback>
                                                        </Avatar>
                                                        <span>{trip.organiser}</span>
                                                    </div>
                                                )}

                                                {attr.key === "region" && trip.region}
                                                {attr.key === "route" && trip.route}
                                                {attr.key === "duration" && trip.duration}
                                                {attr.key === "travelDates" && trip.travelDates}
                                                {attr.key === "moods" && trip.moods.join(", ")}

                                                {attr.key === "rating" && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span className="font-medium">{trip.rating}</span>
                                                    </div>
                                                )}

                                                {attr.key === "avgGroupSize" && trip.avgGroupSize}

                                                {attr.key === "startingPrice" && (
                                                    <span className="font-bold">
                                                        ₹{Math.round(trip.startingPrice).toLocaleString()}
                                                    </span>
                                                )}

                                                {attr.key === "bookNow" && (
                                                    <button className="w-full px-6 py-2.5 bg-[#FF804C] text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
                                                        Book Now
                                                    </button>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <SidebarMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                userMenuItems={userMenuItems}
                onLogout={onLogout}
                isLoggedIn={isLoggedIn}
                user={user}
            />
            <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
            <FloatingRoleActions
                isLoggedIn={isLoggedIn}
                userType={userType}
                hiddenActions={["PUBLISH", "EDIT"]}
                onModifySearch={() => {
                    setShowSearchOverlay(true);
                }}
            />
            <Overlay
                open={showSearchOverlay}
                onClose={() => setShowSearchOverlay(false)}
            >
                <div className="hidden lg:block">
                    <SearchTripsCard onClose={() => setShowSearchOverlay(false)} />
                </div>
                <div className="block lg:hidden w-[85vw] max-w-[360px]">
                    <SearchTripsCardMobile
                        onClose={() => setShowSearchOverlay(false)}
                        className="shadow-none border-none"
                    />
                </div>
            </Overlay>

        </div>
    );
}
