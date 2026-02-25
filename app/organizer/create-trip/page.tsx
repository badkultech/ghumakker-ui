"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
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
    <main>
      <TripStepperHeader activeStep={1} />
      <CreateTrip isViewMode={isViewMode} />
    </main>
  );
}
