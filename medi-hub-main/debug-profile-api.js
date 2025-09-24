// Debug script for profile API endpoints
// This script can be run with: node debug-profile-api.js

const http = require('http');

// Configuration
const HOST = 'localhost';
const PORT = 8000;
const ENDPOINTS = [
  '/api/v1/user/patient/update',
  '/api/v1/user/doctor/update'
];

console.log('Debugging profile API endpoints...\n');

// Test each endpoint
ENDPOINTS.forEach(endpoint => {
  console.log(`Testing endpoint: ${endpoint}`);
  
  const options = {
    hostname: HOST,
    port: PORT,
    path: endpoint,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dummy_token_for_testing'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`  Status Code: ${res.statusCode}`);
    console.log(`  Content-Type: ${res.headers['content-type']}`);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`  Response Length: ${data.length} characters`);
      
      // Check if response is JSON
      try {
        const jsonData = JSON.parse(data);
        console.log(`  ✅ Valid JSON Response`);
        console.log(`  Response Keys: ${Object.keys(jsonData).join(', ')}`);
      } catch (e) {
        console.log(`  ❌ Invalid JSON Response`);
        console.log(`  First 100 characters: ${data.substring(0, 100)}`);
      }
      console.log(''); // Empty line for spacing
    });
  });

  req.on('error', (error) => {
    console.log(`  ❌ Request Error: ${error.message}`);
    console.log('');
  });

  // Send empty body for testing
  req.write(JSON.stringify({}));
  req.end();
});

// Also test a non-existent endpoint to see what we get
console.log(`Testing non-existent endpoint: /api/v1/user/nonexistent`);

const badOptions = {
  hostname: HOST,
  port: PORT,
  path: '/api/v1/user/nonexistent',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const badReq = http.request(badOptions, (res) => {
  let data = '';
  
  console.log(`  Status Code: ${res.statusCode}`);
  console.log(`  Content-Type: ${res.headers['content-type']}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`  Response Length: ${data.length} characters`);
    
    // Check if response is JSON
    try {
      const jsonData = JSON.parse(data);
      console.log(`  ✅ Valid JSON Response`);
      console.log(`  Response Keys: ${Object.keys(jsonData).join(', ')}`);
    } catch (e) {
      console.log(`  ❌ Invalid JSON Response`);
      console.log(`  First 100 characters: ${data.substring(0, 100)}`);
    }
    console.log(''); // Empty line for spacing
  });
});

badReq.on('error', (error) => {
  console.log(`  ❌ Request Error: ${error.message}`);
  console.log('');
});

badReq.end();