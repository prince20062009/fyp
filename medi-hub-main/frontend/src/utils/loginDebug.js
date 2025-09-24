import api from "../axios/axios";

// Debug login function that mimics the frontend exactly
export const debugFrontendLogin = async (email, password) => {
  console.log("=== FRONTEND LOGIN DEBUG ===");
  console.log("Email:", email);
  console.log("Password:", password ? `(${password.length} characters)` : "NULL");
  console.log("API Base URL:", api.defaults.baseURL);
  console.log("With credentials:", api.defaults.withCredentials);
  
  try {
    console.log("Sending request to /user/simple-login");
    const response = await api.post("/user/simple-login", {
      email,
      password,
      role: "Patient"
    });
    
    console.log("✅ Request successful!");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response headers:", response.headers);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.log("❌ Request failed!");
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
      console.log("Response headers:", error.response.headers);
    }
    
    if (error.request) {
      console.log("Request:", error.request);
    }
    
    return {
      success: false,
      error: error
    };
  }
};

// Test function
export const testLogin = async () => {
  console.log("Testing login with test credentials...");
  const result = await debugFrontendLogin("test2@example.com", "password123");
  return result;
};

export default {
  debugFrontendLogin,
  testLogin
};