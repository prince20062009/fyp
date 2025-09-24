import axios from 'axios';

// Test CORS with frontend origin
async function testCORS() {
  try {
    console.log('Testing CORS with frontend origin...');
    
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
      email: 'test2@example.com',
      password: 'testpassword123',
      role: 'Patient'
    }, {
      headers: {
        'Origin': 'http://localhost:5173'
      },
      withCredentials: true
    });
    
    console.log('CORS test successful:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.log('CORS test failed:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
  }
}

testCORS();