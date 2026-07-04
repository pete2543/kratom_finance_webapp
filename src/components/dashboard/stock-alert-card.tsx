import { Card, ProgressBar } from "@heroui/react";

import { AlertIcon } from "@/components/icons";
import type { StockAlert } from "@/types";

type StockAlertCardProps = {
  alerts: StockAlert[];
};

export function StockAlertCard({ alerts }: StockAlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <Card className="ds-card border border-warning/30 bg-warning/5">
      <Card.Content className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20 text-warning">
            <AlertIcon width={18} height={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              สินค้าใกล้หมด
            </p>
            <p className="text-xs text-muted">ควรสั่งเพิ่ม {alerts.length} รายการ</p>
          </div>
        </div>

        <ul className="space-y-3">
          {alerts.map((a) => {
            const ratio = Math.min(a.stockQty / a.reorderLevel, 1);
            return (
              <li key={a.productId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-foreground">
                    {a.productName}
                  </span>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-warning">
                    เหลือ {a.stockQty} {a.unit}
                  </span>
                </div>
                <ProgressBar
                  value={ratio * 100}
                  color="warning"
                  size="sm"
                  aria-label={`คงเหลือ ${a.productName}`}
                >
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
              </li>
            );
          })}
        </ul>
      </Card.Content>
    </Card>
  );
}
