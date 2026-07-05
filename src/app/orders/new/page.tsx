import type { Metadata } from "next";

import { SellForm } from "@/components/orders/sell-form";

export const metadata: Metadata = { title: "ขายสินค้า" };

export default function SellPage() {
  return <SellForm />;
}
