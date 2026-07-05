"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Label,
  Spinner,
  TextArea,
  useOverlayState,
} from "@heroui/react";

import { ApiError, stockTransactionsApi } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/types";

type InboundStockDrawerProps = {
  products: Product[];
  initialProductId?: number | null;
  onSuccess: () => void;
  state: ReturnType<typeof useOverlayState>;
};

export function InboundStockDrawer({
  products,
  initialProductId,
  onSuccess,
  state,
}: InboundStockDrawerProps) {
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState("10");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((p) => String(p.id) === productId);

  useEffect(() => {
    if (!state.isOpen) return;

    setError(null);
    setNote("");
    setQuantity("10");

    if (initialProductId) {
      setProductId(String(initialProductId));
      return;
    }

    if (products.length > 0) {
      setProductId(String(products[0].id));
    } else {
      setProductId("");
    }
  }, [state.isOpen, initialProductId, products]);

  async function handleSubmit() {
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);

    if (!parsedProductId) {
      setError("กรุณาเลือกสินค้า");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("กรุณาระบุจำนวนที่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await stockTransactionsApi.inbound({
        productId: parsedProductId,
        quantity: parsedQuantity,
        note: note.trim() || undefined,
      });

      state.close();
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ไม่สามารถบันทึกได้");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer state={state}>
      <Drawer.Backdrop isDismissable={!submitting}>
        <Drawer.Content placement="bottom" className="max-h-[92dvh]">
          <Drawer.Dialog className="rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-2" />
            <Drawer.Header className="px-5 pt-2">
              <Drawer.Heading className="text-lg font-semibold">
                รับของเข้าสต็อก
              </Drawer.Heading>
              <p className="text-sm text-muted">บันทึกจำนวนสินค้าที่รับเข้าคลัง</p>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 overflow-y-auto px-5 pb-2">
              <div className="space-y-2">
                <Label htmlFor="inbound-product">สินค้า</Label>
                <select
                  id="inbound-product"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={submitting || products.length === 0}
                  className="h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent"
                >
                  {products.length === 0 ? (
                    <option value="">ไม่มีสินค้า</option>
                  ) : (
                    products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (คงเหลือ {formatNumber(product.stockQty)}{" "}
                        {product.unit})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inbound-quantity">จำนวน</Label>
                <input
                  id="inbound-quantity"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={submitting}
                  className="h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base tabular-nums text-foreground outline-none focus:border-accent"
                />
                {selectedProduct ? (
                  <p className="text-xs text-muted">
                    หลังรับเข้า จะมีประมาณ{" "}
                    {formatNumber(selectedProduct.stockQty + Number(quantity || 0))}{" "}
                    {selectedProduct.unit}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inbound-note">หมายเหตุ</Label>
                <TextArea
                  id="inbound-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น รับของจาก supplier"
                  disabled={submitting}
                  fullWidth
                  rows={3}
                />
              </div>

              {error ? (
                <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              ) : null}
            </Drawer.Body>

            <Drawer.Footer className="gap-2 border-t border-separator px-5 py-4">
              <Button
                variant="secondary"
                className="flex-1"
                onPress={state.close}
                isDisabled={submitting}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onPress={handleSubmit}
                isDisabled={submitting || products.length === 0}
              >
                {submitting ? <Spinner size="sm" color="current" /> : "บันทึกรับเข้า"}
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
