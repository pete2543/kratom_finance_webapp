/** โครงตาม kratom_finance_db.sql + API */

export type SaleTypeCode =
  | "cash"
  | "transfer"
  | "credit"
  | "retail"
  | "wholesale";
export type PaymentStatusCode = "paid" | "partial" | "unpaid";
export type PaymentMethodCode = "cash" | "transfer" | "promptpay";

export type Product = {
  id: number;
  name: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  stockQty: number;
  isActive: boolean;
  imageUrl?: string | null;
};

export type Customer = {
  id: number;
  name: string;
  phone?: string;
  lineUserId?: string;
  address?: string;
  creditLimit: number;
};

export type OrderCustomer = {
  id: number;
  name: string;
  phone?: string;
};

export type OrderItem = {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderPayment = {
  id: number;
  amount: number;
  methodId: number;
  methodCode: string;
  methodLabelTh: string;
  paidAt: string;
  note?: string | null;
};

export type Order = {
  id: number;
  code: string;
  customer?: OrderCustomer | null;
  customerName: string;
  saleTypeId?: number;
  saleTypeCode: string;
  saleTypeLabelTh: string;
  /** legacy / mock */
  saleType: SaleTypeCode;
  paymentStatusId?: number;
  paymentStatusCode: PaymentStatusCode;
  paymentStatusLabelTh: string;
  paymentStatus: PaymentStatusCode;
  totalAmount: number;
  paidAmount: number;
  orderDate: string;
  dueDate?: string | null;
  note?: string | null;
  items: OrderItem[];
  payments: OrderPayment[];
};

export type StockAlert = {
  productId: number;
  productName: string;
  stockQty: number;
  unit: string;
  reorderLevel: number;
};
