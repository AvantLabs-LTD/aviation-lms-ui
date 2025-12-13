import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const data = await apiClient<any>("/chapters", {
        method: "POST",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },
  });
};

export const useGetAllChapters = () => {
  return useQuery({
    queryKey: ["getAllChapters"],
    queryFn: async () => {
      const data: any = await apiClient("/chapters", {
        method: "GET",
      });
      return data;
    },
  });
};

export const useGetChapterById = (id: string) => {
  return useQuery({
    queryKey: ["getChapterById", id],
    queryFn: async () => {
      const data: any = await apiClient(`/chapters/${id}`, {
        method: "GET",
      });
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const id = payload.id;
      delete payload.id;
      const data = await apiClient<any>(`/chapters/${id}`, {
        method: "PUT",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      const data = await apiClient<any>(`/chapters/${id}`, {
        method: "DELETE",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },
  });
};
