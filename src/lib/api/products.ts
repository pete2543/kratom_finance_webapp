import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { PaginatedData, PaginationParams } from "./types";
import type { Product } from "@/types";

export type CreateProductInput = {
  name: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  isActive?: boolean;
};

export type UpdateProductInput = {
  name?: string;
  costPrice?: number;
  sellingPrice?: number;
  unit?: string;
  isActive?: boolean;
};

export type ProductListParams = PaginationParams & {
  search?: string;
  isActive?: boolean;
};

type ProductApi = {
  id: number;
  name: string;
  costPrice: string | number;
  sellingPrice: string | number;
  unit: string;
  isActive: boolean;
  stockBalance?: string | number;
  stockQty?: string | number;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function toNumber(value: string | number | undefined | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeProduct(raw: ProductApi): Product {
  return {
    id: raw.id,
    name: raw.name,
    costPrice: toNumber(raw.costPrice),
    sellingPrice: toNumber(raw.sellingPrice),
    unit: raw.unit,
    stockQty: toNumber(raw.stockBalance ?? raw.stockQty),
    isActive: raw.isActive,
    imageUrl: raw.imageUrl || null,
  };
}

async function mapPaginatedProducts(data: PaginatedData<ProductApi>) {
  return {
    ...data,
    items: data.items.map(normalizeProduct),
  };
}

export const productsApi = {
  async list(params?: ProductListParams) {
    const data = await apiGet<PaginatedData<ProductApi>>("/products", params);
    return mapPaginatedProducts(data);
  },

  async getById(id: number) {
    const data = await apiGet<ProductApi>(`/products/${id}`);
    return normalizeProduct(data);
  },

  async create(input: CreateProductInput) {
    const data = await apiPost<ProductApi, CreateProductInput>("/products", input);
    return normalizeProduct(data);
  },

  async update(id: number, input: UpdateProductInput) {
    const data = await apiPatch<ProductApi, UpdateProductInput>(`/products/${id}`, input);
    return normalizeProduct(data);
  },

  /** ปิดการใช้งานสินค้า (soft delete) — DELETE /products/{id} */
  async deactivate(id: number) {
    const data = await apiDelete<ProductApi>(`/products/${id}`);
    return normalizeProduct(data);
  },
};
