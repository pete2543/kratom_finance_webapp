import {
  BoxIcon,
  HomeIcon,
  ReceiptIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof HomeIcon;
};

export const navItems: NavItem[] = [
  { href: "/", label: "ภาพรวม", icon: HomeIcon },
  { href: "/orders", label: "ออเดอร์", icon: ReceiptIcon },
  { href: "/wallet", label: "การเงิน", icon: WalletIcon },
  { href: "/stock", label: "สต็อก", icon: BoxIcon },
  { href: "/customers", label: "ลูกค้า", icon: UsersIcon },
];
