"use client";

import { Button } from "@heroui/react";

import { PlusIcon } from "@/components/icons";

export function Fab() {
  return (
    <Button
      variant="primary"
      aria-label="เพิ่มรายการขาย"
      onPress={() => {}}
      className="fixed bottom-24 right-4 z-40 h-14 gap-2 rounded-2xl px-5 shadow-lg shadow-accent/30 lg:bottom-8 lg:right-8"
    >
      <PlusIcon width={22} height={22} />
      <span className="font-semibold">ขายสินค้า</span>
    </Button>
  );
}
