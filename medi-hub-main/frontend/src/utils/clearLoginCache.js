// Utility to clear login-related cache and storage
export const clearLoginCache = () => {
  console.log("=== CLEARING LOGIN CACHE ===");
  
  // Clear localStorage
  const user = localStorage.getItem("user");
  if (user) {
    console.log("Removing user from localStorage");
    localStorage.removeItem("user");
  }
  
  // Clear sessionStorage
  console.log("Clearing sessionStorage");
  sessionStorage.clear();
  
  // Note: We can't directly clear cookies from JavaScript for security reasons
  // But we can try to overwrite them with expired values
  console.log("Attempting to clear authentication cookies");
  
  // Try to clear common cookie names
  const cookieNames = ["patientToken", "doctorToken", "adminToken"];
  const pastDate = new Date(0).toUTCString();
  
  cookieNames.forEach(name => {
    document.cookie = `${name}=; expires=${pastDate}; path=/`;
    console.log(`Attempted to clear cookie: ${name}`);
  });
  
  console.log("=== LOGIN CACHE CLEARED ===");
};

// Function to reset the entire application state
export const resetAppState = () => {
  console.log("=== RESETTING APPLICATION STATE ===");
  
  // Clear all storage
  clearLoginCache();
  
  // Reload the page to ensure clean state
  console.log("Reloading page to ensure clean state");
  window.location.reload();
};

export default {
  clearLoginCache,
  resetAppState
};