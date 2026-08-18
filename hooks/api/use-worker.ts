import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type WorkerProfile = {
  id?: string;
  userId?: string;
  skilledIn?: string[];
  qualification?: string | null;
  certificates?: string[];
  aadharNumber?: string;
  yearsExperience?: number | null;
  profilePic?: string | null;
  bio?: string | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  availableAreas?: string[];
  latitude?: number | null;
  longitude?: number | null;
  hourlyRate?: number | null;
  minimumFee?: number | null;
};

export function useWorkerProfileQuery() {
  return useQuery({
    queryKey: ["workerProfile"],
    queryFn: async () => {
      const res = await fetch("/api/worker/profile");
      if (!res.ok) throw new Error("Failed to fetch worker profile");
      const payload = await res.json();
      return payload?.data ?? payload;
    },
  });
}

export function useUpdateWorkerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<WorkerProfile>) => {
      const res = await fetch("/api/worker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update worker profile");
      const payload = await res.json();
      return payload?.data ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workerProfile"] });
    },
  });
}

export function useSaveWorkerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<WorkerProfile>) => {
      const res = await fetch("/api/worker/profile", {
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
      const payload = await res.json();
      return payload?.data ?? payload;
    },
  });
}
