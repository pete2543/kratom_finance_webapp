"use client";

import type { IconType } from "react-icons";

import { cn } from "@/lib/utils";

export type SegmentedControlItem<T extends string> = {
  id: T;
  label: string;
  icon?: IconType;
};

type SegmentedControlProps<T extends string> = {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  ariaLabel = "ตัวกรอง",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("grid gap-1 rounded-xl bg-default p-1", className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const isActive = value === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all",
              isActive
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted active:opacity-80",
            )}
          >
            {Icon ? <Icon size={14} aria-hidden /> : null}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
