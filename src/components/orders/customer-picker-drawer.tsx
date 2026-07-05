"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Drawer, useOverlayState } from "@heroui/react";

import { CheckIcon, SearchIcon } from "@/components/icons";
import { ListSkeleton } from "@/components/skeleton";
import { ApiError, customersApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types";

const fieldClassName =
  "h-12 w-full rounded-[var(--field-radius)] border border-separator bg-field-background px-3 text-base text-foreground outline-none focus:border-accent";

type CustomerPickerDrawerProps = {
  selectedCustomerId?: number | null;
  onSelect: (customer: Customer) => void;
  state: ReturnType<typeof useOverlayState>;
};

export function CustomerPickerDrawer({
  selectedCustomerId,
  onSelect,
  state,
}: CustomerPickerDrawerProps) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await customersApi.list({
        page: 1,
        limit: 50,
        search: query.trim() || undefined,
      });
      setCustomers(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดลูกค้าไม่สำเร็จ");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!state.isOpen) return;
    setSearch("");
    void loadCustomers("");
  }, [state.isOpen, loadCustomers]);

  useEffect(() => {
    if (!state.isOpen) return;
    const timer = window.setTimeout(() => {
      void loadCustomers(search);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, state.isOpen, loadCustomers]);

  const resultLabel = useMemo(() => {
    if (loading) return "กำลังค้นหา...";
    return customers.length > 0
      ? `พบ ${customers.length} ราย`
      : "ไม่พบลูกค้า";
  }, [loading, customers.length]);

  function handleSelect(customer: Customer) {
    onSelect(customer);
    state.close();
  }

  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-2" />
            <Drawer.Header className="shrink-0 border-b border-separator px-5 py-4">
              <Drawer.Heading className="text-base font-semibold">
                เลือกลูกค้า
              </Drawer.Heading>
              <p className="text-sm text-muted">ค้นหาชื่อหรือเบอร์โทร แล้วแตะเลือก</p>
            </Drawer.Header>

            <div className="shrink-0 space-y-2 border-b border-separator px-5 py-3">
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
                  autoFocus
                  className={cn(fieldClassName, "pl-10")}
                />
              </div>
              <p className="text-xs text-muted">{resultLabel}</p>
            </div>

            <Drawer.Body className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {error ? (
                <p className="mx-3 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
                  {error}
                </p>
              ) : loading && customers.length === 0 ? (
                <ListSkeleton count={5} withTrailing={false} rowClassName="px-4 py-2.5" />
              ) : customers.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">ไม่พบลูกค้า</p>
                  <p className="mt-1 text-xs text-muted">
                    ลองค้นหาคำอื่น หรือสร้างลูกค้าใหม่แทน
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-separator">
                  {customers.map((customer) => {
                    const isSelected = customer.id === selectedCustomerId;
                    return (
                      <li key={customer.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(customer)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-default",
                            isSelected && "bg-accent/8",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold",
                              isSelected
                                ? "bg-accent text-accent-foreground"
                                : "bg-accent/12 text-accent",
                            )}
                          >
                            {customer.name.trim().charAt(0)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {customer.name}
                            </p>
                            <p className="text-xs text-muted">
                              {customer.phone ?? "ไม่มีเบอร์โทร"}
                            </p>
                          </div>
                          {isSelected ? (
                            <CheckIcon
                              width={20}
                              height={20}
                              className="shrink-0 text-accent"
                            />
                          ) : (
                            <span className="h-5 w-5 shrink-0 rounded-full border-2 border-separator" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Drawer.Body>

            <Drawer.Footer className="shrink-0 border-t border-separator px-5 py-4">
              <Button variant="secondary" className="w-full" onPress={state.close}>
                ปิด
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
