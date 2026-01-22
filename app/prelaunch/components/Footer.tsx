import React from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer(): React.JSX.Element {
  const LINKEDIN_URL = "https://www.linkedin.com/company/ghumakker/";
  const INSTAGRAM_URL = "https://www.instagram.com/ghumakker.in?igsh=MWdldHR0ZDRyYzNyMA%3D%3D&utm_source=qr";
  const FACEBOOK_URL = "https://www.facebook.com/share/1CdLRkogGV/?mibextid=wwXIfr";


  return (
    <footer className="bg-black text-white p-4 md:px-[5rem] md:py-[1.75rem] flex max-md:gap-4 max-md:flex-col-reverse  justify-between items-center">
      <p className="text-center text-[1rem]">© 2025 Copyright. All rights reserved.</p>

      <div className="flex items-center gap-4">
        <a
          href={LINKEDIN_URL}
          aria-label="Follow us on LinkedIn"
          title="LinkedIn — ghumakker"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <Linkedin size={28} className="text-white hover:text-blue-400" />
        </a>

        <a
          href={FACEBOOK_URL}
          aria-label="Follow us on Facebook"
          title="Facebook — ghumakker"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <Facebook size={28} className="text-white hover:text-blue-500" />
        </a>

        <a
          href={INSTAGRAM_URL}
          aria-label="Follow us on Instagram"
          title="Instagram — ghumakker"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <Instagram size={28} className="text-white hover:text-pink-400" />
        </a>
      </div>

    </footer>
  );
}
