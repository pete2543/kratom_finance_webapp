import { Card } from "@heroui/react";

import { TrendDownIcon, TrendUpIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type StatTone = "accent" | "success" | "danger" | "neutral";

const toneRing: Record<StatTone, string> = {
  accent: "text-accent bg-accent/12",
  success: "text-success bg-success/15",
  danger: "text-danger bg-danger/12",
  neutral: "text-muted bg-default",
};

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: StatTone;
  changePercent?: number;
  hint?: string;
  compact?: boolean;
  interactive?: boolean;
};

export function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
  changePercent,
  hint,
  compact = false,
  interactive = false,
}: StatCardProps) {
  const isUp = (changePercent ?? 0) >= 0;

  if (compact) {
    return (
      <Card className="ds-card h-full">
        <Card.Content className="flex h-full flex-col p-3">
          <span
            className={cn(
              "mb-2 flex h-8 w-8 items-center justify-center rounded-lg",
              toneRing[tone],
            )}
          >
            {icon}
          </span>
          <p className="line-clamp-2 text-[11px] leading-snug text-muted">{label}</p>
          <p className="mt-1.5 text-lg font-semibold tabular-nums leading-none tracking-tight">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted">
              {hint}
            </p>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "ds-card",
        interactive && "dashboard-stat-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg",
      )}
    >
      <Card.Content className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              toneRing[tone],
            )}
          >
            {icon}
          </span>
          {typeof changePercent === "number" ? (
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                isUp
                  ? "bg-success/15 text-success"
                  : "bg-danger/12 text-danger",
              )}
            >
              {isUp ? (
                <TrendUpIcon width={13} height={13} />
              ) : (
                <TrendDownIcon width={13} height={13} />
              )}
              {Math.abs(changePercent)}%
            </span>
          ) : null}
        </div>

        <div className="space-y-0.5">
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          {hint ? <p className="text-xs text-muted">{hint}</p> : null}
        </div>
      </Card.Content>
    </Card>
  );
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-5 grid grid-cols-3 gap-2 sm:gap-3", className)}>
      {children}
    </div>
  );
}
