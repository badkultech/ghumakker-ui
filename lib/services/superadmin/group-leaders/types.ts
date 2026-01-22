export type PromotionType = "FEATURED" | "SPONSORED" | "BOOSTED";

export interface GroupLeaderPromotion {
    id: number;
    type: PromotionType;
    endDate: string;
    weight: number;
}

export interface GroupLeader {
    id: number;
    name: string;
    organizerName: string;
    tripCount: number;
    promotion?: GroupLeaderPromotion | null;
}
