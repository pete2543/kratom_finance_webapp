"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  useOverlayState,
} from "@heroui/react";

import { MinusIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { ProductAvatar } from "@/components/stock/product-avatar";
import { CompactProductListSkeleton } from "@/components/skeleton";
import { ApiError, productsApi } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent";

type ProductPickerDrawerProps = {
  cart: Record<number, number>;
  onQtyChange: (product: Product, quantity: number) => void;
  state: ReturnType<typeof useOverlayState>;
};

export function ProductPickerDrawer({
  cart,
  onQtyChange,
  state,
}: ProductPickerDrawerProps) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await productsApi.list({
        page: 1,
        limit: 100,
        isActive: true,
        search: query.trim() || undefined,
      });
      setProducts(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดสินค้าไม่สำเร็จ");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!state.isOpen) return;
    setSearch("");
    void loadProducts("");
  }, [state.isOpen, loadProducts]);

  useEffect(() => {
    if (!state.isOpen) return;
    const timer = window.setTimeout(() => {
      void loadProducts(search);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, state.isOpen, loadProducts]);

  const resultLabel = useMemo(() => {
    if (loading) return "กำลังค้นหา...";
    return `พบ ${products.length} รายการ`;
  }, [loading, products.length]);

  function bump(product: Product, delta: number) {
    const current = cart[product.id] ?? 0;
    const next = current + delta;
    if (next > product.stockQty) return;
    onQtyChange(product, Math.max(0, next));
  }

  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-2" />
            <Drawer.Header className="shrink-0 border-b border-separator px-5 py-4">
              <Drawer.Heading className="text-base font-semibold">
                เลือกสินค้า
              </Drawer.Heading>
              <p className="text-sm text-muted">ค้นหาแล้วแตะเพิ่ม — ไม่ต้องเลื่อนหน้าหลักยาวๆ</p>
            </Drawer.Header>

            <div className="shrink-0 space-y-2 border-b border-separator px-5 py-3">
              <div className="relative">
                <SearchIcon
                  width={18}
                  height={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อสินค้า..."
                  autoFocus
                  className={cn(fieldClassName, "pl-10")}
                />
              </div>
              <p className="text-xs text-muted">{resultLabel}</p>
            </div>

            <Drawer.Body className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {error ? (
                <p className="mx-3 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
                  {error}
                </p>
              ) : loading && products.length === 0 ? (
                <CompactProductListSkeleton count={6} />
              ) : products.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted">ไม่พบสินค้า</p>
              ) : (
                <ul className="divide-y divide-separator">
                  {products.map((product) => {
                    const qty = cart[product.id] ?? 0;
                    const outOfStock = product.stockQty <= 0;
                    const atMax = qty >= product.stockQty;

                    return (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <ProductAvatar product={product} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted">
                            {formatCurrency(product.sellingPrice)} / {product.unit}
                            {" · "}
                            คงเหลือ {formatNumber(product.stockQty)}
                          </p>
                        </div>

                        {outOfStock ? (
                          <span className="shrink-0 text-xs font-medium text-danger">
                            หมด
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => bump(product, -1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-default text-foreground active:opacity-70"
                              aria-label="ลด"
                            >
                              <MinusIcon width={18} height={18} />
                            </button>
                            <span className="w-6 text-center text-base font-semibold tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => bump(product, 1)}
                              disabled={atMax}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground active:opacity-80 disabled:opacity-40"
                              aria-label="เพิ่ม"
                            >
                              <PlusIcon width={18} height={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onQtyChange(product, 1)}
                            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-accent/10 px-3.5 text-sm font-semibold text-accent active:bg-accent/20"
                          >
                            <PlusIcon width={16} height={16} />
                            เพิ่ม
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Drawer.Body>

            <Drawer.Footer className="drawer-footer-safe shrink-0 border-t border-separator px-5 pt-4">
              <Button variant="primary" className="w-full" onPress={state.close}>
                เสร็จสิ้น
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
