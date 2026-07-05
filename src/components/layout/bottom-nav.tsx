"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PlusIcon } from "@/components/icons";
import type { NavItem } from "@/config/nav";
import { navItems } from "@/config/nav";
import { getBottomNavActiveSlot, isNavItemActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const SLOT_COUNT = 5;

function NavItemLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "nav-link group flex flex-col items-center gap-0.5 py-1.5 text-muted transition-colors duration-200",
          isActive && "text-accent",
        )}
      >
        <span
          className={cn(
            "relative z-10 flex h-8 w-full items-center justify-center rounded-full transition-transform duration-200 group-active:scale-90",
            isActive && "text-accent",
          )}
        >
          <Icon width={22} height={22} />
        </span>
        <span
          className={cn(
            "relative z-10 text-[11px] font-medium leading-none transition-all duration-200",
            isActive && "font-semibold",
          )}
        >
          {item.label}
        </span>
      </Link>
    </li>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/orders/new") {
    return null;
  }

  const activeSlot = getBottomNavActiveSlot(pathname);
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-separator bg-surface/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="relative mx-auto max-w-lg px-1">
        {activeSlot >= 0 ? (
          <span
            aria-hidden
            className="nav-indicator pointer-events-none absolute top-2.5 h-8 rounded-full bg-accent/12 transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${100 / SLOT_COUNT}%`,
              left: `${(100 / SLOT_COUNT) * activeSlot}%`,
            }}
          />
        ) : null}

        <ul className="relative grid grid-cols-5 items-end">
          {leftItems.map((item) => (
            <NavItemLink key={item.href} item={item} pathname={pathname} />
          ))}

          <li className="flex flex-col items-center pb-1">
            <Link
              href="/orders/new"
              aria-label="ขายสินค้า"
              className={cn(
                "relative z-10 -mt-5 flex h-[3.25rem] w-[3.25rem] touch-manipulation items-center justify-center rounded-full bg-accent text-accent-foreground",
                "shadow-[0_6px_20px_-6px] shadow-accent/50 ring-[3px] ring-surface",
                "transition-transform active:scale-95",
              )}
            >
              <PlusIcon width={22} height={22} />
            </Link>
            <span className="relative z-10 mt-1 text-[11px] font-semibold leading-none text-accent">
              ขาย
            </span>
          </li>

          {rightItems.map((item) => (
            <NavItemLink key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </div>
    </nav>
  );
}
