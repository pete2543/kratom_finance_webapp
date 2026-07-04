import { Card } from "@heroui/react";

import { OrderRow } from "@/components/dashboard/order-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockAlertCard } from "@/components/dashboard/stock-alert-card";
import { Fab } from "@/components/dashboard/fab";
import {
  ReceiptIcon,
  TrendDownIcon,
  TrendUpIcon,
  WalletIcon,
} from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import {
  dashboardSummary,
  monthlyProfit,
  orders,
  stockAlerts,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      {/* หัวข้อทักทาย */}
      <div className="mb-5">
        <p className="text-sm text-muted">{today}</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          สวัสดี, ร้านกระท่อม 🌿
        </h1>
      </div>

      {/* การ์ดกำไรสุทธิ (hero) */}
      <Card className="ds-card mb-5 overflow-hidden bg-accent text-accent-foreground">
        <Card.Content className="p-5">
          <p className="text-sm opacity-80">กำไรสุทธิเดือนนี้</p>
          <p className="mt-1 text-3xl font-bold tabular-nums sm:text-4xl">
            {formatCurrency(monthlyProfit)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/12 p-3">
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <TrendUpIcon width={15} height={15} />
                รายรับ
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(dashboardSummary.incomeThisMonth)}
              </p>
            </div>
            <div className="rounded-xl bg-black/15 p-3">
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <TrendDownIcon width={15} height={15} />
                รายจ่าย
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(dashboardSummary.expenseThisMonth)}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* สถิติย่อ */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="ยอดขายวันนี้"
          value={formatCurrency(dashboardSummary.todaySales)}
          icon={<WalletIcon width={20} height={20} />}
          tone="success"
          changePercent={dashboardSummary.todaySalesChange}
        />
        <StatCard
          label="ออเดอร์วันนี้"
          value={`${dashboardSummary.orderCountToday} รายการ`}
          icon={<ReceiptIcon width={20} height={20} />}
          tone="accent"
        />
        <StatCard
          label="ยอดค้างชำระ"
          value={formatCurrency(dashboardSummary.outstandingCredit)}
          icon={<TrendDownIcon width={20} height={20} />}
          tone="danger"
          hint="ลูกค้าเครดิต 2 ราย"
        />
        <StatCard
          label="กำไรเดือนนี้"
          value={formatCurrency(monthlyProfit)}
          icon={<TrendUpIcon width={20} height={20} />}
          tone="accent"
          changePercent={8.2}
        />
      </div>

      {/* เนื้อหา 2 คอลัมน์บนจอใหญ่ */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeader
            title="ออเดอร์ล่าสุด"
            actionLabel="ดูทั้งหมด"
            actionHref="/orders"
          />
          <Card className="ds-card overflow-hidden">
            <ul className="divide-y divide-separator">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeader title="แจ้งเตือน" />
          <StockAlertCard alerts={stockAlerts} />
        </section>
      </div>

      <Fab />
    </div>
  );
}
