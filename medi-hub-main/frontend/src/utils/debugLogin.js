// Debug utility for login issues
export const debugLogin = async (email, password) => {
  console.log('=== LOGIN DEBUG INFO ===');
  console.log('Email:', email);
  console.log('Password length:', password?.length);
  console.log('Current time:', new Date().toISOString());
  
  // Check if required fields are present
  if (!email || !password) {
    console.log('ERROR: Missing email or password');
    return { success: false, message: 'Email and password are required' };
  }
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('ERROR: Invalid email format');
    return { success: false, message: 'Invalid email format' };
  }
  
  // Check password length
  if (password.length < 8) {
    console.log('ERROR: Password too short');
    return { success: false, message: 'Password must be at least 8 characters' };
  }
  
  console.log('Validation passed, proceeding with login request');
  
  // Additional checks
  console.log('Email trimmed:', email.trim());
  console.log('Password trimmed length:', password.trim().length);
  
  return { success: true };
};

// Enhanced error logging
export const logLoginError = (error) => {
  console.log('=== LOGIN ERROR DETAILS ===');
  console.log('Error type:', error?.constructor?.name);
  console.log('Error message:', error?.message);
  
  if (error?.response) {
    console.log('Response status:', error.response.status);
    console.log('Response data:', error.response.data);
    console.log('Response headers:', error.response.headers);
  }
  
  if (error?.request) {
    console.log('Request details:', error.request);
  }
  
  console.log('Stack trace:', error?.stack);
};