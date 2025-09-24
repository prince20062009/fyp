import axios from 'axios';

// Test login for new doctor
async function testNewDoctorLogin() {
  try {
    console.log('Testing login for new doctor...');
    
    const loginData = {
      email: 'dr.sarah.new@example.com',
      password: 'password123',
      role: 'Doctor'
    };
    
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', loginData, {
      withCredentials: true
    });
    
    console.log('✅ Doctor login successful');
    console.log('Response:', response.data.message);
    console.log('User:', response.data.data.user.firstName, response.data.data.user.lastName);
    console.log('Role:', response.data.data.user.role);
  } catch (error) {
    console.log('❌ Doctor login failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

testNewDoctorLogin();