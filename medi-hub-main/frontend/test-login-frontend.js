import axios from 'axios';

// Test the frontend login directly
async function testFrontendLogin() {
  try {
    console.log('Testing frontend login simulation...');
    
    const api = axios.create({
      baseURL: "http://localhost:8000/api/v1",
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const response = await api.post("/user/simple-login", {
      email: "test2@example.com",
      password: "password123",
      role: "Patient"
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testFrontendLogin();