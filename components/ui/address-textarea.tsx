"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

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
  placeId: string;
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

interface AddressTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (placeData: OpenStreetMapPlaceData) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export default function AddressTextarea({
  value = "",
  onChange,
  onPlaceSelect,
  placeholder = "Enter your complete address",
  rows = 3,
  className = "",
  id,
  name,
  required = false
}: AddressTextareaProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const query = e.target.value;
    setInputValue(query);
    setCursorPosition(e.target.selectionStart || 0);
    
    // Call parent onChange if provided
    if (onChange) {
      onChange(query);
    }

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search - only search if user is typing an address-like text
    if (query.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchPlaces(query.trim());
      }, 500); // Wait 500ms after user stops typing
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
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
    
    // Call parent callbacks
    if (onChange) {
      onChange(result.display_name);
    }
    if (onPlaceSelect) {
      onPlaceSelect(placeData);
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        rows={rows}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical ${className}`}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none border-b border-border last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-medium truncate">
                    {suggestion.display_name.split(',').slice(0, 2).join(', ')}
                  </div>
                  <div className="text-muted-foreground text-xs truncate">
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