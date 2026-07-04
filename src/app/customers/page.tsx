import type { Metadata } from "next";

import { UsersIcon } from "@/components/icons";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "ลูกค้า" };

export default function CustomersPage() {
  return (
    <PlaceholderPage
      title="ลูกค้า"
      description="ข้อมูลลูกค้าและวงเงินเครดิต — กำลังพัฒนา"
      icon={<UsersIcon width={30} height={30} />}
    />
  );
}
