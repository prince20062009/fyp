import axios from 'axios';

// Simple login test utility
async function testUserLogin(email, password) {
  try {
    console.log(`Testing login for ${email}...`);
    
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
      email: email,
      password: password,
      role: 'Patient'
    }, {
      withCredentials: true
    });
    
    if (response.data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('User:', response.data.data.user);
      return true;
    } else {
      console.log('❌ LOGIN FAILED');
      console.log('Message:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ LOGIN FAILED WITH ERROR:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node test-user-login.js <email> <password>');
  console.log('Example: node test-user-login.js test2@example.com password123');
  process.exit(1);
}

testUserLogin(email, password);