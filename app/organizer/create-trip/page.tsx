"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { CreateTrip } from '@/components/create-trip/create-trip';
import {
  organizerState,
  setCityTags,
  setFormData,
  setLeaders,
  setSelectedGroupLeaderId,
  setSelectedTags
} from '../-organizer-slice';
import { useDispatch, useSelector } from 'react-redux';

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector(organizerState);
  const { cityTags } = state;

  const searchParams = useSearchParams();
  const isViewMode = searchParams.get('mode') === 'view';

  useEffect(() => {
    if (isViewMode) return;

    dispatch(setFormData({
      tripTitle: "",
      startDate: "",
      endDate: "",
      totalDays: 1,
      minGroupSize: 2,
      maxGroupSize: 20,
      minAge: 18,
      maxAge: 50,
      tripHighlights: "",
    }));
    dispatch(setSelectedTags([]));
    dispatch(setCityTags(cityTags));
    dispatch(setLeaders([]));
    dispatch(setSelectedGroupLeaderId(""));
  }, [isViewMode]);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className='flex-1'>
        <AppHeader title='Organizers' />
        <TripStepperHeader activeStep={1} />
        <CreateTrip isViewMode={isViewMode} />
      </div>
    </div>
  );
}
