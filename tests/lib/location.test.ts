import { describe, it, expect } from "vitest";
import {
  distanceKm,
  formatDisplayAddress,
  type Coordinates,
  type Address,
} from "@/lib/location";

describe("distanceKm (Haversine formula)", () => {
  it("returns 0 for the same point", () => {
    const point: Coordinates = { lat: 28.6139, lng: 77.209 };
    expect(distanceKm(point, point)).toBe(0);
  });

  it("calculates known distance between Delhi and Mumbai (~1150 km)", () => {
    const delhi: Coordinates = { lat: 28.6139, lng: 77.209 };
    const mumbai: Coordinates = { lat: 19.076, lng: 72.8777 };
    const dist = distanceKm(delhi, mumbai);
    // Actual is ~1148 km; allow ±10 km tolerance
    expect(dist).toBeGreaterThan(1130);
    expect(dist).toBeLessThan(1170);
  });

  it("calculates distance between two nearby points in same city", () => {
    // Two points ~1 km apart in Bangalore
    const a: Coordinates = { lat: 12.9716, lng: 77.5946 };
    const b: Coordinates = { lat: 12.9806, lng: 77.5946 }; // ~1 km north
    const dist = distanceKm(a, b);
    expect(dist).toBeGreaterThan(0.9);
    expect(dist).toBeLessThan(1.1);
  });

  it("is symmetric — distance A→B equals distance B→A", () => {
    const a: Coordinates = { lat: 28.6139, lng: 77.209 };
    const b: Coordinates = { lat: 12.9716, lng: 77.5946 };
    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 5);
  });

  it("returns positive distance for points in different hemispheres", () => {
    const northPole: Coordinates = { lat: 90, lng: 0 };
    const southPole: Coordinates = { lat: -90, lng: 0 };
    const dist = distanceKm(northPole, southPole);
    // Half of Earth's circumference ≈ 20015 km
    expect(dist).toBeCloseTo(20015, -2); // within ±100 km
  });
});

describe("formatDisplayAddress", () => {
  it("returns undefined for undefined input", () => {
    expect(formatDisplayAddress(undefined)).toBeUndefined();
  });

  it("returns empty string for an empty address object (all fields absent)", () => {
    // The function joins only truthy parts — so empty object → ""
    expect(formatDisplayAddress({})).toBe("");
  });

  it("joins all present fields with a comma", () => {
    const addr: Address = {
      line1: "123 Main St",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
    };
    expect(formatDisplayAddress(addr)).toBe(
      "123 Main St, Bangalore, Karnataka, 560001, India"
    );
  });

  it("skips missing optional fields", () => {
    const addr: Address = {
      city: "Pune",
      state: "Maharashtra",
      country: "India",
    };
    expect(formatDisplayAddress(addr)).toBe("Pune, Maharashtra, India");
  });

  it("handles only city being present", () => {
    const addr: Address = { city: "Delhi" };
    expect(formatDisplayAddress(addr)).toBe("Delhi");
  });
});
