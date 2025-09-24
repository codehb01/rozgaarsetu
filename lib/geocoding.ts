/**
 * Geocoding utilities using Google Maps API
 */

// City coordinates mapping (fallback for common cities)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "mumbai, maharashtra": { lat: 19.0760, lng: 72.8777 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "delhi, ncr": { lat: 28.6139, lng: 77.2090 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "bangalore, karnataka": { lat: 12.9716, lng: 77.5946 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "hyderabad, telangana": { lat: 17.3850, lng: 78.4867 },
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "chennai, tamil nadu": { lat: 13.0827, lng: 80.2707 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "pune, maharashtra": { lat: 18.5204, lng: 73.8567 },
  "pune": { lat: 18.5204, lng: 73.8567 },
  "ahmedabad, gujarat": { lat: 23.0225, lng: 72.5714 },
  "ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "jaipur, rajasthan": { lat: 26.9124, lng: 75.7873 },
  "jaipur": { lat: 26.9124, lng: 75.7873 },
};

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

/**
 * Get coordinates from city name using Google Maps Geocoding API
 */
export async function geocodeCity(cityName: string): Promise<LocationCoordinates | null> {
  try {
    // First try the fallback coordinates
    const fallback = CITY_COORDINATES[cityName.toLowerCase()];
    if (fallback) {
      return { ...fallback, address: cityName };
    }

    // If Google Maps API key is available, use it
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
      console.warn('Google Maps API key not configured, using fallback coordinates');
      return null;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Get current user location using browser geolocation API
 */
export async function getCurrentLocation(): Promise<LocationCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Try to get address from coordinates (reverse geocoding)
        try {
          const address = await reverseGeocode(coords.lat, coords.lng);
          resolve({ ...coords, address });
        } catch {
          resolve(coords);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
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
 * Convert coordinates to address using Google Maps Reverse Geocoding API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding API request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Find the most appropriate address (usually city level)
      const cityResult = data.results.find((result: any) =>
        result.types.includes('locality') || result.types.includes('administrative_area_level_2')
      );

      return cityResult?.formatted_address || data.results[0].formatted_address;
    }

    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * Calculate if a location is within a given radius of another location
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  targetLat: number,
  targetLng: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLng, targetLat, targetLng);
  return distance <= radiusKm;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}