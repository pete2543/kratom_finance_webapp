import type { Metadata } from "next";

import { AddProductForm } from "@/components/stock/add-product-form";

export const metadata: Metadata = { title: "เพิ่มสินค้า" };

export default function AddProductPage() {
  return <AddProductForm />;
}
