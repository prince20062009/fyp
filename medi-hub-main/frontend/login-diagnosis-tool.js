/**
 * Login Diagnosis Tool
 * 
 * This tool can be run directly to diagnose login issues
 * It tests the core login functionality without React dependencies
 */

// Simple axios-like function using fetch
async function post(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  
  const responseData = await response.json();
  
  return {
    status: response.status,
    data: responseData,
    headers: response.headers
  };
}

// Test login function
async function testLogin() {
  console.log('=== LOGIN DIAGNOSIS TOOL ===');
  console.log('Testing login functionality...\n');
  
  // Test data
  const testData = {
    email: 'test2@example.com',
    password: 'password123',
    role: 'Patient'
  };
  
  console.log('Test data:', testData);
  console.log('API endpoint: http://localhost:8000/api/v1/user/simple-login\n');
  
  try {
    console.log('Sending login request...');
    const response = await post('http://localhost:8000/api/v1/user/simple-login', testData);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.success) {
      console.log('\n✅ LOGIN TEST PASSED');
      console.log('User logged in successfully');
      console.log('User role:', response.data.data.user.role);
      console.log('Welcome,', response.data.data.user.firstName, response.data.data.user.lastName);
    } else {
      console.log('\n❌ LOGIN TEST FAILED');
      console.log('Server returned an error');
      console.log('Error message:', response.data.message);
    }
  } catch (error) {
    console.log('\n❌ LOGIN TEST FAILED');
    console.log('Network error occurred');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    
    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.message.includes('cors')) {
      console.log('\n🔧 POSSIBLE SOLUTION:');
      console.log('- Check if the backend server is running');
      console.log('- Verify CORS configuration in backend');
      console.log('- Ensure frontend and backend URLs match');
    }
    
    // Check if it's a network error
    if (error.message.includes('fetch') || error.message.includes('network')) {
      console.log('\n🔧 POSSIBLE SOLUTION:');
      console.log('- Check if the backend server is running on port 8000');
      console.log('- Verify network connectivity');
      console.log('- Check firewall settings');
    }
  }
  
  console.log('\n=== END DIAGNOSIS ===');
}

// Run the test
testLogin();

export { testLogin };