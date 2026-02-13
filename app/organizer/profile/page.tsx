'use client';

import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  organizerState,
  setBannerFile,
  setCertificationsDocuments,
  setLogoFile,
  setProfile,
  setTestimonialScreenshotFile,
} from '../-organizer-slice';
import { useLazyGetOrganizerProfileQuery } from '@/lib/services/organizer';
import { EMPTY_DOCUMENT } from '@/hooks/useDocumentsManager';
import {
  ImagePlaceHolder,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/library/SvgComponents/GradientsOfMoods';
import { GradientButton } from '@/components/gradient-button';
import { LazyImage } from '@/components/ui/lazyImage';
import { Certificate } from '@/components/library/SvgComponents/Icons/certificate';
import { Check } from 'lucide-react';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { Button } from '@/components/ui/button';

const hasProfile = true;



export default function OrganizerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const state = useSelector(organizerState);
  const organizationId = useOrganizationId();
  const dispatch = useDispatch();
  const {
    logoFile,
    bannerFile,
    testimonialScreenshotFile,
    profile,
    certificationsDocuments,
  } = state;
  console.log('profile', profile, testimonialScreenshotFile);

  const [getOrgProfile, { isLoading: profileLoading }] =
    useLazyGetOrganizerProfileQuery();

  useEffect(() => {
    if (organizationId) {
      getOrgProfile({ organizationId }).then((res) => {
        if (res.data) {
          const data = res.data as any;
          dispatch(
            setProfile({
              organizerName: data.organizerName || '',
              tagline: data.tagline || '',
              description: data.description || '',
              websiteUrl: data.websiteUrl || '',
              instagramHandle: data.instagramHandle || '',
              youtubeChannel: data.youtubeChannel || '',
              googleBusiness: data.googleBusiness || '',
              testimonials: data.testimonials || [],
            }),
          );
          dispatch(setLogoFile(data.displayPicture || EMPTY_DOCUMENT));
          dispatch(setBannerFile(data.bannerImage || EMPTY_DOCUMENT));
          dispatch(setTestimonialScreenshotFile(data.testimonialScreenshot));

          if (data.certifications) {
            dispatch(setCertificationsDocuments(data.certifications));
          }
        }
      });
    }
  }, [organizationId]);

  if (profileLoading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid'></div>
      </div>
    );

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className='flex-1 flex flex-col'>
        <AppHeader title='Organizer Profile' />

        <main className='flex-1 p-10 md:p-10'>
          <div className='max-w-6xl mx-auto'>
            {/* Page Header */}
            <div className='flex items-start justify-between mb-4'>
              <h1 className='text-3xl font-semibold'>Organizer Profile</h1>
              <div className='flex items-center space-x-3 '>
                <Link href='/organizer/profile/edit'>
                  <GradientButton className='rounded-full px-5 py-2 text-white cursor-pointer'>
                    Edit Profile
                  </GradientButton>
                </Link>
              </div>
            </div>

            {!hasProfile ? (
              // Empty state
              <div className='flex flex-col items-center justify-center h-72 text-center'>
                <h2 className='text-2xl font-semibold mb-2'>
                  Complete Your Profile
                </h2>
                <p className='text-gray-500 mb-6 max-w-md'>
                  Add your details to showcase your identity and manage your
                  events seamlessly.
                </p>

                <Link href='/organizer/profile/edit'>
                  <Button className='rounded-full px-6 py-2 bg-brand-gradient hover:opacity-90 text-white'>
                    Add Details +
                  </Button>
                </Link>
              </div>
            ) : (
              // Profile View
              <div className='space-y-8'>
                {/* Cover Image */}
                <div className='relative w-full h-56 rounded-xl overflow-hidden'>
                  {bannerFile.url ? (
                    <LazyImage
                      src={bannerFile.url}
                      alt='Cover'
                      className='w-full h-full rounded-xl object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-[#EFF1F3]'>
                      <ImagePlaceHolder width='240px' height='100%' />
                    </div>
                  )}
                </div>

                {/* Logo + Name + Socials */}
                <div className='flex items-center -mt-12 px-2'>
                  {logoFile.url ? (
                    <div className='w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden z-10'>
                      <LazyImage
                        src={logoFile.url}
                        alt='Logo'
                        className='w-full h-full rounded-full object-cover'
                      />
                    </div>
                  ) : (
                    <ImagePlaceHolder
                      className='w-28 h-28 rounded-full border-4 border-white shadow-md'
                      width='240px'
                      height='100px'
                    />
                  )}

                  <div className='ml-4'>
                    <p className='font-medium text-2xl'>
                      {profile.organizerName}
                    </p>
                    <p className='text-gray-600'>{profile.tagline}</p>
                  </div>

                  <div className='ml-auto flex items-center space-x-4'>
                    <a
                      href={profile.youtubeChannel || '#'}
                      target='_blank'
                      rel='noreferrer'
                      className='hover:scale-110 transition-transform duration-200'
                    >
                      <YouTubeIcon />
                    </a>
                    <a
                      href={profile.instagramHandle || '#'}
                      target='_blank'
                      rel='noreferrer'
                      aria-label='Instagram'
                      className='hover:scale-110 transition-transform duration-200'
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>

                {/* Main content layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                  {/* Left column */}
                  <div className='lg:col-span-2 space-y-6'>
                    {/* About Us */}
                    <div className='font-[Poppins] font-normal text-base leading-[1.4] tracking-[0.005em] rounded-lg bg-[#F7F7F7] p-6 text[#757575]  border border-[#E4E4E4]'>
                      <h2 className='text-xl font-semibold mb-2'>About Us</h2>
                      <p className='text-gray-700 leading-relaxed'>
                        {profile.description || 'No description added yet.'}
                      </p>
                    </div>

                    {/* Testimonials */}
                    <div className='font-[Poppins] font-normal text-base leading-[1.4] tracking-[0.005em] rounded-lg bg-[#F7F7F7] p-6 text[#757575]  border border-[#E4E4E4]'>
                      <h2 className='text-xl font-semibold mb-4'>
                        What Our Attendees Say
                      </h2>

                      {testimonialScreenshotFile ? (
                        <div className='border-l-4 bg-white rounded-lg border-primary p-4 mb-6'>
                          {testimonialScreenshotFile.url ? (
                            <img
                              src={testimonialScreenshotFile.url}
                              alt='Cover'
                              className='w-full h-20 rounded-xl object-cover'
                            />
                          ) : (
                            <p className='text-gray-500'>
                              No testimonial image available.
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className='text-gray-500'>
                          No testimonials added yet.
                        </p>
                      )}

                      {profile.testimonials ? (
                        <div className='border-l-4 bg-white rounded-lg border-primary p-4 mb-6'>
                          <p className=' text-gray-700'>
                            “{profile.testimonials}”
                          </p>
                          <p className='font-semibold mt-2'>
                            — {profile.organizerName}, {'designation'}
                          </p>
                        </div>
                      ) : (
                        <p className='text-gray-500'>
                          No testimonials added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
