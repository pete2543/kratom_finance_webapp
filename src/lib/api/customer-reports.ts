import { apiGet } from "./client";
import type { PaginationParams } from "./types";

export type CustomerReportPeriod = {
  dateTime: string | null;
};

export type CustomerReportSummary = {
  customerCount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
};

export type CustomerReportItem = {
  id: number;
  name: string;
  phone?: string;
  lineUserId?: string | null;
  creditLimit: number;
  orderCount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  lastOrderDate?: string | null;
};

export type CustomerReportData = {
  items: CustomerReportItem[];
  summary: CustomerReportSummary;
  period: CustomerReportPeriod;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerReportParams = PaginationParams & {
  search?: string;
  /** กรองออเดอร์ในเดือนเดียวกับ datetime ที่ส่งมา */
  dateTime?: string;
  hasOutstanding?: boolean;
};

export type CustomerReportOrdersSummary = {
  orderCount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  lastOrderDate?: string | null;
};

export type CustomerReportOrderLineItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type CustomerReportOrder = {
  id: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  saleTypeCode: string;
  saleTypeLabelTh: string;
  paymentStatusCode: string;
  paymentStatusLabelTh: string;
  orderDate: string;
  dueDate?: string | null;
  note?: string | null;
  items: CustomerReportOrderLineItem[];
};

export type CustomerReportOrdersData = {
  items: CustomerReportOrder[];
  summary: CustomerReportOrdersSummary;
  period: CustomerReportPeriod;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerReportDetail = {
  id: number;
  name: string;
  phone?: string;
  lineUserId?: string | null;
  address?: string | null;
  creditLimit: number;
  createdAt?: string;
  summary: CustomerReportOrdersSummary;
  period: CustomerReportPeriod;
};

type CustomerReportSummaryApi = {
  customerCount?: number;
  totalAmount?: string | number;
  paidAmount?: string | number;
  outstandingAmount?: string | number;
};

type CustomerReportItemApi = {
  id: number;
  name: string;
  phone?: string | null;
  lineUserId?: string | null;
  creditLimit?: string | number | null;
  orderCount?: number;
  totalAmount?: string | number;
  paidAmount?: string | number;
  outstandingAmount?: string | number;
  lastOrderDate?: string | null;
};

type CustomerReportDataApi = {
  items: CustomerReportItemApi[];
  summary: CustomerReportSummaryApi;
  period: CustomerReportPeriod;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CustomerReportOrderLineItemApi = {
  productId: number;
  productName: string;
  quantity: string | number;
  unitPrice: string | number;
  subtotal: string | number;
};

type CustomerReportOrderApi = {
  id: number;
  totalAmount?: string | number;
  paidAmount?: string | number;
  outstandingAmount?: string | number;
  saleTypeCode?: string;
  saleTypeLabelTh?: string;
  paymentStatusCode?: string;
  paymentStatusLabelTh?: string;
  orderDate?: string;
  dueDate?: string | null;
  note?: string | null;
  items?: CustomerReportOrderLineItemApi[];
};

type CustomerReportOrdersDataApi = {
  items: CustomerReportOrderApi[];
  summary: CustomerReportOrdersSummaryApi;
  period: CustomerReportPeriod;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CustomerReportOrdersSummaryApi = {
  orderCount?: number;
  totalAmount?: string | number;
  paidAmount?: string | number;
  outstandingAmount?: string | number;
  lastOrderDate?: string | null;
};

type CustomerReportDetailApi = {
  id: number;
  name: string;
  phone?: string | null;
  lineUserId?: string | null;
  address?: string | null;
  creditLimit?: string | number | null;
  createdAt?: string;
  summary: CustomerReportOrdersSummaryApi;
  period: CustomerReportPeriod;
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSummary(raw: CustomerReportSummaryApi): CustomerReportSummary {
  return {
    customerCount: raw.customerCount ?? 0,
    totalAmount: toNumber(raw.totalAmount),
    paidAmount: toNumber(raw.paidAmount),
    outstandingAmount: toNumber(raw.outstandingAmount),
  };
}

function normalizeOrdersSummary(
  raw: CustomerReportOrdersSummaryApi,
): CustomerReportOrdersSummary {
  return {
    orderCount: raw.orderCount ?? 0,
    totalAmount: toNumber(raw.totalAmount),
    paidAmount: toNumber(raw.paidAmount),
    outstandingAmount: toNumber(raw.outstandingAmount),
    lastOrderDate: raw.lastOrderDate ?? null,
  };
}

function normalizeReportItem(raw: CustomerReportItemApi): CustomerReportItem {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone ?? undefined,
    lineUserId: raw.lineUserId ?? null,
    creditLimit: toNumber(raw.creditLimit),
    orderCount: raw.orderCount ?? 0,
    totalAmount: toNumber(raw.totalAmount),
    paidAmount: toNumber(raw.paidAmount),
    outstandingAmount: toNumber(raw.outstandingAmount),
    lastOrderDate: raw.lastOrderDate ?? null,
  };
}

function normalizeOrderLineItem(
  raw: CustomerReportOrderLineItemApi,
): CustomerReportOrderLineItem {
  const quantity = toNumber(raw.quantity);
  const unitPrice = toNumber(raw.unitPrice);
  return {
    productId: raw.productId,
    productName: raw.productName,
    quantity,
    unitPrice,
    subtotal: raw.subtotal != null ? toNumber(raw.subtotal) : quantity * unitPrice,
  };
}

function normalizeOrder(raw: CustomerReportOrderApi): CustomerReportOrder {
  return {
    id: raw.id,
    totalAmount: toNumber(raw.totalAmount),
    paidAmount: toNumber(raw.paidAmount),
    outstandingAmount: toNumber(raw.outstandingAmount),
    saleTypeCode: raw.saleTypeCode ?? "",
    saleTypeLabelTh: raw.saleTypeLabelTh ?? "",
    paymentStatusCode: raw.paymentStatusCode ?? "",
    paymentStatusLabelTh: raw.paymentStatusLabelTh ?? "",
    orderDate: raw.orderDate ?? new Date().toISOString(),
    dueDate: raw.dueDate ?? null,
    note: raw.note ?? null,
    items: (raw.items ?? []).map(normalizeOrderLineItem),
  };
}

function normalizeDetail(raw: CustomerReportDetailApi): CustomerReportDetail {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone ?? undefined,
    lineUserId: raw.lineUserId ?? null,
    address: raw.address ?? undefined,
    creditLimit: toNumber(raw.creditLimit),
    createdAt: raw.createdAt,
    summary: normalizeOrdersSummary(raw.summary),
    period: raw.period,
  };
}

export const customerReportsApi = {
  async list(params?: CustomerReportParams) {
    const data = await apiGet<CustomerReportDataApi>("/customer-reports", params);
    return {
      ...data,
      items: data.items.map(normalizeReportItem),
      summary: normalizeSummary(data.summary),
    } satisfies CustomerReportData;
  },

  async getById(customerId: number, params?: CustomerReportParams) {
    const data = await apiGet<CustomerReportDetailApi>(
      `/customer-reports/${customerId}`,
      params,
    );
    return normalizeDetail(data);
  },

  async orders(customerId: number, params?: CustomerReportParams) {
    const data = await apiGet<CustomerReportOrdersDataApi>(
      `/customer-reports/${customerId}/orders`,
      params,
    );
    return {
      ...data,
      items: data.items.map(normalizeOrder),
      summary: normalizeOrdersSummary(data.summary),
    } satisfies CustomerReportOrdersData;
  },
};
