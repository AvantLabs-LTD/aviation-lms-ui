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
  console.log(
    "API Request Body:",
    body instanceof FormData ? "FormData (not logged)" : body
  );

  const headers: Record<string, string> = {};

  // Only add Authorization if needed
  const authToken = token || localStorage.getItem("token");
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      // Pass FormData directly — NO JSON.stringify, NO Content-Type header
      config.body = body;
    } else {
      // For plain objects/JSON
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_URL_LOCAL}${endpoint}`, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
};
