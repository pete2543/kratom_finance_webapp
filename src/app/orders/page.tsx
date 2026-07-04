import type { Metadata } from "next";

import { ReceiptIcon } from "@/components/icons";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "ออเดอร์" };

export default function OrdersPage() {
  return (
    <PlaceholderPage
      title="ออเดอร์"
      description="รายการคำสั่งซื้อทั้งหมด — กำลังพัฒนา"
      icon={<ReceiptIcon width={30} height={30} />}
    />
  );
}
