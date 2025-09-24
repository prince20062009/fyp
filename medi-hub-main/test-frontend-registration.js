const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration from frontend context...');
    
    // Simulate frontend request with proper headers
    const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', {
      firstName: "Frontend",
      lastName: "Test",
      age: 25,
      email: "frontendtest@example.com",
      phone: "9876543210",
      password: "password123",
      role: "Patient"
    }, {
      headers: {
        'Origin': 'http://localhost:5176',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration Response:', response.data);
  } catch (error) {
    console.log('Registration Error:', error.response ? error.response.data : error.message);
  }
}

testRegistration();