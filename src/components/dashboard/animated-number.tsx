"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { formatCurrency } from "@/lib/format";

type AnimatedCurrencyProps = {
  value: number;
  delay?: number;
  className?: string;
};

export function AnimatedCurrency({ value, delay = 0, className }: AnimatedCurrencyProps) {
  const animated = useAnimatedNumber(value, { delay });
  return <span className={className}>{formatCurrency(animated)}</span>;
}

type AnimatedCountProps = {
  value: number;
  suffix?: string;
  delay?: number;
  className?: string;
};

export function AnimatedCount({
  value,
  suffix = "",
  delay = 0,
  className,
}: AnimatedCountProps) {
  const animated = useAnimatedNumber(value, { delay });
  return (
    <span className={className}>
      {animated.toLocaleString("th-TH")}
      {suffix}
    </span>
  );
}
