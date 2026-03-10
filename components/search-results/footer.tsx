"use client"
import { LOGO_IMAGES, APP_BRANDING } from "@/lib/constants/assets";
import Image from "next/image"
import { footerLinks, socialLinks } from "@/app/home/constants";
import Link from "next/link";


export function Footer() {
  return (
    <footer className="bg-orange-50/30 border-t border-orange-100 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] shadow-sm bg-brand-gradient mb-4 w-[40px] h-[40px]">
              <Image src={LOGO_IMAGES} alt={APP_BRANDING} width={24} height={24} style={{ objectFit: "contain" }} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              An all-in-one platform to plan, book, and share your adventures
              effortlessly. Discover destinations, connect with your group, and
              create memories that last a lifetime.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-24">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {footerLinks.main.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label} className="hover:text-primary hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1">
                      <Link
                        href={link.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {footerLinks.support.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label} className="hover:text-primary hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1">
                      <Link
                        href={link.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}