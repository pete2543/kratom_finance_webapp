import { Chip } from "@heroui/react";

import { formatDateShort, formatNumber, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StockTransaction } from "@/lib/api";

const typeTone: Record<string, "success" | "danger" | "warning" | "default"> = {
  IN: "success",
  OUT: "danger",
  ADJUST: "warning",
};

type StockTransactionRowProps = {
  transaction: StockTransaction;
};

export function StockTransactionRow({ transaction }: StockTransactionRowProps) {
  const tone = typeTone[transaction.typeCode ?? ""] ?? "default";
  const signedQty =
    transaction.typeCode === "OUT"
      ? -transaction.quantity
      : transaction.quantity;

  return (
    <li className="flex items-start gap-3 px-4 py-3.5">
      <div
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
          tone === "success" && "bg-success/15 text-success",
          tone === "danger" && "bg-danger/12 text-danger",
          tone === "warning" && "bg-warning/15 text-warning",
          tone === "default" && "bg-default text-muted",
        )}
      >
        {transaction.typeCode?.slice(0, 1) ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {transaction.productName ?? `สินค้า #${transaction.productId}`}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {transaction.typeLabelTh ?? transaction.typeCode ?? "ธุรกรรม"}
              {transaction.createdDate
                ? ` · ${formatDateShort(transaction.createdDate)} ${formatTime(transaction.createdDate)}`
                : null}
            </p>
          </div>
          <p
            className={cn(
              "shrink-0 text-base font-semibold tabular-nums",
              signedQty >= 0 ? "text-success" : "text-danger",
            )}
          >
            {signedQty >= 0 ? "+" : ""}
            {formatNumber(signedQty)}
          </p>
        </div>

        {transaction.note ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{transaction.note}</p>
        ) : null}

        {transaction.typeCode ? (
          <Chip size="sm" variant="soft" color={tone} className="mt-2">
            {transaction.typeLabelTh ?? transaction.typeCode}
          </Chip>
        ) : null}
      </div>
    </li>
  );
}
