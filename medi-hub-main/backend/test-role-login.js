import axios from 'axios';

// Test login for different roles
async function testRoleLogin() {
  try {
    console.log('Testing login for different roles...\n');
    
    // Test data for each role
    const testData = [
      {
        email: 'john.patient@example.com',
        password: 'password123',
        role: 'Patient'
      },
      {
        email: 'dr.sarah@example.com',
        password: 'password123',
        role: 'Doctor'
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin'
      }
    ];
    
    // Test login for each role
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
        console.log('Response:', response.data.message);
        console.log('User:', response.data.data.user.firstName, response.data.data.user.lastName);
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

testRoleLogin();