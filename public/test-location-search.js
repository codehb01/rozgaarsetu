/**
 * Test script to verify Google Maps API integration
 * Run this in the browser console to test geocoding functionality
 */

// Test geocoding functionality
async function testGoogleMapsAPI() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
    console.error('❌ Google Maps API key not found or not configured');
    return false;
  }

  console.log('🔑 Google Maps API key found');

  try {
    // Test geocoding
    console.log('🧪 Testing geocoding...');
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Mumbai,Maharashtra&key=${apiKey}`
    );
    
    if (!geocodeResponse.ok) {
      throw new Error(`Geocoding API error: ${geocodeResponse.status}`);
    }

    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.status === 'OK') {
      console.log('✅ Geocoding API working');
      console.log('📍 Mumbai coordinates:', geocodeData.results[0].geometry.location);
    } else {
      console.error('❌ Geocoding API error:', geocodeData.status, geocodeData.error_message);
      return false;
    }

    // Test reverse geocoding
    console.log('🧪 Testing reverse geocoding...');
    const reverseResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=19.0760,72.8777&key=${apiKey}`
    );
    
    if (!reverseResponse.ok) {
      throw new Error(`Reverse geocoding API error: ${reverseResponse.status}`);
    }

    const reverseData = await reverseResponse.json();
    
    if (reverseData.status === 'OK') {
      console.log('✅ Reverse geocoding API working');
      console.log('🏠 Address for Mumbai coords:', reverseData.results[0].formatted_address);
    } else {
      console.error('❌ Reverse geocoding API error:', reverseData.status, reverseData.error_message);
      return false;
    }

    console.log('🎉 All Google Maps API tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Google Maps API test failed:', error);
    return false;
  }
}

// Test the search functionality
async function testSearchFunctionality() {
  console.log('🔍 Testing search API...');
  
  try {
    const response = await fetch('/api/workers?category=plumber&lat=19.0760&lng=72.8777&limit=5');
    
    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Search API working');
    console.log(`📊 Found ${data.workers?.length || 0} workers`);
    
    if (data.workers && data.workers.length > 0) {
      console.log('👷 Sample worker:', {
        name: data.workers[0].name,
        city: data.workers[0].workerProfile?.city,
        skills: data.workers[0].workerProfile?.skilledIn?.slice(0, 3),
        distance: data.workers[0].distanceText
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Search API test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Location-Based Search Tests...\n');
  
  const googleMapsTest = await testGoogleMapsAPI();
  console.log('');
  
  const searchTest = await testSearchFunctionality();
  console.log('');

  if (googleMapsTest && searchTest) {
    console.log('🎉 All tests passed! Location-based search is fully functional.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
}

// Export for console use
if (typeof window !== 'undefined') {
  window.testLocationSearch = runAllTests;
  window.testGoogleMaps = testGoogleMapsAPI;
  window.testSearch = testSearchFunctionality;
}

console.log('🧪 Location search tests loaded. Run window.testLocationSearch() in console to test.');