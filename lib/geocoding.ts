import { GeocodeResult } from "./location";

// Minimal Nominatim client (OpenStreetMap) with a proper User-Agent via headers.
// For production, consider adding caching (e.g., LRU) and rate-limit/proxy on server.

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OSM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ||
  "RozgaarSetu/1.0 (contact: support@rozgaarsetu.local)";
const APP_REFERER = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// simple in-memory cache
type CacheEntry<T> = { t: number; v: T };
const SEARCH_CACHE = new Map<string, CacheEntry<GeocodeResult[]>>();
const REVERSE_CACHE = new Map<string, CacheEntry<GeocodeResult>>();
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ITEMS = 100;

function getCache<T>(
  map: Map<string, CacheEntry<T>>,
  key: string
): T | undefined {
  const now = Date.now();
  const hit = map.get(key);
  if (hit && now - hit.t < TTL_MS) return hit.v;
  if (hit) map.delete(key);
  return undefined;
}

function setCache<T>(map: Map<string, CacheEntry<T>>, key: string, v: T) {
  if (map.size >= MAX_ITEMS) {
    // naive eviction: delete oldest
    let oldestKey: string | null = null;
    let oldestT = Infinity;
    for (const [k, e] of map.entries()) {
      if (e.t < oldestT) {
        oldestT = e.t;
        oldestKey = k;
      }
    }
    if (oldestKey) map.delete(oldestKey);
  }
  map.set(key, { t: Date.now(), v });
}

// naive 1 req/sec throttle per endpoint (best-effort; not guaranteed in serverless/multi-instance)
let lastSearchAt = 0;
let lastReverseAt = 0;
async function throttle(kind: "search" | "reverse") {
  const now = Date.now();
  const last = kind === "search" ? lastSearchAt : lastReverseAt;
  const elapsed = now - last;
  const wait = elapsed >= 1000 ? 0 : 1000 - elapsed;
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  if (kind === "search") lastSearchAt = Date.now();
  else lastReverseAt = Date.now();
}

export async function geocodeFreeOSM(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeResult[]> {
  if (!query?.trim()) return [];
  const q = query.trim();
  const cached = getCache(SEARCH_CACHE, q);
  if (cached) return cached;
  await throttle("search");
  const url = new URL(NOMINATIM_BASE + "/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      // Identify your app per Nominatim policy
      "User-Agent": OSM_USER_AGENT,
      Referer: APP_REFERER,
    },
    signal,
    // cache: "force-cache" // optional
  });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data = (await res.json()) as unknown[];
  const results = data.map((d) => toGeocodeResultFromNominatim(d));
  setCache(SEARCH_CACHE, q, results);
  return results;
}

export async function reverseGeocodeFreeOSM(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<GeocodeResult | null> {
  const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  const cached = getCache(REVERSE_CACHE, key);
  if (cached) return cached;
  await throttle("reverse");
  const url = new URL(NOMINATIM_BASE + "/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": OSM_USER_AGENT,
      Referer: APP_REFERER,
    },
    signal,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  if (!data) return null;
  const result = toGeocodeResultFromNominatim(data);
  setCache(REVERSE_CACHE, key, result);
  return result;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    state?: string;
    county?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

function toGeocodeResultFromNominatim(d: unknown): GeocodeResult {
  const data = d as NominatimResponse;
  const address = data.address ?? {};
  return {
    coords: { lat: parseFloat(data.lat), lng: parseFloat(data.lon) },
    displayName: data.display_name ?? "",
    address: {
      line1:
        [address.house_number, address.road].filter(Boolean).join(" ") ||
        undefined,
      city:
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        undefined,
      state: address.state || address.county || undefined,
      postalCode: address.postcode || undefined,
      country: address.country || undefined,
      countryCode: address.country_code || undefined,
    },
    source: "nominatim",
  };
}
