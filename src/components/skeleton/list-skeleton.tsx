import { SkeletonCircle, SkeletonLine } from "@/components/skeleton/skeleton-primitives";
import { cn } from "@/lib/utils";

type ListRowSkeletonProps = {
  className?: string;
  avatarShape?: "circle" | "rounded";
  avatarSize?: "sm" | "md" | "lg";
  withTrailing?: boolean;
  withSubtitle?: boolean;
};

export function ListRowSkeleton({
  className,
  avatarShape = "circle",
  avatarSize = "md",
  withTrailing = true,
  withSubtitle = true,
}: ListRowSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3.5", className)}>
      {avatarShape === "circle" ? (
        <SkeletonCircle size={avatarSize} />
      ) : (
        <SkeletonCircle size={avatarSize} className="rounded-xl" />
      )}

      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonLine className="w-2/5" />
        {withSubtitle ? <SkeletonLine className="w-3/5" /> : null}
      </div>

      {withTrailing ? (
        <div className="flex shrink-0 flex-col items-end gap-2">
          <SkeletonLine className="h-4 w-14" />
          <SkeletonLine className="h-3 w-10" />
        </div>
      ) : null}
    </div>
  );
}

type ListSkeletonProps = {
  count?: number;
  className?: string;
  rowClassName?: string;
  withTrailing?: boolean;
  avatarShape?: "circle" | "rounded";
};

export function ListSkeleton({
  count = 5,
  className,
  rowClassName,
  withTrailing = true,
  avatarShape = "circle",
}: ListSkeletonProps) {
  return (
    <ul
      className={cn("divide-y divide-separator", className)}
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ListRowSkeleton
            className={rowClassName}
            withTrailing={withTrailing}
            avatarShape={avatarShape}
          />
        </li>
      ))}
    </ul>
  );
}
