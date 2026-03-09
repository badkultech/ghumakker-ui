"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { GradientButton } from "../gradient-button";
import { ROUTES } from "@/lib/utils";
import { LOGO_SVG, APP_BRANDING } from "@/lib/constants/assets";

/**
 * Header Component
 * Navigation bar with responsive logo and CTA button
 * Features hover animations and mobile-responsive design
 */
export default function Header(): React.JSX.Element {
  return (
    <header
      className={` p-4 md:py-[1.2rem] md:px-[4rem] border-b border-gray-200`}
    >
      <nav className="flex justify-between items-center">
        <Link href={ROUTES.COMMON.HOME} className="flex items-center gap-2 font-bold no-underline">
          <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] shadow-sm bg-brand-gradient"
            style={{ width: 44, height: 44 }}
          >
            <Image
              src={LOGO_SVG}
              width={26}
              height={26}
              alt={APP_BRANDING}
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <GradientButton className="w-fit py-2.75">
          <span className="group-hover:opacity-0 font-medium transition-all duration-300">
            Login/Register
          </span>
        </GradientButton>
      </nav>
    </header>
  );
}
