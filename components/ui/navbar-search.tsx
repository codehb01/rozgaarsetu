"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Search, MapPin, ChevronDown } from "lucide-react";

const SERVICES = [
  { key: "plumber", label: "Plumber", description: "Pipe repairs, installations", emoji: "🔧" },
  { key: "electrician", label: "Electrician", description: "Electrical work, wiring", emoji: "⚡" },
  { key: "ac-technician", label: "AC Technician", description: "AC repair, maintenance", emoji: "❄️" },
  { key: "cleaner", label: "House Cleaner", description: "Home cleaning services", emoji: "🧹" },
  { key: "carpenter", label: "Carpenter", description: "Wood work, furniture", emoji: "🔨" },
  { key: "painter", label: "Painter", description: "Wall painting, decoration", emoji: "🎨" },
  { key: "gardener", label: "Gardener", description: "Garden maintenance", emoji: "🌱" },
  { key: "driver", label: "Driver", description: "Personal driver service", emoji: "🚗" },
];

const LOCATION_OPTIONS = [
  "Mumbai, Maharashtra",
  "Delhi, NCR", 
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan"
];

const PLACEHOLDER_SERVICES = [
  "plumber...",
  "electrician...",
  "cleaner...",
  "carpenter...",
  "painter...",
  "services..."
];

export default function NavbarSearch() {
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState("Current Location");
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Try to get city name from coordinates
              const { latitude, longitude } = position.coords;
              const address = await reverseGeocode(latitude, longitude);
              const cityName = extractCityFromAddress(address);
              setLocation(cityName || "Current Location");
            } catch {
              setLocation("Current Location");
            }
          },
          () => {
            setLocation("Mumbai, Maharashtra"); // Default fallback
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
        );
      } else {
        setLocation("Mumbai, Maharashtra");
      }
    } catch {
      setLocation("Mumbai, Maharashtra");
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simple reverse geocoding - in production you'd use Google Maps API
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  };

  const extractCityFromAddress = (address: string): string | null => {
    // Simple city extraction logic
    if (address.includes("Mumbai") || address.includes("19.")) return "Mumbai, Maharashtra";
    if (address.includes("Delhi") || address.includes("28.")) return "Delhi, NCR";
    if (address.includes("Bangalore") || address.includes("12.")) return "Bangalore, Karnataka";
    return null;
  };

  // Typewriter effect for placeholder
  useEffect(() => {
    let currentText = "";
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      const currentService = PLACEHOLDER_SERVICES[currentServiceIndex];
      
      if (!isDeleting) {
        if (charIndex < currentService.length) {
          currentText = currentService.substring(0, charIndex + 1);
          charIndex++;
          setPlaceholderText(currentText);
          timeoutId = setTimeout(typeWriter, 100);
        } else {
          // Pause before deleting
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeWriter();
          }, 2000);
        }
      } else {
        if (charIndex > 0) {
          currentText = currentService.substring(0, charIndex - 1);
          charIndex--;
          setPlaceholderText(currentText);
          timeoutId = setTimeout(typeWriter, 50);
        } else {
          // Move to next service
          isDeleting = false;
          setCurrentServiceIndex((prev) => (prev + 1) % PLACEHOLDER_SERVICES.length);
          timeoutId = setTimeout(typeWriter, 500);
        }
      }
    };

    typeWriter();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentServiceIndex]);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceSelection = async (key: string | number | null) => {
    if (key) {
      setSelectedService(key.toString());
      await performSearch(key.toString(), location);
    }
  };

  const performSearch = async (service: string, locationName: string) => {
    try {
      // Get coordinates for the location
      const coords = await getLocationCoordinates(locationName);
      
      // Build search URL with parameters
      const searchParams = new URLSearchParams({
        service: service,
        location: locationName,
      });

      if (coords) {
        searchParams.append('lat', coords.lat.toString());
        searchParams.append('lng', coords.lng.toString());
      }

      // Navigate to search results page
      window.location.href = `/search/results?${searchParams.toString()}`;
    } catch (error) {
      console.error('Search error:', error);
      // Fallback - search without coordinates
      const searchParams = new URLSearchParams({
        service: service,
        location: locationName,
      });
      window.location.href = `/search/results?${searchParams.toString()}`;
    }
  };

  const getLocationCoordinates = async (locationName: string): Promise<{lat: number, lng: number} | null> => {
    // Fallback coordinates for common cities
    const cityCoords: Record<string, {lat: number, lng: number}> = {
      "mumbai, maharashtra": { lat: 19.0760, lng: 72.8777 },
      "delhi, ncr": { lat: 28.6139, lng: 77.2090 },
      "bangalore, karnataka": { lat: 12.9716, lng: 77.5946 },
      "hyderabad, telangana": { lat: 17.3850, lng: 78.4867 },
      "chennai, tamil nadu": { lat: 13.0827, lng: 80.2707 },
      "pune, maharashtra": { lat: 18.5204, lng: 73.8567 },
      "ahmedabad, gujarat": { lat: 23.0225, lng: 72.5714 },
      "jaipur, rajasthan": { lat: 26.9124, lng: 75.7873 },
    };

    const cityKey = locationName.toLowerCase();
    
    if (cityKey === "current location") {
      // Get current location coordinates
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            () => resolve(null),
            { enableHighAccuracy: false, timeout: 5000 }
          );
        } else {
          resolve(null);
        }
      });
    }

    return cityCoords[cityKey] || null;
  };

  return (
    <div className="flex items-center gap-4">
      <div ref={locationRef} className="relative">
        <button
          onClick={() => setIsLocationFocused(!isLocationFocused)}
          className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-neutral-800 border-0 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-200 text-sm"
        >
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white truncate max-w-32">
            {location}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isLocationFocused ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isLocationFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
            >
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Select Location
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setLocation("Current Location");
                      setIsLocationFocused(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150 font-medium"
                  >
                     Use Current Location
                  </button>
                  {LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setIsLocationFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 max-w-md">
        <Autocomplete
          variant="flat"
          radius="full"
          size="md"
          placeholder={`Search for ${placeholderText || "services..."}`}
          selectedKey={selectedService}
          onSelectionChange={handleServiceSelection}
          startContent={<Search className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />}
          inputProps={{
            classNames: {
              input: "text-sm text-gray-900 dark:text-white ml-1",
              inputWrapper: "bg-gray-100 dark:bg-neutral-800 border-0 hover:bg-gray-200 dark:hover:bg-neutral-700 data-[hover=true]:bg-gray-200 dark:data-[hover=true]:bg-neutral-700 shadow-none outline-none focus:outline-none data-[focus=true]:outline-none data-[focus=true]:ring-0 data-[focus=true]:border-0 data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-0"
            }
          }}
          popoverProps={{
            classNames: {
              base: "rounded-xl shadow-xl",
              content: "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-0"
            }
          }}
          listboxProps={{
            classNames: {
              base: "bg-white dark:bg-neutral-800 rounded-xl",
              list: "bg-white dark:bg-neutral-800 rounded-xl"
            },
            emptyContent: "No services found matching your search."
          }}
          classNames={{
            base: "w-full border-0 outline-none shadow-none data-[focus=true]:outline-none data-[focus=true]:ring-0 data-[focus-visible=true]:outline-none",
            listboxWrapper: "max-h-72 bg-white dark:bg-neutral-800 rounded-xl shadow-xl",
            popoverContent: "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl"
          }}
        >
          {SERVICES.map((service) => (
            <AutocompleteItem 
              key={service.key} 
              textValue={service.label}
              classNames={{
                base: "bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 data-[hover=true]:bg-gray-50 dark:data-[hover=true]:bg-neutral-700 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/20",
                title: "text-gray-900 dark:text-white font-medium",
                description: "text-gray-500 dark:text-gray-400"
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{service.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{service.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{service.description}</div>
                </div>
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    </div>
  );
}
