export type Coordinates = {
  lat: number
  lng: number
}

export type Address = {
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  countryCode?: string
}

export type GeocodeResult = {
  coords: Coordinates
  displayName: string
  address?: Address
  source: "nominatim" | string
}

// Haversine distance in kilometers
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const R = 6371 // Earth radius km
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function formatDisplayAddress(addr?: Address): string | undefined {
  if (!addr) return undefined
  const parts = [addr.line1, addr.city, addr.state, addr.postalCode, addr.country]
  return parts.filter(Boolean).join(", ")
}
