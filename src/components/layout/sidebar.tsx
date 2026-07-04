"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-separator bg-surface px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold">
          ก
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.name}
          </span>
          <span className="text-xs text-muted">ระบบรายรับรายจ่าย</span>
        </div>
      </div>

      <nav aria-label="เมนูหลัก" className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground",
                isActive && "bg-accent/12 text-accent hover:bg-accent/16 hover:text-accent",
              )}
            >
              <Icon width={20} height={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
