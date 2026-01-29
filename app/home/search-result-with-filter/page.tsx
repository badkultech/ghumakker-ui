"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card";
import { AdvancedFilters } from "@/components/search-results/advanced-filters";
import { DesktopFilterBar } from "@/components/search-results/desktop-filter-bar";
import { DesktopFilterSidebar } from "@/components/search-results/desktop-filter-sidebar";
import { MobileBottomBar } from "@/components/search-results/mobile-bottom-bar";
import NoTripsFound from "@/components/search-results/NoTripsFound";
import { useSearchPublicTripsQuery } from "@/lib/services/trip-search";
import { MainHeader } from "@/components/search-results/MainHeader";
import { userMenuItems, notificationsData } from "../constants"
import { useAuthActions } from "@/hooks/useAuthActions";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { FloatingRoleActions } from "@/components/common/FloatingRoleActions";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { SearchTripsCardMobile } from "@/components/homePage/shared/SearchTripsCardMobile";
import { FloatingCompareBadge } from "@/components/homePage/shared/FloatingCompareBadge";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { useGetMyWishlistQuery } from "@/lib/services/wishlist";
import { AuthModals } from "@/components/auth/auth/AuthModals";

const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "-D/-N";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-D/-N";

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${nights + 1}D/${nights}N`;
};

export default function SearchResultsWithFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, handleLogout } = useAuthActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);
  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
  const moodsFromUrl = searchParams.get("moods");
  const moodsAll = searchParams.getAll("moods");
  const { userData } = useSelector(selectAuthState);
  const userType = userData?.userType;
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTab, setSearchTab] =
    useState<"destination" | "moods">("destination");

  const user = isLoggedIn
    ? {
      name: userData?.firstName
        ? `${userData.firstName} ${userData.lastName ?? ""}`
        : "",
      email: userData?.email as string,
      profileImage: userData?.profileImageUrl,
    }
    : undefined;
  const organizationId = useOrganizationId();
  const userId = useUserId();

  const { data: wishlistData } = useGetMyWishlistQuery(
    { organizationId, publicId: userId }, // userId is the publicId
    { skip: !organizationId || !userId }
  );

  const wishlistTripIds = new Set(
    wishlistData?.content?.map((t) => t.publicId)
  );

  // ---------- INITIAL API CRITERIA ----------
  const [criteria, setCriteria] = useState<any>({
    month: undefined,
    year: undefined,
    destinationTags: [],
    moods: [],
  });


  useEffect(() => {
    const destination = searchParams.get("destinationTags");
    const moodsAll = searchParams.getAll("moods");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    setCriteria((prev: any) => ({
      ...prev,
      destinationTags: destination
        ? [destination.toLowerCase().replace(/\s+/g, "_")]
        : [],
      moods:
        moodsAll.length > 0
          ? moodsAll.map((m) => m.replace("-", "_").toLowerCase())
          : [],
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    }));
  }, [searchParams]);

  // ---------- UI FILTER TAGS ----------
  let parsedMoods: string[] = moodsAll;

  if (moodsAll.length === 0 && moodsFromUrl) {
    try {
      parsedMoods = JSON.parse(moodsFromUrl);
    } catch { }
  }

  const [filters, setFilters] = useState<
    { id: number; label: string }[]
  >([]);
  useEffect(() => {
    let list: { id: number; label: string }[] = [];
    let id = 1;

    searchParams.getAll("moods").forEach((m) => {
      list.push({ id: id++, label: m });
    });

    const formatFilterLabel = (value: string) => {
      return value
        .toLowerCase()
        .replace(/_/g, " ");
    };

    const destination = searchParams.get("destinationTags");
    if (destination) {
      list.push({
        id: id++,
        label: `Destination: ${formatFilterLabel(destination)}`,
      });
    }
    const year = searchParams.get("year");
    if (year) {
      list.push({ id: id++, label: `Year: ${year}` });
    }
    const month = searchParams.get("month");
    if (month) {
      list.push({ id: id++, label: `Month: ${month}` });
    }
    setFilters(list);
  }, [searchParams]);


  // ---------- API CALL ----------
  const { data, isLoading, isFetching, error } = useSearchPublicTripsQuery({
    criteria,
    pageable: { page: 0, size: 10 },
  });

  const apiTrips = data?.content || [];

  // Show skeleton when initially loading OR when refetching (e.g., filter changes)
  const isLoadingData = isLoading || isFetching;




  // ---------- ACTIONS ----------
  const removeFilter = (id: number) => {
    const filterToRemove = filters.find((f) => f.id === id);
    if (!filterToRemove) return;

    const params = new URLSearchParams(searchParams.toString());
    const label = filterToRemove.label.toLowerCase();

    // mood
    if (["adventure", "trekking", "wellness", "skygaze", "beach", "spiritual"].some(m => label.includes(m))) {
      params.delete("moods");
    }

    // destination
    if (label.startsWith("destination:")) {
      params.delete("destinationTags");
    }

    if (label.startsWith("year:")) params.delete("year");
    if (label.startsWith("month:")) params.delete("month");

    router.push(`/home/search-result-with-filter?${params.toString()}`);
  };



  const clearAllFilters = () => {
    router.push("/home/search-result-with-filter");
  };


  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [sortBy, setSortBy] = useState<string | null>(null);

  const sortLabelMap: Record<string, string> = {
    price_low: "Price Per Day: Lowest",
    price_high: "Price Per Day: Highest",
    discount: "Biggest Discount",
    popularity: "Popularity",
  };

  type SortType = "price_low" | "price_high" | "discount" | "popularity";

  return (
    <>
      <div className="min-h-screen bg-[#f5f3f0]">
        <MainHeader isLoggedIn={isLoggedIn}
          onLoginClick={() => setAuthStep("PHONE")}
          onMenuOpen={() => setIsMenuOpen(true)}
          notifications={notificationsList}
          onUpdateNotifications={setNotificationsList}
          variant="edge" />

        {/* DESKTOP FILTER BAR */}
        <DesktopFilterBar
          filters={filters}
          onRemove={removeFilter}
          onClear={clearAllFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onToggleSort={(state?: boolean) => {
            if (window.innerWidth >= 768) {
              if (typeof state === "boolean") setShowSortDropdown(state);
              else setShowSortDropdown((p) => !p);
            }
          }}
          showSortDropdown={showSortDropdown}
          onSortSelect={(type: SortType) => {
            setSortBy(type);
            setShowSortDropdown(false);
          }}
          selectedSortLabel={sortBy ? sortLabelMap[sortBy] : "Sort By"}
        />

        <main className="max-w-[1400px] bg-white mx-auto px-4 md:px-8 py-6">
          <div className="flex gap-6 ">
            {/* DESKTOP SIDEBAR */}
            <DesktopFilterSidebar
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              onApply={(data: any) => {
                const params = new URLSearchParams();
                data.moods?.forEach((m: string) =>
                  params.append("moods", m.toLowerCase().replace(/\s+/g, "_"))
                );
                data.destinations?.forEach((d: string) =>
                  params.append("destinationTags", d.toLowerCase().replace(/\s+/g, "_"))
                );
                if (data.duration === "3-5 Days") {
                  params.set("minDays", "3");
                  params.set("maxDays", "5");
                }
                if (data.duration === "6-7 Days") {
                  params.set("minDays", "6");
                  params.set("maxDays", "7");
                }
                if (data.duration === "7+ Days") {
                  params.set("minDays", "7");
                }
                if (data.minBudget) params.set("minBudget", String(data.minBudget));
                if (data.maxBudget) params.set("maxBudget", String(data.maxBudget));
                router.push(`/home/search-result-with-filter?${params.toString()}`);
                setShowFilters(false);
              }}

            />

            {/* RESULTS */}
            <div className="flex-1 ">
              {isLoadingData && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-[#eaeaea] flex flex-col">
                      {/* Image skeleton */}
                      <div className="relative h-40 md:h-52 w-full bg-gray-200 animate-pulse" />

                      {/* Content skeleton */}
                      <div className="p-4 flex flex-col gap-3">
                        {/* Title & Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="h-6 bg-gray-200 rounded animate-pulse flex-1" />
                          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Organizer */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                        </div>

                        {/* Footer */}
                        <div className="flex items-end justify-between mt-3">
                          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="text-red-500">Failed to load trips</p>
              )}

              {!isLoadingData && apiTrips.length === 0 && <NoTripsFound />}

              {!isLoadingData && apiTrips.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {apiTrips.map((trip: any) => (
                    <SearchResultsTripCard
                      key={trip.publicId}
                      id={trip.publicId}
                      title={trip.name}
                      provider={trip.organizerName || "—"}
                      route={
                        trip.startPoint && trip.endPoint
                          ? `${trip.startPoint} → ${trip.endPoint}`
                          : undefined
                      }
                      location={
                        trip.cityTags?.join(", ") ||
                        trip.destinationTags?.join(", ") ||
                        "—"
                      }
                      rating={trip.rating || 4.5}
                      days={calculateDuration(trip.startDate, trip.endDate)}
                      dates={`${trip.startDate} — ${trip.endDate}`}
                      price={trip.startingFrom || 0}
                      image={
                        trip.document?.url ||
                        "/hampi-ruins-temples.png"
                      }

                      badges={[
                        ...(trip.moodTags || []),
                        ...(trip.destinationTags || []),
                      ]}
                      organizationId={organizationId}
                      userId={userId}
                      isWishlistPage={false}
                      isFavorite={wishlistTripIds.has(trip.publicId)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* MOBILE BOTTOM BAR */}
        <MobileBottomBar
          onSort={() => {
            setShowFilters(false);
            setShowSortDropdown(true);
          }}
          onFilters={() => setShowFilters(true)}
          sortLabel={sortBy ? sortLabelMap[sortBy] : "Sort By"}
        />

        {/* MOBILE FILTER PANEL */}
        <div className="md:hidden">
          <AdvancedFilters
            isOpen={showFilters}
            isMobile={true}
            onClose={() => setShowFilters(false)}
            onApplyFilters={(data: any) => {
              setCriteria((prev: any) => ({
                ...prev,
                moods: data.moods?.map((m: string) =>
                  m.replace(/\s+/g, "_")
                ) || [],
                destinationTags: data.destinations?.map((d: string) =>
                  d.replace(/\s+/g, "_")
                ) || [],

                ...(data.duration === "3-5 Days" && { minDays: 3, maxDays: 5 }),
                ...(data.duration === "6-7 Days" && { minDays: 6, maxDays: 7 }),
                ...(data.duration === "7+ Days" && { minDays: 7 }),
                ...(data.minAge && { minAge: Number(data.minAge) }),
                ...(data.maxAge && { maxAge: Number(data.maxAge) }),
                ...(data.minBudget && data.minBudget > 0 && { minBudget: Number(data.minBudget) }),
                ...(data.maxBudget && data.maxBudget > 0 && { maxBudget: Number(data.maxBudget) }),
              }));

              setShowFilters(false);
            }}

          />
        </div>

        <div className="h-16 md:hidden" />
      </div>
      {/* MOBILE SORT SHEET */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-50 flex items-end md:hidden"
          onClick={() => setShowSortDropdown(false)}
        >
          <div
            className="bg-white w-full rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold mb-3">Sort By</p>

            <button
              onClick={() => { setSortBy("price_low"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Price Per Day: Lowest
            </button>

            <button
              onClick={() => { setSortBy("price_high"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Price Per Day: Highest
            </button>

            <button
              onClick={() => { setSortBy("discount"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Biggest Discount
            </button>

            <button
              onClick={() => { setSortBy("popularity"); setShowSortDropdown(false); }}
              className="w-full text-left py-3"
            >
              Popularity
            </button>
          </div>
        </div>
      )}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userMenuItems={userMenuItems}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        user={user}
      />
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
        <div className="block lg:hidden w-[85vw] max-w-[360px]">
          <SearchTripsCardMobile
            defaultTab={searchTab}
            onClose={() => setShowSearchOverlay(false)}
            className="shadow-none border-none p-1"
          />
        </div>
        <div className="hidden lg:block">
          <SearchTripsCard defaultTab={searchTab}
            onClose={() => setShowSearchOverlay(false)} />
        </div>
      </Overlay>
      <FloatingCompareBadge />
      <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
    </>
  );
}
