import { useState } from "react";
import api from "./src/axios/axios";

function SimpleLoginPage() {
  const [formData, setFormData] = useState({
    email: "test2@example.com",
    password: "password123",
    role: "Patient",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    
    console.log("Sending login request with:", { email, password, role });
    
    try {
      const response = await api.post(
        "/user/simple-login",
        {
          email,
          password,
          role
        }
      );
      
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        console.log("Login successful!");
        // Store user data in localStorage
        if (response.data.data && response.data.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          console.log("User data stored in localStorage");
        }
      } else {
        console.log("Login failed - success is false");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      
      let errorMessage = "Login failed";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Login failed with status ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error - please check your connection";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      console.log("Displaying error message:", errorMessage);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simple Login Test</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default SimpleLoginPage;