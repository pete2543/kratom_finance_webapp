import { apiGet } from "./client";

export type DropdownOption = {
  id: number;
  code: string;
  labelTh: string;
};

export const dropdownApi = {
  saleTypes() {
    return apiGet<DropdownOption[]>("/dropdown/sale-types");
  },

  paymentStatuses() {
    return apiGet<DropdownOption[]>("/dropdown/payment-statuses");
  },

  paymentMethods() {
    return apiGet<DropdownOption[]>("/dropdown/payment-methods");
  },

  stockTransactionTypes() {
    return apiGet<DropdownOption[]>("/dropdown/stock-transaction-types");
  },

  notificationTypes() {
    return apiGet<DropdownOption[]>("/dropdown/notification-types");
  },
};
