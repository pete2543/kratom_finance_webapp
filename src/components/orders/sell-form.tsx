"use client";

import { useEffect, useMemo, useState } from "react";
import type { DateValue } from "@internationalized/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Label, Spinner, useOverlayState } from "@heroui/react";

import {
  ArrowLeftIcon,
  BagIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@/components/icons";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import {
  CustomerSelector,
  type CustomerMode,
  type NewCustomerDraft,
} from "@/components/orders/customer-selector";
import { DueDatePicker, dueDateToIso } from "@/components/orders/due-date-picker";
import { ProductPickerDrawer } from "@/components/orders/product-picker-drawer";
import { SellCart } from "@/components/orders/sell-cart";
import {
  ApiError,
  dropdownApi,
  ordersApi,
  type CheckoutOrderInput,
  type DropdownOption,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Customer, Product } from "@/types";

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent disabled:opacity-60";

export function SellForm() {
  const router = useRouter();
  const pickerDrawer = useOverlayState();

  const [productMap, setProductMap] = useState<Record<number, Product>>({});
  const [cart, setCart] = useState<Record<number, number>>({});

  const [saleTypes, setSaleTypes] = useState<DropdownOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DropdownOption[]>([]);

  const [customerMode, setCustomerMode] = useState<CustomerMode>("walkin");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<NewCustomerDraft>({
    name: "",
    phone: "",
  });

  const [saleTypeId, setSaleTypeId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<DateValue | null>(null);
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [successTotal, setSuccessTotal] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [saleTypeData, methodData] = await Promise.all([
          dropdownApi.saleTypes(),
          dropdownApi.paymentMethods(),
        ]);
        if (!active) return;
        setSaleTypes(saleTypeData);
        setPaymentMethods(methodData);
        setSaleTypeId((prev) => prev ?? saleTypeData[0]?.id ?? null);
        setPaymentMethodId((prev) => prev ?? methodData[0]?.id ?? null);
      } catch {
        if (active) setError("โหลดข้อมูลไม่สำเร็จ");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedSaleType = useMemo(
    () => saleTypes.find((s) => s.id === saleTypeId) ?? null,
    [saleTypes, saleTypeId],
  );
  const isCredit = selectedSaleType?.code === "credit";

  useEffect(() => {
    if (isCredit && customerMode === "walkin") {
      setCustomerMode("existing");
    }
  }, [isCredit, customerMode]);

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => {
        const product = productMap[Number(id)];
        if (!product) return null;
        return { product, quantity };
      })
      .filter((line): line is { product: Product; quantity: number } => line != null);
  }, [cart, productMap]);

  const total = useMemo(
    () =>
      cartLines.reduce(
        (sum, line) => sum + line.product.sellingPrice * line.quantity,
        0,
      ),
    [cartLines],
  );
  const totalItems = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines],
  );

  function handleQtyChange(product: Product, quantity: number) {
    setProductMap((prev) => ({ ...prev, [product.id]: product }));
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[product.id];
      else next[product.id] = quantity;
      return next;
    });
  }

  async function handleSubmit() {
    setError(null);

    if (cartLines.length === 0) {
      setError("กรุณาเพิ่มสินค้าในตะกร้าก่อน");
      pickerDrawer.open();
      return;
    }
    if (!saleTypeId) {
      setError("กรุณาเลือกประเภทการขาย");
      return;
    }

    let customerId: number | undefined;
    let newCustomerPayload: CheckoutOrderInput["newCustomer"];

    if (customerMode === "existing") {
      if (!selectedCustomer) {
        setError("กรุณาเลือกลูกค้า");
        return;
      }
      customerId = selectedCustomer.id;
    } else if (customerMode === "new") {
      if (!newCustomer.name.trim()) {
        setError("กรุณาระบุชื่อลูกค้าใหม่");
        return;
      }
      newCustomerPayload = {
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim() || undefined,
      };
    } else if (isCredit) {
      setError("การขายแบบเครดิตต้องระบุลูกค้า");
      return;
    }

    const payload: CheckoutOrderInput = {
      customerId,
      newCustomer: newCustomerPayload,
      saleTypeId,
      items: cartLines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
        unitPrice: line.product.sellingPrice,
      })),
      note: note.trim() || undefined,
    };

    if (isCredit) {
      payload.dueDate = dueDateToIso(dueDate);
    } else {
      if (!paymentMethodId) {
        setError("กรุณาเลือกช่องทางชำระเงิน");
        return;
      }
      payload.payment = { methodId: paymentMethodId, amount: total };
    }

    setSubmitting(true);
    try {
      const order = await ordersApi.checkout(payload);
      setSuccessTotal(total);
      setSuccessCode(order.code);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "บันทึกการขายไม่สำเร็จ",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setCart({});
    setProductMap({});
    setCustomerMode("walkin");
    setSelectedCustomer(null);
    setNewCustomer({ name: "", phone: "" });
    setSaleTypeId(saleTypes[0]?.id ?? null);
    setDueDate(null);
    setNote("");
    setError(null);
    setSuccessCode(null);
    setSuccessTotal(0);
  }

  if (successCode) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckCircleIcon width={44} height={44} />
        </span>
        <h1 className="mt-5 text-xl font-semibold">บันทึกการขายสำเร็จ</h1>
        <p className="mt-1 text-sm text-muted">
          ออเดอร์ {successCode} · ยอดรวม {formatCurrency(successTotal)}
        </p>
        <div className="mt-8 flex w-full flex-col gap-2">
          <Button variant="primary" onPress={resetForm}>
            ขายรายการใหม่
          </Button>
          <Button
            variant="secondary"
            onPress={() => {
              router.push("/orders");
              router.refresh();
            }}
          >
            ดูรายการออเดอร์
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-mobile-action-flush pt-5 sm:px-6">
      <Link
        href="/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
      >
        <ArrowLeftIcon width={16} height={16} />
        กลับออเดอร์
      </Link>

      <div className="mb-5">
        <p className="text-sm text-muted">สร้างออเดอร์</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          ขายสินค้า
        </h1>
      </div>

      <div className="space-y-4">
        {/* ตะกร้า — หน้าหลักแสดงเฉพาะสินค้าที่เลือก */}
        <Card className="ds-card overflow-hidden">
          <Card.Content className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">ตะกร้า</h2>
              {totalItems > 0 ? (
                <span className="rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {totalItems} ชิ้น · {formatCurrency(total)}
                </span>
              ) : null}
            </div>

            <SellCart
              lines={cartLines}
              onQtyChange={handleQtyChange}
              disabled={submitting}
            />

            <button
              type="button"
              disabled={submitting}
              onClick={pickerDrawer.open}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent/10 py-3 text-sm font-semibold text-accent transition-colors active:bg-accent/20 disabled:opacity-60"
            >
              <PlusIcon width={18} height={18} />
              {cartLines.length === 0 ? "เพิ่มสินค้า" : "เพิ่มสินค้าอื่น"}
            </button>
          </Card.Content>
        </Card>

        <Card className="ds-card overflow-hidden">
          <Card.Content className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">ลูกค้า</h2>
            <CustomerSelector
              mode={customerMode}
              onModeChange={setCustomerMode}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
              newCustomer={newCustomer}
              onNewCustomerChange={setNewCustomer}
              disableWalkin={isCredit}
              disabled={submitting}
            />
          </Card.Content>
        </Card>

        <Card className="ds-card overflow-hidden">
          <Card.Content className="space-y-4 p-4">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                ประเภทการขาย
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {saleTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => setSaleTypeId(type.id)}
                    className={cn(
                      "h-11 rounded-xl border text-sm font-semibold transition-colors",
                      saleTypeId === type.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-separator text-muted",
                    )}
                  >
                    {type.labelTh}
                  </button>
                ))}
              </div>
            </div>

            {isCredit ? (
              <DueDatePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={submitting}
              />
            ) : (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  ช่องทางชำระเงิน
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      disabled={submitting}
                      onClick={() => setPaymentMethodId(method.id)}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-semibold transition-colors",
                        paymentMethodId === method.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-separator text-muted",
                      )}
                    >
                      {method.labelTh}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="order-note">หมายเหตุ (ไม่บังคับ)</Label>
              <input
                id="order-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น ลูกค้าประจำ"
                disabled={submitting}
                className={fieldClassName}
              />
            </div>
          </Card.Content>
        </Card>

        {error ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <MobileActionBar flush>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">ยอดรวม ({totalItems} ชิ้น)</p>
          <p className="truncate text-lg font-semibold tabular-nums text-foreground">
            {formatCurrency(total)}
          </p>
        </div>
        <Button
          variant="primary"
          className="h-12 flex-[1.4] gap-2"
          isDisabled={submitting || cartLines.length === 0}
          onPress={handleSubmit}
        >
          {submitting ? (
            <Spinner size="sm" color="current" />
          ) : (
            <>
              <BagIcon width={18} height={18} />
              บันทึกการขาย
            </>
          )}
        </Button>
      </MobileActionBar>

      <ProductPickerDrawer
        cart={cart}
        onQtyChange={handleQtyChange}
        state={pickerDrawer}
      />
    </div>
  );
}
