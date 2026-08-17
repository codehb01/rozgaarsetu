import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useJobsQuery(role: "worker" | "customer") {
  return useQuery({
    queryKey: ["jobs", role],
    queryFn: async () => {
      const res = await fetch(`/api/${role}/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });
}

export function useJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      action,
      data,
    }: {
      jobId: string;
      action: "accept" | "start" | "complete" | "cancel";
      data?: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      if (!res.ok) throw new Error(`Failed to ${action} job`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
