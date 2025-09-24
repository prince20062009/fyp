import axios from 'axios';

// Test simple login with different roles
async function testSimpleLogin() {
  try {
    console.log('Testing simple login with different roles...\n');
    
    // Test data
    const testData = [
      {
        email: 'test2@example.com',
        password: 'password123',
        role: 'Patient'
      },
      {
        email: 'doctor@example.com',
        password: 'password123',
        role: 'Doctor'
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin'
      }
    ];
    
    // Test each role
    for (const data of testData) {
      console.log(`Testing login for ${data.role}...`);
      
      try {
        const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
          email: data.email,
          password: data.password,
          role: data.role
        }, {
          withCredentials: true
        });
        
        console.log(`✅ ${data.role} login successful`);
        console.log('Response:', response.data);
        console.log('---\n');
      } catch (error) {
        console.log(`❌ ${data.role} login failed`);
        console.log('Error:', error.response?.data || error.message);
        console.log('---\n');
      }
    }
  } catch (error) {
    console.log('Test error:', error.message);
  }
}

testSimpleLogin();