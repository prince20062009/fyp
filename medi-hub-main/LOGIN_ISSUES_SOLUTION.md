# Medi-Hub Login Issues Solution

## Common Login Issues and Solutions

### 1. Password Related Issues

#### Problem: Invalid email or password error
**Cause**: Password hashing/comparison issues or incorrect password

**Solution**:
1. Reset the user's password using the password reset utility:
   ```bash
   cd backend
   node fix-login-issues.js reset <user-email> <new-password>
   ```

2. Test the login with the new password

#### Problem: User registered but can't login
**Cause**: Password not properly hashed during registration

**Solution**:
1. Diagnose the user account:
   ```bash
   node fix-login-issues.js diagnose <user-email>
   ```

2. If needed, reset the password as shown above

### 2. CORS Configuration Issues

#### Problem: Frontend can't connect to backend
**Cause**: Incorrect CORS configuration

**Solution**:
1. Check the `.env` file in the backend directory and ensure the frontend URL is correctly set:
   ```
   FRONTEND_URL=http://localhost:5173
   DASHBOARD_URL=http://localhost:5174
   ```

2. Restart the backend server after any changes

### 3. Cookie Handling Issues

#### Problem: Login successful but not redirected or session not maintained
**Cause**: Cookie not being set or read properly

**Solution**:
1. Ensure `withCredentials: true` is set in all API requests
2. Check that the frontend and backend are using compatible cookie settings
3. Verify that the browser is not blocking cookies

### 4. Frontend Validation Issues

#### Problem: Login form not working as expected
**Cause**: Frontend validation or error handling issues

**Solution**:
1. The LoginPage.jsx now includes debugging utilities that will show detailed error information in the browser console
2. Check the browser's developer console for detailed error messages

## Testing Login

### Backend Test Script
Run the backend test script to verify login functionality:
```bash
cd backend
node test-frontend-login.js
```

### Manual Testing
1. Start both frontend and backend servers
2. Navigate to the login page
3. Use the test credentials:
   - Email: test2@example.com
   - Password: newpassword123

## Utility Scripts

### fix-login-issues.js
A comprehensive utility for diagnosing and fixing login issues:
```bash
# Diagnose a user account
node fix-login-issues.js diagnose <email>

# Reset a user's password
node fix-login-issues.js reset <email> <new-password>

# Create a test user
node fix-login-issues.js create-test
```

### test-frontend-login.js
Tests the exact same login process as the frontend:
```bash
node test-frontend-login.js
```

## Common Error Messages and Solutions

### "Invalid email or password"
1. Verify the email and password are correct
2. Reset the password using the utility script
3. Check that the user exists in the database

### "Unauthorized Access!"
1. Check that you're logged in
2. Verify that cookies are being set and read properly
3. Ensure CORS configuration is correct

### "Network Error" or "CORS Error"
1. Verify that both frontend and backend servers are running
2. Check the CORS configuration in app.js
3. Ensure the frontend URL matches the one in the backend .env file

## Best Practices

1. Always use the simple-login endpoint for frontend users (`/api/v1/user/simple-login`)
2. Ensure passwords are at least 8 characters long
3. Use proper error handling in frontend components
4. Test login functionality after any authentication-related changes
5. Keep environment variables up to date

## For Developers

If you're experiencing persistent login issues:

1. Check the browser console for JavaScript errors
2. Check the backend console for error messages
3. Verify that all required environment variables are set
4. Ensure MongoDB is running and accessible
5. Test with the provided utility scripts before troubleshooting further