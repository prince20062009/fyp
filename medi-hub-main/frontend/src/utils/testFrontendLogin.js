import axios from "axios";

// Create an axios instance that exactly matches the frontend configuration
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true, // Enable sending cookies
    headers: {
        'Content-Type': 'application/json',
    }
});

// Test function that exactly mimics the frontend login
export const testFrontendLogin = async (email, password) => {
  console.log("=== FRONTEND LOGIN TEST ===");
  console.log("Email:", email);
  console.log("Password:", password ? `(${password.length} characters)` : "NULL");
  console.log("Base URL:", api.defaults.baseURL);
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

// Run the test with our known good credentials
testFrontendLogin("test2@example.com", "password123");