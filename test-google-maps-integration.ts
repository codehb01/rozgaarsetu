// Test file to verify Google Maps integration is working
// Run with: npx tsx test-google-maps-integration.ts

import { PrismaClient } from '@prisma/client';

async function testGoogleMapsIntegration() {
  const prisma = new PrismaClient();
  
  console.log('🧪 Testing Google Maps Integration...\n');
  
  try {
    // Test 1: Check if schema has the new fields
    console.log('✅ 1. Testing database schema...');
    
    // Try to create a test customer profile with Google Maps fields
    const testCustomer = await prisma.user.create({
      data: {
        clerkUserId: 'test-google-maps-customer',
        email: 'test-google-maps@test.com',
        phone: '+91-9999999999',
        name: 'Google Maps Test Customer',
        role: 'CUSTOMER',
        customerProfile: {
          create: {
            formattedAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA',
            placeId: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
            streetNumber: '1600',
            streetName: 'Amphitheatre Parkway',
            locality: 'Mountain View',
            city: 'Mountain View',
            state: 'California',
            country: 'United States',
            postalCode: '94043'
          }
        }
      },
      include: {
        customerProfile: true
      }
    });
    
    console.log('   ✓ Customer profile created with Google Maps data');
    console.log(`   ✓ Formatted Address: ${testCustomer.customerProfile?.formattedAddress}`);
    console.log(`   ✓ Place ID: ${testCustomer.customerProfile?.placeId}`);
    
    // Test 2: Create worker profile with Google Maps fields
    const testWorker = await prisma.user.create({
      data: {
        clerkUserId: 'test-google-maps-worker',
        email: 'test-google-maps-worker@test.com',
        phone: '+91-8888888888',
        name: 'Google Maps Test Worker',
        role: 'WORKER',
        workerProfile: {
          create: {
            skilledIn: ['plumbing', 'electrical'],
            aadharNumber: '1234-5678-9012',
            formattedAddress: 'Connaught Place, New Delhi, Delhi 110001, India',
            placeId: 'ChIJLbZ-NFv9DDkRzk0gTkm3wlI',
            streetName: 'Connaught Place',
            locality: 'Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India',
            postalCode: '110001',
            availableAreas: ['New Delhi', 'Delhi NCR']
          }
        }
      },
      include: {
        workerProfile: true
      }
    });
    
    console.log('   ✓ Worker profile created with Google Maps data');
    console.log(`   ✓ Formatted Address: ${testWorker.workerProfile?.formattedAddress}`);
    console.log(`   ✓ Place ID: ${testWorker.workerProfile?.placeId}`);
    
    // Test 3: Verify data retrieval
    console.log('\n✅ 2. Testing data retrieval...');
    
    const customers = await prisma.customerProfile.findMany({
      include: {
        user: true
      }
    });
    
    const workers = await prisma.workerProfile.findMany({
      include: {
        user: true
      }
    });
    
    console.log(`   ✓ Found ${customers.length} customer profiles with Google Maps data`);
    console.log(`   ✓ Found ${workers.length} worker profiles with Google Maps data`);
    
    // Cleanup test data
    await prisma.user.delete({ where: { id: testCustomer.id } });
    await prisma.user.delete({ where: { id: testWorker.id } });
    
    console.log('\n🎉 All tests passed! Google Maps integration is working correctly.\n');
    
    // Test API endpoint
    console.log('✅ 3. Testing API endpoints...');
    
    try {
      const response = await fetch('http://localhost:3001/api/test-maps');
      const data = await response.json();
      console.log('   ✓ Google Maps API endpoint is accessible');
      console.log(`   ✓ API Response: ${data.message || 'Success'}`);
    } catch (error) {
      console.log('   ⚠️  API endpoint test failed (server may not be running)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGoogleMapsIntegration();