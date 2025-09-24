import axios from 'axios';

// Test frontend connection
async function testFrontendConnection() {
  try {
    console.log('Testing frontend connection to backend...');
    
    // Test a simple GET request to see if the server is responding
    const response = await axios.get('http://localhost:8000/api/v1/user/allpatients', {
      withCredentials: true
    });
    
    console.log('Frontend connection test successful:', response.status);
  } catch (error) {
    console.log('Frontend connection test failed:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Headers:', error.response?.headers);
  }
}

testFrontendConnection();