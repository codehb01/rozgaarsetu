"use client";

import { useState, useEffect } from 'react';

export interface LocationData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isCurrentLocation: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    address: "Current Location",
    isCurrentLocation: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with current location detection
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported");
      }

      const position = await getCurrentPosition();
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Try to get address from coordinates
      let address = "Current Location";
      try {
        address = await reverseGeocode(coords.lat, coords.lng);
      } catch {
        // Keep "Current Location" as fallback
      }

      setLocation({
        address,
        coordinates: coords,
        isCurrentLocation: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Location detection failed");
      // Set default fallback location
      setLocation({
        address: "Mumbai, Maharashtra",
        coordinates: { lat: 19.0760, lng: 72.8777 },
        isCurrentLocation: false
      });
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const coords = await geocodeCity(cityName);
      setLocation({
        address: cityName,
        coordinates: coords || undefined,
        isCurrentLocation: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set location");
      setLocation({
        address: cityName,
        isCurrentLocation: false
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    detectCurrentLocation,
    setManualLocation
  };
}

// Helper functions
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
    // Fallback to approximate city based on coordinates
    return getApproximateCity(lat, lng);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      // Find city-level result
      const cityResult = data.results.find((result: any) =>
        result.types.includes('locality') || result.types.includes('administrative_area_level_2')
      );
      
      if (cityResult) {
        return formatAddress(cityResult.formatted_address);
      }
      
      return formatAddress(data.results[0].formatted_address);
    }

    throw new Error('No results found');
  } catch (error) {
    console.warn('Reverse geocoding failed, using fallback:', error);
    return getApproximateCity(lat, lng);
  }
}

async function geocodeCity(cityName: string): Promise<{lat: number, lng: number} | null> {
  // First check fallback coordinates
  const fallbackCoords = getCityFallbackCoords(cityName);
  if (fallbackCoords) return fallbackCoords;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }

    return null;
  } catch (error) {
    console.warn('Geocoding failed:', error);
    return null;
  }
}

function getCityFallbackCoords(cityName: string): {lat: number, lng: number} | null {
  const coords: Record<string, {lat: number, lng: number}> = {
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

  return coords[cityName.toLowerCase()] || null;
}

function getApproximateCity(lat: number, lng: number): string {
  // Simple approximate city detection based on coordinates
  if (lat >= 18.8 && lat <= 19.3 && lng >= 72.7 && lng <= 73.0) return "Mumbai, Maharashtra";
  if (lat >= 28.4 && lat <= 28.8 && lng >= 76.8 && lng <= 77.4) return "Delhi, NCR";
  if (lat >= 12.8 && lat <= 13.1 && lng >= 77.4 && lng <= 77.8) return "Bangalore, Karnataka";
  if (lat >= 17.2 && lat <= 17.6 && lng >= 78.3 && lng <= 78.7) return "Hyderabad, Telangana";
  if (lat >= 12.9 && lat <= 13.2 && lng >= 80.1 && lng <= 80.4) return "Chennai, Tamil Nadu";
  if (lat >= 18.4 && lat <= 18.7 && lng >= 73.7 && lng <= 73.9) return "Pune, Maharashtra";
  
  return "Current Location";
}

function formatAddress(address: string): string {
  // Extract city and state from full address
  const parts = address.split(',').map(part => part.trim());
  
  // Try to find city and state pattern
  for (let i = 0; i < parts.length - 1; i++) {
    const city = parts[i];
    const state = parts[i + 1];
    
    // Check if this looks like a city, state combination
    if (city && state && 
        !city.match(/^\d/) && // Not starting with number
        !state.match(/^\d/) && // Not starting with number
        city.length > 2 && state.length > 2) {
      return `${city}, ${state}`;
    }
  }
  
  // Fallback to first two non-numeric parts
  const nonNumeric = parts.filter(part => !part.match(/^\d/));
  if (nonNumeric.length >= 2) {
    return `${nonNumeric[0]}, ${nonNumeric[1]}`;
  }
  
  return parts[0] || address;
}