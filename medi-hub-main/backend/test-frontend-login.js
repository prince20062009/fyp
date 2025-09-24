import axios from 'axios';

// Test exact frontend login request
async function testFrontendLogin() {
  try {
    console.log('Testing exact frontend login request...');
    
    // Create an axios instance that matches the frontend configuration
    const api = axios.create({
      baseURL: "http://localhost:8000/api/v1",
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const response = await api.post("/user/simple-login", {
      email: 'test2@example.com',
      password: 'password123',
      role: 'Patient'
    });
    
    console.log('Frontend login test successful:', response.status);
    console.log('Response data:', response.data);
    
    // Check if cookies are being set
    console.log('Response headers:', response.headers);
  } catch (error) {
    console.log('Frontend login test failed:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Headers:', error.response?.headers);
  }
}

testFrontendLogin();