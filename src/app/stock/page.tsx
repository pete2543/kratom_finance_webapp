import type { Metadata } from "next";

import { StockPageClient } from "@/components/stock/stock-page-client";

export const metadata: Metadata = { title: "สต็อก" };

export default function StockPage() {
  return <StockPageClient />;
}
