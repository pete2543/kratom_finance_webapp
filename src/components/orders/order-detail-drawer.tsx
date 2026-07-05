"use client";

import { useEffect, useState } from "react";
import { Button, Chip, Drawer, useOverlayState } from "@heroui/react";

import { orderStatusColor } from "@/components/orders/order-list-row";
import {
  SkeletonBlock,
  SkeletonLine,
} from "@/components/skeleton";
import { PhoneIcon, ReceiptIcon } from "@/components/icons";
import { ApiError, ordersApi, type Order } from "@/lib/api";
import {
  formatCurrency,
  formatDateShort,
  formatNumber,
  formatTime,
} from "@/lib/format";
import { cn } from "@/lib/utils";

type OrderDetailDrawerProps = {
  order: Order | null;
  state: ReturnType<typeof useOverlayState>;
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="กำลังโหลดออเดอร์">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <SkeletonLine className="h-5 w-28" />
          <SkeletonLine className="w-40" />
        </div>
        <SkeletonBlock className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBlock key={i} className="h-[4.5rem] w-full" />
        ))}
      </div>
      <SkeletonBlock className="h-24 w-full" />
    </div>
  );
}

export function OrderDetailDrawer({ order, state }: OrderDetailDrawerProps) {
  const [detail, setDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isOpen || !order) return;

    let active = true;
    setLoading(true);
    setError(null);
    setDetail(null);

    ordersApi
      .getById(order.id)
      .then((data) => {
        if (!active) return;
        setDetail(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "โหลดออเดอร์ไม่สำเร็จ");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [state.isOpen, order]);

  const data = detail ?? order;
  const outstanding =
    data != null ? Math.max(data.totalAmount - data.paidAmount, 0) : 0;
  const phone = data?.customer?.phone;

  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="mx-auto max-h-[92dvh] w-full max-w-lg rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-2" />
            <Drawer.Header className="border-b border-separator px-5 py-4">
              <Drawer.Heading className="text-base font-semibold">
                รายละเอียดออเดอร์
              </Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body className="overflow-y-auto px-5 py-4">
              {loading ? (
                <OrderDetailSkeleton />
              ) : error ? (
                <p className="rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
                  {error}
                </p>
              ) : data ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {data.code}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {formatDateShort(data.orderDate)}{" "}
                        {formatTime(data.orderDate)} น.
                      </p>
                    </div>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={orderStatusColor[data.paymentStatus]}
                    >
                      {data.paymentStatusLabelTh}
                    </Chip>
                  </div>

                  <div className="rounded-xl bg-default/60 px-4 py-3.5">
                    <p className="text-xs text-muted">ลูกค้า</p>
                    <p className="mt-0.5 font-medium text-foreground">
                      {data.customerName}
                    </p>
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-accent"
                      >
                        <PhoneIcon width={14} height={14} />
                        {phone}
                      </a>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">ยอดรวม</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums">
                        {formatCurrency(data.totalAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">จ่ายแล้ว</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums text-success">
                        {formatCurrency(data.paidAmount)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "rounded-xl px-3 py-3",
                        outstanding > 0 ? "bg-danger/10" : "bg-default/60",
                      )}
                    >
                      <p className="text-xs text-muted">ค้างชำระ</p>
                      <p
                        className={cn(
                          "mt-0.5 text-base font-semibold tabular-nums",
                          outstanding > 0 ? "text-danger" : "text-foreground",
                        )}
                      >
                        {formatCurrency(outstanding)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">ประเภทขาย</p>
                      <p className="mt-0.5 text-base font-semibold">
                        {data.saleTypeLabelTh}
                      </p>
                    </div>
                  </div>

                  {data.dueDate ? (
                    <p className="text-sm text-muted">
                      ครบกำหนดชำระ {formatDateShort(data.dueDate)}
                    </p>
                  ) : null}

                  {data.note ? (
                    <p className="rounded-xl bg-default/50 px-3 py-2.5 text-sm text-muted">
                      {data.note}
                    </p>
                  ) : null}

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <ReceiptIcon width={16} height={16} className="text-muted" />
                      <h4 className="text-sm font-semibold text-foreground">
                        รายการสินค้า ({data.items.length})
                      </h4>
                    </div>
                    <ul className="-mx-5 divide-y divide-separator border-y border-separator">
                      {data.items.map((item) => (
                        <li
                          key={item.id ?? `${item.productId}-${item.unitPrice}`}
                          className="flex items-center justify-between gap-3 px-5 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.productName}
                            </p>
                            <p className="text-xs text-muted">
                              {formatCurrency(item.unitPrice)} ×{" "}
                              {formatNumber(item.quantity)}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-semibold tabular-nums">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {data.payments.length > 0 ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        การชำระเงิน
                      </h4>
                      <ul className="space-y-2">
                        {data.payments.map((payment) => (
                          <li
                            key={payment.id}
                            className="flex items-center justify-between rounded-xl bg-default/60 px-3 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {payment.methodLabelTh}
                              </p>
                              <p className="text-xs text-muted">
                                {formatDateShort(payment.paidAt)}{" "}
                                {formatTime(payment.paidAt)} น.
                              </p>
                            </div>
                            <p className="text-sm font-semibold tabular-nums text-success">
                              {formatCurrency(payment.amount)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Drawer.Body>

            <Drawer.Footer className="border-t border-separator px-5 py-4">
              <Button variant="secondary" className="w-full" onPress={state.close}>
                ปิด
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
