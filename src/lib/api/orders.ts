import { apiGet, apiPost } from "./client";
import type { PaginatedData, PaginationParams } from "./types";
import type {
  Order,
  OrderCustomer,
  OrderItem,
  OrderPayment,
  PaymentStatusCode,
  SaleTypeCode,
} from "@/types";

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

type OrderCustomerApi = {
  id: number;
  name: string;
  phone?: string | null;
};

type OrderItemApi = {
  id?: number;
  productId: number;
  productName?: string;
  quantity: string | number;
  unitPrice: string | number;
  subtotal?: string | number;
};

type OrderPaymentApi = {
  id: number;
  amount?: string | number;
  methodId: number;
  methodCode?: string;
  methodLabelTh?: string;
  paidAt?: string;
  note?: string | null;
};

type OrderApi = {
  id: number;
  code?: string;
  orderNo?: string;
  customer?: OrderCustomerApi | null;
  customerId?: number | null;
  customerName?: string | null;
  saleTypeId?: number;
  saleTypeCode?: string;
  saleTypeLabelTh?: string;
  paymentStatusId?: number;
  paymentStatusCode?: string;
  paymentStatusLabelTh?: string;
  orderDate?: string;
  createdAt?: string;
  dueDate?: string | null;
  totalAmount?: string | number;
  paidAmount?: string | number;
  note?: string | null;
  items?: OrderItemApi[];
  payments?: OrderPaymentApi[];
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asSaleTypeCode(code?: string): SaleTypeCode {
  const allowed: SaleTypeCode[] = [
    "cash",
    "transfer",
    "credit",
    "retail",
    "wholesale",
  ];
  return allowed.includes(code as SaleTypeCode)
    ? (code as SaleTypeCode)
    : "cash";
}

function asPaymentStatusCode(code?: string): PaymentStatusCode {
  const allowed: PaymentStatusCode[] = ["paid", "partial", "unpaid"];
  return allowed.includes(code as PaymentStatusCode)
    ? (code as PaymentStatusCode)
    : "unpaid";
}

function normalizeCustomer(raw?: OrderCustomerApi | null): OrderCustomer | null {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone ?? undefined,
  };
}

function normalizeOrderItem(raw: OrderItemApi): OrderItem {
  const quantity = toNumber(raw.quantity);
  const unitPrice = toNumber(raw.unitPrice);
  return {
    id: raw.id,
    productId: raw.productId,
    productName: raw.productName ?? `สินค้า #${raw.productId}`,
    quantity,
    unitPrice,
    subtotal: raw.subtotal != null ? toNumber(raw.subtotal) : quantity * unitPrice,
  };
}

function normalizePayment(raw: OrderPaymentApi): OrderPayment {
  return {
    id: raw.id,
    amount: toNumber(raw.amount),
    methodId: raw.methodId,
    methodCode: raw.methodCode ?? "",
    methodLabelTh: raw.methodLabelTh ?? "",
    paidAt: raw.paidAt ?? new Date().toISOString(),
    note: raw.note ?? null,
  };
}

function normalizeOrder(raw: OrderApi): Order {
  const customer = normalizeCustomer(raw.customer);
  const saleTypeCode = raw.saleTypeCode ?? "cash";
  const paymentStatusCode = asPaymentStatusCode(raw.paymentStatusCode);

  return {
    id: raw.id,
    code: raw.code ?? raw.orderNo ?? `OD-${raw.id}`,
    customer,
    customerName: customer?.name ?? raw.customerName ?? "ลูกค้าทั่วไป",
    saleTypeId: raw.saleTypeId,
    saleTypeCode,
    saleTypeLabelTh: raw.saleTypeLabelTh ?? saleTypeCode,
    saleType: asSaleTypeCode(saleTypeCode),
    paymentStatusId: raw.paymentStatusId,
    paymentStatusCode,
    paymentStatusLabelTh: raw.paymentStatusLabelTh ?? paymentStatusCode,
    paymentStatus: paymentStatusCode,
    totalAmount: toNumber(raw.totalAmount),
    paidAmount: toNumber(raw.paidAmount),
    orderDate: raw.orderDate ?? raw.createdAt ?? new Date().toISOString(),
    dueDate: raw.dueDate ?? null,
    note: raw.note ?? null,
    items: (raw.items ?? []).map(normalizeOrderItem),
    payments: (raw.payments ?? []).map(normalizePayment),
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

export type { Order, OrderCustomer, OrderItem, OrderPayment };
