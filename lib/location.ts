/**
 * Location services and utilities for RozgaarSetu
 * Handles geocoding, distance calculations, and location-based operations
 */

// Types for location data
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: Coordinates;
}

export interface DistanceResult {
  distance: number; // in kilometers
  distanceText: string; // formatted text like "2.5 km"
  isNearby: boolean; // within 10km
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): DistanceResult {
  const distance = Math.round(distanceKm * 10) / 10; // Round to 1 decimal
  
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    return {
      distance,
      distanceText: `${meters}m away`,
      isNearby: true,
    };
  }
  
  return {
    distance,
    distanceText: `${distance} km away`,
    isNearby: distance <= 10,
  };
}

/**
 * Geocode an address using Google Maps API
 * @param address Full address string
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    
    console.warn(`Geocoding failed for address: ${address}, status: ${data.status}`);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param lat Latitude
 * @param lng Longitude
 * @returns LocationInfo or null if reverse geocoding fails
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationInfo | null> {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const components = result.address_components;
      
      // Extract address components
      const getComponent = (types: string[]) => {
        const component = components.find((c: any) =>
          types.some((type) => c.types.includes(type))
        );
        return component?.long_name || "";
      };
      
      return {
        address: result.formatted_address,
        city: getComponent(["locality", "administrative_area_level_2"]),
        state: getComponent(["administrative_area_level_1"]),
        country: getComponent(["country"]),
        postalCode: getComponent(["postal_code"]),
        coordinates: { latitude: lat, longitude: lng },
      };
    }
    
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

/**
 * Get current user location using browser geolocation API
 * This is a client-side utility
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Check if a worker is within service radius of a customer
 * @param workerCoords Worker's coordinates
 * @param customerCoords Customer's coordinates
 * @param radiusKm Service radius in kilometers
 * @returns Whether worker can serve the customer
 */
export function isWithinServiceRadius(
  workerCoords: Coordinates,
  customerCoords: Coordinates,
  radiusKm: number = 25
): boolean {
  const distance = calculateDistance(
    workerCoords.latitude,
    workerCoords.longitude,
    customerCoords.latitude,
    customerCoords.longitude
  );
  
  return distance <= radiusKm;
}

/**
 * Sort workers by distance from customer
 * @param workers Array of workers with coordinates
 * @param customerCoords Customer's coordinates
 * @returns Workers sorted by distance (closest first)
 */
export function sortWorkersByDistance<T extends { latitude?: number; longitude?: number }>(
  workers: T[],
  customerCoords: Coordinates
): (T & { distance?: number })[] {
  return workers
    .map((worker) => {
      if (!worker.latitude || !worker.longitude) {
        return { ...worker, distance: undefined };
      }
      
      const distance = calculateDistance(
        customerCoords.latitude,
        customerCoords.longitude,
        worker.latitude,
        worker.longitude
      );
      
      return { ...worker, distance };
    })
    .sort((a, b) => {
      // Workers with coordinates come first
      if (a.distance !== undefined && b.distance === undefined) return -1;
      if (a.distance === undefined && b.distance !== undefined) return 1;
      if (a.distance === undefined && b.distance === undefined) return 0;
      
      // Sort by distance
      return a.distance! - b.distance!;
    });
}

/**
 * Calculate a relevance score for worker based on distance and other factors
 * @param worker Worker data with coordinates
 * @param customer Customer data with coordinates
 * @param searchQuery Search query text
 * @returns Relevance score (0-100)
 */
export function calculateWorkerRelevanceScore(
  worker: {
    latitude?: number;
    longitude?: number;
    skilledIn?: string[];
    city?: string;
    yearsExperience?: number;
    availableAreas?: string[];
  },
  customer: {
    latitude?: number;
    longitude?: number;
    city?: string;
  },
  searchQuery?: string
): number {
  let score = 0;
  
  // Distance score (40% weight)
  if (worker.latitude && worker.longitude && customer.latitude && customer.longitude) {
    const distance = calculateDistance(
      customer.latitude,
      customer.longitude,
      worker.latitude,
      worker.longitude
    );
    
    // Closer workers get higher scores
    if (distance <= 5) score += 40;
    else if (distance <= 10) score += 35;
    else if (distance <= 25) score += 25;
    else if (distance <= 50) score += 15;
    else score += 5;
  } else if (worker.city && customer.city && worker.city.toLowerCase() === customer.city.toLowerCase()) {
    // Same city gets medium score if no coordinates
    score += 25;
  }
  
  // Skills match score (30% weight)
  if (searchQuery && worker.skilledIn) {
    const query = searchQuery.toLowerCase();
    const skillsMatch = worker.skilledIn.some(skill => 
      skill.toLowerCase().includes(query)
    );
    if (skillsMatch) score += 30;
  }
  
  // Experience score (20% weight)
  if (worker.yearsExperience) {
    if (worker.yearsExperience >= 10) score += 20;
    else if (worker.yearsExperience >= 5) score += 15;
    else if (worker.yearsExperience >= 2) score += 10;
    else score += 5;
  }
  
  // Service area coverage (10% weight)
  if (worker.availableAreas && customer.city) {
    const cityMatch = worker.availableAreas.some(area =>
      area.toLowerCase().includes(customer.city!.toLowerCase())
    );
    if (cityMatch) score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
}