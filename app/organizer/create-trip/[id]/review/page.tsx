'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { SectionCard } from '@/components/create-trip/section-card';
import { TripSummaryCard } from '@/components/create-trip/trip-summary-card';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from '@/lib/services/organizer/trip/review';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { useGetTripByIdQuery } from '@/lib/services/organizer/trip/create-trip';
import { toast } from '@/hooks/use-toast';

interface ReviewPageState {
  tripName: string;
  travelDates: string;
  duration: string;
  groupSize: string;
  ageRange: string;
  leader: string;
  itineraryType: string;
  confirmed: boolean;
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = useOrganizationId();
  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();


  const { data: tripDetails } = useGetTripByIdQuery({
    organizationId,
    tripId: tripId as string,
  })
  useEffect(() => {
    if (!tripDetails) return;

    setState(prev => ({
      ...prev,
      tripName: tripDetails.data.name,

      travelDates: `${formatDateDMY(tripDetails.data.startDate)} to ${formatDateDMY(
        tripDetails.data.endDate
      )}`,
      duration: calculateDuration(tripDetails.data.startDate, tripDetails.data.endDate),
      groupSize: `${tripDetails.data.minGroupSize} - ${tripDetails.data.maxGroupSize} people`,
      ageRange: `${tripDetails.data.minAge} - ${tripDetails.data.maxAge} years`,
      leader:
        (tripDetails.data.groupLeaders || [])
          .map((l) => l.name)
          .join(", ") || "Not Assigned",
      // itineraryType: (tripDetails.data.moodTags || []).join(", "),
    }));
  }, [tripDetails]);

  function formatDateDMY(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  function calculateDuration(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = diffDays > 0 ? diffDays - 1 : 0;
    return `${diffDays} Days | ${nights} Nights`;
  }

  const [state, setState] = useState<ReviewPageState>({
    tripName: 'Himalaya',
    travelDates: '25-09-25 to 29-09-25',
    duration: '5 Days | 6 Nights',
    groupSize: '8 - 12 people',
    ageRange: '18 - 56 years',
    leader: 'Not Assigned',
    itineraryType: 'Advanced',
    confirmed: false,
  });
  const handleDraft = () => {
    console.log('Review draft saved:', state);
  };
  const handleSubmit = async () => {
    if (!state.confirmed) {
      toast({
        toastType: "error",
        title: "Confirmation Required",
        description: "Please confirm the information before submitting.",
      });
      return;
    }

    try {
      const payload = { confirmed: true };

      if (!tripDetails) {
        await createReview({
          organizationId,
          tripPublicId: tripId as string,
          data: payload,
        });
      } else {
        await updateReview({
          organizationId,
          tripPublicId: tripId as string,
          data: payload,
        });
      }

      toast({
        toastType: "success",
        title: "Trip Submitted",
        description: "Your trip has been submitted successfully.",
      });

      router.push('/organizer/dashboard');
    } catch (e) {
      console.error('Review submit error:', e);
      toast({
        toastType: "error",
        title: "Submission Failed",
        description: "Something went wrong while submitting the trip.",
      });
    }
  };

  const handlePrevious = () => {
    router.push(`/organizer/create-trip/${tripId}/pricing`);
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1 h-auto'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={6} />

        <SectionCard title='Review & Submit'>
          <TripSummaryCard
            data={{
              tripName: state.tripName,
              travelDates: state.travelDates,
              duration: state.duration,
              groupSize: state.groupSize,
              ageRange: state.ageRange,
              leader: state.leader,
              itineraryType: state.itineraryType,
            }}
            confirmed={state.confirmed}
            onConfirmedChange={(confirmed) => setState({ ...state, confirmed })}
          />
        </SectionCard>

        <WizardFooter
          nextLabel='Submit'
          onPrev={handlePrevious}
          onDraft={handleDraft}
          onNext={handleSubmit}
        />
      </div>
    </div>
  );
}
