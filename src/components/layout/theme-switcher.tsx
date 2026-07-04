"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeSwitcher() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" isIconOnly isDisabled aria-label="สลับธีม">
        <SunIcon width={20} height={20} />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      isIconOnly
      aria-label={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <SunIcon width={20} height={20} />
      ) : (
        <MoonIcon width={20} height={20} />
      )}
    </Button>
  );
}
