// Free alternative using OpenStreetMap Nominatim API
// No API key required, completely free

async function testFreeGeocoding() {
  console.log('🗺️  Testing Free OpenStreetMap Geocoding...\n');

  // Test 1: Reverse Geocoding (coordinates to address)
  console.log('1. Testing reverse geocoding (FREE)...');
  try {
    const lat = 28.6139;
    const lng = 77.209;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RozgaarSetu/1.0 (your-email@example.com)' // Required by Nominatim
        }
      }
    );
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    
    if (response.ok && data) {
      console.log('   ✅ Reverse geocoding works!');
      console.log(`   Address: ${data.display_name}`);
      console.log(`   City: ${data.address?.city || data.address?.town || data.address?.village}`);
      console.log(`   State: ${data.address?.state}`);
      console.log(`   Country: ${data.address?.country}`);
      console.log(`   Postal Code: ${data.address?.postcode}`);
    } else {
      console.log('   ❌ Failed');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error}`);
  }

  // Test 2: Forward Geocoding (address to coordinates)
  console.log('\n2. Testing forward geocoding (FREE)...');
  try {
    const address = encodeURIComponent('New Delhi, India');
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1&limit=1`,
      {
        headers: {
          'User-Agent': 'RozgaarSetu/1.0 (your-email@example.com)'
        }
      }
    );
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    
    if (response.ok && data.length > 0) {
      console.log('   ✅ Forward geocoding works!');
      console.log(`   Address: ${data[0].display_name}`);
      console.log(`   Coordinates: ${data[0].lat}, ${data[0].lon}`);
    } else {
      console.log('   ❌ No results found');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error}`);
  }

  // Test 3: Search/Autocomplete
  console.log('\n3. Testing address search (FREE)...');
  try {
    const query = encodeURIComponent('Delhi');
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          'User-Agent': 'RozgaarSetu/1.0 (your-email@example.com)'
        }
      }
    );
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    
    if (response.ok && data.length > 0) {
      console.log('   ✅ Search works!');
      console.log(`   Found ${data.length} results:`);
      data.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.display_name}`);
      });
    } else {
      console.log('   ❌ No results found');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error}`);
  }

  console.log('\n📋 Summary:');
  console.log('✅ OpenStreetMap Nominatim is completely FREE');
  console.log('✅ No API key required');
  console.log('✅ No billing or credit card needed');
  console.log('✅ Good accuracy for addresses');
  console.log('⚠️  Usage limit: ~1 request per second (fair use)');
  console.log('⚠️  Requires User-Agent header');
}

testFreeGeocoding();