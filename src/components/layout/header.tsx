import { Button } from "@heroui/react";

import { BellIcon } from "@/components/icons";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { siteConfig } from "@/config/site";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-separator bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex flex-col leading-tight lg:hidden">
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.name}
          </span>
          <span className="text-xs text-muted">ระบบรายรับรายจ่าย</span>
        </div>

        <div className="hidden flex-col leading-tight lg:flex">
          <span className="text-base font-semibold text-foreground">
            {title ?? "ภาพรวม"}
          </span>
          {subtitle ? (
            <span className="text-xs text-muted">{subtitle}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label="การแจ้งเตือน"
            className="relative"
          >
            <BellIcon width={20} height={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
