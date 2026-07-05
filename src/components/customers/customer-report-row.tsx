import { Avatar, Chip } from "@heroui/react";

import { ArrowRightIcon } from "@/components/icons";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { CustomerReportItem } from "@/lib/api";

type CustomerReportRowProps = {
  customer: CustomerReportItem;
  onSelect: (customer: CustomerReportItem) => void;
};

export function CustomerReportRow({ customer, onSelect }: CustomerReportRowProps) {
  const hasOutstanding = customer.outstandingAmount > 0;
  const initial = customer.name.trim().charAt(0) || "?";

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(customer)}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-default/60"
      >
        <Avatar
          size="md"
          color={hasOutstanding ? "danger" : "accent"}
          className="shrink-0"
        >
          <Avatar.Fallback className="text-sm font-semibold">{initial}</Avatar.Fallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {customer.name}
            </p>
            {hasOutstanding ? (
              <Chip size="sm" color="danger" variant="soft" className="shrink-0">
                ค้างชำระ
              </Chip>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {customer.phone ?? "ไม่มีเบอร์โทร"}
            {customer.lastOrderDate
              ? ` · ซื้อล่าสุด ${formatDateShort(customer.lastOrderDate)}`
              : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            {hasOutstanding ? (
              <p className="text-sm font-semibold tabular-nums text-danger">
                {formatCurrency(customer.outstandingAmount)}
              </p>
            ) : (
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {formatCurrency(customer.totalAmount)}
              </p>
            )}
            <p className="text-xs text-muted">{customer.orderCount} ออเดอร์</p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors group-active:bg-default">
            <ArrowRightIcon width={14} height={14} />
          </span>
        </div>
      </button>
    </li>
  );
}
