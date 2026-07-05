"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, EmptyState, useOverlayState } from "@heroui/react";

import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { CustomerDetailDrawer } from "@/components/customers/customer-detail-drawer";
import { CustomerReportRow } from "@/components/customers/customer-report-row";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import {
  ListSkeleton,
  StatCardsSkeleton,
} from "@/components/skeleton";
import {
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

type FilterKey = "all" | "outstanding";

const FILTERS = [
  { id: "all" as const, label: "ทั้งหมด" },
  { id: "outstanding" as const, label: "ค้างชำระ" },
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
      <PageHeader eyebrow="จัดการลูกค้า" title="ลูกค้า" />

      {loading && !summary ? (
        <StatCardsSkeleton count={3} compact className="mb-5" />
      ) : (
        <StatGrid>
          <StatCard
            compact
            label="ลูกค้าทั้งหมด"
            value={`${summary?.customerCount ?? 0}`}
            icon={<UsersIcon size={16} />}
            tone="accent"
            hint="ราย"
          />
          <StatCard
            compact
            label="ค้างชำระ"
            value={formatCurrency(summary?.outstandingAmount ?? 0)}
            icon={<TrendDownIcon size={16} />}
            tone="danger"
          />
          <StatCard
            compact
            label="ยอดซื้อรวม"
            value={formatCurrency(summary?.totalAmount ?? 0)}
            icon={<WalletIcon size={16} />}
            tone="neutral"
            hint={`จ่าย ${formatCurrency(summary?.paidAmount ?? 0)}`}
          />
        </StatGrid>
      )}

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="ค้นหาชื่อหรือเบอร์โทร..."
        searchAriaLabel="ค้นหาลูกค้า"
        filters={FILTERS}
        filter={filter}
        onFilterChange={setFilter}
        filterAriaLabel="กรองลูกค้า"
      />

      {error ? (
        <p className="mb-4 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Card className="ds-card overflow-hidden">
        {!loading && customers.length > 0 ? (
          <div className="border-b border-separator px-4 py-2.5">
            <p className="text-xs font-medium text-muted">
              รายชื่อ · {customers.length} ราย
            </p>
          </div>
        ) : null}

        {loading ? (
          <ListSkeleton count={6} />
        ) : customers.length === 0 ? (
          <EmptyState className="px-6 py-14 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <UsersIcon size={26} />
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
