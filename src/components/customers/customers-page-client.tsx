"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, EmptyState, Spinner, useOverlayState } from "@heroui/react";

import { StatCard } from "@/components/dashboard/stat-card";
import { CustomerDetailDrawer } from "@/components/customers/customer-detail-drawer";
import { CustomerReportRow } from "@/components/customers/customer-report-row";
import {
  SearchIcon,
  TrendDownIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";
import {
  ApiError,
  customerReportsApi,
  type CustomerReportItem,
  type CustomerReportSummary,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "outstanding";

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent";

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "outstanding", label: "ค้างชำระ" },
];

export function CustomersPageClient() {
  const detailDrawer = useOverlayState();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [customers, setCustomers] = useState<CustomerReportItem[]>([]);
  const [summary, setSummary] = useState<CustomerReportSummary | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerReportItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerReportsApi.list({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        hasOutstanding: filter === "outstanding" ? true : undefined,
      });
      setCustomers(data.items);
      setSummary(data.summary);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "โหลดรายชื่อลูกค้าไม่สำเร็จ",
      );
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCustomers();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadCustomers]);

  function handleSelectCustomer(customer: CustomerReportItem) {
    setSelectedCustomer(customer);
    detailDrawer.open();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-5 sm:max-w-6xl sm:px-6">
      <div className="mb-5">
        <p className="text-sm text-muted">จัดการลูกค้า</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">ลูกค้า</h1>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="ลูกค้าทั้งหมด"
          value={`${summary?.customerCount ?? 0} ราย`}
          icon={<UsersIcon width={20} height={20} />}
          tone="accent"
        />
        <StatCard
          label="ยอดค้างชำระรวม"
          value={formatCurrency(summary?.outstandingAmount ?? 0)}
          icon={<TrendDownIcon width={20} height={20} />}
          tone="danger"
          hint={
            (summary?.outstandingAmount ?? 0) > 0
              ? "แตะรายชื่อเพื่อดูรายละเอียด"
              : undefined
          }
        />
        <StatCard
          label="ยอดซื้อรวม"
          value={formatCurrency(summary?.totalAmount ?? 0)}
          icon={<WalletIcon width={20} height={20} />}
          tone="neutral"
          hint={`จ่ายแล้ว ${formatCurrency(summary?.paidAmount ?? 0)}`}
        />
      </div>

      <div className="mb-4 space-y-3">
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
            placeholder="ค้นหาชื่อหรือเบอร์โทร..."
            className={cn(fieldClassName, "pl-10")}
          />
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-default p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "h-10 rounded-xl text-sm font-semibold transition-colors",
                filter === item.id
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Card className="ds-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="sm" />
          </div>
        ) : customers.length === 0 ? (
          <EmptyState className="px-6 py-14 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <UsersIcon width={26} height={26} />
            </span>
            <p className="font-medium text-foreground">
              {filter === "outstanding" ? "ไม่มีลูกค้าค้างชำระ" : "ยังไม่มีลูกค้า"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {filter === "outstanding"
                ? "ลูกค้าที่มียอดค้างจะแสดงที่นี่"
                : "ลูกค้าจะถูกสร้างเมื่อมีการขายแบบบันทึกลูกค้า"}
            </p>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-separator">
            {customers.map((customer) => (
              <CustomerReportRow
                key={customer.id}
                customer={customer}
                onSelect={handleSelectCustomer}
              />
            ))}
          </ul>
        )}
      </Card>

      <CustomerDetailDrawer customer={selectedCustomer} state={detailDrawer} />
    </div>
  );
}
