import { publicBaseAPI } from "../index";

export interface LandingPageBgImage {
    id: number;
    type: string;
    url: string;
    file: string | null;
    markedForDeletion: boolean;
}

export interface LandingPageData {
    id: number;
    heroTitle: string;
    heroSubtitle: string;
    footerText: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    linkedinUrl: string;
    backgroundImage: LandingPageBgImage | null;
}

export const landingPageApi = publicBaseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getLandingPage: builder.query<LandingPageData, { organizationPublicId: string }>({
            query: ({ organizationPublicId }) =>
                `/org/${organizationPublicId}/landing-page`,
        }),
    }),
});

export const { useGetLandingPageQuery } = landingPageApi;
