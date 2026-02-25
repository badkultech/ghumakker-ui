'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';


import { CreateTrip } from '@/components/create-trip/create-trip';
import { useOrganizationId } from '@/hooks/useOrganizationId';

export default function Page() {

  const organizationId = useOrganizationId();
  const { id } = useParams();



  return (
    <main>
      <TripStepperHeader activeStep={1} />
      <CreateTrip tripId={id as string} />
    </main>
  );
}
