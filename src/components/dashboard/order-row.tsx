import { Chip } from "@heroui/react";

import { formatCurrency, formatDateShort, formatTime } from "@/lib/format";
import { paymentStatusLabels, saleTypeLabels } from "@/lib/mock-data";
import type { Order } from "@/types";

const statusColor: Record<
  Order["paymentStatus"],
  "success" | "warning" | "danger"
> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
};

type OrderRowProps = {
  order: Order;
};

export function OrderRow({ order }: OrderRowProps) {
  const initial = order.customerName.trim().charAt(0);

  return (
    <li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-default/60">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-base font-semibold text-accent">
        {initial}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {order.customerName}
          </p>
          <span className="shrink-0 text-xs text-muted">·</span>
          <span className="shrink-0 text-xs text-muted">
            {saleTypeLabels[order.saleType]}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {order.code} · {formatDateShort(order.orderDate)}{" "}
          {formatTime(order.orderDate)} น.
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold tabular-nums">
          {formatCurrency(order.totalAmount)}
        </span>
        <Chip
          size="sm"
          variant="soft"
          color={statusColor[order.paymentStatus]}
        >
          {paymentStatusLabels[order.paymentStatus]}
        </Chip>
      </div>
    </li>
  );
}
