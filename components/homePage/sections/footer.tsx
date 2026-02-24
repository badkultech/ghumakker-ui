"use client";

import Link from "next/link";
import { APP_BRANDING } from "@/lib/constants/assets";
import { socialLinks as fallbackSocialLinks } from "@/app/home/constants";
import { useGetLandingPageQuery } from "@/lib/services/landing-page";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
  const organizationPublicId = useOrganizationId();

  const { data: landingPage } = useGetLandingPageQuery(
    { organizationPublicId: organizationPublicId! },
    { skip: !organizationPublicId }
  );

  // Build dynamic social links from API, fall back to constants if not available
  const dynamicLinks = landingPage
    ? [
      { icon: Facebook, href: landingPage.facebookUrl || "#", label: "Facebook" },
      { icon: Instagram, href: landingPage.instagramUrl || "#", label: "Instagram" },
      { icon: Youtube, href: landingPage.youtubeUrl || "#", label: "YouTube" },
      { icon: Linkedin, href: landingPage.linkedinUrl || "#", label: "LinkedIn" },
    ].filter((l) => l.href && l.href !== "#")
    : fallbackSocialLinks;

  const footerText = landingPage?.footerText
    || `© ${new Date().getFullYear()} ${APP_BRANDING}. All rights reserved.`;

  return (
    <footer className="border-t bg-brand-gradient text-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-xs">
        <p>{footerText}</p>

        <div className="flex gap-3">
          {dynamicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Icon className="w-3 h-3 text-white" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
