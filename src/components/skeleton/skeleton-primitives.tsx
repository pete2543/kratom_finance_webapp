import { Skeleton } from "@heroui/react";

import { cn } from "@/lib/utils";

type SkeletonLineProps = {
  className?: string;
};

export function SkeletonLine({ className }: SkeletonLineProps) {
  return <Skeleton className={cn("h-3.5 rounded-md", className)} />;
}

type SkeletonCircleProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const circleSize = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function SkeletonCircle({ className, size = "md" }: SkeletonCircleProps) {
  return (
    <Skeleton className={cn("shrink-0 rounded-full", circleSize[size], className)} />
  );
}

type SkeletonBlockProps = {
  className?: string;
};

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <Skeleton className={cn("rounded-xl", className)} />;
}
