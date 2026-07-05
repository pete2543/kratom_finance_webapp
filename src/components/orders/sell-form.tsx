"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Label, Spinner } from "@heroui/react";

import {
  ArrowLeftIcon,
  BagIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import {
  CustomerSelector,
  type CustomerMode,
  type NewCustomerDraft,
} from "@/components/orders/customer-selector";
import { ProductAvatar } from "@/components/stock/product-avatar";
import {
  ApiError,
  dropdownApi,
  ordersApi,
  productsApi,
  type CheckoutOrderInput,
  type DropdownOption,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Customer, Product } from "@/types";

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent disabled:opacity-60";

type CartLine = { product: Product; quantity: number };

export function SellForm() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [saleTypes, setSaleTypes] = useState<DropdownOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DropdownOption[]>([]);

  const [cart, setCart] = useState<Record<number, number>>({});

  const [customerMode, setCustomerMode] = useState<CustomerMode>("walkin");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<NewCustomerDraft>({
    name: "",
    phone: "",
  });

  const [saleTypeId, setSaleTypeId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [productData, saleTypeData, methodData] = await Promise.all([
          productsApi.list({ page: 1, limit: 100, isActive: true }),
          dropdownApi.saleTypes(),
          dropdownApi.paymentMethods(),
        ]);
        if (!active) return;
        setProducts(productData.items);
        setSaleTypes(saleTypeData);
        setPaymentMethods(methodData);
        setSaleTypeId((prev) => prev ?? saleTypeData[0]?.id ?? null);
        setPaymentMethodId((prev) => prev ?? methodData[0]?.id ?? null);
      } catch {
        if (active) setError("โหลดข้อมูลสินค้าไม่สำเร็จ");
      } finally {
        if (active) setProductsLoading(false);
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

  // credit sale cannot be walk-in
  useEffect(() => {
    if (isCredit && customerMode === "walkin") {
      setCustomerMode("existing");
    }
  }, [isCredit, customerMode]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const cartLines: CartLine[] = useMemo(() => {
    return products
      .filter((p) => (cart[p.id] ?? 0) > 0)
      .map((p) => ({ product: p, quantity: cart[p.id] }));
  }, [products, cart]);

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

  function setQty(productId: number, quantity: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  async function handleSubmit() {
    setError(null);

    if (cartLines.length === 0) {
      setError("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
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
      payload.dueDate = dueDate || undefined;
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
    setCustomerMode("walkin");
    setSelectedCustomer(null);
    setNewCustomer({ name: "", phone: "" });
    setSaleTypeId(saleTypes[0]?.id ?? null);
    setDueDate("");
    setNote("");
    setError(null);
    setSuccessCode(null);
  }

  if (successCode) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckCircleIcon width={44} height={44} />
        </span>
        <h1 className="mt-5 text-xl font-semibold">บันทึกการขายสำเร็จ</h1>
        <p className="mt-1 text-sm text-muted">
          ออเดอร์ {successCode} · ยอดรวม {formatCurrency(total)}
        </p>
        <div className="mt-8 flex w-full flex-col gap-2">
          <Button variant="primary" onPress={resetForm}>
            ขายรายการใหม่
          </Button>
          <Button
            variant="secondary"
            onPress={() => {
              router.push("/");
              router.refresh();
            }}
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-32 pt-5 sm:px-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
      >
        <ArrowLeftIcon width={16} height={16} />
        กลับหน้าหลัก
      </Link>

      <div className="mb-5">
        <p className="text-sm text-muted">สร้างออเดอร์</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          ขายสินค้า
        </h1>
      </div>

      <div className="space-y-4">
        {/* สินค้า */}
        <Card className="ds-card overflow-hidden">
          <Card.Content className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                เลือกสินค้า
              </h2>
              {totalItems > 0 ? (
                <span className="text-xs font-medium text-accent">
                  {totalItems} ชิ้น
                </span>
              ) : null}
            </div>

            <div className="relative mb-3">
              <SearchIcon
                width={18}
                height={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className={cn(fieldClassName, "pl-10")}
              />
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner size="sm" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">ไม่พบสินค้า</p>
            ) : (
              <ul className="-mx-1 divide-y divide-separator">
                {filteredProducts.map((product) => {
                  const qty = cart[product.id] ?? 0;
                  return (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 px-1 py-2.5"
                    >
                      <ProductAvatar product={product} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatCurrency(product.sellingPrice)} / {product.unit}
                        </p>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty(product.id, qty - 1)}
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
                            onClick={() => setQty(product.id, qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground active:opacity-80"
                            aria-label="เพิ่ม"
                          >
                            <PlusIcon width={18} height={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setQty(product.id, 1)}
                          className="flex h-9 items-center gap-1 rounded-full bg-accent/10 px-3.5 text-sm font-semibold text-accent active:bg-accent/20"
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
          </Card.Content>
        </Card>

        {/* ลูกค้า */}
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

        {/* ประเภทการขายและชำระเงิน */}
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
              <div className="space-y-2">
                <Label htmlFor="due-date">วันครบกำหนดชำระ</Label>
                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={submitting}
                  className={fieldClassName}
                />
              </div>
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

      {/* แถบสรุปด้านล่าง */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-separator bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3 sm:px-6">
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
        </div>
      </div>
    </div>
  );
}
