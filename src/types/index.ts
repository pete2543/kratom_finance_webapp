/** โครงตาม kratom_finance_db.sql */

export type SaleTypeCode = "retail" | "wholesale" | "credit";
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

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: number;
  code: string;
  customerName: string;
  saleType: SaleTypeCode;
  orderDate: string;
  dueDate?: string;
  totalAmount: number;
  paymentStatus: PaymentStatusCode;
  items: OrderItem[];
};

export type StockAlert = {
  productId: number;
  productName: string;
  stockQty: number;
  unit: string;
  reorderLevel: number;
};
