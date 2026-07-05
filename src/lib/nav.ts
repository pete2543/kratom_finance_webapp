import type { NavItem } from "@/config/nav";

export function isNavItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function getActiveNavIndex(pathname: string, items: NavItem[]) {
  return items.findIndex((item) => isNavItemActive(pathname, item.href));
}

/** ตำแหน่ง slot ใน bottom nav (5 ช่อง — กลางเป็นปุ่มขาย) */
export function getBottomNavActiveSlot(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/orders") && pathname !== "/orders/new") return 1;
  if (pathname.startsWith("/stock")) return 3;
  if (pathname.startsWith("/customers")) return 4;
  return -1;
}
