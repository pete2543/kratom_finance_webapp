"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Label, Spinner, Switch } from "@heroui/react";

import { ArrowLeftIcon } from "@/components/icons";
import { ProductPhotoField } from "@/components/stock/product-photo-field";
import { ApiError, objectDocumentsApi, productsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const UNIT_PRESETS = ["ขวด", "แพ็ก", "กล่อง", "ถุง", "ชิ้น"] as const;

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent disabled:opacity-60";

export function AddProductForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [unit, setUnit] = useState("ขวด");
  const [isActive, setIsActive] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const margin = useMemo(() => {
    const cost = Number(costPrice);
    const sell = Number(sellingPrice);
    if (!Number.isFinite(cost) || !Number.isFinite(sell) || sell <= 0) return null;
    return sell - cost;
  }, [costPrice, sellingPrice]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsedCost = Number(costPrice);
    const parsedSell = Number(sellingPrice);

    if (!name.trim()) {
      setError("กรุณาระบุชื่อสินค้า");
      return;
    }

    if (!unit.trim()) {
      setError("กรุณาระบุหน่วย");
      return;
    }

    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      setError("กรุณาระบุราคาทุนที่ถูกต้อง");
      return;
    }

    if (!Number.isFinite(parsedSell) || parsedSell <= 0) {
      setError("กรุณาระบุราคาขายที่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const product = await productsApi.create({
        name: name.trim(),
        costPrice: parsedCost,
        sellingPrice: parsedSell,
        unit: unit.trim(),
        isActive,
      });

      if (photo) {
        await objectDocumentsApi.upload({
          file: photo,
          folder1: "products",
          table_name: "products",
          table_id: product.id,
        });
      }

      router.push("/stock");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ไม่สามารถเพิ่มสินค้าได้");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-5 sm:px-6">
      <Link
        href="/stock"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
      >
        <ArrowLeftIcon width={16} height={16} />
        กลับไปสต็อก
      </Link>

      <div className="mb-5">
        <p className="text-sm text-muted">เพิ่มรายการใหม่</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          เพิ่มสินค้า
        </h1>
      </div>

      <Card className="ds-card overflow-hidden">
        <Card.Content className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">ชื่อสินค้า</Label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น กระท่อมแคปซูล"
                disabled={submitting}
                className={fieldClassName}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="product-cost">ราคาทุน (฿)</Label>
                <input
                  id="product-cost"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="50"
                  disabled={submitting}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sell">ราคาขาย (฿)</Label>
                <input
                  id="product-sell"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="120"
                  disabled={submitting}
                  className={fieldClassName}
                />
              </div>
            </div>

            {margin !== null ? (
              <p
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  margin >= 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger",
                )}
              >
                กำไรต่อหน่วยประมาณ {formatCurrency(margin, true)}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="product-unit">หน่วย</Label>
              <input
                id="product-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ขวด"
                disabled={submitting}
                className={fieldClassName}
              />
              <div className="flex flex-wrap gap-2">
                {UNIT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={submitting}
                    onClick={() => setUnit(preset)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      unit === preset
                        ? "bg-accent text-accent-foreground"
                        : "bg-default text-muted",
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <ProductPhotoField
              photo={photo}
              onPhotoChange={setPhoto}
              disabled={submitting}
            />

            <div className="flex items-center justify-between rounded-xl bg-default/60 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">เปิดใช้งาน</p>
                <p className="text-xs text-muted">แสดงในรายการขายและสต็อก</p>
              </div>
              <Switch
                isSelected={isActive}
                onChange={setIsActive}
                isDisabled={submitting}
                aria-label="เปิดใช้งานสินค้า"
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>

            {error ? (
              <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            ) : null}

            <div className="flex gap-2 pt-1">
              <Link
                href="/stock"
                className={cn(
                  "flex flex-1 items-center justify-center rounded-xl bg-default px-4 py-2.5 text-sm font-semibold text-foreground transition-opacity",
                  submitting && "pointer-events-none opacity-60",
                )}
              >
                ยกเลิก
              </Link>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isDisabled={submitting}
              >
                {submitting ? <Spinner size="sm" color="current" /> : "บันทึกสินค้า"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
