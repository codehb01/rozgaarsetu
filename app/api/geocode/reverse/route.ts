import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Use OpenStreetMap Nominatim for reverse geocoding (completely free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RozgaarSetu/1.0' // Required by Nominatim
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Reverse geocoding failed' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (data && data.display_name) {
      const address = data.address || {};

      // Extract address components similar to Google Maps format
      const addressComponents = {
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
        placeId: data.place_id || ''
      };

      return NextResponse.json({
        success: true,
        address: addressComponents
      });
    } else {
      return NextResponse.json(
        { error: 'No address found for the given coordinates' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}