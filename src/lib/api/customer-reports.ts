import { apiGet } from "./client";
import type { PaginationParams } from "./types";

export type CustomerReportSummary = {
  customerCount: number;
  totalAmount: string;
  paidAmount: string;
  outstandingAmount: string;
};

export type CustomerReportPeriod = {
  dateTime: string | null;
};

export type CustomerReportItem = {
  id: number;
  name: string;
  phone?: string;
  totalAmount: string;
  paidAmount: string;
  outstandingAmount: string;
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
  totalAmount: string;
  paidAmount: string;
  outstandingAmount: string;
};

export type CustomerReportOrderItem = {
  id: number;
  code: string;
  orderDate: string;
  dueDate?: string;
  saleType: string;
  paymentStatus: string;
  totalAmount: string;
  paidAmount: string;
  outstandingAmount: string;
};

export type CustomerReportOrdersData = {
  items: CustomerReportOrderItem[];
  summary: CustomerReportOrdersSummary;
  period: CustomerReportPeriod;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerReportDetailCustomer = {
  id: number;
  name: string;
  phone?: string;
  lineUserId?: string;
  address?: string;
  creditLimit: number;
};

export type CustomerReportDetailData = {
  customer: CustomerReportDetailCustomer;
  summary: CustomerReportOrdersSummary;
  period: CustomerReportPeriod;
  items: CustomerReportOrderItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const customerReportsApi = {
  list(params?: CustomerReportParams) {
    return apiGet<CustomerReportData>("/customer-reports", params);
  },

  getById(customerId: number, params?: CustomerReportParams) {
    return apiGet<CustomerReportDetailData>(
      `/customer-reports/${customerId}`,
      params,
    );
  },

  orders(customerId: number, params?: CustomerReportParams) {
    return apiGet<CustomerReportOrdersData>(
      `/customer-reports/${customerId}/orders`,
      params,
    );
  },
};
