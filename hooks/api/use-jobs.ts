import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useJobsQuery(role: "worker" | "customer") {
  return useQuery({
    queryKey: ["jobs", role],
    queryFn: async () => {
      const res = await fetch(`/api/${role}/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const payload = await res.json();
      return payload?.data ?? payload;
    },
  });
}

export function useJobMutation() {
  const queryClient = useQueryClient();

  const actionMap: Record<"accept" | "start" | "complete" | "cancel", "ACCEPT" | "START" | "COMPLETE" | "CANCEL"> = {
    accept: "ACCEPT",
    start: "START",
    complete: "COMPLETE",
    cancel: "CANCEL",
  };

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
      const apiAction = actionMap[action];
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: apiAction, ...data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Failed to ${action} job`);
      }
      const payload = await res.json();
      return payload?.data ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
