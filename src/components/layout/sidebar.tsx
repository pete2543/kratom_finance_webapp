"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/layout/brand-logo";
import { navItems } from "@/config/nav";
import { isNavItemActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-separator bg-surface px-4 py-6 lg:flex">
      <BrandMark
        size="md"
        showTagline
        showLink
        className="px-2"
      />

      <nav aria-label="เมนูหลัก" className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "nav-link group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:bg-default hover:text-foreground active:scale-[0.98]",
                isActive && "bg-accent/12 text-accent hover:bg-accent/16 hover:text-accent",
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-1 w-0.5 rounded-full bg-accent transition-opacity duration-200"
                />
              ) : null}
              <Icon
                width={20}
                height={20}
                className={cn(
                  "relative z-10 transition-transform duration-200 group-active:scale-90",
                  isActive && "text-accent",
                )}
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
