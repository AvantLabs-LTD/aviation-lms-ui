import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

const TOKEN_KEY = "token";

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const data = await apiClient<AuthResponse>("/auth/login", {
        method: "POST",
        body: credentials,
      });
      setToken(data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLoggedInUser"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterRequest): Promise<AuthResponse> => {
      const data = await apiClient<AuthResponse>("/auth/register", {
        method: "POST",
        body: credentials,
      });
      setToken(data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGetLoggedInUser = () => {
  return useQuery({
    queryKey: ["getLoggedInUser"],
    queryFn: async () => {
      let data;
      if (getToken()) {
        data = await apiClient("/auth/me", {
          method: "GET",
        });
      }
      return data?._id ? data : null;
    },
  });
};

/**
 * Hook to update student progress by adding a completed lesson
 */
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await apiClient<{ message: string; progress: string[] }>(
        "/auth/progress",
        {
          method: "POST",
          body: { lessonId },
        }
      );
      return response;
    },
    onSuccess: (data) => {
      // Invalidate or update the logged-in user query to reflect new progress
      queryClient.invalidateQueries({ queryKey: ["getLoggedInUser"] });

      // Optional: If you have other queries that depend on progress (e.g., lesson lists),
      // invalidate them here as well
      // queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error: any) => {
      console.error("Failed to update progress:", error);
      // You can handle error toast/notification here if needed
    },
  });
};
