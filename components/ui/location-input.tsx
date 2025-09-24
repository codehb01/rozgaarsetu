"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { geocodeAddress, reverseGeocode, getCurrentLocation } from "@/lib/location";

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
      const result = await geocodeAddress(fullAddress);
      
      if (result) {
        setCoordinates({
          latitude: result.latitude,
          longitude: result.longitude,
        });
      } else {
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

        // Reverse geocode to get address
        try {
          const addressResult = await reverseGeocode(location.latitude, location.longitude);
          if (addressResult) {
            setAddress(addressResult.address || "");
            setCity(addressResult.city || "");
            setState(addressResult.state || "");
            setCountry(addressResult.country || "");
            setPostalCode(addressResult.postalCode || "");
          }
        } catch (reverseError) {
          console.error("Reverse geocoding error:", reverseError);
          setLocationError("Got your location but couldn't determine address");
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
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          ❌ {locationError}
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