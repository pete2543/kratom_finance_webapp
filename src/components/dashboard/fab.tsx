import Link from "next/link";

import { PlusIcon } from "@/components/icons";

export function Fab() {
  return (
    <Link
      href="/orders/new"
      aria-label="เพิ่มรายการขาย"
      className="fixed bottom-24 right-4 z-40 flex h-14 items-center gap-2 rounded-2xl bg-accent px-5 font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-opacity active:opacity-90 lg:bottom-8 lg:right-8"
    >
      <PlusIcon width={22} height={22} />
      <span>ขายสินค้า</span>
    </Link>
  );
}
