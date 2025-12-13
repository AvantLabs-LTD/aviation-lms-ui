import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const data = await apiClient<any>("/lessons", {
        method: "POST",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllLessons"] });
    },
  });
};

export const useGetAllLessons = (chapterId: string) => {
  return useQuery({
    queryKey: ["getAllLessons", chapterId],
    queryFn: async () => {
      const data: any = await apiClient(`/lessons?chapter=${chapterId}`, {
        method: "GET",
      });
      return data;
    },
    enabled: !!chapterId,
  });
};

export const useGetLessonById = (id: string) => {
  return useQuery({
    queryKey: ["getLessonById", id],
    queryFn: async () => {
      const data: any = await apiClient(`/lessons/${id}`, {
        method: "GET",
      });
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const id = payload.id;
      delete payload.id;
      const data = await apiClient<any>(`/lessons/${id}`, {
        method: "PUT",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllLessons"] });
      queryClient.invalidateQueries({ queryKey: ["getLessonById"] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      const data = await apiClient<any>(`/lessons/${id}`, {
        method: "DELETE",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllLessons"] });
      queryClient.invalidateQueries({ queryKey: ["getLessonById"] });
    },
  });
};
