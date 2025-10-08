"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
// Reverse geocoding via internal API to keep provider calls server-side.
import type { Coordinates, GeocodeResult } from "@/lib/location"

type Status = "idle" | "locating" | "success" | "error"

export function useLocation() {
  const [status, setStatus] = useState<Status>("idle")
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [place, setPlace] = useState<GeocodeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const getCurrentPosition = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation not supported")
      setStatus("error")
      return
    }
    setStatus("locating")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(c)
        setStatus("success")
        // reverse geocode (best-effort)
        try {
          abortRef.current?.abort()
          const ac = new AbortController()
          abortRef.current = ac
          const res = await fetch(`/api/reverse-geocode?lat=${c.lat}&lng=${c.lng}`, { signal: ac.signal })
          if (res.ok) {
            const data = await res.json()
            if (data?.result) setPlace(data.result)
          }
        } catch (e) {
          // ignore reverse geocode error
        }
      },
      (err) => {
        setError(err.message)
        setStatus("error")
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 }
    )
  }, [])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  return {
    status,
    coords,
    place,
    error,
    getCurrentPosition,
  }
}
