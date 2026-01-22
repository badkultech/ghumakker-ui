"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { GradientButton } from "../gradient-button";
import { ROUTES } from "@/lib/utils";

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
        <Link href={ROUTES.COMMON.HOME} className="font-bold">
          <Image
            src="/prelaunch-page-imgs/logo-ghumakker.svg"
            width={100}
            height={100}
            alt="Logo"
            className="block"
          />
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
