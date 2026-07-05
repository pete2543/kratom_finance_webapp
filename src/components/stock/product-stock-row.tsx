import { Chip, ProgressBar } from "@heroui/react";

import { InboxInIcon } from "@/components/icons";
import { ProductAvatar } from "@/components/stock/product-avatar";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/types";

const LOW_STOCK_THRESHOLD = 10;

type ProductStockRowProps = {
  product: Product;
  onInbound: (product: Product) => void;
};

export function ProductStockRow({ product, onInbound }: ProductStockRowProps) {
  const isLow = product.stockQty <= LOW_STOCK_THRESHOLD;
  const ratio = Math.min(product.stockQty / LOW_STOCK_THRESHOLD, 1);

  return (
    <li className="px-4 py-3.5">
      <div className="flex items-start gap-3">
        <ProductAvatar product={product} isLow={isLow} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{product.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                คงเหลือ {formatNumber(product.stockQty)} {product.unit}
              </p>
            </div>
            {isLow ? (
              <Chip size="sm" color="warning" variant="soft" className="shrink-0">
                ใกล้หมด
              </Chip>
            ) : null}
          </div>

          {isLow ? (
            <ProgressBar
              value={ratio * 100}
              color="warning"
              size="sm"
              className="mt-2.5"
              aria-label={`คงเหลือ ${product.name}`}
            >
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onInbound(product)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent/10 px-3 py-2.5 text-sm font-semibold text-accent transition-colors active:bg-accent/20"
      >
        <InboxInIcon width={18} height={18} />
        รับของเข้า
      </button>
    </li>
  );
}

export { LOW_STOCK_THRESHOLD };
