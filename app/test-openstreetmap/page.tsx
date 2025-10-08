"use client";

import { useState } from "react";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";

export default function TestOpenStreetMapPage() {
  const [selected, setSelected] = useState<{
    displayName?: string;
    address?: Record<string, unknown>;
    coords?: { lat: number; lng: number };
  } | null>(null);
  const { status, coords, place, error, getCurrentPosition } = useLocation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">OpenStreetMap Search (Demo)</h1>
        <p className="text-muted-foreground mt-2">
          Try searching locations and selecting a result.
        </p>
      </div>
      <OpenStreetMapInput onSelect={setSelected} />
      {selected && (
        <pre className="rounded-md border bg-muted/30 p-3 text-xs overflow-auto">
          {JSON.stringify(selected, null, 2)}
        </pre>
      )}
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Browser Geolocation</h2>
        <Button onClick={getCurrentPosition} variant="outline">
          Use my location
        </Button>
        <div className="text-sm text-muted-foreground">Status: {status}</div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        {coords && (
          <div className="text-sm">
            Coords: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}
        {place && <div className="text-sm">Address: {place.displayName}</div>}
      </div>
    </div>
  );
}
