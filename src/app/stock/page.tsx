import type { Metadata } from "next";

import { BoxIcon } from "@/components/icons";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "สต็อก" };

export default function StockPage() {
  return (
    <PlaceholderPage
      title="สต็อกสินค้า"
      description="จัดการคลังและการเคลื่อนไหวสต็อก — กำลังพัฒนา"
      icon={<BoxIcon width={30} height={30} />}
    />
  );
}
