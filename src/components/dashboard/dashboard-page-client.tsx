"use client";

import { Card } from "@heroui/react";

import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { OrderRow } from "@/components/dashboard/order-row";
import { ProfitHeroCard } from "@/components/dashboard/profit-hero-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockAlertCard } from "@/components/dashboard/stock-alert-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import {
  ReceiptIcon,
  TrendDownIcon,
  TrendUpIcon,
  WalletIcon,
} from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import type { Order, StockAlert } from "@/types";

type DashboardPageClientProps = {
  summary: {
    todaySales: number;
    todaySalesChange: number;
    incomeThisMonth: number;
    expenseThisMonth: number;
    outstandingCredit: number;
    orderCountToday: number;
  };
  monthlyProfit: number;
  weeklySales: { label: string; value: number }[];
  orders: Order[];
  stockAlerts: StockAlert[];
};

export function DashboardPageClient({
  summary,
  monthlyProfit,
  weeklySales,
  orders,
  stockAlerts,
}: DashboardPageClientProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <DashboardGreeting />

      <div
        className="dashboard-stagger"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        <ProfitHeroCard
          profit={monthlyProfit}
          income={summary.incomeThisMonth}
          expense={summary.expenseThisMonth}
        />
      </div>

      <QuickActions />
      <WeeklyChart data={weeklySales} />

      <div
        className="dashboard-stagger mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        style={{ "--stagger": 4 } as React.CSSProperties}
      >
        <StatCard
          label="ยอดขายวันนี้"
          value={formatCurrency(summary.todaySales)}
          icon={<WalletIcon width={20} height={20} />}
          tone="success"
          changePercent={summary.todaySalesChange}
          interactive
        />
        <StatCard
          label="ออเดอร์วันนี้"
          value={`${summary.orderCountToday} รายการ`}
          icon={<ReceiptIcon width={20} height={20} />}
          tone="accent"
          interactive
        />
        <StatCard
          label="ยอดค้างชำระ"
          value={formatCurrency(summary.outstandingCredit)}
          icon={<TrendDownIcon width={20} height={20} />}
          tone="danger"
          hint="ลูกค้าเครดิต 2 ราย"
          interactive
        />
        <StatCard
          label="กำไรเดือนนี้"
          value={formatCurrency(monthlyProfit)}
          icon={<TrendUpIcon width={20} height={20} />}
          tone="accent"
          changePercent={8.2}
          interactive
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section
          className="dashboard-stagger lg:col-span-2"
          style={{ "--stagger": 5 } as React.CSSProperties}
        >
          <SectionHeader
            title="ออเดอร์ล่าสุด"
            actionLabel="ดูทั้งหมด"
            actionHref="/orders"
          />
          <Card className="ds-card overflow-hidden">
            <ul className="divide-y divide-separator">
              {orders.map((order, index) => (
                <OrderRow key={order.id} order={order} index={index} />
              ))}
            </ul>
          </Card>
        </section>

        <section
          className="dashboard-stagger"
          style={{ "--stagger": 6 } as React.CSSProperties}
        >
          <SectionHeader title="แจ้งเตือน" />
          <StockAlertCard alerts={stockAlerts} />
        </section>
      </div>
    </div>
  );
}
