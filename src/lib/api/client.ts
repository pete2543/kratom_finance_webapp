import axios, { isAxiosError } from "axios";

import { apiConfig } from "@/config/api";

import { ApiError, type ApiResponse } from "./types";

export const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError<ApiResponse<unknown>>(error)) {
      const status = error.response?.data?.status ?? error.response?.status ?? 500;
      const message =
        error.response?.data?.message ?? error.message ?? "เกิดข้อผิดพลาดจาก API";

      return Promise.reject(new ApiError(status, message));
    }

    return Promise.reject(error);
  },
);

/** เรียก GET แล้ว unwrap ค่า `data` จาก response */
export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  return data.data;
}

/** เรียก POST แล้ว unwrap ค่า `data` จาก response */
export async function apiPost<T, B = unknown>(url: string, body?: B) {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  return data.data;
}

/** เรียก PATCH แล้ว unwrap ค่า `data` จาก response */
export async function apiPatch<T, B = unknown>(url: string, body?: B) {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  return data.data;
}

/** เรียก DELETE แล้ว unwrap ค่า `data` จาก response */
export async function apiDelete<T>(url: string) {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  return data.data;
}

/** เรียก POST multipart/form-data แล้ว unwrap ค่า `data` จาก response */
export async function apiUpload<T>(url: string, formData: FormData) {
  const { data } = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
}
