'use client';

import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useLazyGetOrganizerProfileQuery,
  useUpdateOrganizerProfileMutation,
} from '@/lib/services/organizer';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Trash2, X } from 'lucide-react';
import {
  Document,
  EMPTY_DOCUMENT,
  useDocumentsManager,
} from '@/hooks/useDocumentsManager';
import {
  organizerState,
  setBannerFile,
  setLogoFile,
  setProfile,
  setTestimonialScreenshotFile,
} from '../../-organizer-slice';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { UploadIcon } from 'lucide-react';
import { LazyImage } from '@/components/ui/lazyImage';
import { useOrganizationId } from '@/hooks/useOrganizationId';

export default function OrganizerProfileEditPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const focusedOrgPublicId = useOrganizationId();

  const state = useSelector(organizerState);

  const { logoFile, bannerFile, testimonialScreenshotFile, profile } = state;
  // Keep actual File objects in local component state (Files are non-serializable)
  const [logoUploadFile, setLogoUploadFile] = useState<File | null>(null);
  const [bannerUploadFile, setBannerUploadFile] = useState<File | null>(null);
  const [testimonialUploadFile, setTestimonialUploadFile] =
    useState<File | null>(null);
  // Helper to get a readable name for uploaded documents (Document type may not include name)
  const getDocName = (c: Document) => {
    // try common fields, otherwise derive from url
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyC = c as any;
    return (
      anyC.name ||
      anyC.filename ||
      c.url?.split('/').pop()?.split('?')[0] ||
      'Document'
    );
  };
  // Lazy image helper: shows skeleton while loading and fades in.
  // Handles cached images by checking image.complete and enforces a short
  // minimum skeleton duration so the user perceives a loading state.
  const organizationId = focusedOrgPublicId;

  const [updatedOrgProfile, { isLoading }] =
    useUpdateOrganizerProfileMutation();

  const {
    documents: certificationsDocuments,
    error: certificationsError,
    handleAddFiles: handleCertificationsAddFiles,
    handleMarkForDeletion: handleCertificationsMarkForDeletion,
    setDocuments: setCertificationsDocuments,
  } = useDocumentsManager();

  console.log('certificationsDocuments', certificationsDocuments);

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
              testimonials: data.testimonials || '',
            }),
          );
          dispatch(setLogoFile(data.displayPicture || EMPTY_DOCUMENT));
          dispatch(setBannerFile(data.bannerImage || EMPTY_DOCUMENT));
          dispatch(setTestimonialScreenshotFile(data.testimonialScreenshot));

          if (data.certifications) {
            setCertificationsDocuments(data.certifications);
          }
        }
      });
    }
  }, [organizationId]);

  // Placeholder error function
  const showApiError = (msg: string) => alert(msg);

  const validateImageFile = (file: File): boolean => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      showApiError('Please choose a PNG, JPG, or WEBP image');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      showApiError('Max file size is 2MB');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      // 🧱 1️⃣ Append simple string fields dynamically
      const textFields: Record<string, any> = {
        organizerName: profile.organizerName,
        tagline: profile.tagline,
        description: profile.description,
        websiteUrl: profile.websiteUrl,
        instagramHandle: profile.instagramHandle,
        youtubeChannel: profile.youtubeChannel,
        googleBusiness: profile.googleBusiness,
        testimonials: profile.testimonials,
      };

      Object.entries(textFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      // 🖼️ 2️⃣ Helper to append file-related data
      const appendFileData = (
        keyPrefix: string,

        uploadFile?: File | null,
      ) => {
        // Append actual file
        if (uploadFile) formData.append(`${keyPrefix}.file`, uploadFile);
      };

      // 🧩 3️⃣ Append file-related data using helper
      appendFileData('displayPicture', logoUploadFile);
      appendFileData('bannerImage', bannerUploadFile);
      appendFileData('testimonialScreenshot', testimonialUploadFile);

      // 📜 4️⃣ Append certifications
      certificationsDocuments.forEach((doc, index) => {
        if (!doc) return;

        const baseKey = `certifications[${index}]`;

        if (doc.file) formData.append(`${baseKey}.file`, doc.file);
        if (doc.id !== null) formData.append(`${baseKey}.id`, String(doc.id));
        if (typeof doc.markedForDeletion !== 'undefined')
          formData.append(
            `${baseKey}.markedForDeletion`,
            String(doc.markedForDeletion),
          );
        if (doc.type) formData.append(`${baseKey}.type`, doc.type);
      });

      // 🚀 5️⃣ API call
      const response = await updatedOrgProfile({
        organizationId,
        data: formData,
      }).unwrap();

      console.log('Profile updated successfully:', response);
      if (response) router.push('/organizer/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleCertificationsAddFiles(e.target.files);
  };

  if (profileLoading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid'></div>
      </div>
    );
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {profile?.organizationPublicId && <OrganizerSidebar
        isOpen={false}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      }

      <div className='flex-1 flex flex-col'>
        <AppHeader title='Organizer Profile' />

        <main className='flex-1 p-6 md:p-8 space-y-8'>
          {/* ================= Basic Details ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-[22px] font-semibold'>Basic Details</h2>

            {/* Logo Upload */}
            <label className='block text-lg mb-5 font-medium'>
              Display Picture / Logo
            </label>
            <div className='flex items-center space-x-6'>
              {logoFile.url && (
                <div className='w-20 h-20 rounded-full border overflow-hidden'>
                  <LazyImage
                    src={logoFile.url}
                    alt='Logo'
                    className='w-20 h-20 rounded-full'
                  />
                </div>
              )}
              <div>
                <div className='flex items-center gap-2'>
                  <div className='relative inline-block'>
                    <Button variant='outline' className='bg-gray-100'>
                      <UploadIcon className='mr-2' />
                      Upload New Image
                    </Button>
                    <input
                      id='logo-upload'
                      type='file'
                      accept='image/*'
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateImageFile(file)) {
                          // store raw File locally, and only store metadata in Redux
                          setLogoUploadFile(file);
                          dispatch(
                            setLogoFile({
                              ...logoFile,
                              type: file.type,
                              url: URL.createObjectURL(file),
                              file: null,
                              markedForDeletion: true,
                            } as Document),
                          );
                        }
                      }}
                    />
                  </div>
                  {logoFile.url && (
                    <Button
                      variant='outline'
                      className='hover:text-red-500'
                      onClick={() => {
                        dispatch(
                          setLogoFile({
                            ...logoFile,
                            markedForDeletion: true,
                            url: '',
                            file: null,
                          }),
                        );
                      }}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
                <p className='text-xs text-gray-400 mt-1'>
                  PNG, JPG, or WEBP up to 2MB
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className='block text-lg mb-1 font-medium'>
                Organizer Name
              </label>
              <Input
                value={profile?.organizerName}
                onChange={(e) => {
                  dispatch(
                    setProfile({
                      ...profile,
                      organizerName: e.target.value,
                    }),
                  );
                }}
                placeholder='Enter here'
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className='block text-lg mb-1'>Cover Image / Banner</label>
              <div className='border border-dashed rounded-lg p-6 bg-gray-100 text-center relative'>
                {bannerFile.url && (
                  <div className='relative group inline-block w-full'>
                    <LazyImage
                      src={bannerFile.url}
                      alt='Banner'
                      className='w-full h-40 rounded-lg mb-4'
                    />
                    <button
                      type='button'
                      className='absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50'
                      onClick={() => {
                        dispatch(
                          setBannerFile({
                            ...bannerFile,
                            markedForDeletion: true,
                            url: '',
                            file: null,
                          }),
                        );
                      }}
                    >
                      <Trash2 className='text-red-500 w-4 h-4' />
                    </button>
                  </div>
                )}

                {/* ✅ Upload Button Centered */}
                <div className='relative flex flex-col items-center justify-center'>
                  <Button
                    variant='outline'
                    className='flex items-center justify-center w-12 h-12 rounded-lg shadow-sm hover:bg-gray-100 transition'
                  >
                    <UploadIcon className='w-5 h-5' />
                  </Button>
                  <h3 className='mt-3 text-center text-base font-semibold text-gray-800'>
                    Upload Banner Image
                  </h3>
                  <p className='text-xs text-gray-400 text-center'>
                    1920px x 480px recommended
                  </p>
                  <input
                    id='banner-upload'
                    type='file'
                    accept='image/*'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateImageFile(file)) {
                        setBannerUploadFile(file);
                        dispatch(
                          setBannerFile({
                            ...bannerFile,
                            type: file.type,
                            url: URL.createObjectURL(file),
                            file: null,
                            markedForDeletion: true,
                          } as Document),
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= About the Organizer ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>About the Organizer</h2>

            <div>
              <label className='block text-sm mb-1 font-medium '>Tagline</label>
              <Input
                value={profile?.tagline}
                onChange={(e) =>
                  dispatch(setProfile({ ...profile, tagline: e.target.value }))
                }
                placeholder='Enter here'
              />
            </div>

            <div>
              <label className='block text-sm mb-1 font-medium'>
                Description
              </label>
              <Textarea
                value={profile?.description}
                onChange={(e) =>
                  dispatch(
                    setProfile({ ...profile, description: e.target.value }),
                  )
                }
                rows={4}
                placeholder='Enter here'
              />
            </div>
          </section>

          {/* ================= Social Profiles ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium '>Social Profiles</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm mb-1 font-medium'>
                  Website URL
                </label>
                <Input
                  value={profile?.websiteUrl}
                  onChange={(e) =>
                    dispatch(
                      setProfile({ ...profile, websiteUrl: e.target.value }),
                    )
                  }
                  placeholder='https://'
                />
              </div>
              <div>
                <label className='block text-sm mb-1 font-medium'>
                  Instagram Handle
                </label>
                <Input
                  value={profile?.instagramHandle}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        instagramHandle: e.target.value,
                      }),
                    )
                  }
                  placeholder='@handle'
                />
              </div>
              <div>
                <label className='block text-sm mb-1 font-medium'>
                  YouTube Channel
                </label>
                <Input
                  value={profile?.youtubeChannel}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        youtubeChannel: e.target.value,
                      }),
                    )
                  }
                  placeholder='youtube.com/channel'
                />
              </div>
              <div>
                <label className='block text-sm mb-1 font-medium'>
                  Google Business
                </label>
                <Input
                  value={profile.googleBusiness}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        googleBusiness: e.target.value,
                      }),
                    )
                  }
                  placeholder='Business link'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm mb-1 font-medium'>
                Testimonials
              </label>
              <Textarea
                value={profile?.testimonials}
                onChange={(e) =>
                  dispatch(
                    setProfile({ ...profile, testimonials: e.target.value }),
                  )
                }
                rows={2}
                placeholder='Optional'
              />
            </div>
            <h3 className='text-center'>or</h3>

            <div className='border border-dashed rounded-lg bg-gray-100 p-6 text-center relative'>
              {/* ✅ Preview image */}
              {testimonialScreenshotFile?.url && (
                <div className='relative group inline-block w-full'>
                  <LazyImage
                    src={testimonialScreenshotFile.url}
                    alt='Screenshot'
                    className='w-full h-40 rounded-lg mb-4'
                  />
                  <button
                    type='button'
                    className='absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50'
                    onClick={() =>
                      dispatch(
                        setTestimonialScreenshotFile({
                          ...testimonialScreenshotFile,
                          markedForDeletion: true,
                          url: '',
                          file: null,
                        }),
                      )
                    }
                  >
                    <Trash2 className='text-red-500 w-4 h-4' />
                  </button>
                </div>
              )}

              {/* ✅ Centered upload area */}
              <div className='flex flex-col items-center justify-center mt-2 space-y-2'>
                <div className='relative flex flex-col items-center justify-center'>
                  <Button
                    variant='outline'
                    className='flex items-center justify-center w-12 h-12 rounded-lg shadow-sm hover:bg-gray-100 transition'
                  >
                    <UploadIcon className='w-5 h-5' />
                  </Button>

                  <h3 className='mt-3 text-center text-base font-semibold text-gray-800'>
                    Upload Screenshot
                  </h3>

                  {/* ✅ Hidden input */}
                  <input
                    id='testimonial-upload'
                    type='file'
                    accept='image/*'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateImageFile(file)) {
                        setTestimonialUploadFile(file);
                        dispatch(
                          setTestimonialScreenshotFile({
                            ...testimonialScreenshotFile,
                            type: file.type,
                            url: URL.createObjectURL(file),
                            file: null,
                            markedForDeletion: true,
                          } as Document),
                        );
                      }
                    }}
                  />
                </div>
                <p className='text-xs text-gray-400 text-center'>
                  1920px x 480px recommended
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* {testimonialScreenshotFile && (
                <p className='text-sm text-gray-700 mt-2'>
                  Uploaded: <strong>{testimonialScreenshotFile.name}</strong>
                </p>
              )} */}
            </div>
          </section>

          {/* ================= Trust & Verification ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>Trust & Verification</h2>

            <div className='border  border-dashed rounded-lg p-6 text-center'>
              <div className='relative inline-block'>
                <Button variant='outline'>
                  <UploadIcon></UploadIcon>
                </Button>
                <h3 className='mt-2'>Upload Certification</h3>
                <input
                  type='file'
                  onChange={onFileChange}
                  multiple
                  // accept images, PDFs and common document types for certifications
                  accept='image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                />
              </div>
              {certificationsError && (
                <p style={{ color: 'red' }}>{certificationsError}</p>
              )}
              <p className='text-xs text-gray-400 mt-1'>
                Accepted formats: PNG, JPG, WEBP (Max 2MB)
              </p>
            </div>

            <div className='flex gap-5 h-[5rem] overflow-y-auto'>
              {certificationsDocuments.map(
                (cert, idx) =>
                  cert.url && (
                    <div
                      key={idx}
                      className='relative group w-34 h-20 rounded-lg overflow-hidden border'
                    >
                      {cert.type === 'application/pdf' ? (
                        <FileText className='w-full h-full text-gray-400' />
                      ) : (
                        <LazyImage
                          src={cert.url}
                          alt={getDocName(cert)}
                          className='w-full h-full'
                        />
                      )}

                      {/* ❌ Delete icon (visible only on hover) */}
                      <button
                        type='button'
                        className='absolute top-1 right-1 z-100 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50'
                        onClick={() =>
                          handleCertificationsMarkForDeletion(cert.id, idx)
                        }
                      >
                        <X className='w-4 h-4 text-red-500' />
                      </button>
                    </div>
                  ),
              )}
            </div>
          </section>

          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleCancel}
              variant='outline'
              className='rounded-2xl'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className='bg-brand-gradient text-white rounded-2xl'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
