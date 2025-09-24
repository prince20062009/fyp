// Verification script for the login system
import axios from 'axios';

console.log('=== MEDI-HUB LOGIN SYSTEM VERIFICATION ===\n');

async function verifyBackend() {
  console.log('1. Checking backend connectivity...');
  try {
    const response = await axios.get('http://localhost:8000/api/v1/');
    console.log('   ✅ Backend is accessible');
    return true;
  } catch (error) {
    console.log('   ❌ Backend is not accessible');
    console.log('   Error:', error.message);
    return false;
  }
}

async function verifyTestUser() {
  console.log('\n2. Testing login with test user...');
  try {
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
      email: 'test2@example.com',
      password: 'password123',
      role: 'Patient'
    }, {
      withCredentials: true
    });
    
    if (response.data.success) {
      console.log('   ✅ Test user login successful');
      console.log('   User:', response.data.data.user.email);
      return true;
    } else {
      console.log('   ❌ Test user login failed');
      console.log('   Message:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Test user login failed with error');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data.message);
    } else {
      console.log('   Error:', error.message);
    }
    return false;
  }
}

async function verifyDemoUser() {
  console.log('\n3. Testing login with demo user...');
  try {
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
      email: 'demo@example.com',
      password: 'password123',
      role: 'Patient'
    }, {
      withCredentials: true
    });
    
    if (response.data.success) {
      console.log('   ✅ Demo user login successful');
      console.log('   User:', response.data.data.user.email);
      return true;
    } else {
      console.log('   ❌ Demo user login failed');
      console.log('   Message:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Demo user login failed with error');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data.message);
    } else {
      console.log('   Error:', error.message);
    }
    return false;
  }
}

async function runVerification() {
  console.log('Starting verification of login system...\n');
  
  const backendOk = await verifyBackend();
  const testUserOk = await verifyTestUser();
  const demoUserOk = await verifyDemoUser();
  
  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log('Backend connectivity:', backendOk ? '✅ PASS' : '❌ FAIL');
  console.log('Test user login:', testUserOk ? '✅ PASS' : '❌ FAIL');
  console.log('Demo user login:', demoUserOk ? '✅ PASS' : '❌ FAIL');
  
  if (backendOk && testUserOk && demoUserOk) {
    console.log('\n🎉 ALL TESTS PASSED - Login system is working correctly!');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED - Please check the issues above');
  }
}

runVerification();