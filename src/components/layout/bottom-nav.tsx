"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/config/nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-separator bg-surface/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="group flex flex-col items-center gap-1 py-2 text-muted transition-colors data-[active=true]:text-accent"
                data-active={isActive}
              >
                <span
                  className={cn(
                    "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-accent/12 text-accent",
                  )}
                >
                  <Icon width={22} height={22} />
                </span>
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
