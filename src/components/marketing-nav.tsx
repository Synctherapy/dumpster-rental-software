'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { Brand } from '@/components/brand';

export interface NavItem {
  name: string;
  href: string;
  desc: string;
  isAllLink?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'features',
    label: 'Features',
    items: [
      {
        name: 'Online Booking Widget',
        href: '/features/online-booking',
        desc: 'Take orders & payments on your website 24/7',
      },
      {
        name: 'Visual Dispatch Board',
        href: '/features/dispatch-board',
        desc: 'Drag-and-drop schedule for deliveries & pickups',
      },
      {
        name: 'Driver SMS Routes',
        href: '/features/driver-routes',
        desc: 'Send route links to drivers with zero app download',
      },
      {
        name: 'Scale Tickets & Invoicing',
        href: '/features/tonnage-billing',
        desc: 'Charge extra tonnage and overage fees automatically',
      },
      {
        name: 'View All Software Features',
        href: '/features',
        desc: 'Complete suite of roll-off operations tools',
        isAllLink: true,
      },
    ],
  },
  {
    id: 'tools',
    label: 'Free Tools',
    items: [
      {
        name: 'Tonnage & Overage Calculator',
        href: '/tools/tonnage-calculator',
        desc: 'Calculate overweight dump fees instantly',
      },
      {
        name: 'Software Savings Calculator',
        href: '/tools/savings-calculator',
        desc: 'See how much you save vs Docket or ServiceCore',
      },
      {
        name: 'View All Free Tools',
        href: '/tools',
        desc: 'All interactive calculators for roll-off haulers',
        isAllLink: true,
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    items: [
      {
        name: 'Dumpster Rental Contract',
        href: '/templates/dumpster-rental-contract',
        desc: 'Ready-to-use customer liability agreement',
      },
      {
        name: 'Dumpster Invoice Template',
        href: '/templates/dumpster-invoice',
        desc: 'Professional invoice maker for haulers',
      },
      {
        name: 'View All Templates',
        href: '/templates',
        desc: 'Free legal and operational templates',
        isAllLink: true,
      },
    ],
  },
  {
    id: 'compare',
    label: 'Compare',
    items: [
      {
        name: 'vs. Docket',
        href: '/vs/docket',
        desc: 'Why haulers switch from Docket’s $300/mo fee',
      },
      {
        name: 'vs. ServiceCore',
        href: '/vs/servicecore',
        desc: 'Built for roll-off dumpsters, not septic trucks',
      },
      {
        name: 'vs. Dumpster Rental Systems',
        href: '/vs/dumpster-rental-systems',
        desc: 'No container caps or surprise price jumps',
      },
      {
        name: 'All Comparisons',
        href: '/compare',
        desc: 'Compare RollOS side-by-side with alternatives',
        isAllLink: true,
      },
    ],
  },
];

export interface MarketingNavProps {
  currentPath?: string;
}

export function MarketingNav({ currentPath }: MarketingNavProps = {}) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({
    features: true,
    tools: false,
    templates: false,
    compare: false,
  });

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Escape key & click outside listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (sectionId: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(sectionId);
  };

  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleTriggerClick = (sectionId: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown((prev) => (prev === sectionId ? null : sectionId));
  };

  const toggleMobileSection = (sectionId: string) => {
    setExpandedMobileSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <header className={`marketing-nav-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav ref={navRef} className="marketing-nav" aria-label="Main Navigation">
        {/* Brand Logo */}
        <Brand />

        {/* Desktop Navigation Links & Dropdowns */}
        <div className="marketing-desktop-nav" role="menubar">
          {NAV_SECTIONS.map((section) => {
            const isOpen = activeDropdown === section.id;
            const isSectionActive =
              activePath?.startsWith(`/${section.id}`) ||
              (section.id === 'compare' && activePath?.startsWith('/vs'));

            return (
              <div
                key={section.id}
                className="nav-dropdown"
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`nav-dropdown-btn ${isOpen ? 'open' : ''} ${isSectionActive ? 'active' : ''}`}
                  onClick={() => handleTriggerClick(section.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label={`${section.label} menu`}
                >
                  <span>{section.label}</span>
                  <ChevronDown size={14} className={`nav-chevron ${isOpen ? 'open' : ''}`} />
                </button>

                {/* Dropdown Menu Panel */}
                <div
                  className={`nav-dropdown-menu ${isOpen ? 'open' : ''}`}
                  role="menu"
                  aria-label={`${section.label} links`}
                  onMouseEnter={() => handleMouseEnter(section.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="nav-dropdown-menu-inner">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-dropdown-item ${item.isAllLink ? 'nav-dropdown-item-all' : ''}`}
                        role="menuitem"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="nav-dropdown-item-title">
                          <span>{item.name}</span>
                          {item.isAllLink ? (
                            <ArrowRight size={13} className="text-[#ea580c] transition-transform group-hover:translate-x-0.5" />
                          ) : null}
                        </div>
                        <div className="nav-dropdown-item-desc">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pricing Link */}
          <Link
            href="/pricing"
            className={`nav-link-direct ${activePath === '/pricing' ? 'active' : ''}`}
            role="menuitem"
          >
            Pricing
          </Link>
        </div>

        {/* Right Actions: Log In + Start Free Demo */}
        <div className="marketing-nav-actions">
          <Link href="/login" className="nav-action-login">
            Log In
          </Link>
          <Link href="/signup" className="btn btn-orange nav-action-cta">
            <span>Start Free in 3 Min →</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="marketing-mobile-btn"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Responsive Drawer & Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="marketing-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`marketing-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header with Brand & Close Button */}
        <div className="marketing-mobile-header">
          <Brand />
          <button
            type="button"
            className="marketing-mobile-close"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content Silos */}
        <div className="marketing-mobile-content">
          {NAV_SECTIONS.map((section) => {
            const isExpanded = !!expandedMobileSections[section.id];
            return (
              <div key={section.id} className="marketing-mobile-section">
                <button
                  type="button"
                  className="marketing-mobile-accordion-btn"
                  onClick={() => toggleMobileSection(section.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="font-bold text-[#20332a] text-sm">{section.label}</span>
                  <ChevronDown
                    size={16}
                    className={`nav-chevron transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#ea580c]' : 'text-[#748777]'}`}
                  />
                </button>

                {isExpanded && (
                  <div className="marketing-mobile-links">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`marketing-mobile-link ${item.isAllLink ? 'marketing-mobile-link-all' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="marketing-mobile-link-title">
                          <span>{item.name}</span>
                          {item.isAllLink && <ArrowRight size={13} className="text-[#ea580c]" />}
                        </div>
                        <div className="marketing-mobile-link-desc">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Direct Pricing Link in Mobile */}
          <div className="marketing-mobile-section">
            <Link
              href="/pricing"
              className="marketing-mobile-direct-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Pricing</span>
              <ArrowRight size={15} className="text-[#647867]" />
            </Link>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="marketing-mobile-actions">
          <Link
            href="/login"
            className="marketing-mobile-login-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="btn btn-orange w-full text-center font-bold text-sm py-3 justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Free in 3 Min →
          </Link>
        </div>
      </div>
    </header>
  );
}
