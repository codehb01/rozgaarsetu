"use client";

import { useState, useEffect, useRef } from "react";
import Input from "./input";
import { Button } from "./button";
import { MapPin, Search, Loader2 } from "lucide-react";

interface OpenStreetMapPlaceData {
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  locality?: string;
  sublocality?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  placeId: string; // Using OSM place_id for consistency
}

interface LocationSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface OpenStreetMapInputProps {
  onPlaceSelect: (placeData: OpenStreetMapPlaceData) => void;
  value?: string;
  placeholder?: string;
  className?: string;
}

export default function OpenStreetMapInput({
  onPlaceSelect,
  value = "",
  placeholder = "Enter your address",
  className = ""
}: OpenStreetMapInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced search function
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'RozgaarSetu/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: LocationSearchResult[] = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search addresses');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300); // Wait 300ms after user stops typing
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (result: LocationSearchResult) => {
    const address = result.address;
    
    const placeData: OpenStreetMapPlaceData = {
      formattedAddress: result.display_name,
      streetNumber: address.house_number || '',
      streetName: address.road || '',
      locality: address.neighbourhood || address.suburb || '',
      sublocality: address.suburb || '',
      city: address.city || address.town || address.village || '',
      state: address.state || '',
      country: address.country || '',
      postalCode: address.postcode || '',
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      placeId: result.place_id
    };

    setInputValue(result.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onPlaceSelect(placeData);
  };

  // Handle current location detection
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsDetectingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding with OpenStreetMap
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'RozgaarSetu/1.0'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Reverse geocoding failed');
          }

          const data: LocationSearchResult = await response.json();
          
          if (data && data.display_name) {
            const address = data.address;
            
            const placeData: OpenStreetMapPlaceData = {
              formattedAddress: data.display_name,
              streetNumber: address.house_number || '',
              streetName: address.road || '',
              locality: address.neighbourhood || address.suburb || '',
              sublocality: address.suburb || '',
              city: address.city || address.town || address.village || '',
              state: address.state || '',
              country: address.country || '',
              postalCode: address.postcode || '',
              latitude: parseFloat(data.lat),
              longitude: parseFloat(data.lon),
              placeId: data.place_id
            };

            setInputValue(data.display_name);
            onPlaceSelect(placeData);
          } else {
            throw new Error('Could not determine your address');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setError("Could not determine your address. Please enter it manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsDetectingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Please allow location access to detect your current address");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("An unknown error occurred while detecting location");
            break;
        }
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-24"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isDetectingLocation}
            className="h-7 w-7 p-0"
            title="Use current location"
          >
            {isDetectingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.place_id}-${index}`}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.display_name.split(',').slice(0, 2).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.display_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}