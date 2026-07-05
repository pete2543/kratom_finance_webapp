"use client";

import { useEffect, useRef, useState } from "react";
import { Label, Spinner } from "@heroui/react";

import {
  CheckIcon,
  PhoneIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";
import { customersApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types";

export type CustomerMode = "walkin" | "existing" | "new";

export type NewCustomerDraft = {
  name: string;
  phone: string;
};

type CustomerSelectorProps = {
  mode: CustomerMode;
  onModeChange: (mode: CustomerMode) => void;
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  newCustomer: NewCustomerDraft;
  onNewCustomerChange: (draft: NewCustomerDraft) => void;
  /** walk-in ใช้ไม่ได้ (เช่น ขายเครดิต) */
  disableWalkin?: boolean;
  disabled?: boolean;
};

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent disabled:opacity-60";

const MODES: { id: CustomerMode; label: string }[] = [
  { id: "walkin", label: "ลูกค้าทั่วไป" },
  { id: "existing", label: "ลูกค้าเก่า" },
  { id: "new", label: "ลูกค้าใหม่" },
];

export function CustomerSelector({
  mode,
  onModeChange,
  selectedCustomer,
  onSelectCustomer,
  newCustomer,
  onNewCustomerChange,
  disableWalkin = false,
  disabled = false,
}: CustomerSelectorProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== "existing") return;
    if (selectedCustomer) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const data = await customersApi.list({
          page: 1,
          limit: 20,
          search: search.trim() || undefined,
        });
        setResults(data.items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search, mode, selectedCustomer]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-default p-1">
        {MODES.map((m) => {
          const isDisabled = disabled || (m.id === "walkin" && disableWalkin);
          return (
            <button
              key={m.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onModeChange(m.id)}
              className={cn(
                "h-10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40",
                mode === m.id
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {mode === "walkin" ? (
        <div className="flex items-center gap-3 rounded-xl bg-default/50 px-4 py-3.5 text-muted">
          <UsersIcon width={20} height={20} />
          <p className="text-sm">ขายให้ลูกค้าทั่วไป — ไม่บันทึกข้อมูลลูกค้า</p>
        </div>
      ) : null}

      {mode === "existing" ? (
        selectedCustomer ? (
          <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-base font-semibold text-accent">
              {selectedCustomer.name.trim().charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">
                {selectedCustomer.name}
              </p>
              {selectedCustomer.phone ? (
                <p className="text-xs text-muted">{selectedCustomer.phone}</p>
              ) : null}
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectCustomer(null)}
              className="text-sm font-medium text-accent"
            >
              เปลี่ยน
            </button>
          </div>
        ) : (
          <div className="space-y-2">
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
                disabled={disabled}
                className={cn(fieldClassName, "pl-10")}
              />
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-separator">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="sm" />
                </div>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  ไม่พบลูกค้า — ลองสลับไปแท็บ &quot;ลูกค้าใหม่&quot;
                </p>
              ) : (
                <ul className="divide-y divide-separator">
                  {results.map((customer) => (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(customer)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-default"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/12 text-sm font-semibold text-accent">
                          {customer.name.trim().charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {customer.name}
                          </p>
                          {customer.phone ? (
                            <p className="text-xs text-muted">{customer.phone}</p>
                          ) : null}
                        </div>
                        <CheckIcon
                          width={18}
                          height={18}
                          className="text-transparent"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      ) : null}

      {mode === "new" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="new-customer-name">
              <span className="inline-flex items-center gap-1.5">
                <UserPlusIcon width={15} height={15} />
                ชื่อลูกค้า
              </span>
            </Label>
            <input
              id="new-customer-name"
              type="text"
              value={newCustomer.name}
              onChange={(e) =>
                onNewCustomerChange({ ...newCustomer, name: e.target.value })
              }
              placeholder="เช่น สมชาย ใจดี"
              disabled={disabled}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-customer-phone">
              <span className="inline-flex items-center gap-1.5">
                <PhoneIcon width={15} height={15} />
                เบอร์โทร (ไม่บังคับ)
              </span>
            </Label>
            <input
              id="new-customer-phone"
              type="tel"
              inputMode="tel"
              value={newCustomer.phone}
              onChange={(e) =>
                onNewCustomerChange({ ...newCustomer, phone: e.target.value })
              }
              placeholder="0812345678"
              disabled={disabled}
              className={fieldClassName}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
