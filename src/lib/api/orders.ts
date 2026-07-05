import { apiGet, apiPost } from "./client";
import type { PaginatedData, PaginationParams } from "./types";
import type { Order, OrderItem } from "@/types";

export type CheckoutItemInput = {
  productId: number;
  quantity: number;
  /** ถ้าไม่ส่งจะใช้ราคาขายจากสินค้า */
  unitPrice?: number;
};

export type CheckoutPaymentInput = {
  /** payment_methods.id */
  methodId: number;
  /** ถ้าไม่ส่งจะใช้ยอดรวมออเดอร์ */
  amount?: number;
  note?: string;
};

export type CheckoutNewCustomerInput = {
  name: string;
  phone?: string;
  lineUserId?: string;
  address?: string;
  creditLimit?: number;
};

export type CheckoutOrderInput = {
  /** ลูกค้าเก่า — ส่ง customerId หรือ newCustomer อย่างใดอย่างหนึ่ง */
  customerId?: number;
  /** ลูกค้าใหม่ — สร้างลูกค้าแล้วผูกกับออเดอร์ทันที */
  newCustomer?: CheckoutNewCustomerInput;
  /** sale_types.id (1=cash, 2=transfer, 3=credit) */
  saleTypeId: number;
  items: CheckoutItemInput[];
  /** บังคับเมื่อ sale type ไม่ใช่ credit */
  payment?: CheckoutPaymentInput;
  /** วันครบกำหนดชำระ (แนะนำเมื่อ sale type = credit) */
  dueDate?: string;
  note?: string;
};

export type OrderListParams = PaginationParams & {
  customerId?: number;
  paymentStatusId?: number;
};

type OrderItemApi = {
  productId: number;
  productName?: string;
  quantity: string | number;
  unitPrice: string | number;
  subtotal?: string | number;
};

type OrderApi = {
  id: number;
  code?: string;
  orderNo?: string;
  customerId?: number | null;
  customerName?: string | null;
  saleTypeCode?: string;
  saleTypeLabelTh?: string;
  orderDate?: string;
  createdAt?: string;
  dueDate?: string | null;
  totalAmount?: string | number;
  paymentStatusCode?: string;
  paymentStatusLabelTh?: string;
  items?: OrderItemApi[];
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeOrderItem(raw: OrderItemApi): OrderItem {
  const quantity = toNumber(raw.quantity);
  const unitPrice = toNumber(raw.unitPrice);
  return {
    productId: raw.productId,
    productName: raw.productName ?? `สินค้า #${raw.productId}`,
    quantity,
    unitPrice,
    subtotal: raw.subtotal != null ? toNumber(raw.subtotal) : quantity * unitPrice,
  };
}

function normalizeOrder(raw: OrderApi): Order {
  return {
    id: raw.id,
    code: raw.code ?? raw.orderNo ?? `OD-${raw.id}`,
    customerName: raw.customerName ?? "ลูกค้าทั่วไป",
    saleType: (raw.saleTypeCode as Order["saleType"]) ?? "retail",
    orderDate: raw.orderDate ?? raw.createdAt ?? new Date().toISOString(),
    dueDate: raw.dueDate ?? undefined,
    totalAmount: toNumber(raw.totalAmount),
    paymentStatus: (raw.paymentStatusCode as Order["paymentStatus"]) ?? "unpaid",
    items: (raw.items ?? []).map(normalizeOrderItem),
  };
}

export const ordersApi = {
  async list(params?: OrderListParams) {
    const data = await apiGet<PaginatedData<OrderApi>>("/orders", params);
    return { ...data, items: data.items.map(normalizeOrder) };
  },

  async getById(id: number) {
    const data = await apiGet<OrderApi>(`/orders/${id}`);
    return normalizeOrder(data);
  },

  /** ขายสินค้า — รองรับลูกค้าเก่า/ใหม่, รายการสินค้า, ชำระเงิน, ตัดสต็อก */
  async checkout(input: CheckoutOrderInput) {
    const data = await apiPost<OrderApi, CheckoutOrderInput>(
      "/orders/checkout",
      input,
    );
    return normalizeOrder(data);
  },
};
