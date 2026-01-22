import { LibraryItem } from '@/components/library/LibrarySelectModal';
import { Document, EMPTY_DOCUMENT } from '@/hooks/useDocumentsManager';
import { RootState } from '@/lib/slices/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

export interface Profile {
  organizationPublicId?: string;
  organizerName: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  instagramHandle: string;
  youtubeChannel: string;
  googleBusiness: string;
  testimonials: string;
}

export interface TripFormData {
  tripTitle: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  tripHighlights: string;
}

export interface OrganizerSliceState {
  // Organizer Profile State
  profile: Profile;
  currentStep: number;
  logoFile: Document;
  bannerFile: Document;
  testimonialScreenshotFile: Document;
  certificationsDocuments: Array<Document>;
  leaderModalOpen: boolean;
  selectedTags: string[];
  chooseModalOpen: boolean;
  selectedGroupLeaderId: string;
  leaders: LibraryItem[];
  cityInput: string;
  formData: TripFormData
  cityTags: string[];
}

export const initialOrganizerSliceState: OrganizerSliceState = {
  currentStep: 0,
  profile: {
    organizerName: '',
    tagline: '',
    description: '',
    websiteUrl: '',
    instagramHandle: '',
    youtubeChannel: '',
    googleBusiness: '',
    testimonials: '',
  },
  logoFile: EMPTY_DOCUMENT,
  bannerFile: EMPTY_DOCUMENT,
  testimonialScreenshotFile: EMPTY_DOCUMENT,
  certificationsDocuments: [],

  // create trip states
  leaderModalOpen: false,
  selectedTags: [],
  chooseModalOpen: false,
  selectedGroupLeaderId: '',
  leaders: [],
  cityInput: '',
  formData: {
    tripTitle: '',
    startDate: '',
    endDate: '',
    totalDays: 1,
    minGroupSize: 2,
    maxGroupSize: 20,
    minAge: 18,
    maxAge: 50,
    tripHighlights: '',
  },
  cityTags: [],
};

export const organizerSlice = createSlice({
  name: 'organizer_slice',
  initialState: initialOrganizerSliceState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    setLogoFile: (state, action: PayloadAction<Document>) => {
      state.logoFile = action.payload;
    },
    setBannerFile: (state, action: PayloadAction<Document>) => {
      state.bannerFile = action.payload;
    },
    setTestimonialScreenshotFile: (state, action: PayloadAction<Document>) => {
      state.testimonialScreenshotFile = action.payload;
    },
    setCertificationsDocuments: (
      state,
      action: PayloadAction<Array<Document>>,
    ) => {
      state.certificationsDocuments = action.payload;
    },

    // create trip Actinons
    setLeaderModalOpen: (state, action: PayloadAction<boolean>) => {
      state.leaderModalOpen = action.payload;
    },

    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    setChooseModalOpen: (state, action: PayloadAction<boolean>) => {
      state.chooseModalOpen = action.payload;
    },
    setSelectedGroupLeaderId: (state, action: PayloadAction<string>) => {
      state.selectedGroupLeaderId = action.payload;
    },
    setLeaders: (state, action: PayloadAction<LibraryItem[]>) => {
      state.leaders = action.payload;
    },
    setCityInput: (state, action: PayloadAction<string>) => {
      state.cityInput = action.payload;
    },
    setFormData: (state, action: PayloadAction<TripFormData>) => {
      state.formData = action.payload;
    },
    setCityTags: (state, action: PayloadAction<string[]>) => {
      state.cityTags = action.payload;
    }

  },
});

export const {
  setLogoFile,
  setBannerFile,
  setTestimonialScreenshotFile,
  setCertificationsDocuments,
  setProfile,

  // create trip Actions
  setLeaderModalOpen,
  setSelectedTags,
  setChooseModalOpen,
  setSelectedGroupLeaderId,
  setLeaders,
  setCityInput,
  setFormData,
  setCityTags,
} = organizerSlice.actions;
// dataContextSlice.sta

export const organizerState = (state: RootState) => state.organizer;

export default organizerSlice.reducer;
