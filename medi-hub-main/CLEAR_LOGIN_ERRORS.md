# Clear Login Errors Guide

## Common Login Issues and How to Clear Them

### 1. Cache and Cookie Issues

#### Problem: 
Stale cache or cookies preventing successful login

#### Solution:
1. Click the "Clear Cache" button on the login page
2. Or manually clear browser cache:
   - Press Ctrl+Shift+Delete
   - Select "Cookies and other site data" and "Cached images and files"
   - Click "Clear data"

### 2. JavaScript State Issues

#### Problem:
Frontend application state is corrupted

#### Solution:
1. Click the "Reset State" button on the login page
2. Or manually refresh the page with cache bypass:
   - Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### 3. Network Issues

#### Problem:
Connection issues between frontend and backend

#### Solution:
1. Check that both frontend (port 5173) and backend (port 8000) servers are running
2. Verify network connectivity:
   ```bash
   # Check if backend is accessible
   curl http://localhost:8000
   
   # Check if frontend is accessible
   curl http://localhost:5173
   ```

### 4. Password or Account Issues

#### Problem:
Incorrect password or account problems

#### Solution:
1. Use the "Quick Login" button to test with known working credentials
2. Or manually enter:
   - Email: test2@example.com
   - Password: password123

### 5. Browser-Specific Issues

#### Problem:
Browser extensions or settings interfering with login

#### Solution:
1. Try in incognito/private browsing mode
2. Disable browser extensions temporarily
3. Check browser console for errors (F12 → Console tab)

## Debugging Tools Added

### Quick Login Button
- Automatically fills and submits test credentials
- Bypasses manual entry errors

### Clear Cache Button
- Clears localStorage and sessionStorage
- Attempts to clear authentication cookies

### Reset State Button
- Clears all cache and reloads the page
- Ensures clean application state

## Manual Troubleshooting Steps

### Step 1: Verify Server Status
```bash
# Check if backend is running
netstat -ano | findstr :8000

# Check if frontend is running
netstat -ano | findstr :5173
```

### Step 2: Test Backend Login Directly
```bash
cd c:\Users\HP\Documents\final_year_project\medi-hub-main\backend
node test-user-login.js test2@example.com password123
```

### Step 3: Test Frontend Login Simulation
```bash
cd c:\Users\HP\Documents\final_year_project\medi-hub-main\frontend
node src/utils/testFrontendLogin.js
```

### Step 4: Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Attempt login and check for error messages

### Step 5: Check Network Requests
1. Press F12 to open Developer Tools
2. Go to Network tab
3. Attempt login and check:
   - Request URL: http://localhost:8000/api/v1/user/simple-login
   - Request method: POST
   - Request payload contains email and password
   - Response status: 200 (success) or error code

## If Problems Persist

### 1. Reset User Password
```bash
cd c:\Users\HP\Documents\final_year_project\medi-hub-main\backend
node fix-login-issues.js reset test2@example.com password123
```

### 2. Diagnose User Account
```bash
node fix-login-issues.js diagnose test2@example.com
```

### 3. Check Detailed Login Diagnosis
```bash
node diagnose-login.js test2@example.com password123
```

## Contact Support

If none of these solutions work:

1. Take a screenshot of any error messages
2. Note the exact steps that lead to the error
3. Include browser console output (F12 → Console tab)
4. Include network request details (F12 → Network tab → find the failed request)