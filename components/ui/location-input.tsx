"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { geocodeAddress, reverseGeocode, getCurrentLocation } from "@/lib/location";

// Enhanced city detection with more coverage and better accuracy
function detectCityFromCoordinates(lat: number, lng: number) {
  const cities = [
    // Tier 1 Cities
    { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, range: 0.3, postal: "400001" },
    { city: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090, range: 0.3, postal: "110001" },
    { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, range: 0.3, postal: "560001" },
    { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, range: 0.3, postal: "500001" },
    { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, range: 0.3, postal: "600001" },
    { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, range: 0.3, postal: "700001" },
    { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, range: 0.3, postal: "411001" },
    { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, range: 0.3, postal: "380001" },
    
    // Tier 2 Cities (expanded coverage)
    { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, range: 0.3, postal: "302001" },
    { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, range: 0.3, postal: "226001" },
    { city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, range: 0.3, postal: "208001" },
    { city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, range: 0.3, postal: "440001" },
    { city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, range: 0.3, postal: "452001" },
    { city: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781, range: 0.2, postal: "400601" },
    { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, range: 0.3, postal: "462001" },
    { city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, range: 0.3, postal: "530001" },
    { city: "Pimpri-Chinchwad", state: "Maharashtra", lat: 18.6298, lng: 73.7997, range: 0.2, postal: "411017" },
    { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376, range: 0.3, postal: "800001" },
    { city: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812, range: 0.3, postal: "390001" },
    { city: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538, range: 0.2, postal: "201001" },
    { city: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573, range: 0.3, postal: "141001" },
    { city: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, range: 0.3, postal: "282001" },
    { city: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, range: 0.3, postal: "422001" },
    { city: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178, range: 0.2, postal: "121001" },
    { city: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lng: 77.7064, range: 0.3, postal: "250001" },
    { city: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022, range: 0.3, postal: "360001" },
    { city: "Kalyan-Dombivli", state: "Maharashtra", lat: 19.2403, lng: 73.1305, range: 0.2, postal: "421301" },
    { city: "Vasai-Virar", state: "Maharashtra", lat: 19.4912, lng: 72.8054, range: 0.2, postal: "401201" },
    { city: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, range: 0.3, postal: "221001" },
    { city: "Srinagar", state: "Jammu and Kashmir", lat: 34.0837, lng: 74.7973, range: 0.3, postal: "190001" },
    { city: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433, range: 0.3, postal: "431001" },
    { city: "Dhanbad", state: "Jharkhand", lat: 23.7957, lng: 86.4304, range: 0.3, postal: "826001" },
    { city: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723, range: 0.3, postal: "143001" },
    { city: "Navi Mumbai", state: "Maharashtra", lat: 19.0330, lng: 73.0297, range: 0.2, postal: "400614" },
    { city: "Allahabad", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, range: 0.3, postal: "211001" },
    { city: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096, range: 0.3, postal: "834001" },
    { city: "Howrah", state: "West Bengal", lat: 22.5958, lng: 88.2636, range: 0.2, postal: "711101" },
    { city: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, range: 0.3, postal: "641001" },
    { city: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864, range: 0.3, postal: "482001" },
    { city: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lng: 78.1828, range: 0.3, postal: "474001" },
    { city: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.6480, range: 0.3, postal: "520001" },
    { city: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, range: 0.3, postal: "342001" },
    { city: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198, range: 0.3, postal: "625001" },
    { city: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296, range: 0.3, postal: "492001" },
    { city: "Kota", state: "Rajasthan", lat: 25.2138, lng: 75.8648, range: 0.3, postal: "324001" },
    { city: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794, range: 0.2, postal: "160001" },
    { city: "Gurgaon", state: "Haryana", lat: 28.4595, lng: 77.0266, range: 0.2, postal: "122001" },
    { city: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910, range: 0.2, postal: "201301" },
  ];

  // Find the closest city
  let closestCity = null;
  let minDistance = Infinity;

  for (const city of cities) {
    // Using Haversine formula for better accuracy
    const R = 6371; // Earth's radius in km
    const dLat = (lat - city.lat) * Math.PI / 180;
    const dLng = (lng - city.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(city.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km

    if (distance <= city.range * 111 && distance < minDistance) { // Convert degrees to km (1 degree ≈ 111 km)
      minDistance = distance;
      closestCity = city;
    }
  }

  return closestCity ? {
    city: closestCity.city,
    state: closestCity.state,
    postal: closestCity.postal,
    accuracy: minDistance < 10 ? 'high' : 'medium'
  } : null;
}

interface LocationInputProps {
  onLocationChange: (location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  initialLocation?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  className?: string;
}

export default function LocationInput({ onLocationChange, initialLocation, className }: LocationInputProps) {
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [city, setCity] = useState(initialLocation?.city || "");
  const [state, setState] = useState(initialLocation?.state || "");
  const [country, setCountry] = useState(initialLocation?.country || "");
  const [postalCode, setPostalCode] = useState(initialLocation?.postalCode || "");
  const [coordinates, setCoordinates] = useState<{ latitude?: number; longitude?: number }>({});
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Notify parent component when location data changes
  useEffect(() => {
    onLocationChange({
      address,
      city,
      state,
      country,
      postalCode,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }, [address, city, state, country, postalCode, coordinates, onLocationChange]);

  const handleGeocodeAddress = async () => {
    if (!address.trim()) return;

    setIsGeocodingLoading(true);
    setLocationError(null);

    try {
      const fullAddress = `${address}, ${city}, ${state}, ${country}`;
      
      const response = await fetch('/api/geocode/forward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: fullAddress }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Forward geocoding result:', result);
        
        setCoordinates({
          latitude: result.latitude,
          longitude: result.longitude,
        });
      } else {
        const errorData = await response.json();
        console.error('Forward geocoding API error:', errorData);
        setLocationError("Unable to find coordinates for this address");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Error geocoding address. Please check your address.");
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      if (location) {
        setCoordinates({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Try to get address information - first try API, then fallback
        try {
          console.log('Getting address for coordinates:', {
            latitude: location.latitude,
            longitude: location.longitude,
          });

          // Try server-side reverse geocoding first
          let addressFound = false;
          
          try {
            const response = await fetch('/api/geocode/reverse', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                latitude: location.latitude,
                longitude: location.longitude,
              }),
            });

            if (response.ok) {
              const addressResult = await response.json();
              console.log('Reverse geocoding result:', addressResult);
              
              if (addressResult.address) setAddress(addressResult.address);
              if (addressResult.city) setCity(addressResult.city);
              if (addressResult.state) setState(addressResult.state);
              if (addressResult.country) setCountry(addressResult.country);
              if (addressResult.postalCode) setPostalCode(addressResult.postalCode);
              
              addressFound = true;
              setLocationError(null);
            }
          } catch (apiError) {
            console.log('API reverse geocoding failed, trying fallback approach');
          }

          // Enhanced fallback: Use coordinate-based city detection with high accuracy
          if (!addressFound) {
            const fallbackLocation = detectCityFromCoordinates(location.latitude, location.longitude);
            if (fallbackLocation) {
              // Auto-fill the detected city information
              setCity(fallbackLocation.city);
              setState(fallbackLocation.state);
              setCountry("India");
              setPostalCode(fallbackLocation.postal);
              
              // Provide contextual address based on accuracy
              if (fallbackLocation.accuracy === 'high') {
                setAddress(`${fallbackLocation.city} Area`);
                setLocationError(null);
              } else {
                setAddress(`Near ${fallbackLocation.city}`);
                setLocationError(null);
              }
            } else {
              // If no city detected, at least set India as country
              setCountry("India");
              setLocationError("Location detected but couldn't identify city. Please enter address details manually.");
            }
          }
        } catch (reverseError) {
          console.error("Location processing error:", reverseError);
          setLocationError("Got your location but couldn't determine address. Please enter manually.");
        }
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError("Unable to get your current location. Please enter manually.");
    } finally {
      setIsLocationLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Actions */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={isLocationLoading}
          className="flex-1"
        >
          {isLocationLoading ? "Getting Location..." : "📍 Use My Location"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeocodeAddress}
          disabled={isGeocodingLoading || !address.trim()}
          className="flex-1"
        >
          {isGeocodingLoading ? "Finding..." : "🔍 Find on Map"}
        </Button>
      </div>

      {/* Location Status */}
      {coordinates.latitude && coordinates.longitude && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md">
          ✅ Location found: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
        </div>
      )}

      {locationError && (
        <div className={`text-sm p-2 rounded-md ${
          locationError.includes('detected') 
            ? 'text-yellow-700 bg-yellow-50' 
            : 'text-red-600 bg-red-50'
        }`}>
          {locationError.includes('detected') ? '⚠️' : '❌'} {locationError}
        </div>
      )}

      {/* Address Fields */}
      <div className="space-y-3">
        <Input
          label="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main Street"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
            required
          />
          <Input
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Maharashtra"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="India"
            required
          />
          <Input
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="400001"
            required
          />
        </div>
      </div>

      {/* API Key Notice */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
        💡 For location features to work fully, add your Google Maps API key to environment variables.
      </div>
    </div>
  );
}