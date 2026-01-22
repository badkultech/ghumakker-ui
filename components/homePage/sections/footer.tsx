import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"
import { ROUTES } from "@/lib/utils"

export function Footer() {
  return (
    <footer className="pt-12 ">
      <div className="container mx-auto px-4 md:px-20">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href={ROUTES.COMMON.HOME} className="text-2xl font-bold text-primary">
              <Image src="/logo.png" alt="Logo" width={100} height={100} className=" h-11 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Join group trips and meet like-minded travelers from around the world.
            </p>
          </div>

          <div className="flex justify-between">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={ROUTES.COMMON.TRIPS} className="hover:text-primary transition-colors">
                    Trips
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.DESTINATIONS} className="hover:text-primary transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.HOME_LEADERS} className="hover:text-primary transition-colors">
                    Trip Leaders
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.ABOUT} className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={ROUTES.COMMON.HELP} className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.CONTACT} className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.FAQ} className="hover:text-primary transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COMMON.TERMS} className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>
      <div className="border-t flex justify-between border-muted-foreground/20 bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] py-6 px-20 text-center text-sm text-white">
        <p>&copy; {new Date().getFullYear()} ghumakker. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-primary transition-colors">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Instagram className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Youtube className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
