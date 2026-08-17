import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useWorkerProfileQuery() {
  return useQuery({
    queryKey: ["workerProfile"],
    queryFn: async () => {
      const res = await fetch("/api/worker/profile");
      if (!res.ok) throw new Error("Failed to fetch worker profile");
      return res.json();
    },
  });
}

export function useUpdateWorkerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/worker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update worker profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workerProfile"] });
    },
  });
}

export function useWorkerEarningsQuery() {
  return useQuery({
    queryKey: ["workerEarnings"],
    queryFn: async () => {
      const res = await fetch("/api/worker/earnings");
      if (!res.ok) throw new Error("Failed to fetch worker earnings");
      return res.json();
    },
  });
}
