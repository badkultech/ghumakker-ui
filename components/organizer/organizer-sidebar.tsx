'use client';
import { LOGO_IMAGES, APP_BRANDING } from '@/lib/constants/assets';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  CircleUser,
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  Car,
  UtensilsCrossed,
  PersonStanding,
  UserRoundPlus,
  Headphones,
  Settings,
  CreditCard,
  House,
  UserRoundCog,
  MessageCircleQuestion,
  Users,
  TextSearch,
} from 'lucide-react';
import {
  LibraryIcon,
  TripIcon,
} from '@/components/library/SvgComponents/Icons';
import { useState, useEffect } from 'react';
import { LogoutButton } from '../common/LogoutButton';

import { ROUTES } from '@/lib/utils';

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  boxedPlus?: boolean;
  children?: NavItem[];
};

const nav: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.ORGANIZER.DASHBOARD, icon: LayoutGrid },
  {
    label: 'Organizer Profile',
    href: ROUTES.ORGANIZER.PROFILE,
    icon: CircleUser,
  },
  { label: 'Trip', href: ROUTES.ORGANIZER.TRIP_OVERVIEW, icon: TripIcon },
  
  {
    label: 'Library',
    href: ROUTES.ORGANIZER.LIBRARY,
    icon: LibraryIcon,
    children: [
      {
        label: 'Day Description',
        href: ROUTES.ORGANIZER.LIBRARY_DAY_DESCRIPTION,
        icon: Calendar,
      },
      { label: 'Transit', href: ROUTES.ORGANIZER.LIBRARY_TRANSITS, icon: Car },
      { label: 'Stays', href: ROUTES.ORGANIZER.LIBRARY_STAYS, icon: House },

      {
        label: 'Meals',
        href: ROUTES.ORGANIZER.LIBRARY_MEALS,
        icon: UtensilsCrossed,
      },
      {
        label: 'Activities',
        href: ROUTES.ORGANIZER.LIBRARY_ACTIVITIES,
        icon: PersonStanding,
      },
      {
        label: 'Trip Leaders',
        href: ROUTES.ORGANIZER.LIBRARY_TRIP_LEADERS,
        icon: UserRoundCog,
      },
      {
        label: 'FAQs',
        href: ROUTES.ORGANIZER.LIBRARY_FAQS,
        icon: MessageCircleQuestion,
      },
    ],
  },
  { label: 'Leads', href: ROUTES.ORGANIZER.LEADS_ALL, icon: Users },
  { label: 'Queries', href: ROUTES.ORGANIZER.QUERIES_ALL, icon: TextSearch },

  // { label: 'Team Members', href: ROUTES.ORGANIZER.TEAM, icon: UserRoundPlus },
  // { label: 'Support Center', href: ROUTES.ORGANIZER.SUPPORT, icon: Headphones },
  // { label: 'Billing', href: ROUTES.ORGANIZER.BILLING, icon: CreditCard },
  { label: 'Settings', href: ROUTES.ORGANIZER.SETTINGS, icon: Settings },
];

type OrganizerSidebarProps = {
  showLogo?: boolean;
  isOpen?: boolean; // for mobile
  onClose?: () => void;
};

export function OrganizerSidebar({
  showLogo = true,
  isOpen,
  onClose,
}: OrganizerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<string, boolean>>({
    ['Library']: false,
  });

  const isActive = (href?: string) =>
    href
      ? href === '/organizer'
        ? pathname === href
        : pathname.startsWith(href)
      : false;

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        setOpen((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`bg-[#F3F3F3] fixed md:static top-0 left-0 z-50 min-h-screen md:w-[16%] max-w-[280px] border-r border-gray-200 flex flex-col transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 md:hidden">
          {showLogo && <img src={LOGO_IMAGES} alt={APP_BRANDING} className="h-7 cursor-pointer" onClick={() => router.push("/home")} />}
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Logo (desktop) */}
        {showLogo && (
          <div className="hidden md:block p-4 border-b border-gray-100">
            <img src={LOGO_IMAGES} alt={APP_BRANDING} className="h-7 cursor-pointer"
              onClick={() => router.push("/home")} />
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-2 overflow-y-auto">
          {nav.map(({ label, href, icon: Icon, children }) => {
            const active = isActive(href);
            const hasChildren = !!children;

            return (
              <div key={label}>
                <div
                  onClick={() => {
                    if (hasChildren) {
                      toggle(label);
                    }
                  }}
                  className={[
                    'flex items-center justify-between rounded-[8px] cursor-pointer select-none',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {/* Label Section */}
                  {hasChildren ? (
                    <Link
                      href={href || '#'}
                      className="flex flex-1 items-center gap-2.5 px-3 py-2.5"
                    >
                      <Icon
                        className={[
                          'w-4 h-4',
                          active ? 'text-white' : 'text-gray-700',
                        ].join(' ')}
                      />
                      <span className="font-medium text-[0.875rem]">{label}</span>
                    </Link>
                  ) : (
                    <Link
                      href={href || '#'}
                      className="group relative flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all"
                    >
                      <Icon
                        className={[
                          'w-4 h-4',
                          active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900',
                        ].join(' ')}
                      />
                      <span className="font-medium text-[0.875rem]">{label}</span>
                    </Link>
                  )}
                  {/* Chevron for expandable items */}
                  {hasChildren && (
                    <div className="pr-3 transition-transform duration-200">
                      {open[label] ? (
                        <ChevronDown
                          className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-700'
                            }`}
                        />
                      ) : (
                        <ChevronRight
                          className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-700'
                            }`}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Section */}
                {hasChildren && open[label] && (
                  <div className="bg-gray-100 rounded-[8px] mt-1">
                    <div className="mx-2 py-2 space-y-1.5">
                      {children.map(({ label, href, icon: ChildIcon }) => {
                        const childActive = isActive(href);
                        return (
                          <Link
                            key={href}
                            href={href || '#'}
                            className={[
                              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.8rem] transition-all',
                              childActive
                                ? 'bg-gray-50 text-gray-900 font-medium'
                                : 'text-gray-600 hover:bg-gray-50',
                            ].join(' ')}
                          >
                            <ChildIcon className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <LogoutButton redirectPath="/organizer/login" />
        </div>
      </aside>
    </>
  );
}
