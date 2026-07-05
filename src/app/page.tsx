import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import {
  dashboardSummary,
  monthlyProfit,
  orders,
  stockAlerts,
  weeklySales,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <DashboardPageClient
      summary={dashboardSummary}
      monthlyProfit={monthlyProfit}
      weeklySales={weeklySales}
      orders={orders}
      stockAlerts={stockAlerts}
    />
  );
}
