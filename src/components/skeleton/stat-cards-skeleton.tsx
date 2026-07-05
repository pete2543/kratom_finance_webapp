import { Card } from "@heroui/react";

import { SkeletonBlock, SkeletonLine } from "@/components/skeleton/skeleton-primitives";
import { cn } from "@/lib/utils";

type StatCardSkeletonProps = {
  className?: string;
};

export function StatCardSkeleton({ className, compact = false }: StatCardSkeletonProps & { compact?: boolean }) {
  if (compact) {
    return (
      <Card className={cn("ds-card h-full", className)}>
        <Card.Content className="flex flex-col gap-2 p-3">
          <SkeletonBlock className="h-8 w-8 rounded-lg" />
          <SkeletonLine className="h-3 w-16" />
          <SkeletonLine className="h-6 w-14" />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={cn("ds-card", className)}>
      <Card.Content className="flex flex-col gap-3 p-4">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-20" />
          <SkeletonLine className="h-7 w-24" />
        </div>
      </Card.Content>
    </Card>
  );
}

type StatCardsSkeletonProps = {
  count?: number;
  className?: string;
  columns?: 2 | 3;
  compact?: boolean;
};

export function StatCardsSkeleton({
  count = 3,
  className,
  columns = 3,
  compact = false,
}: StatCardsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3",
        compact || columns === 3
          ? "grid-cols-3"
          : "grid-cols-2 lg:grid-cols-3",
        className,
      )}
      aria-busy="true"
      aria-label="กำลังโหลดสรุป"
    >
      {Array.from({ length: count }, (_, index) => (
        <StatCardSkeleton key={index} compact={compact} />
      ))}
    </div>
  );
}
