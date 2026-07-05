"use client";

import Link from "next/link";

import {
  InboxInIcon,
  PlusIcon,
  ReceiptIcon,
  UsersIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/orders/new",
    label: "ขายสินค้า",
    icon: PlusIcon,
    tone: "primary" as const,
  },
  {
    href: "/stock",
    label: "รับของเข้า",
    icon: InboxInIcon,
    tone: "tonal" as const,
  },
  {
    href: "/customers",
    label: "ลูกค้า",
    icon: UsersIcon,
    tone: "tonal" as const,
  },
  {
    href: "/orders",
    label: "ออเดอร์",
    icon: ReceiptIcon,
    tone: "tonal" as const,
  },
];

const toneClass = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--accent)_55%,transparent)]",
  tonal: "bg-surface text-foreground shadow-surface hover:bg-default/80",
};

export function QuickActions() {
  return (
    <div className="dashboard-stagger mb-5" style={{ "--stagger": 2 } as React.CSSProperties}>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
        ทางลัด
      </p>
      <div className="dashboard-quick-actions -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {actions.map(({ href, label, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "dashboard-quick-action group flex min-w-[5.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-3.5 transition-transform active:scale-95",
              toneClass[tone],
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                tone === "primary" ? "bg-white/18" : "bg-accent/10 text-accent",
              )}
            >
              <Icon width={18} height={18} />
            </span>
            <span className="text-center text-[11px] font-semibold leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
