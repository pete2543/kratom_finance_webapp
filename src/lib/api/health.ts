import { apiGet } from "./client";

export type HealthStatus = {
  status: string;
  timestamp: string;
};

export const healthApi = {
  check() {
    return apiGet<HealthStatus>("/health");
  },
};
