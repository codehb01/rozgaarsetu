import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Google Maps API key not found in environment variables'
      });
    }

    // Test with a simple geocoding request
    const testAddress = "Mumbai, India";
    const encodedAddress = encodeURIComponent(testAddress);
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    console.log('Testing Google Maps API with URL:', testUrl);
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    return NextResponse.json({
      status: 'success',
      apiKeyPresent: true,
      apiKeyLength: apiKey.length,
      testResponse: {
        status: data.status,
        resultsCount: data.results?.length || 0,
        errorMessage: data.error_message || null
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}