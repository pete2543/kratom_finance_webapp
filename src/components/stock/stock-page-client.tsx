"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  useOverlayState,
} from "@heroui/react";

import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SegmentedControl } from "@/components/layout/segmented-control";
import {
  ListSkeleton,
  ProductListSkeleton,
  StatCardsSkeleton,
} from "@/components/skeleton";
import {
  AlertIcon,
  BoxIcon,
  HistoryIcon,
  PackageIcon,
  PlusIcon,
} from "@/components/icons";
import { InboundStockDrawer } from "@/components/stock/inbound-stock-drawer";
import { LOW_STOCK_THRESHOLD, ProductStockRow } from "@/components/stock/product-stock-row";
import { StockTransactionRow } from "@/components/stock/stock-transaction-row";
import {
  ApiError,
  dropdownApi,
  productsApi,
  stockTransactionsApi,
  type DropdownOption,
  type StockTransaction,
} from "@/lib/api";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/types";

const TAB_ITEMS = [
  { id: "products" as const, label: "สินค้า", icon: BoxIcon },
  { id: "transactions" as const, label: "ธุรกรรม", icon: HistoryIcon },
];

type TabKey = "products" | "transactions";

export function StockPageClient() {
  const inboundDrawer = useOverlayState();
  const [tab, setTab] = useState<TabKey>("products");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | null>(null);
  const [initialProductId, setInitialProductId] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<DropdownOption[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await productsApi.list({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        isActive: true,
      });
      setProducts(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดสินค้าไม่สำเร็จ");
    } finally {
      setLoadingProducts(false);
    }
  }, [search]);

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await stockTransactionsApi.list({
        page: 1,
        limit: 50,
        typeId: typeFilter ?? undefined,
      });
      setTransactions(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดธุรกรรมไม่สำเร็จ");
    } finally {
      setLoadingTransactions(false);
    }
  }, [typeFilter]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadProducts(), loadTransactions()]);
  }, [loadProducts, loadTransactions]);

  useEffect(() => {
    dropdownApi.stockTransactionTypes().then(setTransactionTypes).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stockQty <= LOW_STOCK_THRESHOLD).length,
    [products],
  );

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;

    return transactions.filter((tx) => {
      const haystack = [
        tx.productName,
        tx.note,
        tx.typeLabelTh,
        tx.typeCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [transactions, search]);

  function openInbound(product?: Product) {
    setInitialProductId(product?.id ?? null);
    inboundDrawer.open();
  }

  const isLoading = tab === "products" ? loadingProducts : loadingTransactions;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <PageHeader
        eyebrow="จัดการคลังสินค้า"
        title="สต็อกสินค้า"
        action={
          <Button
            variant="primary"
            aria-label="รับของเข้าสต็อก"
            onPress={() => openInbound()}
            isDisabled={isLoading}
            className="h-10 shrink-0 gap-1.5 rounded-xl px-3.5"
          >
            <PlusIcon size={16} />
            รับของเข้า
          </Button>
        }
      />

      {loadingProducts && products.length === 0 ? (
        <StatCardsSkeleton count={3} compact className="mb-5" />
      ) : (
        <StatGrid>
          <StatCard
            compact
            label="สินค้า"
            value={formatNumber(products.length)}
            icon={<PackageIcon size={16} />}
            tone="accent"
          />
          <StatCard
            compact
            label="ใกล้หมด"
            value={formatNumber(lowStockCount)}
            icon={<AlertIcon size={16} />}
            tone="danger"
            hint={`ต่ำกว่า ${LOW_STOCK_THRESHOLD}`}
          />
          <StatCard
            compact
            label="ธุรกรรม"
            value={formatNumber(transactions.length)}
            icon={<HistoryIcon size={16} />}
            tone="neutral"
            hint="50 ล่าสุด"
          />
        </StatGrid>
      )}

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={
          tab === "products" ? "ค้นหาสินค้า..." : "ค้นหาธุรกรรม..."
        }
        searchAriaLabel="ค้นหาสต็อก"
      >
        <SegmentedControl
          items={TAB_ITEMS}
          value={tab}
          onChange={setTab}
          ariaLabel="มุมมองสต็อก"
        />
      </PageToolbar>

      {error ? (
        <div className="mb-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {tab === "products" ? (
        <section>
          <SectionHeader
            title="รายการสินค้า"
            actionLabel="เพิ่มสินค้า"
            actionHref="/stock/add"
          />
          <Card className="ds-card overflow-hidden">
            {loadingProducts ? (
              <ProductListSkeleton count={4} />
            ) : products.length === 0 ? (
              <EmptyState className="px-6 py-14 text-center">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <BoxIcon width={26} height={26} />
                </span>
                <p className="font-medium text-foreground">ยังไม่มีสินค้า</p>
                <p className="mt-1 text-sm text-muted">
                  เพิ่มสินค้าในระบบก่อน แล้วค่อยบันทึกรับเข้าสต็อก
                </p>
                <Link
                  href="/stock/add"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  <PlusIcon width={18} height={18} />
                  เพิ่มสินค้าแรก
                </Link>
              </EmptyState>
            ) : (
              <ul className="divide-y divide-separator">
                {products.map((product) => (
                  <ProductStockRow
                    key={product.id}
                    product={product}
                    onInbound={openInbound}
                  />
                ))}
              </ul>
            )}
          </Card>
        </section>
      ) : (
        <section className="space-y-3">
          <Card className="ds-card">
            <Card.Content className="p-2">
              <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => setTypeFilter(null)}
                  className={`h-8 shrink-0 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                    typeFilter === null
                      ? "bg-accent text-accent-foreground"
                      : "bg-default text-muted"
                  }`}
                >
                  ทั้งหมด
                </button>
                {transactionTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTypeFilter(type.id)}
                    className={`h-8 shrink-0 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                      typeFilter === type.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-default text-muted"
                    }`}
                  >
                    {type.labelTh}
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>

          <SectionHeader title="ธุรกรรมล่าสุด" />
          <Card className="ds-card overflow-hidden">
            {loadingTransactions ? (
              <ListSkeleton count={5} avatarShape="rounded" />
            ) : filteredTransactions.length === 0 ? (
              <EmptyState className="px-6 py-14 text-center">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <HistoryIcon width={26} height={26} />
                </span>
                <p className="font-medium text-foreground">ยังไม่มีธุรกรรม</p>
                <p className="mt-1 text-sm text-muted">
                  กดปุ่มด้านล่างเพื่อบันทึกรับของเข้าสต็อก
                </p>
              </EmptyState>
            ) : (
              <ul className="divide-y divide-separator">
                {filteredTransactions.map((transaction) => (
                  <StockTransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}

      <InboundStockDrawer
        state={inboundDrawer}
        products={products}
        initialProductId={initialProductId}
        onSuccess={() => void refreshAll()}
      />
    </div>
  );
}
