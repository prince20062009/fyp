import axios from 'axios';

// Test login directly
async function testLoginDirect() {
  try {
    console.log('Testing direct login...');
    
    const loginData = {
      email: 'test2@example.com',
      password: 'password123',
      role: 'Patient'
    };
    
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', loginData, {
      withCredentials: true
    });
    
    console.log('✅ Login successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

testLoginDirect();