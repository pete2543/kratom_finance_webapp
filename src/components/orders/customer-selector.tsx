"use client";

import { Label, useOverlayState } from "@heroui/react";

import {
  ArrowRightIcon,
  CheckIcon,
  PhoneIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";
import { CustomerPickerDrawer } from "@/components/orders/customer-picker-drawer";
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

const MODES: { id: CustomerMode; label: string; hint: string }[] = [
  { id: "walkin", label: "ทั่วไป", hint: "ไม่บันทึกชื่อ" },
  { id: "existing", label: "ลูกค้าเก่า", hint: "เลือกจากระบบ" },
  { id: "new", label: "ลูกค้าใหม่", hint: "สร้างใหม่" },
];

function CustomerAvatar({
  name,
  selected = false,
  size = "md",
}: {
  name: string;
  selected?: boolean;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-12 w-12 text-lg" : "h-10 w-10 text-base";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        dim,
        selected
          ? "bg-accent text-accent-foreground"
          : "bg-accent/12 text-accent",
      )}
    >
      {name.trim().charAt(0)}
    </span>
  );
}

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
  const pickerDrawer = useOverlayState();

  function handleModeChange(next: CustomerMode) {
    onModeChange(next);
    if (next === "existing" && !selectedCustomer) {
      pickerDrawer.open();
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-default p-1">
        {MODES.map((m) => {
          const isDisabled = disabled || (m.id === "walkin" && disableWalkin);
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleModeChange(m.id)}
              className={cn(
                "flex flex-col items-center rounded-xl px-1 py-2 transition-colors disabled:opacity-40",
                active
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted",
              )}
            >
              <span className="text-sm font-semibold">{m.label}</span>
              <span className="mt-0.5 text-[10px] leading-tight opacity-80">
                {m.hint}
              </span>
            </button>
          );
        })}
      </div>

      {mode === "walkin" ? (
        <div className="flex items-center gap-3 rounded-xl bg-default/50 px-4 py-3">
          <UsersIcon width={20} height={20} className="shrink-0 text-muted" />
          <div>
            <p className="text-sm font-medium text-foreground">ลูกค้าทั่วไป</p>
            <p className="text-xs text-muted">ไม่บันทึกข้อมูลลูกค้าในออเดอร์</p>
          </div>
          <CheckIcon width={18} height={18} className="ml-auto shrink-0 text-accent" />
        </div>
      ) : null}

      {mode === "existing" ? (
        selectedCustomer ? (
          <div className="overflow-hidden rounded-xl border border-accent/30 bg-accent/8">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <CustomerAvatar name={selectedCustomer.name} selected />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {selectedCustomer.name}
                </p>
                {selectedCustomer.phone ? (
                  <p className="text-xs text-muted">{selectedCustomer.phone}</p>
                ) : (
                  <p className="text-xs text-muted">ไม่มีเบอร์โทร</p>
                )}
              </div>
              <CheckIcon width={20} height={20} className="shrink-0 text-accent" />
            </div>
            <div className="flex border-t border-accent/20">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectCustomer(null)}
                className="flex-1 py-2.5 text-sm font-medium text-muted transition-colors active:bg-accent/10"
              >
                ล้าง
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={pickerDrawer.open}
                className="flex-1 border-l border-accent/20 py-2.5 text-sm font-semibold text-accent transition-colors active:bg-accent/10"
              >
                เปลี่ยน
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={pickerDrawer.open}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-accent/40 bg-accent/5 px-4 py-4 text-left transition-colors active:bg-accent/10 disabled:opacity-60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
              <SearchIcon width={20} height={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                เลือกลูกค้า
              </p>
              <p className="text-xs text-muted">แตะเพื่อค้นหาและเลือกจากระบบ</p>
            </div>
            <ArrowRightIcon width={18} height={18} className="shrink-0 text-muted" />
          </button>
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
          {newCustomer.name.trim() ? (
            <div className="flex items-center gap-3 rounded-xl bg-accent/8 px-4 py-3">
              <CustomerAvatar name={newCustomer.name.trim()} selected />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {newCustomer.name.trim()}
                </p>
                <p className="text-xs text-muted">
                  {newCustomer.phone.trim() || "ลูกค้าใหม่ — บันทึกพร้อมออเดอร์"}
                </p>
              </div>
              <CheckIcon width={18} height={18} className="shrink-0 text-accent" />
            </div>
          ) : null}
        </div>
      ) : null}

      <CustomerPickerDrawer
        selectedCustomerId={selectedCustomer?.id}
        onSelect={onSelectCustomer}
        state={pickerDrawer}
      />
    </div>
  );
}
