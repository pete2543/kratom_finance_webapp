import { BoxIcon } from "@/components/icons";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductAvatarProps = {
  product: Product;
  isLow?: boolean;
  className?: string;
};

export function ProductAvatar({ product, isLow = false, className }: ProductAvatarProps) {
  if (product.imageUrl) {
    return (
      <div
        className={cn(
          "h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-separator bg-default",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        isLow ? "bg-warning/15 text-warning" : "bg-accent/12 text-accent",
        className,
      )}
    >
      {product.stockQty > 0 ? (
        <span className="text-sm font-bold">{formatNumber(product.stockQty)}</span>
      ) : (
        <BoxIcon width={20} height={20} />
      )}
    </div>
  );
}
