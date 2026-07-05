import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
} from "@/components/skeleton/skeleton-primitives";
import { ListSkeleton } from "@/components/skeleton/list-skeleton";

export function CustomerDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="กำลังโหลดข้อมูลลูกค้า">
      <div className="flex items-start gap-3">
        <SkeletonCircle size="lg" className="rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <SkeletonLine className="h-5 w-2/5" />
          <SkeletonLine className="w-1/3" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-[4.5rem] w-full" />
        ))}
      </div>

      <SkeletonBlock className="h-28 w-full" />

      <div className="space-y-2">
        <SkeletonLine className="w-1/3" />
        <ListSkeleton count={3} withTrailing className="-mx-5 border-y border-separator" />
      </div>
    </div>
  );
}
