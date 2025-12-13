import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const data = await apiClient<any>("/courses", {
        method: "POST",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCourses"] });
    },
  });
};

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["getAllCourses"],
    queryFn: async () => {
      const data: any = await apiClient("/courses", {
        method: "GET",
      });
      return data;
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const id = payload.id;
      delete payload.id;
      const data = await apiClient<any>(`/courses/${id}`, {
        method: "PUT",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCourses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      const data = await apiClient<any>(`/courses/${id}`, {
        method: "DELETE",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCourses"] });
    },
  });
};
