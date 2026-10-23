"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { ModalTrigger } from "@/components/interactive";
import { ICON, bilingual } from "@/components/ui";
import { NAV, type NavItem } from "@/lib/nav";
import data_site from "@/data/site.json";
import { textMap, slotMap } from "@/lib/content";

const txt = textMap(data_site.texts);
const imgs = slotMap(data_site.images);

const isActive = (item: NavItem, pathname: string) =>
  [item.href, ...(item.dropdown ?? []).map((d) => d.href)].some(
    (href) => href === pathname,
  );

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Keep the sticky header out of the way while scrolling down and reveal it on the way back up.
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80 || delta < -6 || mobileOpen) {
        setHiddenOnScroll(false);
      } else if (delta > 6) {
        setHiddenOnScroll(true);
      }

      if (Math.abs(delta) > 6) lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  if (pathname.replace(/\/$/, "") === "/frontpage") return null;

  const iconBtn =
    "w-9 h-9 flex items-center justify-center rounded-full border border-charcoal-900/15 text-charcoal-700";

  return (
    <header
      className={`site-header${hiddenOnScroll && !mobileOpen ? " site-header-hidden" : ""}`}
      onFocusCapture={() => setHiddenOnScroll(false)}
    >
      <div className="wrap flex items-center justify-between h-[76px] gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgs.i2.src}
            alt={imgs.i2.alt}
            className="w-11 h-11 rounded-full object-contain shrink-0"
          />
          <div className="leading-tight">
            <div className="font-display text-[1.05rem] text-green-900 font-semibold">
              {bilingual(txt.t21.en, txt.t21.bn)}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => {
            const activeCls = isActive(item, pathname) ? "active" : "";
            if (!item.dropdown) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link ${activeCls}`}
                >
                  {bilingual(item.en, item.bn)}
                </Link>
              );
            }
            return (
              <div key={item.id} className="has-dropdown relative">
                <button
                  type="button"
                  className={`nav-link ${activeCls} inline-flex items-center gap-1`}
                >
                  {bilingual(item.en, item.bn)} {ICON.chevron}
                </button>
                <div className="dropdown-panel absolute left-0 top-full pt-3 w-64">
                  <div className="bg-white border border-charcoal-900/10 rounded-sm shadow-lg p-2">
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.href}
                        href={d.href}
                        className="block px-4 py-3 rounded-sm hover:bg-cream-100 transition-colors"
                      >
                        <span className="block text-sm font-semibold text-charcoal-900">
                          {bilingual(d.en, d.bn)}
                        </span>
                        <span className="block text-xs text-charcoal-500 mt-0.5">
                          {bilingual(d.sub_en ?? "", d.sub_bn ?? "")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <ModalTrigger
            modal="searchModal"
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-charcoal-900/15 text-charcoal-700 hover:border-green-900 hover:text-green-900 transition-colors"
          >
            {ICON.search}
          </ModalTrigger>
          <LanguageSwitch />
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <ModalTrigger
            modal="searchModal"
            aria-label="Search"
            className={iconBtn}
          >
            {ICON.search}
          </ModalTrigger>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobileNav"
            aria-label="Menu"
            className={iconBtn}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {ICON.menu}
          </button>
        </div>
      </div>

      <div
        id="mobileNav"
        ref={panelRef}
        className={`lg:hidden border-t border-charcoal-900/10 ${mobileOpen ? "is-open" : ""}`}
        style={{
          maxHeight: mobileOpen ? (panelRef.current?.scrollHeight ?? 1000) : 0,
        }}
      >
        <div className="wrap py-3">
          {NAV.map((item) =>
            item.dropdown ? (
              <details
                key={item.id}
                className="border-b border-charcoal-900/10 py-2"
              >
                <summary className="py-2 font-semibold text-charcoal-900 cursor-pointer">
                  {bilingual(item.en, item.bn)}
                </summary>
                <div className="pl-3 pb-2 flex flex-col gap-2">
                  {item.dropdown.map((d) => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className="py-1.5 text-sm text-charcoal-700"
                    >
                      {bilingual(d.en, d.bn)}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className="block py-3 border-b border-charcoal-900/10 font-semibold text-charcoal-900"
              >
                {bilingual(item.en, item.bn)}
              </Link>
            ),
          )}
          <div className="pt-4">
            <LanguageSwitch className="w-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
