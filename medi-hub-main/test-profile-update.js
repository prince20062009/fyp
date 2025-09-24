// Test script for profile update functionality
// This script can be run with: node test-profile-update.js

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8000/api/v1';
const TEST_PATIENT_TOKEN = 'YOUR_PATIENT_JWT_TOKEN_HERE';
const TEST_DOCTOR_TOKEN = 'YOUR_DOCTOR_JWT_TOKEN_HERE';

// Test data
const patientUpdateData = {
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

const doctorUpdateData = {
  firstName: 'Dr. John',
  lastName: 'Smith',
  phone: '1234567890',
  department: 'Cardiology',
  specializations: ['Heart Surgery', 'Cardiac Care'],
  experience: 10
};

// Test functions
async function testPatientProfileUpdate() {
  try {
    console.log('Testing patient profile update...');
    
    const response = await axios.put(
      `${BASE_URL}/user/patient/update`,
      patientUpdateData,
      {
        headers: {
          'Authorization': `Bearer ${TEST_PATIENT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Patient profile update successful:', response.data);
    return true;
  } catch (error) {
    console.error('Patient profile update failed:', error.response?.data || error.message);
    return false;
  }
}

async function testDoctorProfileUpdate() {
  try {
    console.log('Testing doctor profile update...');
    
    const response = await axios.put(
      `${BASE_URL}/user/doctor/update`,
      doctorUpdateData,
      {
        headers: {
          'Authorization': `Bearer ${TEST_DOCTOR_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Doctor profile update successful:', response.data);
    return true;
  } catch (error) {
    console.error('Doctor profile update failed:', error.response?.data || error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting profile update tests...\n');
  
  // Note: You need to replace the token placeholders with actual JWT tokens
  // from logged in users to run these tests successfully
  
  if (TEST_PATIENT_TOKEN === 'YOUR_PATIENT_JWT_TOKEN_HERE') {
    console.log('Please replace TEST_PATIENT_TOKEN with a valid patient JWT token');
    return;
  }
  
  if (TEST_DOCTOR_TOKEN === 'YOUR_DOCTOR_JWT_TOKEN_HERE') {
    console.log('Please replace TEST_DOCTOR_TOKEN with a valid doctor JWT token');
    return;
  }
  
  const patientTestPassed = await testPatientProfileUpdate();
  console.log('');
  const doctorTestPassed = await testDoctorProfileUpdate();
  
  console.log('\n--- Test Results ---');
  console.log(`Patient Profile Update: ${patientTestPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`Doctor Profile Update: ${doctorTestPassed ? 'PASSED' : 'FAILED'}`);
  
  if (patientTestPassed && doctorTestPassed) {
    console.log('\nAll tests passed! Profile update functionality is working correctly.');
  } else {
    console.log('\nSome tests failed. Please check the implementation.');
  }
}

// Run the tests
runTests().catch(console.error);