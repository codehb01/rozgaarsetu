"use client";

import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import { useState } from "react";

export default function TestOpenStreetMapPage() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🗺️ OpenStreetMap Integration Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Test Address Input</h2>
          <OpenStreetMapInput
            onPlaceSelect={(placeData) => {
              console.log('Selected place:', placeData);
              setSelectedPlace(placeData);
            }}
            placeholder="Enter any address to test"
            className="w-full"
          />
        </div>

        {selectedPlace && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Selected Address Details:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Formatted Address:</strong> {selectedPlace.formattedAddress}</p>
              <p><strong>Street:</strong> {selectedPlace.streetNumber} {selectedPlace.streetName}</p>
              <p><strong>City:</strong> {selectedPlace.city}</p>
              <p><strong>State:</strong> {selectedPlace.state}</p>
              <p><strong>Country:</strong> {selectedPlace.country}</p>
              <p><strong>Postal Code:</strong> {selectedPlace.postalCode}</p>
              <p><strong>Coordinates:</strong> {selectedPlace.latitude}, {selectedPlace.longitude}</p>
              <p><strong>Place ID:</strong> {selectedPlace.placeId}</p>
            </div>
          </div>
        )}

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Benefits of OpenStreetMap:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Completely FREE - no API keys needed</li>
            <li>• No billing or credit card required</li>
            <li>• Good accuracy for addresses worldwide</li>
            <li>• Real-time search suggestions</li>
            <li>• GPS location detection</li>
            <li>• Production ready</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🧪 Test Features:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Type any address and see suggestions</li>
            <li>• Click the GPS button to use current location</li>
            <li>• Try searching for "New Delhi", "Mumbai", "Bangalore"</li>
            <li>• Check the console for detailed place data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}