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
            <h2 className="text-2xl font-bold text-[#ff6b35] italic mb-4">
              <Image src={LOGO_IMAGES} alt={APP_BRANDING} width={96} height={36.98} className="w-[96px] h-[36.98px]" />
            </h2>
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
                {footerLinks.main.map((link) => (
                  <li key={link.label} className="hover:text-primary hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1">
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {footerLinks.support.map((link) => (
                  <li key={link.label} className="hover:text-primary hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1">
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-brand-gradient py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} {APP_BRANDING}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Icon className="w-3 h-3 text-white" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}