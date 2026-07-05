import type {
  Customer,
  Order,
  PaymentStatusCode,
  Product,
  SaleTypeCode,
  StockAlert,
} from "@/types";

export const saleTypeLabels: Record<SaleTypeCode, string> = {
  cash: "เงินสด",
  transfer: "เงินโอน",
  credit: "เครดิตวางบิล",
  retail: "ขายปลีก",
  wholesale: "ขายส่ง",
};

export const paymentStatusLabels: Record<PaymentStatusCode, string> = {
  paid: "ชำระแล้ว",
  partial: "ชำระบางส่วน",
  unpaid: "ค้างชำระ",
};

export const products: Product[] = [
  {
    id: 1,
    name: "น้ำกระท่อมสูตรเข้มข้น 500ml",
    costPrice: 35,
    sellingPrice: 60,
    unit: "ขวด",
    stockQty: 8,
    isActive: true,
  },
  {
    id: 2,
    name: "น้ำกระท่อมสูตรมาตรฐาน 350ml",
    costPrice: 22,
    sellingPrice: 40,
    unit: "ขวด",
    stockQty: 124,
    isActive: true,
  },
  {
    id: 3,
    name: "ใบกระท่อมสด (แพ็ก 1 กก.)",
    costPrice: 120,
    sellingPrice: 200,
    unit: "แพ็ก",
    stockQty: 15,
    isActive: true,
  },
  {
    id: 4,
    name: "น้ำกระท่อมพร้อมดื่ม 180ml",
    costPrice: 12,
    sellingPrice: 25,
    unit: "ขวด",
    stockQty: 6,
    isActive: true,
  },
];

export const customers: Customer[] = [
  { id: 1, name: "ร้านลุงหมี", phone: "081-234-5678", creditLimit: 5000 },
  { id: 2, name: "เจ๊แดง ปากซอย", phone: "089-111-2222", creditLimit: 3000 },
  { id: 3, name: "ลูกค้าทั่วไป", creditLimit: 0 },
];

const now = new Date();
const iso = (hoursAgo: number) =>
  new Date(now.getTime() - hoursAgo * 3600_000).toISOString();

export const orders: Order[] = [
  {
    id: 101,
    code: "OD-1042",
    customerName: "ลูกค้าทั่วไป",
    saleTypeCode: "retail",
    saleTypeLabelTh: "ขายปลีก",
    saleType: "retail",
    paymentStatusCode: "paid",
    paymentStatusLabelTh: "ชำระแล้ว",
    paymentStatus: "paid",
    orderDate: iso(1),
    totalAmount: 180,
    paidAmount: 180,
    items: [
      { productId: 1, productName: "น้ำกระท่อมเข้มข้น", quantity: 3, unitPrice: 60, subtotal: 180 },
    ],
    payments: [],
  },
  {
    id: 102,
    code: "OD-1041",
    customerName: "ร้านลุงหมี",
    saleTypeCode: "wholesale",
    saleTypeLabelTh: "ขายส่ง",
    saleType: "wholesale",
    paymentStatusCode: "unpaid",
    paymentStatusLabelTh: "ค้างชำระ",
    paymentStatus: "unpaid",
    orderDate: iso(3),
    dueDate: iso(-168),
    totalAmount: 2400,
    paidAmount: 0,
    items: [
      { productId: 2, productName: "สูตรมาตรฐาน", quantity: 60, unitPrice: 40, subtotal: 2400 },
    ],
    payments: [],
  },
  {
    id: 103,
    code: "OD-1040",
    customerName: "เจ๊แดง ปากซอย",
    saleTypeCode: "credit",
    saleTypeLabelTh: "เครดิตวางบิล",
    saleType: "credit",
    paymentStatusCode: "partial",
    paymentStatusLabelTh: "ชำระบางส่วน",
    paymentStatus: "partial",
    orderDate: iso(5),
    dueDate: iso(-72),
    totalAmount: 1200,
    paidAmount: 600,
    items: [
      { productId: 3, productName: "ใบกระท่อมสด", quantity: 6, unitPrice: 200, subtotal: 1200 },
    ],
    payments: [],
  },
  {
    id: 104,
    code: "OD-1039",
    customerName: "ลูกค้าทั่วไป",
    saleTypeCode: "retail",
    saleTypeLabelTh: "ขายปลีก",
    saleType: "retail",
    paymentStatusCode: "paid",
    paymentStatusLabelTh: "ชำระแล้ว",
    paymentStatus: "paid",
    orderDate: iso(7),
    totalAmount: 325,
    paidAmount: 325,
    items: [
      { productId: 4, productName: "พร้อมดื่ม 180ml", quantity: 13, unitPrice: 25, subtotal: 325 },
    ],
    payments: [],
  },
];

export const stockAlerts: StockAlert[] = products
  .filter((p) => p.stockQty <= 10)
  .map((p) => ({
    productId: p.id,
    productName: p.name,
    stockQty: p.stockQty,
    unit: p.unit,
    reorderLevel: 10,
  }));

/** สรุปตัวเลขหน้า dashboard (mock) */
export const dashboardSummary = {
  todaySales: 1830,
  todaySalesChange: 12.5,
  incomeThisMonth: 48250,
  expenseThisMonth: 21600,
  outstandingCredit: orders
    .filter((o) => o.paymentStatus !== "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0),
  orderCountToday: 14,
};

export const monthlyProfit =
  dashboardSummary.incomeThisMonth - dashboardSummary.expenseThisMonth;

/** ยอดขาย 7 วันย้อนหลัง (mock สำหรับกราฟ) */
export const weeklySales = [
  { label: "จ.", value: 1420 },
  { label: "อ.", value: 980 },
  { label: "พ.", value: 1650 },
  { label: "พฤ.", value: 2100 },
  { label: "ศ.", value: 1830 },
  { label: "ส.", value: 2540 },
  { label: "อา.", value: 1980 },
];
