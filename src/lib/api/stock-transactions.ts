import { apiDelete, apiGet, apiPost } from "./client";
import type { PaginatedData, PaginationParams } from "./types";

export type StockTransaction = {
  id: number;
  productId: number;
  productName?: string;
  typeId: number;
  typeCode?: string;
  typeLabelTh?: string;
  quantity: number;
  referenceType?: string;
  referenceId?: number;
  note?: string;
  stockBalanceAfter?: number;
  createdDate?: string;
};

export type CreateStockTransactionInput = {
  productId: number;
  typeId: number;
  quantity: number;
  referenceType?: string;
  referenceId?: number;
  note?: string;
};

export type CreateInboundStockInput = {
  productId: number;
  quantity: number;
  note?: string;
};

export type StockTransactionListParams = PaginationParams & {
  productId?: number;
  typeId?: number;
};

type StockTransactionApi = {
  id: number;
  productId: number;
  productName?: string;
  typeId: number;
  typeCode?: string;
  typeLabelTh?: string;
  quantity: string | number;
  referenceType?: string;
  referenceId?: number | null;
  note?: string | null;
  stockBalanceAfter?: string | number;
  createdAt?: string;
  createdDate?: string;
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeStockTransaction(raw: StockTransactionApi): StockTransaction {
  return {
    id: raw.id,
    productId: raw.productId,
    productName: raw.productName,
    typeId: raw.typeId,
    typeCode: raw.typeCode,
    typeLabelTh: raw.typeLabelTh,
    quantity: toNumber(raw.quantity),
    referenceType: raw.referenceType ?? undefined,
    referenceId: raw.referenceId ?? undefined,
    note: raw.note ?? undefined,
    stockBalanceAfter: raw.stockBalanceAfter != null
      ? toNumber(raw.stockBalanceAfter)
      : undefined,
    createdDate: raw.createdAt ?? raw.createdDate,
  };
}

async function mapPaginatedTransactions(data: PaginatedData<StockTransactionApi>) {
  return {
    ...data,
    items: data.items.map(normalizeStockTransaction),
  };
}

export const stockTransactionsApi = {
  async list(params?: StockTransactionListParams) {
    const data = await apiGet<PaginatedData<StockTransactionApi>>(
      "/stock-transactions",
      params,
    );
    return mapPaginatedTransactions(data);
  },

  async getById(id: number) {
    const data = await apiGet<StockTransactionApi>(`/stock-transactions/${id}`);
    return normalizeStockTransaction(data);
  },

  async create(input: CreateStockTransactionInput) {
    const data = await apiPost<StockTransactionApi, CreateStockTransactionInput>(
      "/stock-transactions",
      input,
    );
    return normalizeStockTransaction(data);
  },

  /** รับของเข้าสต็อก (type IN) */
  async inbound(input: CreateInboundStockInput) {
    const data = await apiPost<StockTransactionApi, CreateInboundStockInput>(
      "/stock-transactions/inbound",
      input,
    );
    return normalizeStockTransaction(data);
  },

  async remove(id: number) {
    const data = await apiDelete<StockTransactionApi>(`/stock-transactions/${id}`);
    return normalizeStockTransaction(data);
  },
};
