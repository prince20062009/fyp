import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Patient"  // Added role with default value
  });

  const [loading, setLoading] = useState(false);

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
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Sending login request with:", { email, password, role });
      
      const response = await api.post(
        "/user/simple-login",
        {
          email,
          password,
          role  // Now sending the selected role instead of hardcoded "Patient"
        }
      );
      
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        toast.success(response.data.message || "Login successful");
        // Store user data in localStorage
        if (response.data.data && response.data.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          const userRole = response.data.data.user.role;
          
          // Role-based redirect
          switch(userRole) {
            case "Patient":
              navigate("/patient-dashboard");
              break;
            case "Doctor":
              navigate("/doctor-dashboard");
              break;
            case "Admin":
              navigate("/admin-dashboard");
              break;
            default:
              navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      
      // Enhanced error handling
      let errorMessage = "Login failed";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Login failed with status ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "rgb(179, 218, 217)" }}
    >
      <Helmet>
        <title>Login - Medi-Hub Healthcare</title>
      </Helmet>
      {/* Left panel with healthcare information */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4">Medi-Hub Healthcare</h2>
          <p className="text-lg">Your trusted healthcare platform</p>
        </div>
      </div>
      
      {/* Right panel with login form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white shadow-lg p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome back</h1>
          <h2 className="text-2xl text-center mb-6">Login to your account</h2>
          
          <form
            className="flex flex-col"
            id="login-form"
            onSubmit={handleLogin}
          >
            {/* Email field */}
            <label htmlFor="email" className="mb-2 font-medium">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              required
              className="border border-gray-300 rounded-md mb-4 p-3 focus:outline-none focus:ring-2 focus:ring-main_theme"
            />
            
            {/* Password field */}
            <label htmlFor="password" className="mb-2 font-medium">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              required
              className="border border-gray-300 rounded-md mb-4 p-3 focus:outline-none focus:ring-2 focus:ring-main_theme"
            />
            
            {/* Role selection */}
            <label htmlFor="role" className="mb-2 font-medium">
              Login as:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              id="role"
              className="border border-gray-300 rounded-md mb-6 p-3 focus:outline-none focus:ring-2 focus:ring-main_theme"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
            
            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-main_theme text-white font-bold py-3 px-4 rounded-md mb-4 hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          {/* Links */}
          <div className="flex justify-between text-sm md:text-base">
            <Link
              to="/register"
              className="text-main_theme hover:underline font-medium"
            >
              Create Account
            </Link>
            <Link
              to="/forgot-password"
              className="text-main_theme hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;