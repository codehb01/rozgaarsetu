import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCustomerProfileQuery() {
  return useQuery({
    queryKey: ["customerProfile"],
    queryFn: async () => {
      const res = await fetch("/api/customer/profile");
      if (!res.ok) throw new Error("Failed to fetch customer profile");
      return res.json();
    },
  });
}

export function useUpdateCustomerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update customer profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
}
