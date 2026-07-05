import { SkeletonBlock, SkeletonCircle, SkeletonLine } from "@/components/skeleton/skeleton-primitives";
import { cn } from "@/lib/utils";

type ProductRowSkeletonProps = {
  className?: string;
  withAction?: boolean;
};

/** แถวสินค้า — ใช้ในหน้าสต็อก (มีปุ่มด้านล่าง) */
export function ProductRowSkeleton({
  className,
  withAction = true,
}: ProductRowSkeletonProps) {
  return (
    <div className={cn("px-4 py-3.5", className)}>
      <div className="flex items-start gap-3">
        <SkeletonCircle size="md" className="rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLine className="w-2/5" />
          <SkeletonLine className="w-1/3" />
        </div>
      </div>
      {withAction ? <SkeletonBlock className="mt-3 h-10 w-full" /> : null}
    </div>
  );
}

type ProductListSkeletonProps = {
  count?: number;
  className?: string;
  withAction?: boolean;
};

export function ProductListSkeleton({
  count = 4,
  className,
  withAction = true,
}: ProductListSkeletonProps) {
  return (
    <ul
      className={cn("divide-y divide-separator", className)}
      aria-busy="true"
      aria-label="กำลังโหลดสินค้า"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ProductRowSkeleton withAction={withAction} />
        </li>
      ))}
    </ul>
  );
}

type CompactProductRowSkeletonProps = {
  className?: string;
};

/** แถวสินค้าแบบกะทัดรัด — ใช้ในหน้าขาย */
export function CompactProductRowSkeleton({ className }: CompactProductRowSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-3 px-1 py-2.5", className)}>
      <SkeletonCircle size="md" className="rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonLine className="w-2/5" />
        <SkeletonLine className="w-1/4" />
      </div>
      <SkeletonBlock className="h-9 w-16 rounded-full" />
    </div>
  );
}

type CompactProductListSkeletonProps = {
  count?: number;
  className?: string;
};

export function CompactProductListSkeleton({
  count = 5,
  className,
}: CompactProductListSkeletonProps) {
  return (
    <ul
      className={cn("-mx-1 divide-y divide-separator", className)}
      aria-busy="true"
      aria-label="กำลังโหลดสินค้า"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CompactProductRowSkeleton />
        </li>
      ))}
    </ul>
  );
}
