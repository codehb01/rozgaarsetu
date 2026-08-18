import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type CustomerProfile = {
  id: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export function useCustomerProfileQuery() {
  return useQuery({
    queryKey: ["customerProfile"],
    queryFn: async () => {
      const res = await fetch("/api/customer/profile");
      if (!res.ok) throw new Error("Failed to fetch customer profile");
      const payload = await res.json();
      return payload?.data ?? payload;
    },
  });
}

export function useUpdateCustomerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CustomerProfile>) => {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update customer profile");
      const payload = await res.json();
      return payload?.data ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
}

export function useSaveCustomerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CustomerProfile>) => {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile");
      }
      const payload = await res.json();
      return payload?.data ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
}
