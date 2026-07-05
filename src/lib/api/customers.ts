import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { PaginatedData, PaginationParams } from "./types";
import type { Customer } from "@/types";

export type CreateCustomerInput = {
  name: string;
  phone?: string;
  lineUserId?: string;
  address?: string;
  creditLimit?: number;
};

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export type CustomerListParams = PaginationParams & {
  search?: string;
};

type CustomerApi = {
  id: number;
  name: string;
  phone?: string | null;
  lineUserId?: string | null;
  address?: string | null;
  creditLimit?: string | number | null;
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeCustomer(raw: CustomerApi): Customer {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone ?? undefined,
    lineUserId: raw.lineUserId ?? undefined,
    address: raw.address ?? undefined,
    creditLimit: toNumber(raw.creditLimit),
  };
}

export const customersApi = {
  async list(params?: CustomerListParams) {
    const data = await apiGet<PaginatedData<CustomerApi>>("/customers", params);
    return { ...data, items: data.items.map(normalizeCustomer) };
  },

  async getById(id: number) {
    const data = await apiGet<CustomerApi>(`/customers/${id}`);
    return normalizeCustomer(data);
  },

  async create(input: CreateCustomerInput) {
    const data = await apiPost<CustomerApi, CreateCustomerInput>("/customers", input);
    return normalizeCustomer(data);
  },

  async update(id: number, input: UpdateCustomerInput) {
    const data = await apiPatch<CustomerApi, UpdateCustomerInput>(
      `/customers/${id}`,
      input,
    );
    return normalizeCustomer(data);
  },

  async remove(id: number) {
    const data = await apiDelete<CustomerApi>(`/customers/${id}`);
    return normalizeCustomer(data);
  },
};
