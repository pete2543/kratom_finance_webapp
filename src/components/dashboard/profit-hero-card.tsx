"use client";

import { Card } from "@heroui/react";

import { AnimatedCurrency } from "@/components/dashboard/animated-number";
import { TrendDownIcon, TrendUpIcon } from "@/components/icons";

type ProfitHeroCardProps = {
  profit: number;
  income: number;
  expense: number;
};

export function ProfitHeroCard({ profit, income, expense }: ProfitHeroCardProps) {
  const total = income + expense;
  const incomeRatio = total > 0 ? (income / total) * 100 : 50;

  return (
    <Card className="dashboard-hero ds-card mb-5 overflow-hidden border-0 shadow-none">
      <Card.Content className="relative p-5 sm:p-6">
        <div className="dashboard-hero__glow dashboard-hero__glow--a" aria-hidden />
        <div className="dashboard-hero__glow dashboard-hero__glow--b" aria-hidden />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/75">กำไรสุทธิเดือนนี้</p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl">
                <AnimatedCurrency value={profit} delay={120} />
              </p>
            </div>
            <span className="dashboard-live-badge">
              <span className="dashboard-live-badge__dot" aria-hidden />
              สด
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl bg-black/12 p-1">
            <div className="flex h-2 overflow-hidden rounded-full">
              <div
                className="dashboard-hero__bar dashboard-hero__bar--income"
                style={{ width: `${incomeRatio}%` }}
              />
              <div
                className="dashboard-hero__bar dashboard-hero__bar--expense"
                style={{ width: `${100 - incomeRatio}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="dashboard-hero__metric rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                <TrendUpIcon width={14} height={14} />
                รายรับ
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                <AnimatedCurrency value={income} delay={280} />
              </p>
            </div>
            <div className="dashboard-hero__metric rounded-2xl bg-black/18 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                <TrendDownIcon width={14} height={14} />
                รายจ่าย
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                <AnimatedCurrency value={expense} delay={360} />
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
