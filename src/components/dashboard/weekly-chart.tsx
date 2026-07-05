"use client";

import { Card } from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TrendUpIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";

type WeeklyChartProps = {
  data: { label: string; value: number }[];
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card
      className="dashboard-stagger ds-card mb-5"
      style={{ "--stagger": 3 } as React.CSSProperties}
    >
      <Card.Content className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">ยอดขาย 7 วัน</p>
            <p className="mt-0.5 text-xs text-muted">รวม {formatCurrency(total)}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
            <TrendUpIcon width={12} height={12} />
            +8%
          </span>
        </div>

        <div className="dashboard-weekly-chart -mx-1 h-36 w-full sm:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="var(--separator)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 10, fontWeight: 500 }}
                dy={6}
              />
              <YAxis
                hide
                domain={[0, (max: number) => Math.ceil(max * 1.15)]}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `วัน${label}`}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid var(--separator)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-surface, 0 4px 12px rgb(0 0 0 / 8%))",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "var(--muted)", fontWeight: 500, marginBottom: 2 }}
                itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Bar
                dataKey="value"
                fill="var(--accent)"
                radius={[10, 10, 4, 4]}
                maxBarSize={36}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  );
}
