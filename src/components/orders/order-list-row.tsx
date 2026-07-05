import { Avatar, Chip } from "@heroui/react";

import { ArrowRightIcon } from "@/components/icons";
import { formatCurrency, formatDateShort, formatTime } from "@/lib/format";
import type { Order } from "@/types";

const statusColor: Record<
  Order["paymentStatus"],
  "success" | "warning" | "danger"
> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
};

type OrderListRowProps = {
  order: Order;
  onSelect: (order: Order) => void;
};

export function OrderListRow({ order, onSelect }: OrderListRowProps) {
  const initial = order.customerName.trim().charAt(0) || "?";
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(order)}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-default/60"
      >
        <Avatar size="md" color="accent" className="shrink-0">
          <Avatar.Fallback className="text-sm font-semibold">{initial}</Avatar.Fallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {order.customerName}
            </p>
            <span className="shrink-0 text-xs text-muted">·</span>
            <span className="shrink-0 truncate text-xs text-muted">
              {order.saleTypeLabelTh}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {order.code} · {formatDateShort(order.orderDate)}{" "}
            {formatTime(order.orderDate)} น.
            {itemCount > 0 ? ` · ${itemCount} ชิ้น` : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-foreground">
              {formatCurrency(order.totalAmount)}
            </p>
            <Chip
              size="sm"
              variant="soft"
              color={statusColor[order.paymentStatus]}
              className="mt-1"
            >
              {order.paymentStatusLabelTh}
            </Chip>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors group-active:bg-default">
            <ArrowRightIcon width={14} height={14} />
          </span>
        </div>
      </button>
    </li>
  );
}

export { statusColor as orderStatusColor };
