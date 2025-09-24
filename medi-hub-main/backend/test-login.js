import axios from 'axios';

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
      email: 'test@example.com',
      password: 'password123',
      role: 'Patient'
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();