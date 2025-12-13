import { API_URL_LOCAL } from "../../config";
export interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export const apiClient = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token || localStorage.getItem("token")) {
    headers.Authorization = `Bearer ${token || localStorage.getItem("token")}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL_LOCAL}${endpoint}`, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
};
