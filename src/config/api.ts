export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://kratomfinanceapi.up.railway.app/api/v1",
  timeout: 30_000,
} as const;
