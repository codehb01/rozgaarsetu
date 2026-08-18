import { useQuery } from "@tanstack/react-query";

type WorkersSearchParams = {
  q?: string;
  category?: string;
  location?: string;
  sortBy?: string;
  lat?: number;
  lng?: number;
};

export function useWorkersSearchQuery(params: WorkersSearchParams) {
  const { q, category, location, sortBy, lat, lng } = params;

  return useQuery({
    queryKey: ["workers", q, category, location, sortBy, lat, lng],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (q) qs.set("q", q);
      if (location) qs.set("location", location);
      if (lat) qs.set("lat", String(lat));
      if (lng) qs.set("lng", String(lng));
      if (category && category !== "All")
        qs.set("category", category.toLowerCase());
      if (sortBy && sortBy !== "relevance") qs.set("sort", sortBy);
      qs.set("limit", "30");

      const url = `/api/workers?${qs.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch workers");
      const payload = await res.json();
      return payload?.data ?? { workers: [], count: 0 };
    },
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}
