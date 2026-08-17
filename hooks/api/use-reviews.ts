import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, rating, comment }: { jobId: string; rating: number; comment?: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, rating, comment }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] }); // Typically updating a review updates the job state
    },
  });
}
