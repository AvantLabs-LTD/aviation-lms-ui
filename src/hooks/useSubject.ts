import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

interface ReorderSubjectsPayload {
  courseId: string;
  orderedIds: string[]; // array of subject _id strings in new order
}

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const data = await apiClient<any>("/subjects", {
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

export const useGetAllSubjects = () => {
  return useQuery({
    queryKey: ["getAllSubjects"],
    queryFn: async () => {
      const data: any = await apiClient("/subjects", {
        method: "GET",
      });
      return data;
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
      const id = payload.id;
      delete payload.id;
      const data = await apiClient<any>(`/subjects/${id}`, {
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

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      const data = await apiClient<any>(`/subjects/${id}`, {
        method: "DELETE",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },
  });
};

export const useReorderSubjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReorderSubjectsPayload): Promise<any> => {
      const data = await apiClient<any>("/subjects/reorder", {
        method: "POST",
        body: payload,
      });
      return data;
    },

    // Optional: optimistic update (if you want to update UI immediately)
    onMutate: async (payload: ReorderSubjectsPayload) => {
      // Cancel ongoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["getAllSubjects"] });

      // Get current data
      const previousSubjects: any = queryClient.getQueryData([
        "getAllSubjects",
      ]);

      if (previousSubjects) {
        // Optimistically reorder the subjects in cache
        const updatedSubjects = previousSubjects?.map((subject: any) => {
          const newIndex = payload.orderedIds.indexOf(subject._id);
          if (newIndex !== -1) {
            return { ...subject, order: newIndex + 1 };
          }
          return subject;
        });

        // Sort by new order
        updatedSubjects.sort((a: any, b: any) => a.order - b.order);

        // Update cache immediately
        queryClient.setQueryData(["getAllSubjects"], updatedSubjects);
      }

      return { previousSubjects }; // for rollback on error
    },

    // On success: refetch or keep optimistic update
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },

    // Rollback on error
    onError: (error, payload, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(["getAllSubjects"], context.previousSubjects);
      }
    },

    // Optional: refetch after settle to ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSubjects"] });
    },
  });
};
