"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, EmptyState, useOverlayState } from "@heroui/react";

import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { OrderDetailDrawer } from "@/components/orders/order-detail-drawer";
import { OrderListRow } from "@/components/orders/order-list-row";
import { PageHeader } from "@/components/layout/page-header";
import { ListSkeleton, StatCardsSkeleton } from "@/components/skeleton";
import { PlusIcon, ReceiptIcon, TrendUpIcon, WalletIcon } from "@/components/icons";
import { ApiError, dropdownApi, ordersApi, type DropdownOption, type Order } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type FilterKey = "all" | number;

export function OrdersPageClient() {
  const detailDrawer = useOverlayState();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [paymentStatuses, setPaymentStatuses] = useState<DropdownOption[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dropdownApi.paymentStatuses().then(setPaymentStatuses).catch(() => {});
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersApi.list({
        page: 1,
        limit: 100,
        paymentStatusId: filter === "all" ? undefined : filter,
      });
      setOrders(data.items);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดออเดอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const summary = useMemo(() => {
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const paidAmount = orders.reduce((sum, o) => sum + o.paidAmount, 0);
    const outstanding = orders.reduce(
      (sum, o) => sum + Math.max(o.totalAmount - o.paidAmount, 0),
      0,
    );
    return { totalAmount, paidAmount, outstanding };
  }, [orders]);

  const filters = useMemo(() => {
    return [
      { id: "all" as const, label: "ทั้งหมด" },
      ...paymentStatuses.map((status) => ({
        id: status.id as FilterKey,
        label: status.labelTh,
      })),
    ];
  }, [paymentStatuses]);

  function handleSelectOrder(order: Order) {
    setSelectedOrder(order);
    detailDrawer.open();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-5 sm:max-w-6xl sm:px-6">
      <PageHeader
        eyebrow="รายการขาย"
        title="ออเดอร์"
        action={
          <Link
            href="/orders/new"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-sm font-semibold text-accent-foreground transition-opacity active:opacity-90"
          >
            <PlusIcon size={16} />
            ขายสินค้า
          </Link>
        }
      />

      {loading && orders.length === 0 ? (
        <StatCardsSkeleton count={3} compact className="mb-5" />
      ) : (
        <StatGrid>
          <StatCard
            compact
            label="ออเดอร์"
            value={`${total}`}
            icon={<ReceiptIcon size={16} />}
            tone="accent"
            hint="รายการ"
          />
          <StatCard
            compact
            label="ยอดขาย"
            value={formatCurrency(summary.totalAmount)}
            icon={<TrendUpIcon size={16} />}
            tone="neutral"
            hint={`จ่าย ${formatCurrency(summary.paidAmount)}`}
          />
          <StatCard
            compact
            label="ค้างชำระ"
            value={formatCurrency(summary.outstanding)}
            icon={<WalletIcon size={16} />}
            tone="danger"
          />
        </StatGrid>
      )}

      <Card className="ds-card mb-4">
        <Card.Content className="p-2">
          <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((item) => (
              <button
                key={String(item.id)}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "h-8 shrink-0 rounded-full px-3.5 text-sm font-semibold transition-colors",
                  filter === item.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-default text-muted active:opacity-80",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {error ? (
        <p className="mb-4 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Card className="ds-card overflow-hidden">
        {!loading && orders.length > 0 ? (
          <div className="border-b border-separator px-4 py-2.5">
            <p className="text-xs font-medium text-muted">
              รายการ · {orders.length} ออเดอร์
            </p>
          </div>
        ) : null}

        {loading ? (
          <ListSkeleton count={6} />
        ) : orders.length === 0 ? (
          <EmptyState className="px-6 py-14 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <ReceiptIcon size={26} />
            </span>
            <p className="font-medium text-foreground">ยังไม่มีออเดอร์</p>
            <p className="mt-1 text-sm text-muted">
              เริ่มบันทึกการขายจากปุ่ม &quot;ขายสินค้า&quot;
            </p>
            <Link
              href="/orders/new"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              <PlusIcon size={16} />
              ขายสินค้า
            </Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-separator">
            {orders.map((order) => (
              <OrderListRow
                key={order.id}
                order={order}
                onSelect={handleSelectOrder}
              />
            ))}
          </ul>
        )}
      </Card>

      <OrderDetailDrawer order={selectedOrder} state={detailDrawer} />
    </div>
  );
}
