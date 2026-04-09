"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Flag } from "lucide-react";
import HeroSection from "@/components/homePage/trip-details/HeroSection";
import TripHeader from "@/components/homePage/trip-details/TripHeader";
import TripInfoCards from "@/components/homePage/trip-details/TripInfoCards";
import TripHighlights from "@/components/homePage/trip-details/TripHighlights";
import DayWiseItinerary from "@/components/homePage/trip-details/DayWiseItinerary";
import ExcludedSection from "@/components/homePage/trip-details/ExcludedSection";
import FAQSection from "@/components/homePage/trip-details/FAQSection";
import DesktopSidebar from "@/components/homePage/trip-details/DesktopSidebar";
import MobilePricingBar from "@/components/homePage/trip-details/MobilePricingBar";
import PricingDetailsModal from "@/components/homePage/trip-details/modal/PricingDetailsModal";
import ReportModal from "@/components/homePage/trip-details/modal/ReportModal";
import AskQuestionModal from "@/components/homePage/trip-details/modal/AskQuestionModal";
import LeaderProfileModal from "@/components/homePage/trip-details/modal/LeaderProfileModal";
import MobilePricingModal from "@/components/homePage/trip-details/modal/MobilePricingModal";
import { useTripDetailsQuery } from "@/lib/services/trip-search";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import OrganizerProfileModal from "@/components/homePage/trip-details/modal/OrganizerProfileModal";
import InviteFriendsModal from "@/components/homePage/trip-details/modal/InviteFriendsModal";
import SendInvitationModal from "@/components/homePage/trip-details/modal/SendInvitationModal";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { FullImageGalleryModal } from "@/components/library/FullImageGalleryModal";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { FloatingRoleActions } from "@/components/common/FloatingRoleActions";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { useRouter } from "next/navigation";
import ScreenLoader from "@/components/common/ScreenLoader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { useCheckTripInWishlistQuery, useAddTripToWishlistMutation, useRemoveTripFromWishlistMutation } from "@/lib/services/wishlist";
import { useUpdateTripStatusMutation } from "@/lib/services/organizer/trip/my-trips";
import { useToast } from "@/hooks/use-toast";
import { useHomeLayout } from "@/app/home/HomeLayoutContext";
import { Footer } from "@/components/search-results/footer";


export default function TripDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  type SelectedPricing = {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
    numTravelers: number;
    mode: "BOOK" | "INVITE";
  };


  const [activeDay, setActiveDay] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [showMobilePricing, setShowMobilePricing] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<SelectedPricing>({
    options: {},
    addOns: [],
    finalPrice: 0,
    numTravelers: 1,
    mode: "BOOK",
  });
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showSendInvitation, setShowSendInvitation] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const { isLoggedIn } = useAuthActions();
  const { openLoginModal } = useHomeLayout();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<{ url: string }[]>([]);
  const { userData } = useSelector(selectAuthState);
  const userType = userData?.userType;
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTab, setSearchTab] =
    useState<"destination" | "moods">("destination");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);



  const organizationId = useOrganizationId();
  const userId = useUserId();
  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      setPendingAction(() => action);
      openLoginModal();
    } else {
      action();
    }
  };
  const { data, isLoading, error, refetch } = useTripDetailsQuery(id as string);
  const [updateTripStatus, { isLoading: isPublishing }] = useUpdateTripStatusMutation();
  const { toast } = useToast();

  // Check if trip is in wishlist
  const { data: isInWishlist } = useCheckTripInWishlistQuery(
    { organizationId, userId, tripId: id as string },
    { skip: !organizationId || !userId || !id }
  );

  const [addToWishlist] = useAddTripToWishlistMutation();
  const [removeFromWishlist] = useRemoveTripFromWishlistMutation();
  const [isFavorite, setIsFavorite] = useState(isInWishlist || false);

  // Update favorite state when API response changes
  useEffect(() => {
    if (isInWishlist !== undefined) {
      setIsFavorite(isInWishlist);
    }
  }, [isInWishlist]);

  // Execute pending action after login
  useEffect(() => {
    if (isLoggedIn && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [isLoggedIn, pendingAction]);

  const handleWishlistToggle = async () => {
    if (!organizationId || !userId) {
      openLoginModal();
      return;
    }

    try {
      if (!isFavorite) {
        await addToWishlist({
          organizationId,
          userId,
          tripId: id as string,
        }).unwrap();
        setIsFavorite(true);
      } else {
        await removeFromWishlist({
          organizationId,
          userId,
          tripId: id as string,
        }).unwrap();
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
      // Revert on error
      setIsFavorite(!isFavorite);
    }
  };

  const [isPublished, setIsPublished] = useState(false);

  const handlePublishTrip = async () => {
    if (!organizationId || !id) {
      toast({
        title: "Error",
        description: "Missing organization or trip information",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateTripStatus({
        organizationId,
        tripId: id as string,
        status: "PUBLISHED"
      }).unwrap();

      setIsPublished(true); // ✅ Immediately disable button after success

      toast({
        title: "Success",
        description: "Trip published successfully!",
      });

      // Re-fetch trip data to update tripStatus without page reload
      await refetch();
      setIsPublished(false); // Reset — tripStatus from API now drives the disabled state
    } catch (err: any) {
      console.error("Failed to publish trip:", err);
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to publish trip. Please try again.",
        variant: "destructive",
      });
    }
  };


  if (isLoading) {
    return <ScreenLoader />;
  }

  const payload = data;
  const trip = payload.tripResponse;
  const itinerary = payload.tripItineraryResponse;
  const exclusions = payload.exclusionsResponse;
  const faq = payload.faqResponse;
  const pricing = payload.tripPricingDTO;
  const organizer = payload.organizerProfileResponse;

  const currentDay = itinerary?.dayDetailResponseList?.[activeDay];
  const rawActivities = currentDay?.tripItems || [];
  const rawItems = currentDay?.tripItems || [];

  const dayDescriptionItem = rawItems.find(
    (item: any) => item.tripType === "DAY_DESCRIPTION"
  );

  const dayDescription = dayDescriptionItem?.description || "";


  const activities = rawItems
    .filter((item: any) => item.tripType !== "DAY_DESCRIPTION")
    .map((item: any) => ({
      time: item.time || item.startTime || item.checkInTime || "--",
      name: item.name,
      description: item.description,
      images: (item.documents || []).map((doc: any) => doc.url).filter(Boolean),
    }));


  const heroImage =
    payload?.images?.length ? payload.images[0].url : undefined;
  const sidebarImages = payload?.images || [];

  const tripName = trip?.name;
  const duration = itinerary?.totalDays
    ? `${itinerary?.totalDays} Days`
    : "";
  const dates =
    trip?.startDate && trip?.endDate
      ? `${trip.startDate} → ${trip.endDate}`
      : "";
  let price = "";

  if (pricing?.tripPricingType === "SIMPLE") {
    const base = pricing.simplePricingRequest?.basePrice || 0;
    const discount = pricing.simplePricingRequest?.discountPercent || 0;
    const final = base - (base * discount) / 100;
    price = `₹${Math.round(final).toLocaleString()} / person`;
  }

  if (pricing?.tripPricingType === "DYNAMIC") {
    price = "Dynamic pricing (based on options)";
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              <HeroSection
                title={trip?.name}
                location={trip?.cityTags?.join(", ")}
                imageUrl={heroImage}
                onImageClick={() => {
                  setGalleryIndex(0);
                  setGalleryOpen(true);
                }}
              />

              <TripHeader
                isLoggedIn={isLoggedIn}
                onOpenOrganizer={() => setShowOrganizer(true)}
                onOpenLeader={() => setShowLeader(true)}
                onOpenInviteFriends={() => {
                  requireAuth(() => {
                    setShowInviteFriends(true);
                  });
                }}
                moods={trip?.moodTags || []}
                tripTitle={trip?.name}
                providerName={organizer?.organizerName}
                providerImage={organizer?.displayPicture?.url || null}
                organizerName={trip?.groupLeaders?.[0]?.name}
                organizerImage={trip?.groupLeaders?.[0]?.documents?.[0]?.url || null}
                cities={trip?.cityTags || []}
                isFavorite={isFavorite}
                onToggleWishlist={handleWishlistToggle}
              />



              <TripInfoCards
                startPoint={itinerary?.startPoint}
                endPoint={itinerary?.endPoint}
                startDate={trip?.startDate}
                endDate={trip?.endDate}
                minAge={trip?.minAge}
                maxAge={trip?.maxAge}
                minGroupSize={trip?.minGroupSize}
                maxGroupSize={trip?.maxGroupSize}
                totalDays={itinerary?.totalDays}
              />


              <TripHighlights highlights={trip?.highlights} />

              <DayWiseItinerary
                dayTabs={
                  itinerary?.dayDetailResponseList?.map(
                    (d: any) => `${TRIP_DETAILS.PAGE.DAY_PREFIX}${d.dayNumber}`
                  ) || []
                }
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                activities={activities}
                onImageClick={(images: string[]) => {
                  setGalleryImages(images.map(url => ({ url })));
                  setGalleryOpen(true);
                }}
                dayTitle={`Day ${activeDay + 1}: ${dayDescriptionItem?.name || trip?.name}`}
                dayDescription={dayDescription}
                itineraryPdfUrl={itinerary?.itineraryPdfDocument?.url}
              />

              <ExcludedSection items={exclusions?.details || []} />

              <FAQSection faqs={faq?.details || []} />
              <button
                onClick={() =>
                  requireAuth(() => {
                    const reportCount = Number(localStorage.getItem(`report_count_${trip?.publicId}`) || 0);
                    if (reportCount >= 5) {
                      toast({
                        title: "Report Limit Reached",
                        description: "You cannot report this trip more than 5 times.",
                        variant: "destructive"
                      });
                      return;
                    }
                    setShowReport(true);
                  })
                }
                className="mt-4 mx-auto flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-full hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 mb-2 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                {TRIP_DETAILS.PAGE.REPORT_BUTTON}
              </button>
            </div>

            {/* RIGHT */}
            <DesktopSidebar
              onAsk={() =>
                requireAuth(() => {
                  setShowAsk(true);
                })
              }

              onImageClick={() => {
                setGalleryIndex(0);
                setGalleryOpen(true);
              }}

              pricing={pricing}
              images={sidebarImages}
              minGroupSize={trip?.minGroupSize}
              maxGroupSize={trip?.maxGroupSize}
              totalSeats={trip?.totalSeats}
              bookedSeats={trip?.bookedSeats}
              onRequestInvite={(data) =>
                requireAuth(() => {
                  setSelectedPricing(data);
                  setShowPricingDetails(true);
                })
              }
            />
          </div>
        </div>
      </main>

      <Footer />

      <MobilePricingBar
        pricing={pricing}
        onOpen={() => setShowMobilePricing(true)}
      />

      {/* MODALS */}
      {showPricingDetails && (
        <PricingDetailsModal
          pricing={pricing}
          selectedPricing={selectedPricing}
          tripId={trip?.publicId}
          tripDbId={trip?.tripId}
          onClose={() => setShowPricingDetails(false)}
        />
      )}

      {showAsk && (
        <AskQuestionModal
          onClose={() => setShowAsk(false)}
          tripPublicId={trip?.publicId}
          tripName={tripName}
          duration={duration}
          dates={dates}
          price={price}
        />
      )}

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          tripPublicId={trip?.publicId}
        />
      )}
      {showLeader && (
        <LeaderProfileModal
          onClose={() => setShowLeader(false)}
          leader={{
            name: trip?.groupLeaders?.[0]?.name,
            bio: trip?.groupLeaders?.[0]?.bio,
            tagline: trip?.groupLeaders?.[0]?.tagline,
            imageUrl: trip?.groupLeaders?.[0]?.documents?.[0]?.url,

          }}
        />
      )}

      {showInviteFriends && (
        <InviteFriendsModal
          onClose={() => setShowInviteFriends(false)}
          onNext={(email) => {
            setInviteEmail(email);
            setShowInviteFriends(false);
            setShowSendInvitation(true);
          }}
        />
      )}

      {showSendInvitation && (
        <SendInvitationModal
          email={inviteEmail}
          trip={{
            name: tripName,
            duration: duration,
            dates: dates,
            price: price,
          }}
          tripPublicId={trip?.publicId}
          onClose={() => setShowSendInvitation(false)}
        />
      )}



      {showMobilePricing && (
        <MobilePricingModal
          onAsk={() =>
            requireAuth(() => {
              setShowAsk(true);
            })
          }
          options={pricing}
          totalSeats={trip?.totalSeats}
          bookedSeats={trip?.bookedSeats}
          onClose={() => setShowMobilePricing(false)}
          onRequestInvite={(data) => {
            requireAuth(() => {
              setSelectedPricing(data);
              setShowMobilePricing(false);
              setShowPricingDetails(true);
            })
          }}
        />

      )}
      {showOrganizer && (
        <OrganizerProfileModal
          organizer={organizer}
          onClose={() => setShowOrganizer(false)}
        />
      )}
      <FullImageGalleryModal
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryImages([]); }}
        images={galleryImages.length > 0 ? galleryImages : sidebarImages}
        title={tripName}
      />

      <FloatingRoleActions
        isLoggedIn={isLoggedIn}
        userType={userType}
        onModifySearch={() => setShowSearchOverlay(true)}
        onEditTrip={() => router.push(`/organizer/create-trip/${trip.publicId}`)}
        onPublishTrip={handlePublishTrip}
        isPublishDisabled={trip?.tripStatus === "PUBLISHED" || isPublished || isPublishing}
      />
      <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
        <div className="block lg:hidden w-[85vw] max-w-[360px]">
          <SearchTripsCard defaultTab={searchTab} onClose={() => setShowSearchOverlay(false)} className="shadow-none border-none p-1" />
        </div>
        <div className="hidden lg:block">
          <SearchTripsCard defaultTab={searchTab} onClose={() => setShowSearchOverlay(false)} className="shadow-none" />
        </div>
      </Overlay>
    </div>
  );
}
