import axios from 'axios';

// Test frontend login with detailed debugging
async function testFrontendLogin() {
  try {
    console.log('Testing frontend login with detailed debugging...');
    
    // Create an axios instance that matches the frontend configuration
    const api = axios.create({
      baseURL: "http://localhost:8000/api/v1",
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Sending login request...');
    const response = await api.post("/user/simple-login", {
      email: 'test2@example.com',
      password: 'password123',
      role: 'Patient'
    });
    
    console.log('Login request successful!');
    console.log('Status code:', response.status);
    console.log('Response data:', response.data);
    
    // Check if we got the expected success response
    if (response.data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('User:', response.data.data.user);
      console.log('Message:', response.data.message);
    } else {
      console.log('❌ LOGIN FAILED - Success flag is false');
    }
    
  } catch (error) {
    console.log('❌ LOGIN FAILED WITH ERROR:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
}

testFrontendLogin();