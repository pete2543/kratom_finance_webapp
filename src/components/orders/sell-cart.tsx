import { TrashIcon } from "@/components/icons";
import { ProductAvatar } from "@/components/stock/product-avatar";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types";

export type SellCartLine = {
  product: Product;
  quantity: number;
};

type SellCartProps = {
  lines: SellCartLine[];
  onQtyChange: (product: Product, quantity: number) => void;
  disabled?: boolean;
};

export function SellCart({ lines, onQtyChange, disabled = false }: SellCartProps) {
  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-separator px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">ตะกร้าว่าง</p>
        <p className="mt-1 text-xs text-muted">
          แตะ &quot;เพิ่มสินค้า&quot; เพื่อเลือกจากรายการทั้งหมด
        </p>
      </div>
    );
  }

  return (
    <ul
      className={[
        "divide-y divide-separator rounded-xl border border-separator",
        lines.length > 4 ? "max-h-72 overflow-y-auto" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {lines.map(({ product, quantity }) => {
        const subtotal = product.sellingPrice * quantity;

        return (
          <li key={product.id} className="flex items-center gap-3 px-3 py-3">
            <ProductAvatar product={product} className="h-10 w-10 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {product.name}
              </p>
              <p className="text-xs text-muted">
                {formatCurrency(product.sellingPrice)} × {quantity} ={" "}
                {formatCurrency(subtotal)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onQtyChange(product, quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-default text-foreground active:opacity-70 disabled:opacity-40"
                aria-label="ลด"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                disabled={disabled || quantity >= product.stockQty}
                onClick={() => onQtyChange(product, quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground active:opacity-80 disabled:opacity-40"
                aria-label="เพิ่ม"
              >
                +
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onQtyChange(product, 0)}
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-danger active:bg-danger/10 disabled:opacity-40"
                aria-label="ลบ"
              >
                <TrashIcon width={16} height={16} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
