import { cn } from "@/lib/utils";

type MobileActionBarProps = {
  children: React.ReactNode;
  className?: string;
  /** ชิดขอบล่าง — ใช้เมื่อซ่อน bottom nav (เช่น หน้าขาย) */
  flush?: boolean;
};

export function MobileActionBar({
  children,
  className,
  flush = false,
}: MobileActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 z-30 border-t border-separator bg-surface/95 backdrop-blur lg:hidden",
        flush
          ? "bottom-0 pb-[env(safe-area-inset-bottom,0px)]"
          : "bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3 sm:px-6">
        {children}
      </div>
    </div>
  );
}
