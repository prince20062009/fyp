// Test utility to verify login functionality
import api from "../axios/axios";

export const testLoginConnection = async () => {
  console.log("=== TESTING LOGIN CONNECTION ===");
  
  try {
    // Test with the known working credentials
    const response = await api.post("/user/simple-login", {
      email: "test2@example.com",
      password: "password123",
      role: "Patient"
    });
    
    console.log("Login test response:", response);
    console.log("Response data:", response.data);
    console.log("Success flag:", response.data.success);
    
    if (response.data.success) {
      console.log("✅ LOGIN TEST PASSED - Connection is working");
      return { success: true, message: "Login connection successful" };
    } else {
      console.log("❌ LOGIN TEST FAILED - Success flag is false");
      return { success: false, message: "Login failed - success flag is false" };
    }
  } catch (error) {
    console.log("❌ LOGIN TEST FAILED WITH ERROR:");
    console.log("Error:", error);
    
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    }
    
    return { 
      success: false, 
      message: `Login test failed: ${error.response?.data?.message || error.message}` 
    };
  }
};