import type { Metadata } from "next";

import { WalletIcon } from "@/components/icons";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "การเงิน" };

export default function WalletPage() {
  return (
    <PlaceholderPage
      title="การเงิน"
      description="รายรับรายจ่ายและการชำระเงิน — กำลังพัฒนา"
      icon={<WalletIcon width={30} height={30} />}
    />
  );
}
