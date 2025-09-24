// Test the debug login utility
import { debugFrontendLogin } from './src/utils/loginDebug.js';

async function testDebugLogin() {
  try {
    console.log('Testing debug login utility...');
    
    const result = await debugFrontendLogin("test2@example.com", "password123");
    
    console.log('Result:', result);
  } catch (error) {
    console.log('Error:', error);
  }
}

testDebugLogin();