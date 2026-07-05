import type { Metadata } from "next";

import { CustomersPageClient } from "@/components/customers/customers-page-client";

export const metadata: Metadata = { title: "ลูกค้า" };

export default function CustomersPage() {
  return <CustomersPageClient />;
}
