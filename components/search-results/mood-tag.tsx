"use client";

import { cn } from "@/lib/utils";

// ICONS
import {
  MountainIcon,
  NightIcon,
  BeachIcon,
  DesertIcon,
  ForestIcon,
  WellnessIcon,
  HeritageIcon,
  CompassIcon,
  Hiking1Icon,
  MotorSportsIcon,
  CalenderIcon,
  FemaleIcon,
  PartiesIcon,
  LearningIcon,
  CampingIcon,
  SpiritualIcon,
} from "@/components/library/SvgComponents/Icons";

// GRADIENT SVGs
import {
  MountainGradient,
  SkygazyGradient,
  BeachGradient,
  DesertGradient,
  JungleGradient,
  WellnessGradient,
  HeritageGradient,
  AdventureGradient,
  TrekkingGradient,
  MotorSportsGradient,
  WeekendGradient,
  WomenOnlyGradient,
  LearningGradient,
  PartyGradient,
} from "@/components/library/SvgComponents/GradientsOfMoods";

import { CampingGradient } from "@/components/library/SvgComponents/GradientsOfMoods/campingGradient";
import { SpiritualGradient } from "@/components/library/SvgComponents/GradientsOfMoods/spiritualGradient";

interface MoodTagProps {
  name: string;
  icon: any
  isActive?: boolean;
  onClick?: () => void;
}

export function MoodTag({ name, isActive = false, onClick }: MoodTagProps) {

  // Use the exported moodMap
  const data = moodMap[name] || {};
  const Icon = data.icon;
  const GradientBG = data.bg;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 overflow-hidden",
        isActive
          ? "text-white border-transparent shadow-md scale-[1.03]"
          : "bg-white text-[#4d4d4d] border-[#e0e0e0] hover:border-[#c0c0c0]"
      )}
    >
      {isActive && GradientBG && (
        <div className="absolute inset-0">
          <GradientBG width="300" height="80" />
        </div>
      )}

      {/* FIXED ICON SYSTEM */}
      <div className="relative flex items-center gap-2 z-10">
        <div className="w-4 h-4 flex items-center justify-center">
          {Icon && (
            <Icon
              className="w-full h-full"
              fill={isActive ? "white" : "black"}
            />
          )}
        </div>

        <span>{name}</span>
      </div>
    </button>
  );
}

export const moodMap: any = {
  Mountain: { icon: MountainIcon, bg: MountainGradient },
  Skygaze: { icon: NightIcon, bg: SkygazyGradient },
  Beach: { icon: BeachIcon, bg: BeachGradient },
  Desert: { icon: DesertIcon, bg: DesertGradient },
  Jungle: { icon: ForestIcon, bg: JungleGradient },
  Wellness: { icon: WellnessIcon, bg: WellnessGradient },
  Heritage: { icon: HeritageIcon, bg: HeritageGradient },
  Adventure: { icon: CompassIcon, bg: AdventureGradient },
  Trekking: { icon: Hiking1Icon, bg: TrekkingGradient },
  Motorsports: { icon: MotorSportsIcon, bg: MotorSportsGradient },
  Weekends: { icon: CalenderIcon, bg: WeekendGradient },
  "Women-Only": { icon: FemaleIcon, bg: WomenOnlyGradient },
  Parties: { icon: PartiesIcon, bg: PartyGradient },
  Learning: { icon: LearningIcon, bg: LearningGradient },
  Camping: { icon: CampingIcon, bg: CampingGradient },
  Spiritual: { icon: SpiritualIcon, bg: SpiritualGradient },
};
