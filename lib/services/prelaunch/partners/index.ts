import { ApiResponse } from "../../common-types";
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { PartnerRequest, PartnerResponse } from "./types";

export const partnerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    joinAsPartner: builder.mutation<PartnerResponse, PartnerRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.PARTNER}`, // e.g. "/api/partners"
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<PartnerResponse>) =>
        response.data,
    }),
  }),
});

export const { useJoinAsPartnerMutation } = partnerAPI;
