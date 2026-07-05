const currencyFmt = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFmtDecimal = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFmt = new Intl.NumberFormat("th-TH");

export function formatCurrency(value: number, decimals = false): string {
  return (decimals ? currencyFmtDecimal : currencyFmt).format(value);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return numberFmt.format(value);
}

/** แสดงวันที่แบบไทยย่อ เช่น 4 ก.ค. */
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });
}

/** เวลาแบบ 20:45 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
