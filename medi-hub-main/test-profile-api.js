// Test script for profile API endpoints
// This script can be run with: node test-profile-api.js

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8000/api/v1';

// Test data
const patientTestData = {
  firstName: 'John',
  lastName: 'Doe',
  age: 35,
  phone: '1234567890',
  address: {
    city: 'New York',
    country: 'USA'
  },
  emergencyContact: {
    name: 'Jane Doe',
    phone: '0987654321',
    relationship: 'Spouse'
  }
};

const doctorTestData = {
  firstName: 'Dr. John',
  lastName: 'Smith',
  phone: '1234567890',
  department: 'Cardiology',
  specializations: ['Heart Surgery', 'Cardiac Care'],
  experience: 10
};

// Test functions
async function testAPIResponse(url, method, data = null, token = null) {
  try {
    console.log(`Testing ${method} ${url}...`);
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    // Check if response is JSON
    if (typeof response.data === 'object' && response.data !== null) {
      console.log(`✅ SUCCESS: ${method} ${url} returned valid JSON`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
    } else {
      console.log(`❌ ERROR: ${method} ${url} did not return valid JSON`);
      console.log(`   Response type: ${typeof response.data}`);
      console.log(`   Response: ${response.data}`);
    }
    
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.log(`⚠️  API ERROR: ${method} ${url} returned status ${error.response.status}`);
      console.log(`   Error response:`, error.response.data);
      
      // Check if error response is JSON
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        console.log(`   ✅ Error response is valid JSON`);
      } else {
        console.log(`   ❌ Error response is NOT valid JSON`);
        console.log(`   Response type: ${typeof error.response.data}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log(`❌ NETWORK ERROR: ${method} ${url} - No response received`);
      console.log(`   Error: ${error.message}`);
    } else {
      // Something else happened
      console.log(`❌ UNKNOWN ERROR: ${method} ${url}`);
      console.log(`   Error: ${error.message}`);
    }
    
    return error;
  }
}

// Run tests
async function runTests() {
  console.log('Starting API response tests...\n');
  
  // Test a few endpoints to verify JSON responses
  await testAPIResponse('/user/patient/update', 'PUT', patientTestData, 'dummy_token');
  console.log('');
  
  await testAPIResponse('/user/doctor/update', 'PUT', doctorTestData, 'dummy_token');
  console.log('');
  
  await testAPIResponse('/user/nonexistent', 'GET');
  console.log('');
  
  console.log('Test completed.');
}

// Run the tests
runTests().catch(console.error);