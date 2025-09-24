import axios from 'axios';

// Test script to verify doctor login fix
async function testDoctorLogin() {
  try {
    console.log('Testing doctor login with fixed frontend...');
    
    // Test data for a doctor login
    const loginData = {
      email: 'dr.sarah.new@example.com',
      password: 'password123',
      role: 'Doctor'
    };
    
    // Make the login request
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', loginData, {
      withCredentials: true
    });
    
    console.log('✅ Doctor login test PASSED');
    console.log('Response Status:', response.status);
    console.log('Response Message:', response.data.message);
    console.log('User Data:', response.data.data.user);
    console.log('User Role:', response.data.data.user.role);
    
    return true;
  } catch (error) {
    console.log('❌ Doctor login test FAILED');
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    } else {
      console.log('Error Message:', error.message);
    }
    
    return false;
  }
}

// Run the test
testDoctorLogin();