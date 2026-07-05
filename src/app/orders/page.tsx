import type { Metadata } from "next";

import { OrdersPageClient } from "@/components/orders/orders-page-client";

export const metadata: Metadata = { title: "ออเดอร์" };

export default function OrdersPage() {
  return <OrdersPageClient />;
}
