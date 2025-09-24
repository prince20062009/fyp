// Script to verify that login errors have been cleared
import axios from 'axios';

console.log("=== LOGIN ERROR VERIFICATION ===");

// Test 1: Backend login
console.log("\n1. Testing backend login...");
try {
  const backendResponse = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
    email: 'test2@example.com',
    password: 'password123',
    role: 'Patient'
  }, {
    withCredentials: true
  });
  
  if (backendResponse.data.success) {
    console.log("✅ Backend login test PASSED");
  } else {
    console.log("❌ Backend login test FAILED");
  }
} catch (error) {
  console.log("❌ Backend login test FAILED with error:", error.message);
}

// Test 2: Check if servers are running
console.log("\n2. Checking server status...");
try {
  // Check backend
  const backendCheck = await axios.get('http://localhost:8000');
  console.log("✅ Backend server is running");
} catch (error) {
  console.log("❌ Backend server is not responding");
}

try {
  // Check frontend
  const frontendCheck = await axios.get('http://localhost:5173');
  console.log("✅ Frontend server is running");
} catch (error) {
  console.log("❌ Frontend server is not responding");
}

// Test 3: Verify user account exists
console.log("\n3. Verifying user account...");
try {
  const userCheck = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
    email: 'test2@example.com',
    password: 'password123',
    role: 'Patient'
  }, {
    withCredentials: true
  });
  
  if (userCheck.data.success && userCheck.data.data?.user) {
    console.log("✅ User account verified");
    console.log("  User ID:", userCheck.data.data.user.id);
    console.log("  User role:", userCheck.data.data.user.role);
  } else {
    console.log("❌ User account verification FAILED");
  }
} catch (error) {
  console.log("❌ User account verification FAILED with error:", error.message);
}

console.log("\n=== VERIFICATION COMPLETE ===");
console.log("If all tests passed, login errors should be cleared.");
console.log("If any tests failed, check the specific error and refer to CLEAR_LOGIN_ERRORS.md");