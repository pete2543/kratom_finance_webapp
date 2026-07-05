"use client";

import { useEffect, useState } from "react";
import { Button, Chip, Drawer, useOverlayState } from "@heroui/react";

import {
  BellIcon,
  PhoneIcon,
  ReceiptIcon,
  UsersIcon,
} from "@/components/icons";
import { CustomerDetailSkeleton } from "@/components/skeleton";
import {
  ApiError,
  customerReportsApi,
  type CustomerReportDetail,
  type CustomerReportItem,
  type CustomerReportOrder,
} from "@/lib/api";
import { formatCurrency, formatDateShort, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type CustomerDetailDrawerProps = {
  customer: CustomerReportItem | null;
  state: ReturnType<typeof useOverlayState>;
};

const paymentStatusColor: Record<string, "success" | "warning" | "danger" | "default"> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
};

function OrderHistoryItem({ order }: { order: CustomerReportOrder }) {
  const tone = paymentStatusColor[order.paymentStatusCode] ?? "default";

  return (
    <li className="px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              OD-{order.id}
            </p>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">{order.saleTypeLabelTh}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {formatDateShort(order.orderDate)} {formatTime(order.orderDate)} น.
            {order.dueDate ? ` · ครบ ${formatDateShort(order.dueDate)}` : ""}
          </p>
          {order.items.length > 0 ? (
            <p className="mt-1.5 truncate text-xs text-muted">
              {order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(order.totalAmount)}
          </span>
          <Chip size="sm" variant="soft" color={tone}>
            {order.paymentStatusLabelTh}
          </Chip>
        </div>
      </div>
      {order.outstandingAmount > 0 ? (
        <p className="mt-2 text-xs font-medium text-danger">
          ค้างชำระ {formatCurrency(order.outstandingAmount)}
        </p>
      ) : null}
    </li>
  );
}

export function CustomerDetailDrawer({
  customer,
  state,
}: CustomerDetailDrawerProps) {
  const [detail, setDetail] = useState<CustomerReportDetail | null>(null);
  const [orders, setOrders] = useState<CustomerReportOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isOpen || !customer) return;

    let active = true;
    setLoading(true);
    setError(null);
    setDetail(null);
    setOrders([]);

    Promise.all([
      customerReportsApi.getById(customer.id),
      customerReportsApi.orders(customer.id, { page: 1, limit: 20 }),
    ])
      .then(([detailData, ordersData]) => {
        if (!active) return;
        setDetail(detailData);
        setOrders(ordersData.items);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError ? err.message : "โหลดข้อมูลลูกค้าไม่สำเร็จ",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [state.isOpen, customer]);

  const outstanding = detail?.summary.outstandingAmount ?? customer?.outstandingAmount ?? 0;
  const hasOutstanding = outstanding > 0;
  const phone = detail?.phone ?? customer?.phone;

  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="mx-auto max-h-[92dvh] w-full max-w-lg rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-2" />
            <Drawer.Header className="border-b border-separator px-5 py-4">
              <Drawer.Heading className="text-base font-semibold">
                ข้อมูลลูกค้า
              </Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body className="overflow-y-auto px-5 py-4">
              {loading ? (
                <CustomerDetailSkeleton />
              ) : error ? (
                <p className="rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
                  {error}
                </p>
              ) : customer ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold",
                        hasOutstanding
                          ? "bg-danger/12 text-danger"
                          : "bg-accent/12 text-accent",
                      )}
                    >
                      {customer.name.trim().charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {detail?.name ?? customer.name}
                      </h3>
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-accent"
                        >
                          <PhoneIcon width={14} height={14} />
                          {phone}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm text-muted">ไม่มีเบอร์โทร</p>
                      )}
                      {detail?.address ? (
                        <p className="mt-1 text-sm text-muted">{detail.address}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">ยอดซื้อรวม</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums">
                        {formatCurrency(detail?.summary.totalAmount ?? customer.totalAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">จ่ายแล้ว</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums text-success">
                        {formatCurrency(detail?.summary.paidAmount ?? customer.paidAmount)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "rounded-xl px-3 py-3",
                        hasOutstanding ? "bg-danger/10" : "bg-default/60",
                      )}
                    >
                      <p className="text-xs text-muted">ค้างชำระ</p>
                      <p
                        className={cn(
                          "mt-0.5 text-base font-semibold tabular-nums",
                          hasOutstanding ? "text-danger" : "text-foreground",
                        )}
                      >
                        {formatCurrency(outstanding)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-default/60 px-3 py-3">
                      <p className="text-xs text-muted">วงเงินเครดิต</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums">
                        {formatCurrency(detail?.creditLimit ?? customer.creditLimit)}
                      </p>
                    </div>
                  </div>

                  {/* ทวงหนี้ — placeholder สำหรับฟีเจอร์ถัดไป */}
                  <div className="rounded-xl border border-dashed border-separator px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/12 text-warning">
                        <BellIcon width={20} height={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">ทวงหนี้</p>
                        <p className="mt-0.5 text-xs text-muted">
                          ส่งแจ้งเตือนทวงหนี้อัตโนมัติ — กำลังพัฒนา
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        isDisabled
                      >
                        ส่งแจ้งเตือนทวงหนี้
                      </Button>
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                        >
                          <PhoneIcon width={16} height={16} />
                          โทรหาลูกค้า
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <ReceiptIcon width={16} height={16} className="text-muted" />
                      <h4 className="text-sm font-semibold text-foreground">
                        ประวัติออเดอร์ ({detail?.summary.orderCount ?? customer.orderCount})
                      </h4>
                    </div>
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 rounded-xl bg-default/50 py-8 text-center">
                        <UsersIcon width={24} height={24} className="text-muted" />
                        <p className="text-sm text-muted">ยังไม่มีออเดอร์</p>
                      </div>
                    ) : (
                      <ul className="-mx-5 divide-y divide-separator border-y border-separator">
                        {orders.map((order) => (
                          <OrderHistoryItem key={order.id} order={order} />
                        ))}
                      </ul>
                    )}
                  </div>
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
