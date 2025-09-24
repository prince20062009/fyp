import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json"; // Reuse the same animation
import { resetPassword } from "../../utils/api";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter new password
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would send a verification email
      // For now, we'll just simulate the process and move to the next step
      setTimeout(() => {
        setStep(2);
        setLoading(false);
        toast.info("Please enter your new password");
      }, 1500);
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error(error.message || "Failed to send reset email");
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await resetPassword(formData.email, formData.newPassword);
      
      if (response.success) {
        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "rgb(179, 218, 217)" }}
    >
      <Helmet>
        <title>Forgot Password - MediHub</title>
      </Helmet>
      <div className="w-1/2 flex justify-center items-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-white shadow-lg p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </h1>
          <h2 className="text-xl text-center mb-6 text-gray-600">
            {step === 1 
              ? "Enter your email to receive reset instructions" 
              : "Enter your new password"}
          </h2>
          
          {step === 1 ? (
            <form className="flex flex-col" onSubmit={handleEmailSubmit}>
              <label htmlFor="email" className="mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                id="email"
                required
                className="border border-gray-300 rounded-md mb-4 p-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-main_theme text-white font-bold py-2 px-4 rounded-md mb-4 hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          ) : (
            <form className="flex flex-col" onSubmit={handlePasswordReset}>
              <label htmlFor="newPassword" className="mb-2">
                New Password:
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                id="newPassword"
                required
                minLength="8"
                className="border border-gray-300 rounded-md mb-4 p-2"
              />
              <label htmlFor="confirmNewPassword" className="mb-2">
                Confirm New Password:
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                id="confirmNewPassword"
                required
                minLength="8"
                className="border border-gray-300 rounded-md mb-4 p-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-main_theme text-white font-bold py-2 px-4 rounded-md mb-4 hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          
          <div className="flex justify-center text-sm md:text-lg">
            <Link
              to="/login"
              className="text-purple-600 hover:underline"
              style={{ color: "rgb(27, 120, 120)" }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;